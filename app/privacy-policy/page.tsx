"use client";
import Link from "next/link";
import { QrCode } from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h2>
    <div className="text-slate-600 dark:text-neutral-400 leading-relaxed space-y-3">{children}</div>
  </div>
);
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-white font-sans">
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00E5FF]/10 blur-[150px] rounded-full pointer-events-none" />
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0B0F1A]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-lg">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">ScanMyEntry</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
      <main className="pt-32 pb-24 px-6 relative z-10 max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-neutral-500 text-sm">Last updated: April 2026 &middot; Effective immediately</p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
          <Section title="1. Information We Collect">
            <p>When you sign up for ScanMyEntry, we collect the following information:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Your full name and email address</li>
              <li>Date of Birth (used for account and password recovery)</li>
              <li>Event details you create on the platform</li>
              <li>Attendee registration data submitted through your event forms</li>
            </ul>
            <p>We never store your credit or debit card numbers directly. All payments are processed securely through Razorpay's payment gateway.</p>
          </Section>
          <Section title="2. How Your Data is Used">
            <p>Your data is used exclusively for the following purposes:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Account management and authentication</li>
              <li>Password recovery and identity verification</li>
              <li>Event registration and QR ticket generation</li>
              <li>Platform security and fraud prevention</li>
            </ul>
            <p>We do not sell or share your personal data with any third parties.</p>
          </Section>
          <Section title="3. Data Security">
            <p>
              Your data is stored on Google Firebase's secure infrastructure, which uses industry-standard encryption.
              Firebase Security Rules are applied to all authenticated requests to ensure your data remains protected.
            </p>
          </Section>
          <Section title="4. Cookies">
            <p>
              ScanMyEntry uses minimal cookies solely for session management. We do not set any third-party advertising or tracking cookies.
            </p>
          </Section>
          <Section title="5. Your Rights">
            <p>You may request deletion of your account and associated data by contacting us at <span className="text-[#00E5FF]">support@scanmyentry.com</span></p>
            <p>You can update your profile information directly from the dashboard at any time.</p>
          </Section>
          <Section title="6. Contact">
            <p>For any privacy-related questions, reach us at: <span className="text-[#00E5FF]">rockysinghdangi@gmail.com</span></p>
            <p>Phone: <span className="font-semibold text-slate-800 dark:text-white">+91 9241277903</span></p>
          </Section>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-[#00E5FF] hover:underline font-medium text-sm">&larr; Back to Home</Link>
        </div>
      </main>
    </div>
  );
}
