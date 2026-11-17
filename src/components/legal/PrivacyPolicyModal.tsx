import React from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Database,
  Eye,
  FileText,
  Trash2,
  Download,
  AlertTriangle,
  Server,
  CheckCircle2
} from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-brand-surface border border-brand-border rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-brand-border flex items-center justify-between bg-brand-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/15 text-brand-yellow flex items-center justify-center border border-brand-yellow/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">FitTrack PRO Privacy & Security Policy</h2>
              <p className="text-xs text-slate-400">
                Effective: November 2026 • OWASP Top 10 Compliant • GDPR & CCPA Aligned
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-brand-dark/80 hover:bg-brand-hover text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* 1. DATA COLLECTION & PURPOSE */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider">
              <FileText className="w-4 h-4 text-brand-yellow" />
              <span>1. Personal Data Collected & Purpose</span>
            </div>
            <p>
              We practice strict <strong>data minimization</strong>: we collect only data strictly necessary to deliver personalized fitness planning and nutritional tracking.
            </p>
            <div className="overflow-x-auto rounded-xl border border-brand-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-brand-dark/90 text-slate-300">
                  <tr>
                    <th className="p-3 border-b border-brand-border">Data Element</th>
                    <th className="p-3 border-b border-brand-border">Purpose & Legitimate Basis</th>
                    <th className="p-3 border-b border-brand-border">Retention Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  <tr>
                    <td className="p-3 font-bold text-white">Full Name & Email</td>
                    <td className="p-3">Account identity, secure authentication, and optional weekly progress digests.</td>
                    <td className="p-3">Duration of active account.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Age Band & Height/Weight</td>
                    <td className="p-3">BMI calculation, age-calibrated recovery periods, and daily caloric burn calculations.</td>
                    <td className="p-3">Kept until updated or deleted by user.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Dietary Palette & Meals</td>
                    <td className="p-3">Filter recipes (e.g. Vegetarian/Non-Veg), track macronutrients (ICMR-NIN guidelines).</td>
                    <td className="p-3">Active account duration or user purge.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Workout & PR Logs</td>
                    <td className="p-3">Track progression across Calisthenics, Taekwondo, and Gym barbell lifts.</td>
                    <td className="p-3">Active account duration or user purge.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-white">Meal Photos (Optional)</td>
                    <td className="p-3">Processed client-side or zero-egress R2 bucket solely for nutritional estimation.</td>
                    <td className="p-3">Deleted immediately or stored locally.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 2. AUTHENTICATION & SECRETS MANAGEMENT */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>2. Secrets, Passwords & Access Controls</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li>
                <strong>Cryptographic Password Hashing:</strong> Passwords are never stored in plaintext. They are hashed using PBKDF2 with SHA-256 (100,000 iterations) and salted keys.
              </li>
              <li>
                <strong>Brute-Force Rate Limiting:</strong> Login attempts are capped at 5 attempts before progressive cooldown lockouts are enforced.
              </li>
              <li>
                <strong>Row-Level Data Ownership:</strong> Every query strictly validates <code className="text-brand-yellow bg-brand-dark px-1 py-0.5 rounded">user_id = auth.uid()</code>. Users can never view or modify another athlete's records.
              </li>
              <li>
                <strong>Zero Hardcoded Secrets:</strong> No credentials, private tokens, or database passwords exist in source control. Environment variables are kept in non-committed <code className="text-slate-200">.env</code> files.
              </li>
            </ul>
          </section>

          {/* 3. INPUT/OUTPUT SAFETY & DATA PROTECTION */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>3. Input Validation, Anti-XSS & Anti-CSRF</span>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
              <li>
                <strong>Parameterized SQL Queries:</strong> Database interactions with Neon PostgreSQL use strict parameter binding (<code className="text-slate-200">$1, $2, ...</code>) to eliminate SQL injection vulnerabilities.
              </li>
              <li>
                <strong>Output Sanitization & Anti-XSS:</strong> All user-supplied content is escaped in React components and sanitized using HTML entity stripping before rendering.
              </li>
              <li>
                <strong>Anti-CSRF Tokens:</strong> Dynamic cryptographically secure CSRF tokens validate state-changing requests.
              </li>
              <li>
                <strong>HTTPS Everywhere:</strong> HSTS headers (<code className="text-slate-200">max-age=63072000; includeSubDomains; preload</code>) mandate end-to-end encrypted transit.
              </li>
              <li>
                <strong>Sensitive Logs Sanitized:</strong> Internal error logs redact email addresses, passwords, and tokens (<code className="text-slate-200">[REDACTED_EMAIL]</code>).
              </li>
            </ul>
          </section>

          {/* 4. THIRD-PARTY DATA PROCESSORS */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider">
              <Server className="w-4 h-4 text-purple-400" />
              <span>4. Third-Party Processors & Data Sharing</span>
            </div>
            <p>FitTrack PRO never sells athlete data. We integrate only with vetted enterprise cloud providers:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border">
                <div className="font-bold text-white">Neon PostgreSQL</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Encrypted at rest (AES-256) serverless database for relational workout and nutrition logs.</div>
              </div>
              <div className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border">
                <div className="font-bold text-white">Clerk Identity</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Enterprise JWT identity management, MFA verification, and secure session rotation.</div>
              </div>
              <div className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border">
                <div className="font-bold text-white">Resend</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Transactional email delivery for optional Monday weigh-in reminders and weekly recaps.</div>
              </div>
              <div className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border">
                <div className="font-bold text-white">Cloudflare R2</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Zero-egress private S3-compatible media store for optional food snapshots.</div>
              </div>
            </div>
          </section>

          {/* 5. USER RIGHTS (GDPR & CCPA) */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>5. User Rights & Data Portability</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Right to View & Edit</span>
                </div>
                <p className="text-[11px] text-slate-400">Update your profile, measurements, dietary palette, or training disciplines anytime in Settings.</p>
              </div>

              <div className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <Download className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>Right to Export (JSON)</span>
                </div>
                <p className="text-[11px] text-slate-400">Download your entire historical dataset (workouts, meals, weights) in standard machine-readable JSON format.</p>
              </div>

              <div className="p-3 rounded-xl bg-brand-dark/70 border border-brand-border">
                <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Right to Erasure</span>
                </div>
                <p className="text-[11px] text-slate-400">Permanently delete your account and all associated local and database training logs in 1 click.</p>
              </div>
            </div>
          </section>

          {/* 6. INCIDENT RESPONSE & OWASP AUDIT */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>6. Incident Response & Breach Notification</span>
            </div>
            <p className="text-xs text-slate-300">
              In the unlikely event of a security anomaly or data exposure, FitTrack PRO maintains a rapid containment protocol: compromised sessions are immediately revoked, affected athletes are notified within <strong>72 hours</strong>, and automated point-in-time database backups restore operational integrity.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-brand-border flex items-center justify-between bg-brand-card/30">
          <span className="text-[11px] text-slate-400">
            Questions? Contact Data Officer: <strong className="text-slate-200">privacy@fittrack.in</strong>
          </span>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-brand-yellow text-slate-950 font-black text-xs transition cursor-pointer hover:bg-brand-yellowDark"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
