import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, UserCheck, Database, Globe, Mail, FileText } from "lucide-react"

export const metadata = {
  title: 'Privacy Policy | AusVerity',
  description: 'AusVerity\'s Privacy Policy - Learn how we collect, use, protect, and manage your personal information in accordance with Australian privacy laws.',
}

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <Shield className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-blue-100">
                Your privacy is important to us
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    AusVerity Pty Ltd (ABN [TO BE INSERTED]) (&quot;AusVerity&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy and handling your personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    This Privacy Policy explains how we collect, use, store, disclose, and protect your personal information when you use our legal directory platform at ausverity.com.au (the &quot;Platform&quot;). By using our Platform, you consent to the collection, use, and disclosure of your personal information as described in this Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">1.1 Personal Information from Clients/Users</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">We may collect the following information when you use our Platform:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Name, email address, and phone number</li>
                      <li>Account login credentials (username and encrypted password)</li>
                      <li>IP address, browser type, device information, and operating system</li>
                      <li>Search queries and browsing behavior on our Platform</li>
                      <li>Reviews and feedback you provide about legal professionals</li>
                      <li>Communications you send to us or through our Platform</li>
                      <li>Payment information (processed securely through third-party payment processors)</li>
                      <li>Any other information you voluntarily provide to us</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">1.2 Personal Information from Legal Professionals</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">When lawyers and law firms register on our Platform, we collect:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Full name, professional title, and qualifications</li>
                      <li>Practicing certificate number and verification documents</li>
                      <li>Law firm name, ABN/ACN, and business details</li>
                      <li>Office addresses and contact information</li>
                      <li>Areas of legal practice and specializations</li>
                      <li>Professional biography and career history</li>
                      <li>Professional photographs and marketing materials</li>
                      <li>Bank account details for subscription payments</li>
                      <li>Professional insurance information</li>
                      <li>Membership details with law societies and professional bodies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">1.3 Automatically Collected Information</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">We automatically collect certain information when you visit our Platform:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Cookies and similar tracking technologies (see our Cookie Policy below)</li>
                      <li>Usage data, including pages viewed, time spent on pages, and click patterns</li>
                      <li>Referral sources (how you found our Platform)</li>
                      <li>Device identifiers and mobile network information</li>
                      <li>Location data (with your consent, based on IP address or device settings)</li>
                      <li>Analytics data to improve Platform performance and user experience</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <UserCheck className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">How We Use Your Information</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-6">
                  <p className="text-slate-700 leading-relaxed">We use your personal information for the following purposes:</p>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Platform Services</h3>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>To create and manage your account</li>
                      <li>To verify the credentials of legal professionals</li>
                      <li>To display lawyer and law firm profiles to users</li>
                      <li>To facilitate connections between clients and legal professionals</li>
                      <li>To process and display reviews and ratings</li>
                      <li>To provide search and filtering functionality</li>
                      <li>To enable communication between users and legal professionals</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">2.2 Business Operations</h3>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>To process subscription payments from legal professionals</li>
                      <li>To provide customer support and respond to inquiries</li>
                      <li>To send administrative communications about your account</li>
                      <li>To notify you of Platform updates, changes, or important information</li>
                      <li>To generate analytics and insights about Platform usage</li>
                      <li>To detect, prevent, and address fraud, security risks, or technical issues</li>
                      <li>To comply with legal obligations and regulatory requirements</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">2.3 Marketing and Communications (with consent)</h3>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>To send promotional emails about new features or services</li>
                      <li>To provide personalized recommendations based on your interests</li>
                      <li>To conduct surveys and request feedback</li>
                      <li>To inform you about Platform improvements and offerings</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">
                      You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or contacting us directly.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">2.4 Platform Improvement</h3>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>To analyze usage patterns and improve Platform functionality</li>
                      <li>To develop new features and services</li>
                      <li>To conduct research and testing</li>
                      <li>To optimize user experience and interface design</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Information Disclosure */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Eye className="h-6 w-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">How We Share Your Information</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-6">
                  <p className="text-slate-700 leading-relaxed">
                    We do not sell your personal information. We may share your information in the following circumstances:
                  </p>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Public Profile Information</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Information that legal professionals choose to include in their public profiles (name, photo, practice areas, experience, contact details) is visible to all Platform users and may be indexed by search engines.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Service Providers</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">We share information with trusted third-party service providers who assist us in operating our Platform:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Cloud hosting and data storage providers (e.g., AWS, Microsoft Azure)</li>
                      <li>Payment processors (e.g., Stripe, PayPal) for subscription billing</li>
                      <li>Email service providers for communications</li>
                      <li>Analytics providers (e.g., Google Analytics) to understand Platform usage</li>
                      <li>Customer support platforms</li>
                      <li>Security and fraud prevention services</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">
                      These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">3.3 Legal Compliance</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">We may disclose your information when required by law or when we believe disclosure is necessary to:</p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li>Comply with legal obligations, court orders, or government requests</li>
                      <li>Enforce our Terms of Service and other agreements</li>
                      <li>Protect the rights, property, or safety of AusVerity, our users, or the public</li>
                      <li>Detect, prevent, or address fraud, security, or technical issues</li>
                      <li>Respond to claims of illegal activity or policy violations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">3.4 Business Transfers</h3>
                    <p className="text-slate-700 leading-relaxed">
                      If AusVerity is involved in a merger, acquisition, sale of assets, or bankruptcy, your personal information may be transferred as part of that transaction. We will notify you via email and/or prominent notice on our Platform of any change in ownership or use of your personal information.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">3.5 With Your Consent</h3>
                    <p className="text-slate-700 leading-relaxed">
                      We may share your information with third parties when you give us explicit consent to do so.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Lock className="h-6 w-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Data Security</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li>Industry-standard SSL/TLS encryption for data transmission</li>
                    <li>Encrypted storage of sensitive information, including passwords</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Employee training on data protection and privacy</li>
                    <li>Secure backup and disaster recovery procedures</li>
                    <li>Monitoring and logging of system access</li>
                    <li>Compliance with Australian cybersecurity standards</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we continuously work to improve our security practices.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Data Retention</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-4">
                  <p className="text-slate-700 leading-relaxed">
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2">
                    <li><strong>Active Accounts:</strong> We retain your information while your account is active</li>
                    <li><strong>Inactive Accounts:</strong> We may delete accounts inactive for more than 24 months after providing notice</li>
                    <li><strong>Legal Obligations:</strong> Some information must be retained for 7 years to comply with Australian tax and business laws</li>
                    <li><strong>Reviews and Feedback:</strong> User reviews may be retained to maintain Platform integrity, even after account closure</li>
                    <li><strong>Transaction Records:</strong> Payment and subscription records are retained as required by law</li>
                    <li><strong>Backup Data:</strong> Information may exist in backup systems for a limited period after deletion</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    When we no longer need your information, we will securely delete or anonymize it in accordance with our data retention schedule.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-pink-100 p-3 rounded-lg">
                    <UserCheck className="h-6 w-6 text-pink-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Your Privacy Rights</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-6">
                  <p className="text-slate-700 leading-relaxed">
                    Under the Australian Privacy Principles, you have the following rights regarding your personal information:
                  </p>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Access</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You have the right to request access to the personal information we hold about you. You can access and update most of your information through your account settings. For additional information, contact us at privacy@ausverity.com.au.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 Correction</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You have the right to request correction of inaccurate or incomplete personal information. You can update most information through your account settings, or contact us for assistance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.3 Deletion</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You may request deletion of your account and personal information. Please note that some information may be retained as required by law or for legitimate business purposes (e.g., transaction records, dispute resolution).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.4 Opt-Out</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You can opt out of marketing communications at any time. You can also manage cookie preferences through your browser settings.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.5 Complaint</h3>
                    <p className="text-slate-700 leading-relaxed">
                      If you believe we have breached the Australian Privacy Principles, you can lodge a complaint with us at privacy@ausverity.com.au. We will investigate and respond within 30 days. If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at www.oaic.gov.au.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">6.6 Data Portability</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You may request a copy of your personal information in a structured, commonly used, machine-readable format.
                    </p>
                  </div>

                  <p className="text-slate-700 leading-relaxed font-semibold">
                    To exercise any of these rights, please contact us at privacy@ausverity.com.au with your request. We may require verification of your identity before processing your request.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Cookies and Tracking Technologies</h2>
                </div>
                <div className="prose prose-lg max-w-none space-y-6">
                  <p className="text-slate-700 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your experience on our Platform.
                  </p>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">7.1 Types of Cookies We Use</h3>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li><strong>Essential Cookies:</strong> Required for Platform functionality, such as authentication and security</li>
                      <li><strong>Performance Cookies:</strong> Help us understand how visitors use our Platform (e.g., Google Analytics)</li>
                      <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                      <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">7.2 Managing Cookies</h3>
                    <p className="text-slate-700 leading-relaxed">
                      You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing cookies. Please note that disabling certain cookies may affect Platform functionality.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">7.3 Third-Party Analytics</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      We use third-party analytics services to understand Platform usage:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                      <li><strong>Google Analytics:</strong> Provides insights into user behavior and demographics. Google&apos;s privacy policy: https://policies.google.com/privacy</li>
                      <li>These services may use cookies and similar technologies to collect information about your use of our Platform</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Children&apos;s Privacy</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed">
                    Our Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you are under 18, please do not use our Platform or provide any personal information. If we become aware that we have collected personal information from a child under 18, we will take steps to delete that information promptly.
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-4">
                    If you are a parent or guardian and believe your child has provided us with personal information, please contact us at privacy@ausverity.com.au.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* International Transfers */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">International Data Transfers</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed">
                    Your personal information is primarily stored and processed in Australia. However, some of our service providers may be located overseas, including in the United States, European Union, and other jurisdictions. When we transfer your information overseas, we take steps to ensure it receives a similar level of protection as it would in Australia, including:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2 mt-4">
                    <li>Using service providers that comply with international data protection standards</li>
                    <li>Implementing contractual safeguards in our agreements with overseas providers</li>
                    <li>Ensuring compliance with APP 8 (Cross-border disclosure of personal information)</li>
                    <li>Conducting due diligence on overseas service providers</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed mt-4">
                    By using our Platform, you consent to the transfer of your information to countries outside Australia for the purposes described in this Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Third-Party Links */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Websites and Services</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed">
                    Our Platform may contain links to third-party websites, including lawyer and law firm websites. We are not responsible for the privacy practices or content of these external sites. When you click on a link to a third-party website, you will be subject to that site&apos;s privacy policy and terms.
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-4">
                    We encourage you to read the privacy policies of any third-party websites you visit. This Privacy Policy applies only to information collected through our Platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Updates to Policy */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-slate-700 leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will:
                  </p>
                  <ul className="list-disc pl-6 text-slate-700 space-y-2 mt-4">
                    <li>Update the &quot;Last Updated&quot; date at the top of this policy</li>
                    <li>Post the updated policy on our Platform</li>
                    <li>For material changes, notify you via email or prominent notice on our Platform</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed mt-4">
                    We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated Privacy Policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">
                    Contact Us
                  </h2>
                  <p className="text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
                    If you have questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please contact us:
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
                  <div className="space-y-3 text-slate-700">
                    <p><strong>AusVerity Pty Ltd</strong></p>
                    <p>ABN: [TO BE INSERTED]</p>
                    <p><strong>Privacy Officer</strong></p>
                    <p>Email: privacy@ausverity.com.au</p>
                    <p>Address: [TO BE INSERTED]</p>
                    <p className="pt-4 text-sm text-slate-600">
                      We aim to respond to all privacy inquiries within 30 days. For urgent matters, please mark your email as &quot;Urgent Privacy Matter&quot;.
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-slate-600 text-sm">
                    <strong>Office of the Australian Information Commissioner (OAIC)</strong>
                  </p>
                  <p className="text-slate-600 text-sm">
                    Website: www.oaic.gov.au | Phone: 1300 363 992
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
