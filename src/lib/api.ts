import axios, { InternalAxiosRequestConfig } from "axios";
import { recaptchaToken } from "./recaptcha";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const protectedActions: Record<string, string> = {
      "/auth/register": "register",
      "/auth/forgot-password": "forgot_password",
      "/contact": "contact",
    };
    const action = protectedActions[config.url || ""];
    if (config.method?.toLowerCase() === "post" && action) {
      const token = await recaptchaToken(action);
      if (token) config.headers["X-Recaptcha-Token"] = token;
    }
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

let renewal: Promise<string> | null = null;
async function renewSession(): Promise<string> {
  if (!renewal) {
    const refreshToken = localStorage.getItem("refreshToken");
    renewal = (async () => {
      if (!refreshToken) throw new Error("No session to renew");
      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        { refreshToken },
        { timeout: 10000 },
      );
      // A logout or another login during renewal must not restore an old session.
      if (localStorage.getItem("refreshToken") !== refreshToken)
        throw new Error("Session changed");
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data.accessToken;
    })().finally(() => {
      renewal = null;
    });
  }
  return renewal;
}
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window === "undefined" || error.response?.status !== 401)
      return Promise.reject(error);
    const config = error.config as InternalAxiosRequestConfig & {
      sessionRetried?: boolean;
    };
    const token = localStorage.getItem("accessToken");
    if (
      !token ||
      config?.headers?.Authorization !== `Bearer ${token}` ||
      config.url?.startsWith("/auth/")
    )
      return Promise.reject(error);
    if (!config.sessionRetried && localStorage.getItem("refreshToken")) {
      config.sessionRetried = true;
      try {
        const accessToken = await renewSession();
        config.headers.Authorization = `Bearer ${accessToken}`;
        return api(config);
      } catch {
        /* Revoked/expired refresh sessions return to sign in. */
      }
    }
    if (localStorage.getItem("accessToken") === token) {
      let role = "";
      try {
        role = JSON.parse(localStorage.getItem("user") || "{}").roleName || "";
      } catch {}
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.dispatchEvent(
        new CustomEvent("nakathata:session-expired", { detail: { role } }),
      );
    }
    return Promise.reject(error);
  },
);
