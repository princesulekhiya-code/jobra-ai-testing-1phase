"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, ArrowRight, Lock, Sparkles, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { requestPasswordReset, confirmPasswordReset } from "@/lib/auth-api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const handleRequest = async () => {
    if (!email.trim()) { setError("Please enter your email"); return; }
    setError("");
    setLoading(true);
    try {
      await requestPasswordReset({ email });
      setSuccess("If an account exists with this email, a reset OTP has been sent.");
      setStep("confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!otp.trim()) { setError("Enter the OTP from your email"); return; }
    if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPwd) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    try {
      await confirmPasswordReset({ email, otp, newPassword });
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: "hsl(25 55% 58% / 0.08)" }} />
      <div className="absolute bottom-1/4 right-1/5 w-60 h-60 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: "hsl(25 55% 58% / 0.05)" }} />

      <div className="relative w-full max-w-[400px] bg-card rounded-2xl border border-border shadow-[0_4px_32px_rgba(0,0,0,0.3)] p-7">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <span className="text-[18px] font-bold text-primary tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Jobra AI</span>
        </div>

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

        {step === "request" ? (
          <>
            <h1 className="text-[22px] font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Reset password</h1>
            <p className="text-[13px] text-muted-foreground mb-5">Enter your email and we&apos;ll send you a reset code.</p>

            <div className="relative mb-6">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRequest()}
                className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <button
              onClick={handleRequest}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              Send Reset Code
            </button>
          </>
        ) : (
          <>
            <h1 className="text-[22px] font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Set new password</h1>
            <p className="text-[13px] text-muted-foreground mb-5">Enter the OTP from your email and choose a new password.</p>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all text-center tracking-[0.5em] font-mono text-lg mb-3"
            />

            <div className="relative mb-3">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="New password (min 8 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div className="relative mb-6">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] mb-3 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Reset Password
            </button>

            <button
              onClick={() => { setStep("request"); setError(""); setSuccess(""); }}
              className="w-full py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Resend code
            </button>
          </>
        )}
      </div>
    </div>
  );
}
