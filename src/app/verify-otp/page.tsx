"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { verifyOtp, resendOtp } from "@/lib/auth-api";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

function VerifyOtpContent() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") || "";
  const otpFromUrl = params.get("otp") || "";

  const [otp, setOtp] = useState(otpFromUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async () => {
    if (!otp.trim()) { setError("Enter the OTP"); return; }
    if (!email) { setError("Email missing from URL"); return; }
    setError("");
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      setSuccess("Email verified! Redirecting to login...");
      setTimeout(() => router.push("/login?verified=1"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) { setError("Email missing"); return; }
    setError("");
    setLoading(true);
    try {
      await resendOtp(email);
      setSuccess("New OTP sent to your email!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-card rounded-2xl border border-border shadow-[0_4px_32px_rgba(0,0,0,0.3)] p-7">
        <h1 className="text-[22px] font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Verify your email
        </h1>
        <p className="text-[13px] text-muted-foreground mb-5">
          Enter the OTP sent to <span className="text-foreground font-medium">{email || "your email"}</span>
        </p>

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

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full px-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all text-center tracking-[0.5em] font-mono text-lg mb-4"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] mb-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Verify OTP
        </button>

        <button
          onClick={handleResend}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
