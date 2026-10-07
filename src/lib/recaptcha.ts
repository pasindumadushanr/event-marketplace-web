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
const message =
  "Security verification could not load. Check your connection or allow reCAPTCHA in your browser, then try again.";

export function submissionError(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;
  const response = (error as { response?: { data?: { message?: unknown } } })
    .response;
  return typeof response?.data?.message === "string"
    ? response.data.message
    : fallback;
}

function load(key: string): Promise<Recaptcha> {
  if (loading) return loading;
  loading = new Promise<Recaptcha>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(key)}`;
    script.async = true;
    const timeout = window.setTimeout(fail, 12000);
    function fail() {
      window.clearTimeout(timeout);
      script.remove();
      reject(new Error(message));
    }
    script.onerror = fail;
    script.onload = () => {
      if (!window.grecaptcha) return fail();
      window.grecaptcha.ready(() => {
        window.clearTimeout(timeout);
        resolve(window.grecaptcha!);
      });
    };
    document.head.appendChild(script);
  }).catch((error) => {
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
    if (!key) throw new Error(message);
    const recaptcha = await load(key);
    const token = await new Promise<string>((resolve, reject) => {
      const timeout = window.setTimeout(
        () => reject(new Error(message)),
        12000,
      );
      recaptcha
        .execute(key, { action })
        .then(resolve, reject)
        .finally(() => window.clearTimeout(timeout));
    });
    if (!token) throw new Error(message);
    return token;
  } catch {
    // Existing forms display API-shaped errors, including errors before a request.
    throw Object.assign(new Error(message), {
      response: { data: { message } },
    });
  }
}
