import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, Shield, Users, Gavel } from "lucide-react"

export const metadata = {
  title: 'Terms of Service | AusVerity',
  description: 'AusVerity\'s Terms of Service - Legal terms and conditions governing your use of our legal directory platform.',
}

export default function TermsPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <FileText className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-blue-100">
                Legal terms governing your use of AusVerity
              </p>
              <p className="text-sm text-blue-200 mt-4">
                Last Updated: 1 October 2025
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Introduction */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and AusVerity Pty Ltd (ABN [TO BE INSERTED]) (&quot;AusVerity&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) governing your access to and use of the AusVerity platform at ausverity.com.au (&quot;Platform&quot;), including all content, features, and services offered.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    By accessing or using the Platform, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use the Platform.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    <strong>IMPORTANT:</strong> These Terms contain provisions that limit our liability and require individual arbitration for any disputes. Please read these Terms carefully.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Definitions */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Definitions</h2>
                <div className="prose prose-lg max-w-none">
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li><strong>&quot;Platform&quot;</strong> means the AusVerity website, mobile applications, and related services</li>
                    <li><strong>&quot;User&quot;</strong> or <strong>&quot;you&quot;</strong> means any individual or entity accessing or using the Platform</li>
                    <li><strong>&quot;Client&quot;</strong> means a User seeking legal services or information about legal professionals</li>
                    <li><strong>&quot;Legal Professional&quot;</strong> means lawyers, solicitors, barristers, and law firms with profiles on the Platform</li>
                    <li><strong>&quot;Content&quot;</strong> means all text, images, videos, data, and other materials on the Platform</li>
                    <li><strong>&quot;User Content&quot;</strong> means content submitted by Users, including reviews, comments, and profile information</li>
                    <li><strong>&quot;Services&quot;</strong> means all services provided through the Platform, including directory listings, search functionality, and communication tools</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Eligibility and Account Registration</h2>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Age Requirement</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You must be at least 18 years old to use the Platform. By using the Platform, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">2.2 Account Registration</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      To access certain features, you must create an account. When creating an account, you agree to:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Provide accurate, current, and complete information</li>
                      <li>Maintain and promptly update your account information</li>
                      <li>Keep your password secure and confidential</li>
                      <li>Accept responsibility for all activities under your account</li>
                      <li>Notify us immediately of any unauthorized use of your account</li>
                      <li>Not create an account using false information or on behalf of someone else without authorization</li>
                      <li>Not create multiple accounts to evade restrictions or bans</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">2.3 Legal Professional Accounts</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      Legal Professionals registering on the Platform must additionally:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Hold a current, valid practicing certificate in Australia</li>
                      <li>Be registered with the relevant state or territory legal authority</li>
                      <li>Maintain current professional indemnity insurance</li>
                      <li>Provide accurate information about qualifications, experience, and specializations</li>
                      <li>Undergo AusVerity&apos;s verification process</li>
                      <li>Comply with all applicable professional conduct rules and regulations</li>
                      <li>Not be subject to current disciplinary action or suspension from legal practice</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">2.4 Account Termination</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We reserve the right to suspend or terminate your account at any time, with or without notice, for violation of these Terms or for any other reason we deem appropriate, including but not limited to fraudulent activity, policy violations, or conduct that harms the Platform or other Users.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Use */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">3. Acceptable Use of the Platform</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 License to Use</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your personal or business purposes. This license does not include any right to resell, redistribute, or create derivative works from our Platform or Content.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Prohibited Activities</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">You agree not to:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Violate any applicable laws, regulations, or third-party rights</li>
                      <li>Use the Platform for any illegal, fraudulent, or unauthorized purpose</li>
                      <li>Impersonate any person or entity, or falsely represent your affiliation</li>
                      <li>Harvest, scrape, or collect User information without authorization</li>
                      <li>Post false, misleading, defamatory, or fraudulent content</li>
                      <li>Submit fake reviews or ratings, or manipulate the review system</li>
                      <li>Spam, solicit, or send unsolicited commercial messages to Users</li>
                      <li>Upload viruses, malware, or malicious code</li>
                      <li>Interfere with or disrupt the Platform&apos;s operation or security</li>
                      <li>Attempt to gain unauthorized access to any part of the Platform</li>
                      <li>Use automated systems (bots, scrapers, crawlers) without our permission</li>
                      <li>Reverse engineer, decompile, or disassemble any aspect of the Platform</li>
                      <li>Remove or modify any copyright, trademark, or proprietary notices</li>
                      <li>Frame or mirror any part of the Platform without authorization</li>
                      <li>Create derivative works based on the Platform or its Content</li>
                      <li>Use the Platform to compete with AusVerity or create a similar service</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">3.3 Professional Conduct for Legal Professionals</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">Legal Professionals must additionally:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Comply with all applicable professional conduct rules and ethical obligations</li>
                      <li>Not make false, misleading, or deceptive statements about their services</li>
                      <li>Respect client confidentiality and attorney-client privilege</li>
                      <li>Not guarantee specific legal outcomes or results</li>
                      <li>Properly disclose any conflicts of interest</li>
                      <li>Maintain professional standards in all communications</li>
                      <li>Not solicit clients in violation of professional conduct rules</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Content */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">4. User Content and Reviews</h2>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">4.1 User Content Submission</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      You may submit User Content, including reviews, ratings, and comments. By submitting User Content, you represent and warrant that:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>You own or have the necessary rights to submit the content</li>
                      <li>The content is accurate, truthful, and based on your genuine experience</li>
                      <li>The content does not violate any laws or third-party rights</li>
                      <li>The content does not contain confidential or proprietary information</li>
                      <li>You have not been compensated or incentivized for positive reviews</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">4.2 License to User Content</h3>
                    <p className="text-slate-700 leading-relaxed">
                      By submitting User Content, you grant AusVerity a worldwide, non-exclusive, royalty-free, perpetual, irrevocable, transferable, sublicensable license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with operating and promoting the Platform. This license continues even if you stop using the Platform or close your account.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">4.3 Content Moderation</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      We reserve the right (but have no obligation) to:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Monitor, review, and moderate User Content</li>
                      <li>Remove or edit User Content that violates these Terms</li>
                      <li>Remove content that we deem inappropriate, offensive, or harmful</li>
                      <li>Take action against Users who violate our content policies</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">
                      We are not responsible for User Content and do not endorse any opinions expressed by Users.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">4.4 Review Guidelines</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">Reviews must:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Be based on genuine firsthand experience with the Legal Professional</li>
                      <li>Be honest, fair, and constructive</li>
                      <li>Not contain profanity, hate speech, or discriminatory language</li>
                      <li>Not include personal attacks or threats</li>
                      <li>Not disclose confidential information or legal advice received</li>
                      <li>Not contain promotional content or spam</li>
                      <li>Not be submitted by competitors or individuals with conflicts of interest</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">4.5 Reporting Inappropriate Content</h3>
                    <p className="text-slate-700 leading-relaxed">
                      If you believe User Content violates these Terms or is inappropriate, please report it to us at support@ausverity.com.au. We will investigate and take appropriate action.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">5. Intellectual Property Rights</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 AusVerity&apos;s Intellectual Property</h3>
                    <p className="text-slate-700 leading-relaxed">
                      The Platform and all Content (excluding User Content) are owned by AusVerity and protected by Australian and international intellectual property laws, including copyright, trademark, patent, and trade secret laws. This includes but is not limited to:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>The AusVerity name, logo, and branding</li>
                      <li>Platform design, layout, and user interface</li>
                      <li>Software, code, databases, and algorithms</li>
                      <li>Original text, images, graphics, and multimedia content</li>
                      <li>Compilation and organization of information</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Restrictions on Use</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You may not copy, modify, distribute, sell, lease, or create derivative works from our intellectual property without our express written permission. Any unauthorized use may result in termination of your access and legal action.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">5.3 Trademark Notice</h3>
                    <p className="text-slate-700 leading-relaxed">
                      AusVerity, the AusVerity logo, and other marks used on the Platform are trademarks or registered trademarks of AusVerity Pty Ltd. You may not use these marks without our prior written consent.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">5.4 Copyright Infringement Claims</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We respect intellectual property rights. If you believe content on the Platform infringes your copyright, please notify us at legal@ausverity.com.au with:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Identification of the copyrighted work</li>
                      <li>Location of the infringing material</li>
                      <li>Your contact information</li>
                      <li>A statement of good faith belief that the use is unauthorized</li>
                      <li>A statement that the information is accurate and you are authorized to act</li>
                      <li>Your physical or electronic signature</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">6. Important Disclaimers</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Not Legal Advice</h3>
                    <p className="text-slate-700 leading-relaxed font-semibold">
                      AUSVERITY IS A DIRECTORY PLATFORM ONLY. WE DO NOT PROVIDE LEGAL ADVICE, LEGAL SERVICES, OR LEGAL REPRESENTATION. The information on the Platform is for informational purposes only and should not be construed as legal advice. You should consult directly with a qualified legal professional for advice specific to your situation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 No Attorney-Client Relationship</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Use of the Platform does not create an attorney-client relationship between you and AusVerity or any Legal Professional listed on the Platform. An attorney-client relationship is only formed when you enter into a direct agreement with a Legal Professional.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.3 Third-Party Information</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Legal Professional profiles, reviews, and ratings are provided by third parties. While we verify credentials, we do not guarantee the accuracy, completeness, reliability, or quality of any information on the Platform. We are not responsible for the acts, omissions, or conduct of Legal Professionals listed on the Platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.4 Platform Availability</h3>
                    <p className="text-slate-700 leading-relaxed">
                      THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-3">
                      We do not warrant that:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>The Platform will be uninterrupted, secure, or error-free</li>
                      <li>The information on the Platform is accurate or complete</li>
                      <li>Defects will be corrected</li>
                      <li>The Platform is free from viruses or harmful components</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.5 Independent Contractors</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Legal Professionals on the Platform are independent contractors, not employees, agents, or partners of AusVerity. We do not supervise, direct, control, or monitor their legal services or professional conduct.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.6 User Responsibility</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You are solely responsible for your use of the Platform and any decisions you make based on information obtained through the Platform. You should conduct your own due diligence before engaging any Legal Professional.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limitation of Liability */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Scale className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">7. Limitation of Liability</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">7.1 Exclusion of Liability</h3>
                    <p className="text-slate-700 leading-relaxed font-semibold">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, AUSVERITY, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2 mt-3">
                      <li>Your access to or use of (or inability to access or use) the Platform</li>
                      <li>Any conduct or content of any third party on the Platform</li>
                      <li>Any content obtained from the Platform</li>
                      <li>The services, conduct, or performance of any Legal Professional</li>
                      <li>Unauthorized access to or alteration of your data or content</li>
                      <li>Any errors, mistakes, or inaccuracies of content</li>
                      <li>Personal injury or property damage resulting from your use of the Platform</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">7.2 Cap on Liability</h3>
                    <p className="text-slate-700 leading-relaxed">
                      TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATING TO THESE TERMS OR THE PLATFORM SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU HAVE PAID TO AUSVERITY IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) AUD $100.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">7.3 Australian Consumer Law</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Nothing in these Terms excludes, restricts, or modifies any consumer guarantees, warranties, or other rights that you may have under the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010 (Cth)) or other applicable laws that cannot lawfully be excluded.
                    </p>
                    <p className="text-slate-700 leading-relaxed mt-3">
                      If the Australian Consumer Law or other applicable law implies a warranty or condition into these Terms, our liability for breach of such warranty or condition is limited, at our option, to:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2 mt-2">
                      <li>The supply of the services again; or</li>
                      <li>The payment of the cost of having the services supplied again</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">7.4 Allocation of Risk</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You acknowledge that the disclaimers and limitations of liability in these Terms reflect a reasonable allocation of risk between you and AusVerity and are fundamental elements of the basis of the bargain between us.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indemnification */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Indemnification</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    You agree to indemnify, defend, and hold harmless AusVerity, its parent company, subsidiaries, affiliates, officers, directors, employees, agents, licensors, and service providers from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising from or relating to:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Your use or misuse of the Platform</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any rights of another party, including any Legal Professional</li>
                    <li>Your User Content or any content you submit</li>
                    <li>Your relationship or interactions with any Legal Professional</li>
                    <li>Any false or misleading information you provide</li>
                    <li>Your violation of any applicable laws or regulations</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed mt-4">
                    This indemnification obligation survives termination of these Terms and your use of the Platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Subscriptions and Payments */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">9. Subscriptions and Payments (Legal Professionals)</h2>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">9.1 Subscription Plans</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Legal Professionals may subscribe to various service tiers with different features and pricing. Current pricing and features are available on our Platform. We reserve the right to modify pricing and features at any time with 30 days&apos; notice to existing subscribers.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">9.2 Billing and Payment</h3>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                      <li>All fees are in Australian dollars (AUD) and inclusive of GST where applicable</li>
                      <li>Payment is due upon subscription activation and at each renewal date</li>
                      <li>We use third-party payment processors; you must comply with their terms</li>
                      <li>You authorize us to charge your payment method on file for all applicable fees</li>
                      <li>Failed payments may result in service suspension or termination</li>
                      <li>You are responsible for all charges, including unauthorized charges</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">9.3 Automatic Renewal</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Subscriptions automatically renew at the end of each billing period unless you cancel before the renewal date. You will be charged at the then-current rate unless you cancel.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">9.4 Cancellation</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You may cancel your subscription at any time through your account settings or by contacting support@ausverity.com.au. Cancellation is effective at the end of the current billing period. You will retain access to paid features until the end of the billing period. No refunds are provided for partial billing periods.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">9.5 Refund Policy</h3>
                    <p className="text-slate-700 leading-relaxed">
                      All fees are non-refundable except where required by law. We do not provide refunds or credits for partial months or years, downgraded subscriptions, or unused features. If you believe you are entitled to a refund under Australian Consumer Law, contact us at billing@ausverity.com.au.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">9.6 Free Trials</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We may offer free trials from time to time. Trial periods will be specified at sign-up. At the end of the trial, you will be charged the subscription fee unless you cancel before the trial ends. We reserve the right to determine trial eligibility and to limit or revoke trials.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">9.7 Taxes</h3>
                    <p className="text-slate-700 leading-relaxed">
                      All fees are inclusive of GST where applicable. You are responsible for any other applicable taxes based on your location or business structure. We will provide tax invoices as required by Australian law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">10. Termination</h2>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">10.1 Termination by You</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You may terminate your account at any time by contacting us at support@ausverity.com.au or through your account settings. Upon termination, your right to use the Platform immediately ceases.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">10.2 Termination by AusVerity</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      We may suspend or terminate your account and access to the Platform immediately, without prior notice or liability, for any reason, including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Breach of these Terms</li>
                      <li>Violation of laws or regulations</li>
                      <li>Fraudulent, abusive, or illegal activity</li>
                      <li>Requests by law enforcement or government agencies</li>
                      <li>Extended periods of inactivity</li>
                      <li>Non-payment of subscription fees (for Legal Professionals)</li>
                      <li>Technical or security concerns</li>
                      <li>Discontinuation of the Platform</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">10.3 Effect of Termination</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">Upon termination:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Your right to access and use the Platform immediately ceases</li>
                      <li>We may delete your account and associated data</li>
                      <li>You remain liable for all obligations incurred prior to termination</li>
                      <li>Sections of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property provisions, disclaimers, limitations of liability, indemnification, and dispute resolution</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">10.4 Data Retention After Termination</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Upon account termination, we may retain certain information as required by law or for legitimate business purposes, as described in our Privacy Policy. User Content such as reviews may remain on the Platform after account closure to maintain Platform integrity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispute Resolution */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <Gavel className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">11. Dispute Resolution</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">11.1 Informal Resolution</h3>
                    <p className="text-slate-700 leading-relaxed">
                      If you have a dispute with AusVerity, you agree to first contact us at legal@ausverity.com.au to attempt to resolve the dispute informally. We will work in good faith to resolve any disputes.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">11.2 Governing Law</h3>
                    <p className="text-slate-700 leading-relaxed">
                      These Terms are governed by and construed in accordance with the laws of [STATE/TERRITORY TO BE INSERTED], Australia, without regard to its conflict of law provisions. You agree to submit to the non-exclusive jurisdiction of the courts of [STATE/TERRITORY TO BE INSERTED], Australia.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">11.3 Arbitration (Optional - for consideration)</h3>
                    <p className="text-slate-700 leading-relaxed">
                      [Alternative: Any dispute arising from these Terms shall be resolved through binding arbitration in accordance with the Resolution Institute Arbitration Rules. The arbitration shall take place in [CITY TO BE INSERTED], Australia, and be conducted in English. The arbitrator&apos;s decision shall be final and binding.]
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">11.4 Class Action Waiver</h3>
                    <p className="text-slate-700 leading-relaxed">
                      To the extent permitted by law, you agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">11.5 Time Limitation</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You agree that any claim or cause of action arising from or relating to these Terms or the Platform must be filed within one (1) year after such claim or cause of action arose, or be forever barred, to the extent permitted by law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General Provisions */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">12. General Provisions</h2>
                <div className="prose prose-lg max-w-none space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.1 Entire Agreement</h3>
                    <p className="text-slate-700 leading-relaxed">
                      These Terms, together with our Privacy Policy and any other policies referenced herein, constitute the entire agreement between you and AusVerity regarding the Platform and supersede all prior agreements and understandings.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.2 Modifications to Terms</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated Terms on the Platform and updating the &quot;Last Updated&quot; date. For significant changes, we may provide additional notice such as email notification. Your continued use of the Platform after changes are posted constitutes acceptance of the modified Terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.3 Severability</h3>
                    <p className="text-slate-700 leading-relaxed">
                      If any provision of these Terms is found to be unlawful, void, or unenforceable, that provision shall be deemed severable and shall not affect the validity and enforceability of the remaining provisions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.4 Waiver</h3>
                    <p className="text-slate-700 leading-relaxed">
                      No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term. Our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.5 Assignment</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You may not assign or transfer these Terms or your rights and obligations under these Terms without our prior written consent. We may assign these Terms without restriction. Any attempted assignment in violation of this provision is void.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.6 No Agency</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Nothing in these Terms creates any agency, partnership, joint venture, employment, or franchisee relationship between you and AusVerity.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.7 Force Majeure</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.8 Notices</h3>
                    <p className="text-slate-700 leading-relaxed">
                      All notices to AusVerity should be sent to legal@ausverity.com.au. We may provide notices to you via email to the address associated with your account, through the Platform, or by posting on the Platform. Notices are deemed received 24 hours after email is sent or when posted on the Platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.9 Export Controls</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You agree to comply with all applicable export and import control laws and regulations in your use of the Platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.10 Language</h3>
                    <p className="text-slate-700 leading-relaxed">
                      These Terms are provided in English. Any translations are provided for convenience only. In the event of any conflict between the English version and a translated version, the English version shall prevail.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">12.11 Survival</h3>
                    <p className="text-slate-700 leading-relaxed">
                      All provisions of these Terms which by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity, limitations of liability, and dispute resolution provisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
              <CardContent className="p-8 md:p-12 text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Questions About These Terms?
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed mb-6 max-w-2xl mx-auto">
                  If you have questions or concerns about these Terms of Service, please contact us:
                </p>
                <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
                  <div className="space-y-2 text-slate-700">
                    <p><strong>AusVerity Pty Ltd</strong></p>
                    <p>ABN: [TO BE INSERTED]</p>
                    <p>Email: legal@ausverity.com.au</p>
                    <p>Support: support@ausverity.com.au</p>
                    <p>Address: [TO BE INSERTED]</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mt-6">
                  By using AusVerity, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
