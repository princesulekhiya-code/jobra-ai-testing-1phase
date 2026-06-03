"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Bell, Moon, Lock, Download, Trash2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

function SectionCard({ title, icon: Icon, danger, children }: { title: string; icon: React.ElementType<{ className?: string }>; danger?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl border p-6 mb-5 ${danger ? "bg-destructive/5 border-destructive/20" : "bg-card border-border"}`}>
      <div className={`flex items-center gap-2.5 mb-5 pb-4 border-b ${danger ? "border-destructive/20" : "border-border"}`}>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${danger ? "bg-destructive/10" : "bg-primary/10"}`}>
          <Icon className={`w-4 h-4 ${danger ? "text-destructive" : "text-primary"}`} />
        </div>
        <h2 className="text-[14px] font-bold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${on ? "bg-primary" : "bg-switch-background"}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-primary-foreground shadow-sm transition-transform duration-300 ${on ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function SettingRow({ label, desc, action }: { label: string; desc: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
      <div>
        <div className="text-[13px] font-semibold text-foreground">{label}</div>
        <div className="text-[11px] text-muted-foreground mt-0.5">{desc}</div>
      </div>
      {action}
    </div>
  );
}

function ActionBtn({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <button className={`px-4 py-1.5 rounded-xl text-[12px] font-semibold border transition-all duration-200 ${danger ? "border-destructive/30 text-destructive hover:bg-destructive/10" : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
      {label}
    </button>
  );
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    jobMatch: true,
    interview: false,
    weekly: false,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-3xl mx-auto">

        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60 mb-2">Account</p>
          <h1 className="text-2xl font-extrabold text-foreground leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Account{" "}
            <span className="warm-text">Settings</span>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1">Manage your preferences, security and privacy</p>
        </div>

        <SectionCard title="Notifications" icon={Bell}>
          <div className="divide-y divide-border">
            <SettingRow label="Email notifications" desc="Receive updates and alerts via email" action={<Toggle on={notifications.email} onToggle={() => toggleNotification("email")} />} />
            <SettingRow label="Push notifications" desc="Get real-time alerts on your device" action={<Toggle on={notifications.push} onToggle={() => toggleNotification("push")} />} />
            <SettingRow label="Job match alerts" desc="Notify when new matches are found" action={<Toggle on={notifications.jobMatch} onToggle={() => toggleNotification("jobMatch")} />} />
            <SettingRow label="Interview reminders" desc="Get reminded about scheduled interviews" action={<Toggle on={notifications.interview} onToggle={() => toggleNotification("interview")} />} />
            <SettingRow label="Weekly summary" desc="Receive a weekly digest of your activity" action={<Toggle on={notifications.weekly} onToggle={() => toggleNotification("weekly")} />} />
          </div>
        </SectionCard>

        <SectionCard title="Appearance" icon={Moon}>
          <div className="mb-5">
            <p className="text-[11px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">Theme</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                { name: "Light", value: "light" as const, bg: "bg-foreground/10" },
                { name: "Dark", value: "dark" as const, bg: "bg-background" },
              ]).map(({ name, value, bg }) => (
                <button
                  key={name}
                  onClick={() => { if (theme !== value) toggleTheme(); }}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${theme === value ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30"}`}
                >
                  <div className={`h-8 rounded-lg mb-2 ${bg}`} />
                  <div className="text-[12px] font-semibold text-foreground">{name}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">Language</p>
            <select className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-foreground text-[13px] focus:outline-none focus:border-primary/50">
              <option>English (US)</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </SectionCard>

        <SectionCard title="Privacy & Security" icon={Lock}>
          <SettingRow
            label="Profile visibility"
            desc="Control who can see your profile"
            action={
              <select className="px-3 py-1.5 bg-secondary border border-border rounded-xl text-[12px] font-semibold text-foreground focus:outline-none focus:border-primary/50">
                <option>Public</option>
                <option>Private</option>
                <option>Connections only</option>
              </select>
            }
          />
          <SettingRow label="Two-factor authentication" desc="Add an extra layer of security to your account" action={<ActionBtn label="Enable" />} />
          <SettingRow label="Change password" desc="Update your account password" action={<ActionBtn label="Update" />} />
        </SectionCard>

        <SectionCard title="Data Export" icon={Download}>
          <SettingRow
            label="Download your data"
            desc="Get a complete copy of all your JOBRA data"
            action={
              <button className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-secondary border border-border text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-card transition-colors duration-200">
                <Download className="w-3.5 h-3.5" /> Export
              </button>
            }
          />
        </SectionCard>

        <SectionCard title="Danger Zone" icon={Trash2} danger>
          <SettingRow
            label="Delete account"
            desc="Permanently delete your account and all associated data. This cannot be undone"
            action={<ActionBtn label="Delete Account" danger />}
          />
        </SectionCard>

      </div>
    </DashboardLayout>
  );
}
