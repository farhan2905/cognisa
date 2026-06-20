'use client';

import SubPageShell from '@/components/shared/SubPageShell';
import PageHero from '@/components/shared/PageHero';
import GlassContentBlock from '@/components/shared/GlassContentBlock';
import MiniNeuralConstellation from '@/components/shared/fragments/MiniNeuralConstellation';
import TableOfContents from '@/components/shared/fragments/TableOfContents';

const sections = [
  { id: 'information-we-collect', title: '1. Information We Collect' },
  { id: 'how-we-use', title: '2. How We Use Your Information' },
  { id: 'information-sharing', title: '3. Information Sharing' },
  { id: 'data-security', title: '4. Data Security' },
  { id: 'cookies', title: '5. Cookies' },
  { id: 'your-rights', title: '6. Your Rights' },
  { id: 'third-party', title: '7. Third-Party Links' },
];

const content = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    body: `We collect information that you provide directly to us, such as when you fill out a contact form, request a consultation, or communicate with us via email. This may include your name, email address, company name, phone number, and project details.\n\nWe may also automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed. This data is collected via cookies and similar technologies.`,
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    body: `We use the information we collect to:\n\n• Respond to your inquiries and provide the services you request\n• Communicate with you about projects, updates, and promotional content\n• Improve our website, services, and user experience\n• Comply with legal obligations and protect our rights\n• Analyze website traffic and usage patterns to optimize performance`,
  },
  {
    id: 'information-sharing',
    title: '3. Information Sharing',
    body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided that those parties agree to keep this information confidential.\n\nWe may also disclose your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.`,
  },
  {
    id: 'data-security',
    title: '4. Data Security',
    body: `We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encrypted data transmission (SSL/TLS), secure server infrastructure, and regular security audits.\n\nHowever, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    id: 'cookies',
    title: '5. Cookies',
    body: `Our website uses cookies to enhance your browsing experience. Cookies are small data files stored on your device that help us understand how you use our website. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some features of our website may not function properly without cookies.`,
  },
  {
    id: 'your-rights',
    title: '6. Your Rights',
    body: `You have the right to:\n\n• Access the personal data we hold about you\n• Request correction of inaccurate data\n• Request deletion of your data\n• Opt out of marketing communications at any time\n• Lodge a complaint with a supervisory authority\n\nTo exercise any of these rights, please contact us at farhansiddiqui0156@gmail.com.`,
  },
  {
    id: 'third-party',
    title: '7. Third-Party Links',
    body: `Our website may contain links to third-party websites or services that are not owned or controlled by Cognisa. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.\n\nWe encourage you to read the privacy policies of any third-party website you visit.`,
  },
];

export default function PrivacyPage() {
  return (
    <SubPageShell>
      <div className="relative overflow-hidden">
        <MiniNeuralConstellation className="z-10 opacity-15" />
      <PageHero
        tagText="LEGAL"
        title="Privacy"
        titleAccent="Policy"
        description="How we collect, use, and protect your information. We believe in complete transparency."
        orbColor="#6366f1"
        orbColor2="#a78bfa"
      />
      </div>

      <section className="relative py-12 md:py-20">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* TOC Sidebar */}
            <div className="lg:col-span-1">
              <TableOfContents sections={sections} />
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <GlassContentBlock className="px-6 md:px-12 py-10 md:py-16">
                <div className="max-w-[900px]">
                  <p className="text-foreground/60 text-sm mb-8">Last updated: January 2026</p>
                  <div className="space-y-10">
                    {content.map((section) => (
                      <div key={section.id} id={section.id} className="scroll-mt-24">
                        <h2 className="text-xl font-bold text-foreground mb-4">{section.title}</h2>
                        {section.body.split('\n\n').map((para, j) => (
                          <p key={j} className="text-foreground/70 leading-relaxed mb-4">
                            {para}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassContentBlock>
            </div>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
