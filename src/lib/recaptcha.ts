type Recaptcha = {
  ready: (callback: () => void) => void;
  execute: (key: string, options: { action: string }) => Promise<string>;
};
declare global {
  interface Window {
    grecaptcha?: Recaptcha;
  }
}

let loading: Promise<Recaptcha> | undefined;
const LOAD_TIMEOUT_MS = 40000;
const EXECUTE_TIMEOUT_MS = 40000;

type FailureCode =
  | "configuration"
  | "script_load"
  | "ready_timeout"
  | "execute_timeout"
  | "execute_failed";
class VerificationError extends Error {
  constructor(readonly code: FailureCode) {
    const messages: Record<FailureCode, string> = {
      configuration:
        "Security verification is not configured correctly. Please contact support; changing your password will not fix this.",
      script_load:
        "Security verification could not load after retrying. Please allow reCAPTCHA in your browser, refresh the page and try again.",
      ready_timeout:
        "Security verification did not finish loading. Please refresh the page and try again.",
      execute_timeout:
        "Security verification took too long. Your form has not been submitted. Please try again.",
      execute_failed:
        "Security verification could not complete. Please refresh the page and try again. If it continues, contact support.",
    };
    super(messages[code]);
  }
}

function executionFailure(error: unknown): VerificationError {
  // Inspect only to classify; never expose/log Google's raw error, keys or tokens.
  const detail = error instanceof Error ? error.message : "";
  return new VerificationError(
    /invalid (?:site key|key type|domain)|site key.*(?:invalid|not loaded)|invalid input response/i.test(
      detail,
    )
      ? "configuration"
      : "execute_failed",
  );
}

export function submissionError(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;
  const response = (error as { response?: { data?: { message?: unknown } } })
    .response;
  return typeof response?.data?.message === "string"
    ? response.data.message
    : fallback;
}

function loadAttempt(key: string, host: string): Promise<Recaptcha> {
  return new Promise<Recaptcha>((resolve, reject) => {
    let settled = false;
    // Reuse a previously initialized library rather than create duplicate clients.
    const existing = window.grecaptcha;
    const reuse = typeof existing?.execute === "function";
    const script = reuse ? undefined : document.createElement("script");
    const timeout = window.setTimeout(
      () => fail("ready_timeout"),
      LOAD_TIMEOUT_MS,
    );
    function fail(code: FailureCode) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      script?.remove();
      reject(new VerificationError(code));
    }
    const ready = () => {
      const client = window.grecaptcha;
      if (typeof client?.ready !== "function") return fail("script_load");
      try {
        client.ready(() => {
          if (settled) return;
          if (typeof window.grecaptcha?.execute !== "function")
            return fail("configuration");
          settled = true;
          window.clearTimeout(timeout);
          resolve(window.grecaptcha);
        });
      } catch {
        fail("configuration");
      }
    };
    if (script) {
      script.src = `https://${host}/recaptcha/api.js?render=${encodeURIComponent(key)}`;
      script.async = true;
      script.onerror = () => fail("script_load");
      script.onload = ready;
      document.head.appendChild(script);
    } else ready();
  });
}

function load(key: string): Promise<Recaptcha> {
  if (loading) return loading;
  loading = loadAttempt(key, "www.google.com")
    .catch((error: unknown) => {
      if (
        !(error instanceof VerificationError) ||
        error.code === "configuration"
      )
        throw error;
      // Google documents recaptcha.net as an alternative host. Retry loading only,
      // never the registration request, so accounts cannot be submitted twice.
      return loadAttempt(key, "www.recaptcha.net");
    })
    .catch((error: unknown) => {
      loading = undefined;
      throw error;
    });
  return loading;
}

export async function recaptchaToken(
  action: string,
): Promise<string | undefined> {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  if (!key && process.env.NODE_ENV !== "production") return undefined;
  try {
    if (!key) throw new VerificationError("configuration");
    const recaptcha = await load(key);
    const token = await new Promise<string>((resolve, reject) => {
      const timeout = window.setTimeout(
        () => reject(new VerificationError("execute_timeout")),
        EXECUTE_TIMEOUT_MS,
      );
      try {
        Promise.resolve(recaptcha.execute(key, { action })).then(
          (value) => {
            window.clearTimeout(timeout);
            resolve(value);
          },
          (error: unknown) => {
            window.clearTimeout(timeout);
            reject(executionFailure(error));
          },
        );
      } catch (error) {
        window.clearTimeout(timeout);
        reject(executionFailure(error));
      }
    });
    if (!token) throw new VerificationError("execute_failed");
    return token;
  } catch (error) {
    const failure =
      error instanceof VerificationError
        ? error
        : new VerificationError("execute_failed");
    // A safe diagnostic code helps support distinguish failures without PII.
    console.warn("reCAPTCHA verification failed:", failure.code);
    // Existing forms display API-shaped errors, including errors before a request.
    throw Object.assign(failure, {
      response: {
        data: { message: failure.message, code: `recaptcha_${failure.code}` },
      },
    });
  }
}
