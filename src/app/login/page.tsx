"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { X, Mail, ArrowRight, Eye, EyeOff, Lock, Sparkles, User, AlertCircle, Loader2 } from "lucide-react";
import { register, login, verifyOtp, resendOtp, oauthUrl, oauthMfaVerify } from "@/lib/auth-api";
import { useAuth } from "@/components/AuthProvider";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { authenticated, loading: authLoading, refresh } = useAuth();

  const [activeTab, setActiveTab] = useState<"signup" | "signin">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [showMfa, setShowMfa] = useState(false);
  const [oauthMfaMode, setOauthMfaMode] = useState(false);
  const [challengeToken, setChallengeToken] = useState("");

  const [otp, setOtp] = useState("");

  const redirectTo = params.get("redirect") || "/dashboard";
  const [mfaRedirecting, setMfaRedirecting] = useState(false);

  useEffect(() => {
    const err = params.get("error");
    if (err === "mfa_enroll_required") {
      const mfaEmail = params.get("email") || "";
      setMfaRedirecting(true);
      router.replace(`/mfa-setup${mfaEmail ? `?email=${encodeURIComponent(mfaEmail)}` : ""}`);
      return;
    }
  }, [params, router]);

  useEffect(() => {
    if (mfaRedirecting) return;
    if (!authLoading && authenticated) {
      router.replace(redirectTo);
    }
  }, [authenticated, authLoading, router, redirectTo, mfaRedirecting]);

  useEffect(() => {
    if (mfaRedirecting) return;
    const err = params.get("error");
    const reason = params.get("reason");
    if (err === "oauth") setError(reason || "OAuth login failed. Please try again.");
    else if (err === "oauth_email") setError("Could not get email from provider. Please use email login.");
    if (params.get("verified") === "1") setSuccess("Email verified! You can now sign in.");

    if (params.get("mfa") === "1" && params.get("oauth") === "1") {
      const email = params.get("email") || "";
      const challenge = params.get("challenge") || "";
      setSigninEmail(email);
      setChallengeToken(challenge);
      setOauthMfaMode(true);
      setShowMfa(true);
      setActiveTab("signin");
      setError("Your admin account requires MFA verification. Enter your TOTP code.");
    }
  }, [params, mfaRedirecting]);

  const handleRegister = async () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await register({ name: signupName, email: signupEmail, password: signupPassword });
      setOtpEmail(signupEmail);
      setShowOtp(true);
      setSuccess("Registration successful! Check your email for OTP.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (oauthMfaMode) {
      if (!mfaCode.trim()) {
        setError("Enter your TOTP code");
        return;
      }
      setError("");
      setLoading(true);
      try {
        await oauthMfaVerify({ email: signinEmail, mfaCode, challengeToken });
        await refresh();
        router.push(redirectTo);
      } catch (err) {
        setError(err instanceof Error ? err.message : "MFA verification failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!signinEmail.trim() || !signinPassword.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ email: signinEmail, password: signinPassword, mfaCode: showMfa ? mfaCode : undefined });
      await refresh();
      router.push(redirectTo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (msg.toLowerCase().includes("enroll") || msg.toLowerCase().includes("mfa enrollment")) {
        router.push(`/mfa-setup?email=${encodeURIComponent(signinEmail)}`);
        return;
      } else if (msg.toLowerCase().includes("mfa") || msg.toLowerCase().includes("totp")) {
        setShowMfa(true);
        setError("Enter your MFA code to continue.");
      } else if (msg.toLowerCase().includes("verify") || msg.toLowerCase().includes("otp")) {
        try {
          await resendOtp(signinEmail);
          setOtpEmail(signinEmail);
          setShowOtp(true);
          setError("");
          setSuccess("Your email is not verified yet. We sent a new OTP to your email.");
        } catch {
          setError("Email not verified. Please register again.");
        }
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) { setError("Enter the OTP"); return; }
    setError("");
    setLoading(true);
    try {
      await verifyOtp({ email: otpEmail, otp });
      setShowOtp(false);
      setActiveTab("signin");
      setSigninEmail(otpEmail);
      setSuccess("Email verified! Sign in now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await resendOtp(otpEmail);
      setSuccess("OTP resent! Check your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  if (mfaRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: "hsl(25 55% 58% / 0.08)" }} />
      <div className="absolute bottom-1/4 right-1/5 w-60 h-60 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: "hsl(25 55% 58% / 0.05)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle, hsl(25 55% 58% / 0.2) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative w-full max-w-[400px] bg-card rounded-2xl border border-border shadow-[0_4px_32px_rgba(0,0,0,0.3)] p-7">
        <Link href="/" className="absolute top-5 right-5 w-8 h-8 rounded-full bg-secondary hover:bg-border flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-muted-foreground" />
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-[18px] font-bold text-primary tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Jobra AI</span>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-[12px] text-destructive">{error}</p>
          </div>
        )}
        {success && !error && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-[12px] text-emerald-400">{success}</p>
          </div>
        )}

        {/* OTP Screen */}
        {showOtp ? (
          <>
            <h1 className="text-[22px] font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Verify your email</h1>
            <p className="text-[13px] text-muted-foreground mb-5">We sent a code to <span className="text-foreground font-medium">{otpEmail}</span></p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all text-center tracking-[0.5em] font-mono text-lg mb-4"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] mb-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Verify OTP
            </button>

            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Resend OTP
            </button>
          </>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex bg-secondary rounded-xl p-1 mb-6 gap-1">
              {(["signup", "signin"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                    activeTab === tab ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "signup" ? "Sign up" : "Sign in"}
                </button>
              ))}
            </div>

            <h1 className="text-[22px] font-bold text-foreground mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
              {activeTab === "signup" ? "Create an account" : "Welcome back"}
            </h1>

            {activeTab === "signup" ? (
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                <div className="relative mb-3">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full name"
                    autoComplete="name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="relative mb-3">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="relative mb-6">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    autoComplete="new-password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] mb-5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Create Account
                </button>
              </form>
            ) : oauthMfaMode ? (
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <p className="text-[13px] text-muted-foreground mb-4">
                  Signed in as <span className="text-foreground font-medium">{signinEmail}</span>
                </p>

                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Enter 6-digit TOTP code"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    maxLength={6}
                    autoFocus
                    className="w-full px-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all text-center tracking-[0.5em] font-mono text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] mb-5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Verify &amp; Sign In
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div className="relative mb-3">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="username"
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="relative mb-3">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {showMfa && (
                  <div className="relative mb-3">
                    <input
                      type="text"
                      placeholder="MFA Code"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      maxLength={6}
                      className="w-full px-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all text-center tracking-[0.3em] font-mono"
                    />
                  </div>
                )}

                <div className="flex justify-end mb-4">
                  <Link href="/forgot-password" className="text-[12px] text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] mb-5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  Sign In to JOBRA
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative mb-4">
              <div className="absolute top-1/2 inset-x-0 h-px bg-border" />
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-[11px] text-muted-foreground uppercase tracking-widest">or continue with</span>
              </div>
            </div>

            {/* OAuth */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <a
                href={oauthUrl("google")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-[11px] font-medium text-foreground/70">Google</span>
              </a>
              <a
                href={oauthUrl("github")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="fill-foreground">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span className="text-[11px] font-medium text-foreground/70">GitHub</span>
              </a>
              <a
                href={oauthUrl("azure")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 23 23">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#00a4ef" d="M1 12h10v10H1z"/>
                  <path fill="#7fba00" d="M12 1h10v10H12z"/>
                  <path fill="#ffb900" d="M12 12h10v10H12z"/>
                </svg>
                <span className="text-[11px] font-medium text-foreground/70">Microsoft</span>
              </a>
              <a
                href={oauthUrl("linkedin")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-[11px] font-medium text-foreground/70">LinkedIn</span>
              </a>
            </div>

            <p className="text-[11.5px] text-muted-foreground text-center">
              By {activeTab === "signup" ? "creating" : "signing into"} an account, you agree to our{" "}
              <Link href="#" className="text-primary hover:underline">Terms & Service</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
