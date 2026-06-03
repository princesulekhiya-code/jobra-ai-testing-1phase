"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, ArrowLeft, Copy, CheckCircle } from "lucide-react";
import { mfaEnrollStart, mfaEnrollConfirm } from "@/lib/auth-api";

function MfaSetupContent() {
  const router = useRouter();
  const params = useSearchParams();
  const emailFromUrl = params.get("email") || "";

  const [step, setStep] = useState<"credentials" | "qr" | "done">("credentials");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [qrImage, setQrImage] = useState("");
  const [secret, setSecret] = useState("");

  const handleStart = async () => {
    if (!email.trim() || !password.trim()) { setError("Email and password required"); return; }
    setError("");
    setLoading(true);
    try {
      const data = await mfaEnrollStart({ email, password });
      setQrImage(data.qrImageDataUrl);
      setSecret(data.secret);
      setStep("qr");
    } catch (err) {
      setError(err instanceof Error ? err.message : "MFA setup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!code.trim() || code.length < 6) { setError("Enter the 6-digit code from your authenticator app"); return; }
    setError("");
    setLoading(true);
    try {
      await mfaEnrollConfirm({ email, password, code });
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/5 w-72 h-72 rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: "hsl(25 55% 58% / 0.08)" }} />

      <div className="relative w-full max-w-[420px] bg-card rounded-2xl border border-border shadow-[0_4px_32px_rgba(0,0,0,0.3)] p-7">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>

        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>MFA Setup</h1>
            <p className="text-[11px] text-muted-foreground">Two-factor authentication</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-[12px] text-destructive">{error}</p>
          </div>
        )}

        {step === "credentials" && (
          <>
            <p className="text-[13px] text-muted-foreground mb-5">Enter your credentials to begin MFA enrollment.</p>

            <div className="relative mb-3">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div className="relative mb-6">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                className="w-full pl-10 pr-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <button onClick={handleStart} disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Start MFA Setup
            </button>
          </>
        )}

        {step === "qr" && (
          <>
            <p className="text-[13px] text-muted-foreground mb-4">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>

            <div className="flex justify-center mb-4 p-4 bg-white rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrImage} alt="MFA QR Code" width={200} height={200} />
            </div>

            <div className="mb-5">
              <p className="text-[11px] text-muted-foreground mb-1.5">Or enter this secret manually:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-[11px] bg-secondary px-3 py-2 rounded-lg text-foreground font-mono break-all border border-border">{secret}</code>
                <button onClick={copySecret} className="p-2 rounded-lg bg-secondary border border-border hover:bg-card transition-colors">
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
              </div>
            </div>

            <input
              type="text" placeholder="Enter 6-digit code" value={code} maxLength={6}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              className="w-full px-4 py-3 text-[13px] rounded-xl bg-secondary border border-border text-foreground outline-none focus:border-primary/50 transition-all text-center tracking-[0.5em] font-mono text-lg mb-4"
            />

            <button onClick={handleConfirm} disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)] flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Verify & Enable MFA
            </button>
          </>
        )}

        {step === "done" && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-[18px] font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>MFA Enabled</h2>
            <p className="text-[13px] text-muted-foreground mb-6">Your account is now protected with two-factor authentication.</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-[14px] font-bold hover:opacity-90 transition-opacity shadow-[0_2px_8px_hsl(25_55%_58%/0.3)]"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MfaSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
      <MfaSetupContent />
    </Suspense>
  );
}
