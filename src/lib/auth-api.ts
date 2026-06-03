const PROXY_BASE = "/gw";
const GATEWAY_DIRECT = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080";

export interface AuthUser {
  email: string;
  name: string;
  role: "END_USER" | "ADMIN" | "SUPER_ADMIN";
}

export interface SessionResponse {
  authenticated: boolean;
  email?: string;
  name?: string;
  role?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  mfaCode?: string;
}

export interface OtpPayload {
  email: string;
  otp: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface MfaEnrollStartPayload {
  email: string;
  password: string;
}

export interface MfaEnrollConfirmPayload {
  email: string;
  password: string;
  code: string;
}

export interface OAuthMfaVerifyPayload {
  email: string;
  mfaCode: string;
  challengeToken: string;
}

async function authFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }
  let res = await fetch(`${PROXY_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
  if (res.status === 401 && !path.includes("/refresh") && !path.includes("/login")) {
    const refreshRes = await fetch(`${PROXY_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) {
      res = await fetch(`${PROXY_BASE}${path}`, {
        ...options,
        credentials: "include",
        headers,
      });
    }
  }
  return res;
}

export async function register(payload: RegisterPayload) {
  const res = await authFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Registration failed");
  return data;
}

export async function verifyOtp(payload: OtpPayload) {
  const res = await authFetch("/api/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "OTP verification failed");
  return data;
}

export async function resendOtp(email: string) {
  const res = await authFetch(`/api/auth/resend-otp?email=${encodeURIComponent(email)}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Failed to resend OTP");
  return data;
}

export async function login(payload: LoginPayload) {
  const res = await authFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || "Login failed");
  return data;
}

export async function logout() {
  const res = await authFetch("/api/auth/logout", { method: "POST" });
  return res.ok;
}

export async function refreshToken() {
  const res = await authFetch("/api/auth/refresh", { method: "POST" });
  return res.ok;
}

export async function getSession(): Promise<SessionResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${PROXY_BASE}/api/auth/session`, {
      credentials: "include",
      signal: controller.signal,
    });
    const data: SessionResponse = await res.json();
    if (!data.authenticated) {
      const refreshed = await refreshToken();
      if (refreshed) {
        const retryRes = await fetch(`${PROXY_BASE}/api/auth/session`, {
          credentials: "include",
        });
        return retryRes.json();
      }
    }
    return data;
  } catch {
    return { authenticated: false };
  } finally {
    clearTimeout(timer);
  }
}

export async function getMe(): Promise<AuthUser> {
  const res = await authFetch("/api/auth/me");
  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
}

export async function requestPasswordReset(payload: PasswordResetRequestPayload) {
  const res = await authFetch("/api/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to request password reset");
  return data;
}

export async function confirmPasswordReset(payload: PasswordResetConfirmPayload) {
  const res = await authFetch("/api/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Password reset failed");
  return data;
}

export async function mfaEnrollStart(payload: MfaEnrollStartPayload) {
  const res = await authFetch("/api/auth/mfa/enroll/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "MFA enrollment failed");
  return data as { otpauthUri: string; secret: string; qrImageDataUrl: string };
}

export async function mfaEnrollConfirm(payload: MfaEnrollConfirmPayload) {
  const res = await authFetch("/api/auth/mfa/enroll/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "MFA confirmation failed");
  return data;
}

export async function oauthMfaVerify(payload: OAuthMfaVerifyPayload) {
  const res = await authFetch("/api/auth/oauth/mfa/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "OAuth MFA verification failed");
  return data;
}

export type OAuthProvider = "google" | "github" | "azure" | "linkedin";

export function oauthUrl(provider: OAuthProvider) {
  return `${GATEWAY_DIRECT}/oauth2/authorization/${provider}`;
}
