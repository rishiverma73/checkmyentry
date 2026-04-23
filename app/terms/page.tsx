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
export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F1A] text-slate-900 dark:text-white font-sans">
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#8B5CF6]/10 blur-[150px] rounded-full pointer-events-none" />
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#0B0F1A]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5CF6] flex items-center justify-center shadow-lg">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CheckMyEntry</span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
      <main className="pt-32 pb-24 px-6 relative z-10 max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Terms of Service</h1>
          <p className="text-slate-500 dark:text-neutral-500 text-sm">Last updated: April 2026 &middot; Applicable to all users</p>
        </div>
        <div className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-sm">
          <Section title="1. Use of the Platform">
            <p>
              CheckMyEntry is a SaaS platform that provides event organizers with QR-based entry management capabilities.
              By using the platform, you agree to abide by these terms.
            </p>
            <p>
              Misuse of the platform — including creating fraudulent events, misusing attendee data, or attempting to tamper with the system — is strictly prohibited and may result in immediate account termination.
            </p>
          </Section>
          <Section title="2. Account Responsibility">
            <p>
              You are solely responsible for maintaining the security of your account. Do not share your password with anyone.
              If you notice any suspicious activity on your account, please report it immediately to <span className="text-[#00E5FF]">support@checkmyentry.com</span>.
            </p>
          </Section>
          <Section title="3. Event Content">
            <p>
              You are fully responsible for the content of events you create on the platform.
              Creating illegal, misleading, or harmful events is strictly prohibited.
              CheckMyEntry reserves the right to remove any event without prior notice.
            </p>
          </Section>
          <Section title="4. Payments and Commission">
            <p>
              Payment gateway fees and platform commission apply to paid events.
              These charges are clearly displayed before checkout.
              Refund policies are determined by the event organizer — CheckMyEntry is not directly responsible for issuing refunds to attendees.
            </p>
          </Section>
          <Section title="5. Data and Privacy">
            <p>
              Attendee data is used solely for event management purposes.
              We comply with the Digital Personal Data Protection (DPDP) Act 2023, India.
              For full details, please review our <Link href="/privacy-policy" className="text-[#00E5FF] hover:underline">Privacy Policy</Link>.
            </p>
          </Section>
          <Section title="6. Service Availability">
            <p>
              We strive to maintain 99.9% uptime. However, the service may be temporarily unavailable during scheduled maintenance windows or due to force majeure events beyond our control.
            </p>
          </Section>
          <Section title="7. Changes to Terms">
            <p>
              CheckMyEntry may update these terms at any time. Users will be notified of material changes via email or an in-platform notification.
            </p>
          </Section>
          <Section title="8. Dispute Resolution">
            <p>
              Any disputes arising from the use of this platform shall be subject to the jurisdiction of the courts in Jodhpur, Rajasthan, India. Indian law shall apply.
            </p>
            <p>Contact: <span className="text-[#00E5FF]">rockysinghdangi@gmail.com</span> &nbsp;&middot;&nbsp; <span className="font-semibold text-slate-800 dark:text-white">+91 9241277903</span></p>
          </Section>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-[#00E5FF] hover:underline font-medium text-sm">&larr; Back to Home</Link>
        </div>
      </main>
    </div>
  );
}
