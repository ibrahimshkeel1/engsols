import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EngSols collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "Overview",
    body: [
      "EngSols (“we”, “us”) operates the EngSols career platform for engineering mentorship, portfolios, jobs, and community features. This policy explains what information we collect, how we use it, and the choices you have.",
      "By creating an account or using the site, you agree to this policy. If you do not agree, please do not use the service.",
    ],
  },
  {
    title: "Information we collect",
    body: [
      "Account information — name, email address, password hash, profile photo, discipline, skills, career goals, and onboarding preferences you provide.",
      "Mentor and portfolio content — professional headline, company, bio, rates, booking availability, portfolio projects, credentials, and application materials.",
      "Usage data — pages visited, searches, filters, saved mentors, bookings, job applications, forum posts, and notification preferences.",
      "Technical data — browser type, device information, IP address, cookies, and analytics events used to secure and improve the platform.",
      "Communications — messages you send through booking requests, forum posts, live sessions, and support inquiries.",
    ],
  },
  {
    title: "How we use information",
    body: [
      "Provide core features — mentor discovery, bookings, portfolios, jobs, certifications, forum, live sessions, marketplace, and personalized recommendations.",
      "Operate your account — authentication, settings, saved items, notifications, and mentor or seller dashboards.",
      "Improve the product — analytics, debugging, fraud prevention, and performance monitoring.",
      "Communicate with you — booking updates, replies to your forum threads, product announcements, and security alerts.",
      "Comply with law — respond to lawful requests and enforce our terms when necessary.",
    ],
  },
  {
    title: "Sharing and disclosure",
    body: [
      "Public profiles — mentor profiles, portfolios, forum posts, and marketplace listings you publish are visible to other users and may appear in search results.",
      "Service providers — we use hosting, authentication, email, analytics, and payment processors that process data on our behalf under contractual safeguards.",
      "Legal requirements — we may disclose information if required by law or to protect users, the platform, or the public.",
      "We do not sell your personal information.",
    ],
  },
  {
    title: "Cookies and analytics",
    body: [
      "We use cookies and similar technologies for sign-in sessions, locale preferences, and product analytics.",
      "You can control cookies through your browser settings. Disabling cookies may limit some features such as staying signed in.",
    ],
  },
  {
    title: "Data retention",
    body: [
      "We retain account and profile data while your account is active and for a reasonable period afterward to comply with legal obligations and resolve disputes.",
      "You may request deletion of your account by contacting us. Some content may remain in backups for a limited time or where retention is required by law.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "Depending on your location, you may have the right to access, correct, export, or delete personal data we hold about you.",
      "You can update most profile information in Settings. For other requests, contact us using the details below.",
    ],
  },
  {
    title: "Security",
    body: [
      "We use industry-standard measures including encrypted connections, access controls, and secure authentication providers. No method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "Children",
    body: [
      "EngSols is intended for adults and professional engineering students. We do not knowingly collect personal information from children under 16.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "We may update this policy from time to time. The “Last updated” date below will change when we do. Continued use after changes means you accept the revised policy.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Questions about privacy? Email privacy@engsols.com or use the contact options on the platform.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        description="How we handle your data on EngSols."
        label="Legal"
      />
      <div className="page-container-wide py-16 lg:py-20">
        <p className="text-caption text-text-muted">Last updated: June 16, 2026</p>
        <div className="mt-10 max-w-3xl space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold sm:text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-body-lg text-pretty text-text-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-text-muted">
          See also{" "}
          <Link href="/how-it-works" className="font-medium text-zone-mentorship hover:underline">
            How EngSols works
          </Link>
          .
        </p>
      </div>
    </>
  );
}
