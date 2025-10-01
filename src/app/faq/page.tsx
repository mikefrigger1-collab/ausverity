import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  HelpCircle,
  Users,
  Scale,
  Mail,
  MessageCircle
} from "lucide-react"

export const metadata = {
  title: 'Frequently Asked Questions | AusVerity',
  description: 'Find answers to common questions about using AusVerity to find lawyers or manage your legal professional profile.',
}

export default function FAQPage() {
  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <HelpCircle className="h-10 w-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-blue-100">
                Everything you need to know about AusVerity
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto space-y-12">

            {/* For Clients Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">For Clients</h2>
              </div>

              <Card className="border-none shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        What is AusVerity?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        AusVerity is Australia's trusted legal directory platform that connects clients with verified lawyers and law firms. We provide comprehensive profiles, client reviews, and detailed information to help you make informed decisions when choosing legal representation.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        Is AusVerity free to use?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Yes! AusVerity is completely free for clients. You can search for lawyers, browse profiles, read reviews, and contact legal professionals at no cost.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        How do I find a lawyer for my specific legal issue?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Use our search function to filter by practice area, location, and other criteria. You can browse by specific legal specialisations like family law, criminal law, property law, and more. Each lawyer's profile shows their areas of expertise, experience, and client reviews to help you find the right match.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        Are all lawyers on AusVerity verified?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Yes. Every lawyer and law firm on AusVerity undergoes a verification process. We check practicing certificates, qualifications, and ensure all information is accurate and current. Verified profiles are marked with a verification badge for your peace of mind.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        Can I read reviews from other clients?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Absolutely! Client reviews are a key feature of AusVerity. You can read authentic feedback from previous clients to understand each lawyer's strengths, communication style, and results. All reviews are moderated to ensure they're genuine and helpful.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        How do I contact a lawyer through AusVerity?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Each lawyer's profile includes their contact information. You can reach out directly via phone or email. Some lawyers also offer online consultation booking through their profiles. We recommend contacting multiple lawyers to compare services and find the best fit for your needs.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        What if I'm not satisfied with a lawyer I found on AusVerity?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        While we verify all legal professionals on our platform, the relationship between you and your lawyer is independent of AusVerity. If you have concerns about a lawyer's conduct, you should first discuss this with them directly. You can also contact your state's legal services commissioner or law society. We welcome feedback about your experiences through our review system.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        Can I leave a review after working with a lawyer?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Yes! We encourage clients to share their experiences. Your honest feedback helps other clients make informed decisions and helps lawyers improve their services. To leave a review, create a free account and navigate to the lawyer's profile. All reviews are moderated to ensure they meet our community guidelines.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* For Lawyers & Firms Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Scale className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">For Lawyers & Law Firms</h2>
              </div>

              <Card className="border-none shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="lawyer-1">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        How do I join AusVerity as a lawyer or law firm?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Simply click the "Join AusVerity" button and create an account. You'll need to provide your professional details, practicing certificate information, and complete our verification process. Once verified, you can create your profile and start connecting with potential clients.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-2">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        What does the verification process involve?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Our verification process ensures all legal professionals on AusVerity are legitimate and qualified. We check your current practicing certificate, confirm your registration with your state's legal authority, and verify your professional credentials. This process typically takes 2-3 business days and helps build trust with potential clients.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-3">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        Is there a cost to join AusVerity?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        AusVerity offers both free and premium subscription plans. Free profiles include basic information and appear in search results. Premium subscriptions provide enhanced visibility, featured placement, detailed analytics, unlimited practice area listings, and priority support. Contact us for detailed pricing information.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-4">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        What information should I include in my profile?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        A comprehensive profile helps attract the right clients. Include your practice areas, years of experience, education, professional memberships, notable cases or achievements, languages spoken, and office locations. Add a professional photo and detailed biography. The more complete your profile, the better clients can assess if you're the right fit for their needs.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-5">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        How do client reviews work?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Clients who have worked with you can leave reviews on your profile. All reviews are moderated to ensure they're genuine and constructive. You'll receive notifications when new reviews are posted and have the opportunity to respond professionally. Reviews help build your reputation and provide valuable feedback for continuous improvement.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-6">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        Can I manage multiple office locations?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Yes! If you practice in multiple locations, you can add all your office addresses to your profile. This helps clients find you when searching by location. Premium subscribers can feature unlimited locations, while free profiles can list one primary location.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-7">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        How do I update my profile information?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Log into your dashboard and navigate to "My Profile" or "Firm Profile". You can update your information at any time. Changes to critical information like qualifications or practicing certificate details will go through a verification review to maintain platform integrity. Minor updates like bio text or contact information are updated immediately.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-8">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        What analytics and insights do you provide?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Premium subscribers receive detailed analytics including profile views, search appearances, client enquiries, and engagement metrics. These insights help you understand how potential clients find and interact with your profile, allowing you to optimize your presence and track your return on investment.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-9">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        Can law firms add their team members?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        Absolutely! Law firms can create a firm profile and add individual lawyer profiles for all team members. This showcases your firm's full capabilities and expertise. Each lawyer can have their own detailed profile while being associated with the firm, giving clients a complete picture of your team's qualifications.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lawyer-10">
                      <AccordionTrigger className="text-left text-lg font-semibold hover:translate-x-2 hover:font-bold hover:text-blue-900">
                        How does AusVerity help me grow my practice?
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-700 leading-relaxed">
                        AusVerity connects you with clients actively seeking legal services in your practice areas and location. Our platform increases your visibility, showcases your expertise and achievements, builds credibility through reviews and verification, and provides you with tools to manage your professional reputation. Many lawyers report increased enquiries within the first month of joining.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Contact CTA */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
              <CardContent className="p-8 md:p-12 text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our support team is here to help you get the most out of AusVerity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                    <Link href="/contact">
                      <Mail className="h-5 w-5 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg px-8">
                    <Link href="/about">
                      Learn More About Us
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
