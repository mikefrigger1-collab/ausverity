import React from "react"
import { notFound } from "next/navigation"
import { isValidStateCode, getStateByCode, AUSTRALIAN_STATES } from "@/lib/constants/states"
import { PRACTICE_AREA_CATEGORIES, getPracticeAreaBySlug, isValidPracticeAreaSlug } from "@/lib/constants/practice-areas"
import { SiteLayout } from "@/components/site-layout"
import { StateSearch } from "@/components/state-search"
import { db } from "@/lib/db"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface PracticeAreaPageProps {
  params: Promise<{
    state: string
    practiceArea: string
  }>
}

// Generate static params for all state + practice area combinations
export async function generateStaticParams() {
  const params: { state: string; practiceArea: string }[] = []

  AUSTRALIAN_STATES.forEach(state => {
    PRACTICE_AREA_CATEGORIES.forEach(pa => {
      params.push({
        state: state.code,
        practiceArea: pa.slug,
      })
    })
  })

  return params
}

// Metadata for SEO
export async function generateMetadata({ params }: PracticeAreaPageProps) {
  const { state, practiceArea } = await params

  if (!isValidStateCode(state) || !isValidPracticeAreaSlug(practiceArea)) {
    return {
      title: 'Page Not Found',
    }
  }

  const stateInfo = getStateByCode(state)
  const practiceAreaInfo = getPracticeAreaBySlug(practiceArea)

  return {
    title: `${practiceAreaInfo?.name} Lawyers in ${stateInfo?.name} | AusVerity`,
    description: `Find experienced ${practiceAreaInfo?.name} lawyers in ${stateInfo?.name}. Compare verified legal professionals, read reviews, and get expert legal help for ${practiceAreaInfo?.description}.`,
    openGraph: {
      title: `${practiceAreaInfo?.name} Lawyers in ${stateInfo?.name}`,
      description: `Connect with verified ${practiceAreaInfo?.name} lawyers in ${stateInfo?.shortName}`,
    },
  }
}

export default async function PracticeAreaPage({ params }: PracticeAreaPageProps) {
  const { state, practiceArea } = await params

  // Validate state code and practice area
  if (!isValidStateCode(state) || !isValidPracticeAreaSlug(practiceArea)) {
    notFound()
  }

  const stateInfo = getStateByCode(state)
  const practiceAreaInfo = getPracticeAreaBySlug(practiceArea)

  if (!stateInfo || !practiceAreaInfo) {
    notFound()
  }

  // Get content for this state + practice area combination
  const content = getPracticeAreaContent(state, practiceArea)

  return (
    <SiteLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-slate-600 mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link href={`/${state}`} className="hover:text-blue-600 transition-colors">
                {stateInfo.name}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-slate-900 font-medium">{practiceAreaInfo.name}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {practiceAreaInfo.name} Lawyers in {stateInfo.name}
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl">
              Find experienced {practiceAreaInfo.name.toLowerCase()} lawyers in {stateInfo.shortName}. Compare verified legal professionals, read reviews, and connect with specialists who can help with your legal matter.
            </p>
          </div>
        </div>

        {/* Search Section - Now filters by this practice area automatically */}
        <StateSearch
          stateCode={state}
          stateName={stateInfo.name}
          practiceArea={practiceAreaInfo.category}
        />

        {/* Informational Content */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg prose-slate max-w-none">
              {content}
            </article>
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}

// Content generator function
function getPracticeAreaContent(stateCode: string, practiceAreaSlug: string) {
  const key = `${stateCode}-${practiceAreaSlug}`

  // Queensland content
  if (stateCode === 'qld') {
    return QLD_CONTENT[practiceAreaSlug] || null
  }

  // New South Wales content
  if (stateCode === 'nsw') {
    return NSW_CONTENT[practiceAreaSlug] || null
  }

  // Victoria content
  if (stateCode === 'vic') {
    return VIC_CONTENT[practiceAreaSlug] || null
  }

    // Victoria content
  if (stateCode === 'wa') {
    return WA_CONTENT[practiceAreaSlug] || null
  }

    // Victoria content
  if (stateCode === 'nt') {
    return NT_CONTENT[practiceAreaSlug] || null
  }

    // Victoria content
  if (stateCode === 'tas') {
    return TAS_CONTENT[practiceAreaSlug] || null
  }

    // Victoria content
  if (stateCode === 'act') {
    return ACT_CONTENT[practiceAreaSlug] || null
  }

  return null
}

// Queensland Practice Area Content
const QLD_CONTENT: Record<string, React.ReactElement> = {
  'family-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Family Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Family law matters in Queensland are governed by both federal legislation under the Family Law Act 1975 and state-specific laws. Whether you're dealing with separation, divorce, or child custody arrangements, having experienced legal representation is crucial to protecting your rights and achieving the best outcome for your family.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Family Law in Queensland</h3>
      <p>
        Queensland family lawyers assist with a comprehensive range of matters including divorce proceedings, property settlements, parenting arrangements, spousal maintenance, and de facto relationship disputes. The Family Court of Australia and Federal Circuit Court handle most family law cases, though some matters may be dealt with in Queensland state courts, particularly domestic violence applications.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Areas of Family Law Practice</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Divorce and Separation</h4>
      <p>
        To file for divorce in Australia, you must have been separated for at least 12 months. Queensland lawyers can guide you through the divorce application process, ensuring all requirements are met including the separation period, residency requirements, and proper service of documents. Many couples in Queensland choose to formalise their separation through Binding Financial Agreements before or after divorce to avoid lengthy property settlement disputes.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Child Custody and Parenting Arrangements</h4>
      <p>
        Queensland family law prioritises the best interests of children in all parenting matters. Parents are encouraged to develop parenting plans that outline living arrangements, decision-making responsibilities, and time spent with each parent. Where agreement cannot be reached, the court can issue parenting orders. Queensland lawyers experienced in child custody matters understand the specific factors Queensland courts consider, including the child's relationship with both parents, protection from harm, and the child's views depending on their age and maturity.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Property Settlement</h4>
      <p>
        Property settlement in Queensland involves dividing assets, liabilities, and superannuation between separating couples. The process considers each party's financial and non-financial contributions, future needs, and what division would be "just and equitable." Queensland has specific considerations around property like the family home, investment properties, and businesses that may have unique valuation requirements under Queensland law.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">De Facto Relationships</h4>
      <p>
        De facto couples in Queensland have the same rights as married couples under federal family law, provided the relationship lasted at least two years, or there are children involved, or significant contributions were made. Queensland lawyers can help establish the existence of a de facto relationship and ensure fair division of property and assets.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Domestic Violence and Protection Orders</h4>
      <p>
        Queensland's Domestic and Family Violence Protection Act 2012 provides strong protections for victims of domestic violence. Lawyers can assist with obtaining Domestic Violence Orders (DVOs) through Queensland Magistrates Courts. These orders can include conditions such as no contact, staying away from certain locations, and prohibitions on violence or threatening behavior. Legal aid is available for victims of domestic violence in Queensland.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Queensland-Specific Resources</h3>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Family Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>DV Connect Womensline:</strong> 1800 811 811 (24/7)</li>
          <li><strong>DV Connect Mensline:</strong> 1800 600 636 (24/7)</li>
          <li><strong>Family Relationship Advice Line:</strong> 1800 050 321</li>
          <li><strong>Legal Aid Queensland Family Law:</strong> 1300 65 11 88</li>
          <li><strong>Family Court of Australia (Brisbane Registry):</strong> (07) 3248 3100</li>
          <li><strong>Federal Circuit Court (Brisbane):</strong> (07) 3248 1100</li>
          <li><strong>Queensland Civil and Administrative Tribunal (QCAT):</strong> 1300 753 228</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Locations in Queensland</h3>
      <p>
        The Family Court and Federal Circuit Court operate from several Queensland locations including Brisbane, Townsville, Cairns, Rockhampton, and Maroochydore. Queensland Magistrates Courts across the state handle domestic violence matters and some child support enforcement. Your lawyer can advise which court is most appropriate for your matter and represent you in proceedings.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Alternative Dispute Resolution</h3>
      <p>
        Before filing court applications, most family law matters require parties to attempt Family Dispute Resolution (FDR) through accredited mediators. Queensland has numerous Family Relationship Centres offering FDR services at low or no cost. Many Queensland family lawyers are also trained mediators and can facilitate negotiations outside of court, saving time and reducing costs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Legal Aid and Support Services</h3>
      <p>
        Legal Aid Queensland provides free or low-cost family law services to eligible Queenslanders. Women's Legal Service Queensland and Aboriginal and Torres Strait Islander Legal Service (ATSILS) offer specialized family law assistance. Community legal centres across Queensland also provide free initial advice and may assist with representation in certain circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Finding the Right Family Lawyer in Queensland</h3>
      <p>
        When choosing a family lawyer in Queensland, look for practitioners with specific experience in your type of matter, whether it's complex property settlements, interstate custody disputes, or domestic violence protection. Many Queensland family lawyers offer fixed-fee arrangements for straightforward matters like divorce applications or initial consultations. Check if they're accredited specialists in family law through the Queensland Law Society, which indicates advanced expertise and experience.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Queensland Government Links:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.qld.gov.au/law/legal-mediation-and-justice-of-the-peace/getting-legal-advice-and-family-dispute-resolution" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Government - Family Dispute Resolution</a></li>
          <li><a href="https://www.legalaid.qld.gov.au/Find-legal-information/Relationships-and-children" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid Queensland - Family Law Information</a></li>
          <li><a href="https://www.courts.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Courts</a></li>
          <li><a href="https://www.qls.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Law Society</a></li>
        </ul>
      </div>
    </>
  ),

  'criminal-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Criminal Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Queensland's criminal justice system operates under both state legislation, primarily the Criminal Code Act 1899, and Commonwealth criminal laws. If you're facing criminal charges in Queensland, securing experienced legal representation early is critical to protecting your rights and achieving the best possible outcome.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Queensland Criminal Law</h3>
      <p>
        Queensland criminal lawyers defend clients charged with offences ranging from traffic violations to serious indictable crimes. The Queensland criminal justice system includes Magistrates Courts for summary offences, District Courts for mid-range indictable offences, and the Supreme Court for the most serious crimes. Understanding which court will hear your matter and the potential penalties is essential.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Common Criminal Matters</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drink Driving and Traffic Offences</h4>
      <p>
        Queensland has strict drink driving laws with mandatory licence disqualifications and potentially criminal records for convictions. High range drink driving, dangerous driving causing death or grievous bodily harm, and driving whilst disqualified are serious offences that can result in imprisonment. Traffic lawyers can help challenge breath test procedures, negotiate penalties, and apply for work licences where eligible under Queensland's transport laws.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Assault and Violence Offences</h4>
      <p>
        Assault charges in Queensland range from common assault to grievous bodily harm and assault occasioning bodily harm. Queensland's "one punch" laws carry mandatory sentences for unlawful striking causing death. Domestic violence assault charges are treated particularly seriously and can result in protection orders affecting where you can live and contact with family members. Legal representation is crucial for mounting defences such as self-defence or lack of intent.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drug Offences</h4>
      <p>
        Queensland drug laws prohibit possession, supply, trafficking, and production of dangerous drugs. Penalties vary significantly based on the drug type, quantity, and whether commercial supply is alleged. Queensland has drug diversion programs available for first-time minor possession offences. More serious charges like trafficking or production can result in lengthy prison sentences, making experienced legal representation essential.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Fraud and White Collar Crime</h4>
      <p>
        Fraud offences in Queensland include stealing, fraud by deception, computer hacking, and identity theft. These matters are often complex, involving substantial documentation and electronic evidence. The Queensland Police Service Fraud and Cyber Crime Group investigates serious fraud matters. Lawyers experienced in white collar crime can challenge evidence gathering procedures and negotiate with prosecutors.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Sexual Offences</h4>
      <p>
        Sexual offence charges in Queensland are prosecuted vigorously and carry severe penalties including lengthy imprisonment and sex offender registration. These include rape, sexual assault, grooming, and child exploitation offences. Queensland law provides for complainant evidence via recorded statements and special procedures to protect witnesses. Specialist criminal lawyers with experience in these sensitive matters are essential.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights When Charged</h3>
      <p>
        In Queensland, you have the right to remain silent (except for providing your name and address), the right to contact a lawyer before police interview, and the right to have a support person or lawyer present during questioning. You cannot be forced to participate in police investigations beyond providing identifying information. These rights are fundamental and should be exercised - many criminal cases are won or lost based on what happens during the police investigation stage.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Process in Queensland</h3>
      <p>
        Most criminal matters start with a first appearance at the Magistrates Court where charges are formally read and bail is considered. Summary offences are heard entirely in the Magistrates Court. Indictable offences may have committal proceedings to test the prosecution case before proceeding to District or Supreme Court trial. Your lawyer will advise whether to plead guilty, negotiate charges with the prosecution, or proceed to trial.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Criminal Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Legal Aid Queensland Criminal Law:</strong> 1300 65 11 88</li>
          <li><strong>Aboriginal and Torres Strait Islander Legal Service (ATSILS):</strong> 1800 012 255</li>
          <li><strong>Youth Advocacy Centre:</strong> (07) 3356 1002</li>
          <li><strong>Queensland Police Service (non-emergency):</strong> 131 444</li>
          <li><strong>Domestic Violence Hotline:</strong> 1800 811 811</li>
          <li><strong>Court Link (victim support):</strong> 1300 762 445</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Sentencing in Queensland</h3>
      <p>
        Queensland courts consider numerous factors when sentencing including the seriousness of the offence, your criminal history, remorse, rehabilitation prospects, and community protection. Sentences range from fines and good behaviour bonds to community service orders, probation, intensive correction orders, and imprisonment. Early guilty pleas typically receive sentencing discounts. Your lawyer can present submissions and evidence to achieve the most lenient sentence possible.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Queensland Criminal Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.qld.gov.au/law/crime-and-police" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Government - Crime and Police</a></li>
          <li><a href="https://www.legalaid.qld.gov.au/Find-legal-information/Criminal-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid Queensland - Criminal Law</a></li>
          <li><a href="https://www.courts.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Courts</a></li>
          <li><a href="https://www.qls.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Law Society</a></li>
        </ul>
      </div>
    </>
  ),

  'property-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Property transactions in Queensland involve complex legal processes governed by the Land Title Act 1994, Property Law Act 1974, and various other state legislation. Whether buying your first home, investing in commercial property, or resolving a property dispute, Queensland property lawyers ensure your interests are protected throughout the conveyancing process and beyond.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Conveyancing in Queensland</h3>
      <p>
        Conveyancing is the legal process of transferring property ownership. In Queensland, this involves preparing and reviewing contracts, conducting property searches, handling stamp duty calculations, liaising with financial institutions, and completing settlement through the Electronic Conveyancing National System (PEXA). Queensland uses a standard REIQ contract for residential sales, though terms can be negotiated. Most Queensland properties are registered under the Torrens title system, providing strong ownership protections.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Residential Property Transactions</h3>
      <p>
        Buying or selling a home in Queensland requires careful attention to numerous legal requirements. Property searches reveal encumbrances, easements, and council restrictions. Building and pest inspections should be conducted during the cooling-off period (for buyers) or before listing. Queensland's transfer duty (stamp duty) rates vary based on property value and buyer circumstances, with concessions available for first home buyers, pensioners, and off-the-plan purchases. Your property lawyer ensures all legal requirements are met and your interests protected.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">First Home Buyers in Queensland</h4>
      <p>
        Queensland offers significant concessions for first home buyers including transfer duty exemptions for properties under certain values, the First Home Owner Grant for new homes, and reduced duty rates for properties in regional areas. Your property lawyer can advise on eligibility and ensure you receive all concessions. They'll also explain your rights regarding building warranties, defects, and consumer protections under Queensland law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Property</h3>
      <p>
        Commercial property transactions in Queensland are more complex than residential, involving due diligence on leases, environmental issues, development potential, and business operations. Commercial contracts typically have fewer consumer protections and shorter timeframes. Issues like GST, goods and chattels, and lease assignments require specialist knowledge. Queensland commercial property lawyers conduct comprehensive due diligence to identify risks and negotiate favourable terms.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Leasing and Tenancy</h3>
      <p>
        Queensland's Residential Tenancies and Rooming Accommodation Act 2008 governs residential leases, while commercial leases are primarily contractual with some statutory protections under the Retail Shop Leases Act 1994. Property lawyers prepare and review lease agreements, advise on rights and obligations, handle bond disputes, and represent parties at the Queensland Civil and Administrative Tribunal (QCAT) for residential matters or in court for commercial disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Strata and Body Corporate</h3>
      <p>
        Queensland has unique body corporate laws under the Body Corporate and Community Management Act 1997. Complex schemes with multiple lot types and extensive common property require careful review of by-laws, levy statements, and management arrangements. Property lawyers review body corporate records, advise on by-law amendments, and handle disputes between lot owners or between owners and the body corporate through QCAT or the courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Development</h3>
      <p>
        Property development in Queensland involves navigating planning schemes, development applications through local councils, subdivision approvals, infrastructure agreements, and Environment Protection Act requirements. Developers must comply with the Planning Act 2016 and local government planning schemes. Development lawyers coordinate with town planners, engineers, and councils to secure necessary approvals and manage legal risks throughout the development process.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Property Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Queensland Office of State Revenue (Stamp Duty):</strong> 1300 300 734</li>
          <li><strong>Residential Tenancies Authority:</strong> 1300 366 311</li>
          <li><strong>QCAT Registry:</strong> 1300 753 228</li>
          <li><strong>Department of Resources (Titles Registry):</strong> 1300 255 750</li>
          <li><strong>Queensland Building and Construction Commission:</strong> 139 333</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Disputes</h3>
      <p>
        Property disputes in Queensland can involve boundary disagreements, easement access, caveats, breach of contract, defective building work, or body corporate conflicts. Resolution options include negotiation, mediation, QCAT proceedings for smaller matters, or Supreme Court litigation for complex disputes. Many disputes involve Queensland's unique "Dividing Fences Act 1953" or water rights under the Water Act 2000. Experienced property dispute lawyers protect your property rights through negotiation or litigation as required.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Queensland Property Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.qld.gov.au/housing/buying-owning-home" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Government - Buying and Owning a Home</a></li>
          <li><a href="https://www.rta.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Residential Tenancies Authority</a></li>
          <li><a href="https://www.qbcc.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Building and Construction Commission</a></li>
          <li><a href="https://www.qld.gov.au/environment/land/title" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Titles Registry</a></li>
        </ul>
      </div>
    </>
  ),

  'wills-estates': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Wills and Estates Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Estate planning and administration in Queensland is governed by the Succession Act 1981, Powers of Attorney Act 1998, and Guardianship and Administration Act 2000. Proper estate planning ensures your wishes are carried out, minimises disputes, reduces tax, and protects your loved ones. Queensland wills and estates lawyers provide comprehensive advice on all succession matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Will Drafting in Queensland</h3>
      <p>
        A valid Queensland will must be in writing, signed by the testator in the presence of two witnesses who also sign. DIY will kits often fail to account for complex family situations, business interests, or Queensland-specific legal requirements. Professional will drafting ensures your estate is distributed according to your wishes, executors are properly appointed, and potential challenges are minimised. Queensland lawyers can include testamentary trusts for asset protection and tax planning.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Estate Planning Strategies</h3>
      <p>
        Comprehensive estate planning in Queensland goes beyond will drafting to include Powers of Attorney, Advance Health Directives, superannuation death benefit nominations, and trust structures. Proper planning can protect assets from family provision claims, provide for disabled beneficiaries through special disability trusts, and structure inheritances to protect against bankruptcy or relationship breakdowns. Queensland estate planning lawyers consider your unique family and financial circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Probate and Estate Administration</h3>
      <p>
        Probate is the Supreme Court's formal recognition of a will's validity, granting executors authority to administer the estate. Queensland executors must collect assets, pay debts and taxes, and distribute to beneficiaries according to the will or intestacy rules. The process involves obtaining a Certificate of Title search, advertising for creditors, preparing estate accounts, and obtaining receipts from beneficiaries. Lawyers ensure executors comply with all legal obligations and protect them from personal liability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intestacy in Queensland</h4>
      <p>
        When someone dies without a valid will in Queensland, intestacy rules under the Succession Act determine distribution. Spouses and children receive priority, with specific formulas based on family composition. Same-sex couples and de facto partners have the same rights as married spouses if the relationship lasted two years or there are children. The Queensland Public Trustee may be appointed administrator if no suitable family member applies. Intestacy often results in unintended outcomes and family disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contested Wills and Family Provision Claims</h3>
      <p>
        Queensland allows eligible persons to challenge a will through family provision applications to the Supreme Court. Spouses, children (including adult children), and dependents can apply if inadequate provision was made for their maintenance and support. Applications must be filed within nine months of death (six months for estates under $250,000). Queensland courts consider factors including financial resources, health, relationship with the deceased, and contributions to the estate. Successful claims can result in greater inheritance or provision from the estate.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Powers of Attorney</h3>
      <p>
        Queensland recognises two types of Powers of Attorney: General (for financial matters) and Enduring (continuing if you lose capacity). Enduring Powers of Attorney can be for financial matters, personal and health matters, or both. These documents must meet strict formal requirements under Queensland law and should be prepared by lawyers to ensure validity and appropriate safeguards. The Office of the Public Guardian can investigate suspected misuse of powers.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Advance Health Directives</h3>
      <p>
        Advance Health Directives allow Queenslanders to document their wishes for medical treatment if they lose capacity. These legally binding documents can refuse specific treatments, set out values and outcomes, and appoint substitute decision-makers. They're particularly important for end-of-life decisions. Queensland's Advance Health Directive forms must comply with specific requirements to be enforceable.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Wills & Estates Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Queensland Supreme Court (Probate Registry):</strong> (07) 3247 4734</li>
          <li><strong>Office of the Public Guardian:</strong> 1300 653 187</li>
          <li><strong>Public Trustee of Queensland:</strong> 1300 360 044</li>
          <li><strong>Legal Aid Queensland (Wills advice):</strong> 1300 65 11 88</li>
          <li><strong>Queensland Law Society - Will search service:</strong> (07) 3842 5842</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Guardianship and Administration</h3>
      <p>
        The Queensland Civil and Administrative Tribunal (QCAT) can appoint guardians for personal decisions and administrators for financial decisions when adults lose capacity without valid Powers of Attorney. The Public Guardian or Public Trustee may be appointed if no suitable family member is available. QCAT can also review decisions of attorneys and make orders to protect vulnerable adults from financial abuse.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Queensland Wills & Estates Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.qld.gov.au/law/legal-mediation-and-justice-of-the-peace/setting-up-your-will-and-power-of-attorney" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Government - Wills and POAs</a></li>
          <li><a href="https://www.pt.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Public Trustee Queensland</a></li>
          <li><a href="https://www.publicguardian.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Public Guardian</a></li>
          <li><a href="https://www.qcat.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Civil and Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'employment-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Employment Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Queensland employment law is governed by both federal legislation including the Fair Work Act 2009 and state-based workers' compensation and workplace health and safety laws. Whether you're facing unfair dismissal, workplace discrimination, or contractual disputes, experienced employment lawyers protect your rights and help navigate the complex workplace relations system.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Employment Law in Queensland</h3>
      <p>
        Most Queensland employment matters fall under the federal Fair Work system, covering minimum wages, working conditions, termination, and workplace disputes. However, Queensland state laws govern workers' compensation through WorkCover Queensland, workplace health and safety under Work Health and Safety Act 2011, and certain public sector employment. Employment lawyers advise both employees and employers on their rights and obligations.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Unfair Dismissal Claims</h3>
      <p>
        Employees dismissed from their job may be eligible to file unfair dismissal claims with the Fair Work Commission if employed for the minimum period (usually six months for businesses with fewer than 15 employees, 12 months for larger businesses) and earning below the high income threshold. Claims must be lodged within 21 days of dismissal. Queensland employment lawyers can assess your case, prepare applications, and represent you at conciliation and hearings. Remedies include reinstatement or compensation up to six months' wages.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">General Protections Claims</h4>
      <p>
        General protections under the Fair Work Act prohibit adverse action against employees for exercising workplace rights, including taking sick leave, making complaints, or union membership. These claims have a 60-day time limit but can result in uncapped compensation. Queensland lawyers can also pursue general protections claims for discrimination based on protected attributes like age, disability, race, or pregnancy.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Discrimination and Harassment</h3>
      <p>
        Queensland's Anti-Discrimination Act 1991 prohibits discrimination in employment based on sex, pregnancy, relationship status, disability, race, age, and other protected attributes. The Queensland Human Rights Commission investigates complaints and attempts conciliation. If unresolved, matters can proceed to the Queensland Civil and Administrative Tribunal (QCAT). Federal discrimination laws also apply through the Australian Human Rights Commission. Sexual harassment, bullying, and victimisation claims can result in compensation for economic loss, hurt, and humiliation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Employment Contracts and Agreements</h3>
      <p>
        Employment lawyers review and draft employment contracts, executive agreements, restraint of trade clauses, and confidentiality agreements. In Queensland, employment terms must comply with the National Employment Standards and relevant modern awards or enterprise agreements. Unlawful contract terms can be challenged. Lawyers advise on enforceability of post-employment restraints and garden leave provisions under Queensland and federal law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers' Compensation</h3>
      <p>
        WorkCover Queensland administers workers' compensation for employees injured at work. Claims cover medical expenses, wage replacement, rehabilitation, and lump sum compensation for permanent impairment. Queensland workers can also pursue common law damages claims for serious injuries caused by employer negligence. Time limits apply - workers' compensation claims should be lodged promptly, while common law claims must generally be started within three years. Specialist workers' compensation lawyers maximise your entitlements and navigate the complex claims process.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Redundancy and Restructuring</h3>
      <p>
        Redundancy occurs when positions are no longer required. Genuine redundancy entitlements include notice periods, redundancy pay based on years of service, and accrued entitlements. Queensland employees may challenge redundancies that are not genuine or involve unfair selection processes. Consultation requirements apply for large-scale redundancies. Employment lawyers ensure proper processes are followed and maximum entitlements received.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Employment Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Fair Work Commission:</strong> 1300 799 675</li>
          <li><strong>Fair Work Ombudsman:</strong> 13 13 94</li>
          <li><strong>Queensland Human Rights Commission:</strong> 1300 130 670</li>
          <li><strong>WorkCover Queensland:</strong> 1300 362 128</li>
          <li><strong>Workplace Health and Safety Queensland:</strong> 1300 369 915</li>
          <li><strong>Queensland Industrial Relations Commission:</strong> (07) 3227 8210</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Bullying</h3>
      <p>
        The Fair Work Commission has jurisdiction over workplace bullying applications where repeated unreasonable behaviour creates a risk to health and safety. Queensland also has specific workplace bullying provisions under work health and safety laws. Applications must be made while still employed. The Commission can order employers to take action to prevent bullying continuing. Queensland lawyers can also pursue workers' compensation claims or general protections claims arising from bullying.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Queensland Employment Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.fairwork.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a></li>
          <li><a href="https://www.qhrc.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Human Rights Commission</a></li>
          <li><a href="https://www.worksafe.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkSafe Queensland</a></li>
          <li><a href="https://www.workcover.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkCover Queensland</a></li>
        </ul>
      </div>
    </>
  ),

  'personal-injury': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Personal Injury Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Personal injury law in Queensland helps victims of accidents and negligence obtain compensation for their injuries. Queensland's compensation schemes include compulsory third party (CTP) insurance for motor vehicle accidents, workers' compensation, public liability, and medical negligence. Experienced personal injury lawyers navigate these complex schemes to maximise your compensation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Motor Vehicle Accidents</h3>
      <p>
        Queensland's Compulsory Third Party (CTP) insurance scheme provides compensation for injuries sustained in motor vehicle accidents. All Queensland registered vehicles must have CTP insurance. Injured persons can claim compensation for medical expenses, loss of income, care costs, and pain and suffering through the Motor Accident Insurance Commission (MAIC). Claims must be lodged within nine months of the accident (three years for children). Queensland's Civil Liability Act 2003 sets out the assessment process, including independent medical examinations and mandatory final offers before court proceedings.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">No-Fault Benefits and Damages</h4>
      <p>
        The Queensland CTP scheme provides immediate no-fault benefits for medical expenses and lost wages regardless of who caused the accident. These early payments help with initial costs while the claim progresses. For ongoing compensation, you must prove the other party was at fault. Damages cover past and future economic loss, medical treatment, domestic assistance, and general damages for pain and suffering. Lawyers ensure all heads of damage are properly valued and claimed.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Medical Negligence</h3>
      <p>
        Medical negligence claims in Queensland arise when healthcare providers breach their duty of care, causing injury. This includes misdiagnosis, surgical errors, medication mistakes, and failure to obtain informed consent. Queensland's public hospitals are covered by the Queensland Government Insurance Fund, while private practitioners have professional indemnity insurance. Medical negligence cases require expert evidence from medical specialists. Time limits are strict - generally three years from when you knew or should have known of the negligence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public Liability Claims</h3>
      <p>
        Public liability claims compensate injuries on another person's property or due to their negligence. This includes slip and fall accidents in shopping centres, injuries in parks or public spaces, dog attacks, and defective products. Queensland's Civil Liability Act requires proof that the property owner or occupier breached their duty of care and this breach caused your injury. Contributory negligence may reduce compensation if you were partly at fault. Personal injury lawyers investigate liability, obtain evidence, and negotiate with insurers.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Work Injury Compensation</h3>
      <p>
        Queensland workers injured at work can claim workers' compensation through WorkCover Queensland for medical expenses, wage replacement, and permanent impairment lump sums. Additionally, seriously injured workers may pursue common law damages claims against their employer for negligence. These claims can result in substantially higher compensation but require proof of employer fault. Time limits apply - common law claims must generally be started within three years. Specialist lawyers assess both statutory and common law entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Total and Permanent Disability (TPD)</h3>
      <p>
        TPD insurance, often held through superannuation, pays lump sum benefits to workers who can no longer work due to injury or illness. Queensland lawyers assist with TPD claims, which often involve disputes over medical evidence, policy interpretation, and the definition of total and permanent disability. Claims can be worth hundreds of thousands of dollars. Insurers frequently deny legitimate claims, making legal representation essential.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dust Diseases and Asbestos</h3>
      <p>
        Queensland workers exposed to asbestos, silica, or other harmful dusts may develop serious diseases decades later. Asbestos-related diseases including mesothelioma, asbestosis, and lung cancer attract special compensation provisions. Queensland's Workers' Compensation and Rehabilitation Act provides for claims even when employers no longer exist, with government-funded compensation available. Time limits are extended for dust disease claims due to long latency periods. Specialist asbestos lawyers trace exposure history and claim against all liable parties.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Personal Injury Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Motor Accident Insurance Commission (MAIC):</strong> 1300 302 568</li>
          <li><strong>WorkCover Queensland:</strong> 1300 362 128</li>
          <li><strong>Office of the Health Ombudsman:</strong> 133 646</li>
          <li><strong>Legal Aid Queensland:</strong> 1300 65 11 88</li>
          <li><strong>Personal Injuries Proceedings Act Information:</strong> (07) 3738 7800</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Compulsory Conference Process</h3>
      <p>
        Queensland's Personal Injuries Proceedings Act 2002 requires parties to attend compulsory conferences before starting court proceedings for most personal injury claims. These conferences aim to settle claims early, reducing legal costs. An independent barrister chairs the conference and facilitates negotiations. If settlement isn't reached, court proceedings can commence. The compulsory conference system resolves many Queensland personal injury claims efficiently.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Queensland Personal Injury Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://maic.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Motor Accident Insurance Commission</a></li>
          <li><a href="https://www.workcover.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkCover Queensland</a></li>
          <li><a href="https://www.health.qld.gov.au/oho" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Health Ombudsman</a></li>
          <li><a href="https://www.qls.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Law Society</a></li>
        </ul>
      </div>
    </>
  ),

  'business-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Business Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Business and commercial law in Queensland encompasses company formation, contracts, mergers and acquisitions, commercial disputes, and regulatory compliance. Whether you're starting a business, expanding operations, or resolving commercial conflicts, Queensland business lawyers provide strategic advice to protect your interests and achieve your commercial objectives.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Formation and Structure</h3>
      <p>
        Choosing the right business structure is critical for tax, liability, and operational purposes. Options include sole trader, partnership, company, or trust structures. Queensland businesses must comply with federal Corporations Act requirements for companies, register business names with ASIC, and obtain necessary Queensland licenses and permits. Business lawyers advise on optimal structures considering asset protection, tax efficiency, succession planning, and compliance obligations. They prepare constitutions, shareholders agreements, and partnership agreements to govern relationships and prevent disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Contracts</h3>
      <p>
        Well-drafted commercial contracts are essential for protecting your business interests. Queensland commercial lawyers prepare and review supply agreements, distribution contracts, service agreements, licensing deals, and terms and conditions. They ensure contracts comply with Australian Consumer Law, include appropriate dispute resolution clauses, allocate risks fairly, and protect intellectual property. Key considerations include payment terms, termination rights, limitation of liability, and governing law provisions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Australian Consumer Law Compliance</h4>
      <p>
        The Australian Consumer Law applies to all Queensland businesses dealing with consumers. It prohibits misleading conduct, unconscionable conduct, and unfair contract terms. Businesses must provide consumer guarantees on goods and services. The ACCC and Queensland Office of Fair Trading enforce consumer law, with significant penalties for breaches. Lawyers ensure marketing materials, contracts, and business practices comply with consumer law requirements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mergers and Acquisitions</h3>
      <p>
        Buying or selling a Queensland business involves complex legal due diligence, contract negotiation, and regulatory approvals. Transactions may be structured as share sales or asset sales, each with different tax and liability implications. Due diligence examines financial records, contracts, intellectual property, employment matters, and regulatory compliance. Lawyers prepare sale agreements, disclosure documents, restraint of trade clauses, and manage settlement. For larger transactions, ACCC merger clearance may be required.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Sales and Purchases</h3>
      <p>
        Queensland business sales require careful attention to goodwill valuation, stock takes, lease assignments, employee transfers, and vendor warranties. The vendor must disclose material information affecting the business value. Purchasers should conduct thorough due diligence including financial analysis, lease reviews, and legal searches. Restraint of trade clauses prevent vendors from competing. Business sale lawyers protect parties' interests and ensure smooth transitions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Disputes</h3>
      <p>
        Commercial disputes in Queensland include breach of contract, debt recovery, partnership disputes, shareholder oppression, and trade practices claims. Resolution options include negotiation, mediation, arbitration, or litigation in the Queensland Supreme Court or District Court. Many commercial contracts include dispute resolution clauses requiring mediation or arbitration before court proceedings. Commercial litigation lawyers protect your interests and pursue cost-effective resolutions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Franchising</h3>
      <p>
        Franchising in Australia is governed by the Franchising Code of Conduct, which requires disclosure documents, cooling-off periods, and good faith obligations. Queensland has significant franchise activity in retail, food service, and service industries. Franchise lawyers advise franchisors on system documentation, disclosure compliance, and territory protection. They assist franchisees with reviewing franchise agreements, negotiating terms, and resolving disputes with franchisors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Partnership Agreements</h3>
      <p>
        Partnerships in Queensland are governed by the Partnership Act 1891 and partnership agreements. Well-drafted partnership agreements address profit sharing, decision-making, capital contributions, admission of new partners, retirement, and dispute resolution. Without written agreements, default statutory rules apply which may not reflect partners' intentions. Business lawyers prepare comprehensive partnership agreements preventing costly disputes.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Business Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Business Queensland:</strong> 13 QGOV (13 74 68)</li>
          <li><strong>Office of Fair Trading Queensland:</strong> 13 QGOV (13 74 68)</li>
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Australian Competition and Consumer Commission (ACCC):</strong> 1300 302 502</li>
          <li><strong>Queensland Small Business Commissioner:</strong> 1300 722 722</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Queensland Business Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.business.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business Queensland</a></li>
          <li><a href="https://www.qld.gov.au/law/fair-trading" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of Fair Trading Queensland</a></li>
          <li><a href="https://www.treasury.qld.gov.au/small-business/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Small Business Commissioner</a></li>
          <li><a href="https://asic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC</a></li>
        </ul>
      </div>
    </>
  ),

  'immigration-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Immigration Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Immigration to Australia is governed by federal legislation including the Migration Act 1958 and administered by the Department of Home Affairs. Queensland, with its strong economy and lifestyle, attracts significant migration including skilled workers, family reunion, students, and business migrants. Registered Migration Agents and immigration lawyers help navigate the complex visa system and maximise your chances of success.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Applications in Queensland</h3>
      <p>
        Australia offers numerous visa categories including temporary work visas, permanent residence, student visas, visitor visas, and protection visas. Each visa has specific eligibility criteria, documentation requirements, and processing times. Queensland's strong industries including mining, agriculture, healthcare, education, and tourism create opportunities for skilled migrants. Immigration lawyers assess eligibility, prepare comprehensive applications, and address any compliance issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Skilled Migration</h3>
      <p>
        Skilled migration to Queensland includes General Skilled Migration (GSM) visas, employer-sponsored visas, and state nomination programs. Queensland offers state nomination for skilled workers in occupations on its priority list, particularly in regional areas. The Business and Skilled Migration Program (BSMQ) manages Queensland nominations. Points-tested skilled visas require occupation assessment, English language proficiency, age, and work experience criteria. Migration agents help maximize points scores and navigate the complex skilled migration system.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Regional Migration</h4>
      <p>
        Queensland's regional areas including Cairns, Townsville, Toowoomba, and the Gold Coast offer additional migration pathways through Regional Sponsored Migration Scheme (RSMS), Skilled Work Regional visas, and regional state nomination. These programs have more flexible requirements and faster processing. Regional migrants must commit to living and working in designated regional areas for specified periods.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Family Migration</h3>
      <p>
        Family reunion visas allow Australian citizens and permanent residents to sponsor overseas family members. Partner visas (including spouse and de facto) are the most common, involving onshore and offshore pathways. Parent visas, child visas, and other family visas have specific requirements. Relationship evidence is critical for partner visas, including financial aspects, household matters, social recognition, and commitment. Immigration lawyers assist with compiling evidence and addressing visa refusals.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business and Investment Migration</h3>
      <p>
        Queensland welcomes business migrants through Business Innovation and Investment Program visas. These include Entrepreneur visas, Investor visas, and Business Talent visas. Queensland offers state nomination for qualifying business migrants. Requirements include business turnover, assets, investment amounts, and business plans. The program aims to attract entrepreneurs and investors who will contribute to Queensland's economy. Migration lawyers advise on business structuring and nomination applications.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Student Visas</h3>
      <p>
        Queensland's universities, TAFEs, and colleges attract international students across Brisbane, Gold Coast, Sunshine Coast, and regional cities. Student visa requirements include enrollment in registered courses (CRICOS), financial capacity, health insurance (OSHC), and genuine temporary entrant criteria. Student visa holders may have work rights and pathways to permanent residence through post-study work visas and skilled migration. Education agents and migration lawyers assist with visa compliance and post-study migration planning.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Refusals and Appeals</h3>
      <p>
        Visa refusals can be challenged through Administrative Appeals Tribunal (AAT) review, now the Administrative Review Tribunal (ART). Time limits are strict - generally 21 days for most visa decisions. Appeals involve hearings where applicants present evidence and submissions. Merits review allows reconsideration of the decision based on law and evidence. Migration lawyers represent clients at tribunal hearings and prepare comprehensive submissions addressing refusal reasons.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Deportation and Removal</h3>
      <p>
        Visa cancellation can occur for character reasons, compliance breaches, or providing false information. Section 501 character cancellations apply to persons with substantial criminal records. Cancellation can be challenged through revocation requests or tribunal review. Ministerial intervention may be sought in compelling cases. Deportation and removal have serious consequences including re-entry bans. Urgent legal advice is essential when facing visa cancellation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Citizenship</h3>
      <p>
        Australian citizenship by conferral requires permanent residence, residency period (usually 4 years with 12 months as permanent resident), good character, and citizenship test. Queensland residents apply through the Department of Home Affairs. Citizenship provides voting rights, Australian passport, and certainty of residence. Special provisions apply for children, stateless persons, and those with service to Australia. Immigration lawyers assist with citizenship applications and address character or residency issues.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Immigration Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Home Affairs (Immigration):</strong> 131 881</li>
          <li><strong>Business and Skilled Migration Queensland:</strong> (07) 3034 3488</li>
          <li><strong>Refugee and Immigration Legal Service (RAILS):</strong> (07) 3846 9300</li>
          <li><strong>Immigration Advice and Rights Centre:</strong> (07) 3034 3900</li>
          <li><strong>Migration Agents Registration Authority (MARA):</strong> (07) 3360 3700</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Immigration Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://immi.homeaffairs.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Home Affairs</a></li>
          <li><a href="https://www.business.qld.gov.au/starting-business/advice-support/support/migration" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business and Skilled Migration Queensland</a></li>
          <li><a href="https://www.mara.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Migration Agents Registration Authority</a></li>
          <li><a href="https://railsqld.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">RAILS Queensland</a></li>
        </ul>
      </div>
    </>
  ),

  'litigation': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Litigation and Dispute Resolution in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Litigation involves resolving disputes through Queensland's court system, including the Magistrates Court, District Court, and Supreme Court. Whether facing civil litigation, commercial disputes, or seeking alternative dispute resolution, experienced litigation lawyers protect your interests and pursue optimal outcomes through negotiation, mediation, arbitration, or court proceedings.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Queensland Courts</h3>
      <p>
        Queensland's civil court system is hierarchical. The Magistrates Court handles claims up to $150,000 ($25,000 in Small Claims). The District Court has jurisdiction for claims $150,000 to $750,000. The Supreme Court hears claims over $750,000 and has unlimited jurisdiction. Different courts have different procedures, costs, and timeframes. Choosing the appropriate court and understanding its rules is critical. The Queensland Civil and Administrative Tribunal (QCAT) provides a simpler forum for certain disputes including tenancy, guardianship, and minor civil matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Civil Litigation</h3>
      <p>
        Civil litigation in Queensland encompasses breach of contract, negligence, defamation, estate disputes, and various other civil wrongs. The Uniform Civil Procedure Rules 1999 govern Queensland court procedures. Litigation involves pleadings (claim and defence), discovery of documents, witness statements, expert evidence, pre-trial conferences, and trial. Queensland courts emphasize early resolution through mediation and case management. Costs often exceed the amount in dispute, making early settlement attractive.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Litigation</h3>
      <p>
        Commercial disputes include breach of contract, partnership disputes, shareholder oppression, trade practices claims, and insolvency matters. Queensland's Supreme Court has a Commercial List for complex commercial cases, providing specialized judges and streamlined procedures. Commercial litigation often involves significant documentation, expert witnesses on accounting or industry practices, and substantial legal costs. Many commercial contracts include arbitration or expert determination clauses requiring disputes be resolved outside courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Alternative Dispute Resolution</h3>
      <p>
        Alternative Dispute Resolution (ADR) includes mediation, arbitration, expert determination, and conciliation. Queensland courts actively encourage ADR to reduce costs and delay. Many cases are referred to court-ordered mediation. Private mediation can resolve disputes quickly and confidentially. Mediators facilitate negotiations but don't make binding decisions. Arbitration involves an arbitrator making binding decisions. ADR is particularly useful for commercial disputes, neighborhood conflicts, and family provision claims where maintaining relationships matters.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Queensland Dispute Resolution Centres</h4>
      <p>
        The Queensland Government operates Dispute Resolution Centres offering free community mediation for neighborhood disputes, minor civil claims, and workplace conflicts. These services help resolve disputes without legal proceedings. Commercial mediators charge fees but can save substantial litigation costs. Litigation lawyers advise when ADR is appropriate and represent clients in mediation sessions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Recovery</h3>
      <p>
        Debt recovery litigation in Queensland involves issuing claims, default judgments, and enforcement through garnishee orders, seizure of property, or bankruptcy. The Queensland Magistrates Court handles most debt recovery matters. The process includes demand letters, statement of claim, judgment, and enforcement. Disputed debts require evidence of the agreement and amounts owing. Debtors can defend claims or negotiate payment arrangements. Creditors must comply with debt collection regulations and avoid prohibited conduct.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Building and Construction Disputes</h3>
      <p>
        Construction disputes in Queensland involve defective work, payment disputes, variations, delays, and contract termination. The Queensland Building and Construction Commission (QBCC) provides dispute resolution for residential building work under $100,000. Larger disputes proceed through courts or adjudication under the Building Industry Fairness (Security of Payment) Act 2017. Adjudication provides fast determination of payment disputes. Litigation may follow for final resolution. Construction lawyers understand complex technical issues and industry practices.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Defamation</h3>
      <p>
        Defamation law in Queensland is governed by the Defamation Act 2005. Defamation involves publishing false statements that damage someone's reputation. Social media has increased defamation claims. Defences include truth, honest opinion, and qualified privilege. Concerns notices must precede proceedings, allowing opportunities for settlement. Defamation proceedings must start within one year. Courts can order damages, injunctions, and corrections. Litigation lawyers advise on defamation risks and remedies.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Queensland Litigation Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Queensland Courts:</strong> (07) 3247 4600</li>
          <li><strong>QCAT Registry:</strong> 1300 753 228</li>
          <li><strong>Dispute Resolution Branch Queensland:</strong> 1800 017 288</li>
          <li><strong>Queensland Law Society:</strong> (07) 3842 5943</li>
          <li><strong>Legal Aid Queensland:</strong> 1300 65 11 88</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Queensland Litigation Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.courts.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Courts</a></li>
          <li><a href="https://www.qcat.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.qld.gov.au/law/legal-mediation-and-justice-of-the-peace/setting-up-mediation-and-resolving-disputes" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Dispute Resolution</a></li>
          <li><a href="https://www.qls.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Law Society</a></li>
        </ul>
      </div>
    </>
  ),

  'bankruptcy-insolvency': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Bankruptcy and Insolvency Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Bankruptcy and insolvency laws help individuals and businesses deal with overwhelming debt. Governed by federal legislation including the Bankruptcy Act 1966 and Corporations Act 2001, these processes provide structured solutions for financial distress. Queensland insolvency lawyers advise on bankruptcy alternatives, navigate insolvency proceedings, and protect creditors' rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Personal Bankruptcy</h3>
      <p>
        Bankruptcy is a legal process where an individual is declared unable to pay their debts. It can be voluntary (debtor's petition) or involuntary (creditor's petition). Bankruptcy typically lasts three years, though it can extend to eight years in some circumstances. A trustee takes control of the bankrupt's assets (except protected items), sells non-exempt property, and distributes proceeds to creditors. Bankruptcy provides relief from debt recovery action and harassment, but has serious consequences including travel restrictions, asset loss, and credit history impacts.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternatives to Bankruptcy</h4>
      <p>
        Before considering bankruptcy, explore alternatives including debt agreements (Part IX), personal insolvency agreements (Part X), and informal arrangements with creditors. Debt agreements allow you to pay a proportion of debts over time, avoiding bankruptcy's consequences. Personal insolvency agreements are more flexible, negotiated with creditors. Both require a registered trustee. Queensland financial counsellors and insolvency lawyers assess which option suits your circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Corporate Insolvency</h3>
      <p>
        Companies facing financial difficulty have several insolvency options. Voluntary administration allows an independent administrator to investigate the company's affairs and recommend to creditors whether to wind up, execute a deed of company arrangement, or return to directors' control. Liquidation (winding up) involves appointing a liquidator to realize assets and distribute to creditors. Receivership occurs when secured creditors appoint receivers to take control of charged assets. Each process has different purposes and outcomes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Liquidation</h3>
      <p>
        Liquidation ends a company's existence. It can be voluntary (members' or creditors') or court-ordered. The liquidator investigates the company's affairs, recovers assets, sells property, examines director conduct, and distributes proceeds according to statutory priorities. Employees have priority for unpaid wages and superannuation. Directors can face personal liability for insolvent trading - incurring debts when the company cannot pay them. Queensland insolvency lawyers advise directors on duties and potential liabilities.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Voluntary Administration</h3>
      <p>
        Voluntary administration provides breathing space for struggling companies. Directors appoint an administrator who investigates whether the company can be saved through restructuring. Creditors meet to decide the company's future. A Deed of Company Arrangement (DOCA) can allow the company to continue trading while repaying creditors over time. Administration provides temporary relief from creditor action. It's used when companies have prospects of recovery or a restructure could return better outcomes than immediate liquidation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Agreements</h3>
      <p>
        Part IX debt agreements are formal alternatives to bankruptcy for individuals with regular income and unsecured debts under statutory limits (currently $127,068.90 in debts). Debtors propose to pay creditors a portion of debts over time, typically three to five years. If creditors representing 50% in value accept, all unsecured creditors are bound. Debt agreements avoid bankruptcy but are recorded on the National Personal Insolvency Index and affect credit ratings. They're suitable when you can make regular payments but cannot pay debts in full.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Bankruptcy and Insolvency Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Financial Security Authority (AFSA):</strong> 1300 364 785</li>
          <li><strong>National Debt Helpline:</strong> 1800 007 007</li>
          <li><strong>Financial Counselling Queensland:</strong> 1300 687 327</li>
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Australian Restructuring Insolvency & Turnaround Association:</strong> (07) 3229 3144</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Creditors' Rights</h3>
      <p>
        Creditors can protect their interests through security agreements, guarantees, and timely debt recovery. When debtors become insolvent, secured creditors have priority over unsecured creditors. Unsecured creditors can issue bankruptcy notices or creditor's petitions against individuals, or wind up companies through court applications. Proving debts in insolvency administrations is essential to receive distributions. Creditors can challenge preferences, uncommercial transactions, and director-related transactions. Insolvency lawyers represent creditors' interests in administrations and litigation.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Bankruptcy and Insolvency Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.afsa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Financial Security Authority</a></li>
          <li><a href="https://ndh.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">National Debt Helpline</a></li>
          <li><a href="https://arita.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ARITA</a></li>
          <li><a href="https://asic.gov.au/regulatory-resources/insolvency/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC - Insolvency Information</a></li>
        </ul>
      </div>
    </>
  ),

  'intellectual-property': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Intellectual property (IP) protects creations of the mind including inventions, artistic works, designs, symbols, and names. Australian IP law is primarily federal, administered by IP Australia. Queensland businesses and creators need IP lawyers to protect, commercialise, and enforce their intellectual property rights through trademarks, copyright, patents, and trade secrets.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trademark Law</h3>
      <p>
        Trademarks identify and distinguish goods and services from competitors. They can be words, logos, sounds, colours, or shapes. Registration through IP Australia provides exclusive rights to use the trademark for registered classes of goods or services throughout Australia. Queensland businesses should register trademarks before use to prevent others from registering identical or similar marks. The registration process involves searching existing trademarks, filing applications, examination, and potential opposition. Registered trademarks last 10 years and can be renewed indefinitely.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Trademark Enforcement</h4>
      <p>
        Trademark owners can take legal action against infringing use through cease and desist letters, Federal Court litigation, or Australian Consumer Law claims for misleading conduct. Remedies include injunctions, damages, account of profits, and corrective advertising. Online trademark infringement through domain names, social media, and e-commerce platforms is increasingly common. IP lawyers enforce trademark rights and defend infringement claims.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Copyright Law</h3>
      <p>
        Copyright automatically protects original literary, dramatic, musical, and artistic works, as well as films, sound recordings, and broadcasts. No registration is required. Copyright in Australia generally lasts 70 years after the creator's death for original works. Queensland creators, artists, authors, and software developers rely on copyright protection. Copyright licenses allow others to use works while retaining ownership. Moral rights protect authors' reputation and connection to their works.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Copyright Infringement</h4>
      <p>
        Copyright infringement occurs when someone reproduces, communicates, or adapts protected works without permission. Common issues include software piracy, image theft, music downloading, and plagiarism. Fair dealing exceptions allow limited use for research, criticism, news reporting, and parody. Copyright owners can seek injunctions, damages, and account of profits. The Copyright Tribunal can determine licensing disputes. Queensland businesses should ensure all used content is licensed or owned.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Patent Law</h3>
      <p>
        Patents protect inventions that are novel, inventive, and useful. Standard patents last 20 years; innovation patents (now abolished for new applications) lasted 8 years. Queensland has significant innovation in mining technology, agriculture, medical devices, and biotechnology. Patent applications require detailed specifications and claims defining the invention's scope. The examination process assesses novelty and inventiveness against prior art. Patents are expensive but provide strong protection for commercially valuable inventions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trade Secrets and Confidential Information</h3>
      <p>
        Trade secrets include formulas, processes, customer lists, and business methods kept confidential. Unlike patents or trademarks, trade secrets don't require registration but rely on confidentiality. Queensland businesses protect trade secrets through non-disclosure agreements, employment contracts with confidentiality clauses, and physical/digital security. Legal action for breach of confidence can restrain disclosure and claim damages. Famous examples include Coca-Cola's formula and KFC's recipe.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Design Rights</h3>
      <p>
        Registered designs protect the visual appearance of products including shape, configuration, pattern, and ornamentation. Registration lasts 10 years and requires novelty and distinctiveness. Queensland designers of furniture, fashion, industrial products, and packaging benefit from design registration. Unregistered designs receive limited automatic protection for two years. Design registration is quicker and cheaper than patents while providing strong protection for aesthetic features.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Commercialisation</h3>
      <p>
        Intellectual property can be commercialised through licensing, franchising, merchandising, and assignment. License agreements allow others to use IP in exchange for royalties or fees. Exclusive licenses grant rights to one party; non-exclusive licenses allow multiple licensees. IP lawyers draft agreements addressing territory, duration, royalties, quality control, and termination. Queensland businesses can monetise IP assets while retaining ownership through strategic licensing.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Intellectual Property Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>IP Australia:</strong> 1300 65 10 10</li>
          <li><strong>Australian Copyright Council:</strong> (02) 9101 2377</li>
          <li><strong>Copyright Agency:</strong> 1800 066 844</li>
          <li><strong>Federal Court of Australia (Brisbane):</strong> (07) 3248 1200</li>
          <li><strong>Queensland Law Society - IP Specialists:</strong> (07) 3842 5943</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Intellectual Property Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ipaustralia.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IP Australia</a></li>
          <li><a href="https://www.copyright.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Copyright Council</a></li>
          <li><a href="https://www.business.qld.gov.au/running-business/protecting-business/ip-kit" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business Queensland - IP Kit</a></li>
          <li><a href="https://www.fedcourt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Federal Court of Australia</a></li>
        </ul>
      </div>
    </>
  ),

  'tax-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Tax Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Australian taxation is primarily governed by federal legislation administered by the Australian Taxation Office (ATO). Queensland taxpayers and businesses navigate income tax, GST, capital gains tax, fringe benefits tax, and various state taxes including payroll tax and transfer duty. Tax lawyers provide advice on tax planning, compliance, disputes, and structuring to minimise tax obligations within legal bounds.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Income Tax</h3>
      <p>
        Income tax applies to individuals, companies, trusts, and partnerships on assessable income. Queensland residents pay federal income tax with rates depending on income levels and entity types. Individuals receive tax-free thresholds and marginal tax rates up to 45% plus Medicare Levy. Companies pay 25% or 30% depending on size and type. Tax lawyers advise on minimising tax through legitimate deductions, offsets, and concessions including small business CGT concessions, research and development incentives, and negative gearing strategies.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Goods and Services Tax (GST)</h3>
      <p>
        GST is a 10% tax on most goods and services sold in Australia. Queensland businesses with turnover exceeding $75,000 ($150,000 for non-profits) must register for GST. Registered businesses charge GST on taxable supplies, claim input tax credits on business purchases, and lodge Business Activity Statements (BAS) reporting GST collected and paid. Some supplies are GST-free (food, health, education) or input-taxed (financial services, residential rent). Tax advisors ensure correct GST treatment and compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Disputes</h3>
      <p>
        Tax disputes arise from ATO audits, amended assessments, transfer pricing adjustments, or denied deductions. Queensland taxpayers can object to assessments within prescribed timeframes, typically two or four years depending on the tax type. Unresolved objections can be appealed to the Administrative Appeals Tribunal or Federal Court. The ATO's dispute resolution service offers early resolution through facilitation. Tax lawyers represent clients in objections, appeals, and litigation, and negotiate settlement agreements.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">ATO Audits</h4>
      <p>
        ATO audits examine taxpayers' compliance with tax laws. They can be random or triggered by data matching, industry benchmarks, or risk profiling. Audits involve requests for information, interviews, and detailed review of records. Taxpayers have rights including representation by tax agents or lawyers, reasonable timeframes, and review of adverse findings. Tax lawyers manage audit processes, respond to information requests, and challenge unreasonable positions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Planning and Structuring</h3>
      <p>
        Effective tax planning minimises tax within legal bounds through appropriate business structures, timing of income and deductions, and utilising concessions. Queensland businesses choose between sole trader, partnership, company, and trust structures based on tax, asset protection, and succession objectives. Family trusts offer flexibility for income distribution. Companies provide certainty and limited liability. Hybrid structures combine benefits. Tax lawyers advise on optimal structures and restructuring when circumstances change.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Capital Gains Tax (CGT)</h3>
      <p>
        CGT applies to profits from selling assets including property, shares, and businesses. The main residence exemption excludes family homes. Small businesses receive generous CGT concessions including 15-year exemption, 50% active asset reduction, retirement exemption, and rollover relief. Queensland property investors calculate CGT on investment properties considering holding period, improvements, and selling costs. Tax planning can significantly reduce CGT through timing sales, using concessions, and structuring ownership.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">State Taxes in Queensland</h3>
      <p>
        Queensland imposes several state taxes. Payroll tax applies to employers with Australian wages exceeding the threshold (currently $1.3 million for Queensland-only employers). Transfer duty (stamp duty) applies to property transfers with rates increasing with property value. Land tax applies to investment and commercial property (not principal residences) with progressive rates. Motor vehicle registration includes stamp duty. The Queensland Revenue Office administers state taxes. Tax lawyers advise on minimisation strategies and challenge assessments.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Fringe Benefits Tax (FBT)</h3>
      <p>
        FBT is a federal tax on benefits employers provide to employees or their associates, including cars, loans, entertainment, and living-away-from-home allowances. The FBT year runs April 1 to March 31. Employers pay 47% on the grossed-up value of benefits. Certain benefits are exempt or concessionally treated including minor benefits, work-related items, and salary packaging arrangements for charities and public hospitals. Queensland employers need advice on FBT compliance and minimisation strategies.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tax Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Taxation Office:</strong> 13 28 61 (individuals) / 13 28 66 (business)</li>
          <li><strong>Queensland Revenue Office:</strong> 1300 300 734</li>
          <li><strong>Tax Practitioners Board:</strong> 1300 362 829</li>
          <li><strong>Inspector-General of Taxation:</strong> 1300 770 454</li>
          <li><strong>Administrative Appeals Tribunal:</strong> 1800 228 333</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tax Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ato.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Taxation Office</a></li>
          <li><a href="https://www.qro.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Revenue Office</a></li>
          <li><a href="https://www.igt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Inspector-General of Taxation</a></li>
          <li><a href="https://www.tpb.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tax Practitioners Board</a></li>
        </ul>
      </div>
    </>
  ),

  'environmental-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Environmental Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Environmental law in Queensland protects natural resources, regulates development, and manages environmental impacts. Governed by the Environmental Protection Act 1994, Planning Act 2016, and various federal laws including the Environment Protection and Biodiversity Conservation Act 1999, environmental law affects property development, mining, agriculture, and industrial operations across Queensland.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Environmental Protection in Queensland</h3>
      <p>
        Queensland's Environmental Protection Act 1994 regulates environmentally relevant activities including waste management, air emissions, water discharge, noise, and contaminated land. The Department of Environment and Science administers environmental approvals, monitoring, and enforcement. Businesses conducting environmentally relevant activities require environmental authorities setting operational conditions. Non-compliance can result in penalty infringement notices, enforcement orders, prosecution, or environmental protection orders. Environmental lawyers advise on compliance, applications, and defending enforcement action.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Planning and Development</h3>
      <p>
        Queensland's Planning Act 2016 governs land use planning and development assessment. Local government planning schemes zone land and set development requirements. Development applications require assessment against planning schemes, state planning policies, and environmental considerations. Impact assessable development requires public notification and may involve appeals to the Planning and Environment Court. Queensland's unique Sustainable Planning Act history influences current interpretations. Planning lawyers represent applicants, objectors, and councils in development applications and court appeals.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Environmental Impact Statements</h4>
      <p>
        Major projects in Queensland require Environmental Impact Statements (EIS) under the State Development and Public Works Organisation Act 1971 or Environmental Protection Act. The EIS process involves terms of reference, detailed environmental studies, public consultation, and government assessment. Projects include mining developments, major infrastructure, and large-scale industrial facilities. The Coordinator-General assesses significant projects with conditions binding despite other approvals. Environmental consultants and lawyers guide proponents through this complex process.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mining and Resources</h3>
      <p>
        Queensland's resources sector operates under the Mineral Resources Act 1989 and Petroleum and Gas (Production and Safety) Act 2004. Mining projects require environmental authorities, land access agreements with landholders, and Indigenous land use agreements where native title exists. The Environmental Protection Act regulates mine rehabilitation, water management, and closure planning. Financial assurances secure rehabilitation obligations. Queensland's resources sector faces increasing environmental scrutiny regarding groundwater impacts, rehabilitation standards, and climate change. Resources lawyers advise on approvals, compliance, and landholder negotiations.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Native Title</h3>
      <p>
        Native title recognises Indigenous Australians' traditional rights to land and waters. Queensland has extensive areas with determined or claimed native title. The Native Title Act 1993 (Commonwealth) requires the native title process for many government and private actions affecting land including mining, infrastructure, and development. Indigenous Land Use Agreements (ILUAs) enable negotiated outcomes. The National Native Title Tribunal mediates claims and future act processes. Native title lawyers represent Indigenous groups, developers, and government in claims and negotiations.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Water Rights and Management</h3>
      <p>
        Queensland's Water Act 2000 regulates water resource planning, water allocations, and water use. Water allocations can be held, traded, and used subject to resource operation plans. The Great Artesian Basin, river systems, and groundwater resources face increasing pressure. Underground water impact reports address mining and CSG impacts on aquifers. Water licences are required for taking or interfering with water. Environmental flows protect ecosystem health. Water lawyers advise on allocations, trading, compliance, and disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Great Barrier Reef Protection</h3>
      <p>
        The Great Barrier Reef is protected by both Queensland and Commonwealth legislation. Reef water quality is regulated through the Environmental Protection (Great Barrier Reef Protection Measures) and Other Legislation Amendment Act 2019. Agriculture in reef catchments faces nutrient and sediment run-off regulations. Development near the reef requires assessment of impacts. The Great Barrier Reef Marine Park Act 1975 (Commonwealth) controls activities in the marine park. Reef protection increasingly affects coastal development and agriculture in Queensland.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contaminated Land</h3>
      <p>
        Queensland's contaminated land regime under the Environmental Protection Act requires investigation and remediation of contaminated sites. The Environmental Management Register (EMR) lists sites conducting notifiable activities. The Contaminated Land Register lists sites posing serious environmental harm. Property transactions in Queensland should include contaminated land searches. Liability for remediation can extend to current and former owners and polluters. Environmental lawyers advise on contaminated land risks, remediation requirements, and liability allocation.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Environmental Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Environment and Science Queensland:</strong> 13 QGOV (13 74 68)</li>
          <li><strong>Environmental Protection Agency Queensland:</strong> 1300 130 372</li>
          <li><strong>Planning and Environment Court Queensland:</strong> (07) 3247 5722</li>
          <li><strong>Department of Resources (Mining):</strong> 13 QGOV (13 74 68)</li>
          <li><strong>National Native Title Tribunal:</strong> 1800 640 501</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Environmental Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.des.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Environment and Science</a></li>
          <li><a href="https://www.resources.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Resources Queensland</a></li>
          <li><a href="https://www.ehp.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Environmental Protection Agency</a></li>
          <li><a href="http://www.nntt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">National Native Title Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'administrative-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrative Law in Queensland</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Administrative law governs how government bodies make decisions and exercise power. In Queensland, this includes judicial review of government decisions, tribunal proceedings, freedom of information, and constitutional matters. Administrative lawyers challenge unlawful decisions, represent clients before tribunals, and ensure government accountability through the courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Judicial Review of Government Decisions</h3>
      <p>
        Judicial review allows courts to examine the legality of government decisions. Queensland's Judicial Review Act 1991 and the federal Judiciary Act 1903 provide review mechanisms. Grounds for review include jurisdictional error, procedural unfairness, unreasonableness, irrelevant considerations, and error of law. Applications must be filed promptly, typically within 28 days to three months depending on the enabling legislation. The Supreme Court and Federal Court have judicial review jurisdiction. Remedies include quashing decisions, mandamus compelling action, and injunctions preventing unlawful conduct.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Queensland Civil and Administrative Tribunal (QCAT)</h3>
      <p>
        QCAT provides accessible justice for reviewing government and private decisions. Jurisdiction includes guardianship, residential tenancy, anti-discrimination, disciplinary proceedings, minor civil disputes, and statutory appeals. QCAT operates less formally than courts with simplified procedures and lower costs. Different streams handle different matters: Civil, Administrative and Disciplinary, and Human Rights. Appeals from QCAT go to the Queensland Court of Appeal. QCAT makes Queensland administrative law more accessible to ordinary citizens.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Government Law and Public Sector</h3>
      <p>
        Government lawyers advise Queensland Government departments, agencies, and statutory authorities on legal powers, administrative law compliance, procurement, and governance. Queensland's Public Service Act 2008 governs public sector employment. The Crime and Corruption Commission investigates serious misconduct. Government entities must comply with financial accountability, right to information, privacy, and procurement requirements. Administrative lawyers represent government in litigation and provide advice on legislative interpretation and policy implementation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Constitutional Law</h3>
      <p>
        Constitutional law in Queensland involves the Australian Constitution, Queensland Constitution, and division of powers between Commonwealth and State. The High Court of Australia is the final arbiter of constitutional matters. Issues include validity of legislation, executive power, implied freedoms, and Commonwealth-State relations. Queensland's Constitution provides for parliamentary supremacy, executive government, and judicial independence. Constitutional challenges are rare but significant, affecting legislation validity and government power limits.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Human Rights in Queensland</h4>
      <p>
        Queensland's Human Rights Act 2019 protects fundamental rights including equality, liberty, privacy, freedom of expression, and fair hearing. Public entities must act compatibly with human rights and consider them in decision-making. All Queensland legislation must be interpreted consistently with human rights where possible. Individuals can raise human rights in existing legal proceedings. The Act doesn't create standalone causes of action but influences administrative decision-making. Administrative lawyers advise on human rights compliance and raise human rights issues in judicial review.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Freedom of Information</h3>
      <p>
        Queensland's Right to Information Act 2009 (RTI) provides public access to government documents. Individuals can request information from Queensland Government agencies, local councils, and universities. A push towards proactive disclosure requires agencies to publish certain information. Applications can be refused for cabinet documents, law enforcement, personal information of others, or commercial confidentiality. The Office of the Information Commissioner reviews RTI decisions. External review can proceed to QCAT. RTI lawyers assist with applications, internal reviews, and QCAT appeals.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Privacy Law</h3>
      <p>
        Privacy in Queensland is governed by the Information Privacy Act 2009 for state government, and the federal Privacy Act 1988 for Commonwealth agencies and private sector. The Information Privacy Principles regulate how Queensland Government collects, uses, stores, and discloses personal information. Individuals can access and correct their personal information held by government. The Office of the Information Commissioner investigates privacy complaints. Privacy breaches can result in compensation and corrective orders. Privacy lawyers advise on compliance and represent parties in complaints.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Administrative Appeals and Reviews</h3>
      <p>
        Many Queensland government decisions have internal review and external appeal rights. Internal reviews allow the decision-maker or senior officer to reconsider. External appeals may go to QCAT, specialist tribunals, or courts depending on the legislation. Time limits are strict - often 28 days or less. Appeals may be limited to questions of law, or allow full merits review. Understanding the correct review pathway and time limits is critical. Administrative lawyers navigate complex review processes and maximize prospects of success.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Ombudsman and Integrity Bodies</h3>
      <p>
        The Queensland Ombudsman investigates complaints about state government administrative action. The Ombudsman can review decisions, recommend changes, and report to Parliament. The Crime and Corruption Commission addresses serious misconduct and corruption in Queensland public sector. The Public Interest Disclosure Act 2010 protects whistleblowers. The Integrity Commissioner advises on ethics and lobbying. These bodies provide accountability mechanisms beyond courts and tribunals. Administrative lawyers coordinate with integrity bodies and use their reports in litigation.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Administrative Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>QCAT Registry:</strong> 1300 753 228</li>
          <li><strong>Queensland Ombudsman:</strong> 1800 068 908</li>
          <li><strong>Office of the Information Commissioner:</strong> (07) 3234 7373</li>
          <li><strong>Crime and Corruption Commission:</strong> (07) 3360 6060</li>
          <li><strong>Queensland Human Rights Commission:</strong> 1300 130 670</li>
          <li><strong>Queensland Supreme Court:</strong> (07) 3247 4600</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Administrative Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.qcat.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.ombudsman.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Ombudsman</a></li>
          <li><a href="https://www.oic.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Information Commissioner</a></li>
          <li><a href="https://www.ccc.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Crime and Corruption Commission</a></li>
          <li><a href="https://www.qhrc.qld.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Queensland Human Rights Commission</a></li>
        </ul>
      </div>
    </>
  ),
}

// New South Wales Practice Area Content
const NSW_CONTENT: Record<string, React.ReactElement> = {
  'family-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Family Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Family law in New South Wales operates under federal legislation including the Family Law Act 1975, with state courts handling specific matters such as domestic violence. NSW has Australia's largest family law jurisdiction, with extensive court resources in Sydney and regional centres supporting families through separation, divorce, and parenting disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Family Law in NSW</h3>
      <p>
        NSW family lawyers handle divorce, property settlements, parenting arrangements, spousal maintenance, and de facto relationship matters. The Family Court and Federal Circuit and Family Court of Australia (Division 2) operate from Sydney, Parramatta, Newcastle, and Wollongong. NSW Local Courts handle Apprehended Domestic Violence Orders (ADVOs), which are frequently integrated with family law proceedings.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Areas of Family Law Practice</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Divorce and Separation</h4>
      <p>
        NSW has the highest volume of divorce applications in Australia. To divorce, couples must have been separated for 12 months. Separation can occur under the same roof if you can demonstrate separate lives. NSW lawyers assist with divorce applications, ensuring proper service of documents and addressing complexities like service outside Australia or disputed separation dates.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Child Custody and Parenting Arrangements</h4>
      <p>
        Parenting matters in NSW prioritise children's best interests. Parents are encouraged to develop parenting plans without court intervention. When agreement isn't possible, parenting orders address living arrangements, time with each parent, decision-making responsibility, and child support. NSW courts consider the child's relationship with both parents, protection from harm, and the benefit of meaningful relationships. Independent Children's Lawyers may be appointed in complex cases.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Property Settlement</h4>
      <p>
        Property settlement in NSW involves identifying and valuing assets, assessing contributions (financial and non-financial), considering future needs, and determining a just and equitable division. NSW's high property values, particularly in Sydney, make expert valuation crucial. Superannuation splitting and dealing with complex assets like businesses or family trusts require specialist legal advice.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">De Facto Relationships</h4>
      <p>
        NSW's Property (Relationships) Act 1984 governs de facto property settlements where federal jurisdiction doesn't apply. De facto couples have the same family law rights as married couples if the relationship lasted two years or there are children. NSW recognises same-sex de facto relationships equally. Disputes about whether a de facto relationship existed are common and require evidence of cohabitation, financial interdependence, and social recognition.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Domestic Violence and ADVOs</h4>
      <p>
        NSW Local Courts issue Apprehended Domestic Violence Orders (ADVOs) under the Crimes (Domestic and Personal Violence) Act 2007. ADVOs can include prohibitions on violence, contact, approaching certain locations, and possessing firearms. Breaching an ADVO is a criminal offence. NSW Police can apply for ADVOs, and provisional orders provide immediate protection. Legal aid is available for ADVO matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">NSW-Specific Resources</h3>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Family Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Domestic Violence Line NSW:</strong> 1800 656 463 (24/7)</li>
          <li><strong>Men's Referral Service:</strong> 1300 766 491 (24/7)</li>
          <li><strong>Family Relationship Advice Line:</strong> 1800 050 321</li>
          <li><strong>Legal Aid NSW Family Law:</strong> 1300 888 529</li>
          <li><strong>Family Court (Sydney Registry):</strong> (02) 9230 8111</li>
          <li><strong>Federal Circuit Court (Parramatta):</strong> (02) 9688 1333</li>
          <li><strong>Women's Domestic Violence Court Advocacy Service:</strong> 1800 810 784</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Locations in NSW</h3>
      <p>
        The Family Court and Federal Circuit and Family Court operate from Sydney, Parramatta, Newcastle, Wollongong, and Dubbo. NSW Local Courts across the state handle domestic violence matters. Sydney has specialist Family Law Lists in multiple registries. Regional NSW is serviced through circuit court sittings and video conferencing facilities.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Family Dispute Resolution</h3>
      <p>
        Before filing parenting applications, parties must attempt Family Dispute Resolution (FDR) and obtain a s60I certificate. NSW has numerous Family Relationship Centres in Sydney, Parramatta, Newcastle, Wollongong, and regional areas offering FDR services. Private mediators and collaborative law approaches are also available. Mediation is not required where there's family violence or urgency.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Legal Aid and Support Services</h3>
      <p>
        Legal Aid NSW provides family law assistance to eligible clients, with priority for victims of domestic violence and matters involving children. Women's Legal Service NSW, Aboriginal Legal Service (NSW/ACT), and community legal centres across Sydney and regional NSW offer free advice and representation. Domestic Violence Court Advocacy Services support ADVO applicants.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Government Links:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.nsw.gov.au/family-and-relationships" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Government - Family and Relationships</a></li>
          <li><a href="https://www.legalaid.nsw.gov.au/what-we-do/family-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid NSW - Family Law</a></li>
          <li><a href="https://www.localcourt.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Local Courts</a></li>
          <li><a href="https://www.wlsnsw.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Women's Legal Service NSW</a></li>
        </ul>
      </div>
    </>
  ),

  'criminal-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Criminal Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        NSW criminal law operates under the Crimes Act 1900, Criminal Procedure Act 1986, and numerous other state and Commonwealth statutes. As Australia's most populous state, NSW has the largest criminal justice system with extensive court resources from the Local Court through to the Supreme Court. If you're facing criminal charges in NSW, experienced legal representation is essential.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding NSW Criminal Law</h3>
      <p>
        NSW criminal lawyers defend clients charged with offences ranging from traffic matters to serious indictable crimes. The NSW Local Court handles summary offences and committal hearings. The District Court hears mid-range indictable offences including assault, drug supply, and serious driving offences. The Supreme Court deals with the most serious crimes including murder, commercial drug importation, and complex fraud.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Common Criminal Matters</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drink Driving and Traffic Offences</h4>
      <p>
        NSW has strict drink driving laws with automatic licence suspensions and criminal records for most convictions. PCA (Prescribed Concentration of Alcohol) offences include low range (0.05-0.079), mid-range (0.08-0.149), and high range (0.15+), each carrying different penalties. Dangerous driving, police pursuits, and driving whilst disqualified are serious offences. Section 10 dismissals or conditional release orders may avoid convictions for first offenders. Traffic lawyers can challenge breath test procedures and apply for appeal licences.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Assault and Violence Offences</h4>
      <p>
        NSW assault charges range from common assault to assault occasioning actual bodily harm (AOABH) and grievous bodily harm (GBH). One-punch laws under s25A Crimes Act 1900 create mandatory minimum sentences for assaults causing death in intoxicated settings. Domestic violence assaults are prosecuted vigorously with ADVOs frequently imposed. Defences include self-defence under s418 Crimes Act, which requires the accused's conduct to be reasonable in the circumstances.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drug Offences</h4>
      <p>
        NSW drug offences under the Drug Misuse and Trafficking Act 1985 include possession, supply, deemed supply, cultivation, and manufacture. Quantities determine charges - commercial, large commercial, and trafficking quantities carry severe penalties. Cannabis Cautions provide diversion for first-time minor possession. Drug Court programs offer intensive rehabilitation for addicted offenders. Drug lawyers challenge police search powers, contest deemed supply presumptions, and negotiate penalties.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Fraud and White Collar Crime</h4>
      <p>
        Fraud offences in NSW include obtaining property by deception, identity theft, computer offences, and Centrelink fraud. The NSW Police Fraud and Cybercrime Squad investigates serious matters. Corporate fraud, ASIC prosecutions, and taxation offences require specialist defence lawyers. Restitution and cooperation can significantly impact sentencing.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Sexual Offences</h4>
      <p>
        Sexual assault charges in NSW carry maximum penalties of life imprisonment for aggravated offences. Child abuse material offences have increased with online investigations. The Sexual Assault Communications Privilege protects counselling communications. Complainant evidence is often given via CCTV. Historical sexual assault prosecutions are common. Specialist criminal lawyers with experience in sexual offence trials are essential.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights When Charged</h3>
      <p>
        NSW law provides strong rights to accused persons. You have the right to silence (Part 9 Division 3 Evidence Act), the right to contact a lawyer before police interview, and the right to have a support person present. Police must caution you before questioning. You're not required to participate in identification procedures or provide anything beyond identifying information. ERISP (Electronically Recorded Interview with Suspected Person) procedures must be followed.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Process in NSW</h3>
      <p>
        Most criminal matters start at the Local Court. Summary offences are heard entirely at the Local Court. Indictable offences may be dealt with summarily at the Local Court if the prosecution and defence agree. Otherwise, committal hearings test the prosecution case before trial at the District or Supreme Court. Sentence indication hearings allow judges to indicate likely sentences if you plead guilty.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Criminal Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Legal Aid NSW Criminal Law:</strong> 1300 888 529</li>
          <li><strong>Aboriginal Legal Service NSW/ACT:</strong> 1800 765 767</li>
          <li><strong>Law Access NSW (Legal Information):</strong> 1300 888 529</li>
          <li><strong>Youth Hotline (under 18):</strong> 1800 10 18 10</li>
          <li><strong>NSW Police Assistance Line:</strong> 131 444</li>
          <li><strong>Victims Services NSW:</strong> 1800 633 063</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Sentencing in NSW</h3>
      <p>
        NSW sentencing follows the Crimes (Sentencing Procedure) Act 1999. Penalties include Section 10 dismissals or conditional release orders (no conviction recorded), fines, Community Correction Orders (CCOs), Intensive Correction Orders (ICOs serving sentences in the community), and full-time imprisonment. Discounts apply for early guilty pleas - up to 25% for the earliest opportunity. Lawyers prepare character references, obtain psychological reports, and present rehabilitation evidence to minimize sentences.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Criminal Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.nsw.gov.au/law-and-justice/crimes-and-offences" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Government - Crimes and Offences</a></li>
          <li><a href="https://www.legalaid.nsw.gov.au/what-we-do/criminal-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid NSW - Criminal Law</a></li>
          <li><a href="https://www.localcourt.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Local Court</a></li>
          <li><a href="https://www.judcom.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Judicial Commission</a></li>
        </ul>
      </div>
    </>
  ),

  'property-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Property law in NSW operates under the Conveyancing Act 1919, Real Property Act 1900, and numerous other statutes. With Sydney's property market among the world's most valuable, NSW property transactions involve complex legal requirements. NSW property lawyers ensure smooth conveyancing, protect your interests, and navigate the unique aspects of NSW property law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Conveyancing in NSW</h3>
      <p>
        NSW conveyancing involves contract exchange, cooling-off period (for buyers - typically 5 business days), settlement, and registration. The standard NSW Law Society contract is commonly used. Electronic conveyancing through PEXA is mandatory for most transactions. NSW's transfer duty (stamp duty) is among Australia's highest, with concessions for first home buyers, pensioners, and off-the-plan purchases. Searches reveal council restrictions, environmental constraints, and any encumbrances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Residential Property Transactions</h3>
      <p>
        Buying property in NSW requires careful attention to vendor disclosure, building and pest inspections, and contractual terms. The cooling-off period allows buyers to withdraw (with 0.25% penalty). Sunset clauses in off-the-plan contracts protect buyers if completion is delayed. Sydney's high property prices make careful contract negotiation and legal advice essential. First home buyers can access stamp duty exemptions and the First Home Buyer Assistance scheme for properties under certain values.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">First Home Buyers in NSW</h4>
      <p>
        NSW offers generous first home buyer concessions including full stamp duty exemption for properties under $800,000 and partial exemption up to $1 million. The First Home Owner Grant provides $10,000 for new homes or substantially renovated homes. Regional NSW has additional benefits. The First Home Buyer Choice allows paying stamp duty or annual property tax. Your property lawyer ensures you receive all available concessions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Property</h3>
      <p>
        NSW commercial property transactions involve complex due diligence on leases, environmental issues, GST, and business operations. Commercial contracts have shorter timeframes and limited cooling-off rights. Lease assignments require landlord consent. Sydney CBD and commercial property markets have unique considerations including building classifications, heritage restrictions, and development potential. Commercial property lawyers conduct comprehensive due diligence and negotiate favourable terms.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Leasing and Tenancy</h3>
      <p>
        NSW residential tenancies are governed by the Residential Tenancies Act 2010. The NSW Civil and Administrative Tribunal (NCAT) resolves tenancy disputes including bond claims, repairs, and termination. Rental reforms provide greater protections for tenants including limits on rent increases and no-grounds evictions. Retail leases over five years must be registered. The Retail Leases Act 1994 provides minimum standards including disclosure statements and rent review provisions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Strata and Community Schemes</h3>
      <p>
        NSW strata law under the Strata Schemes Management Act 2015 governs most apartments and townhouses. Owners corporations manage common property, levy collection, and by-law enforcement. Strata reports disclose levy arrears, by-laws, major works, and disputes. Building defects in new strata developments are common, with builders' warranties and statutory warranties providing protection. NCAT resolves strata disputes including by-law disputes and building defects.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Development</h3>
      <p>
        Property development in NSW requires development consent from local councils under the Environmental Planning and Assessment Act 1979. The consent process involves assessing development against Local Environmental Plans (LEPs) and Development Control Plans (DCPs). Complex developments may require State Significant Development approval or planning agreements (VPAs). Construction certificates, occupation certificates, and subdivision certificates are required at various stages. Development lawyers coordinate applications, appeals to the Land and Environment Court, and compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Property Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Revenue NSW (Stamp Duty):</strong> 1300 139 814</li>
          <li><strong>NSW Fair Trading (Tenancy):</strong> 13 32 20</li>
          <li><strong>NSW Civil and Administrative Tribunal:</strong> 1300 006 228</li>
          <li><strong>Land Registry Services NSW:</strong> 1300 052 637</li>
          <li><strong>NSW Building Commissioner:</strong> 1300 305 695</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Disputes</h3>
      <p>
        Property disputes in NSW include boundary disputes, easement access, caveats, breach of contract, building defects, and strata conflicts. NCAT provides accessible resolution for lower-value disputes. The Supreme Court handles complex property litigation. The Land and Environment Court has specialist jurisdiction for planning, environmental, and valuation matters. Many disputes involve the Dividing Fences Act 1991 or Tree Disputes between Neighbours Act 2006. Experienced property lawyers resolve disputes through negotiation or litigation.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Property Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.nsw.gov.au/housing-and-construction/buying-and-selling-property" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Government - Buying and Selling Property</a></li>
          <li><a href="https://www.fairtrading.nsw.gov.au/housing-and-property" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Fair Trading - Housing and Property</a></li>
          <li><a href="https://www.revenue.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Revenue NSW</a></li>
          <li><a href="https://www.ncat.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Civil and Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'wills-estates': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Wills and Estates Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Wills and estates law in NSW is governed by the Succession Act 2006, Powers of Attorney Act 2003, and Guardianship Act 1987. Proper estate planning protects your assets, provides for loved ones, and minimizes disputes and tax. NSW wills and estates lawyers provide comprehensive advice on succession planning, estate administration, and contesting wills.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Will Drafting in NSW</h3>
      <p>
        A valid NSW will must be in writing, signed by the testator, and witnessed by two independent witnesses who also sign. Informal wills without proper execution can be admitted to probate in limited circumstances. Professional will drafting addresses complex family situations, business succession, asset protection, and tax planning. Testamentary trusts can protect beneficiaries from bankruptcy, relationship breakdowns, and provide tax benefits. Regular updates ensure wills reflect changed circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Estate Planning Strategies</h3>
      <p>
        Comprehensive estate planning in NSW includes wills, enduring guardianship appointments, powers of attorney, advance care directives, and superannuation binding death benefit nominations. Proper planning minimizes family provision claims, provides for disabled beneficiaries through special disability trusts, and structures inheritances to protect from creditors. NSW's high property values make estate planning particularly important for asset protection and tax efficiency.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Probate and Estate Administration</h3>
      <p>
        Probate is the Supreme Court's recognition of a will's validity, granting executors authority to administer the estate. NSW executors must collect assets, pay debts and taxes, advertise for creditors, prepare estate accounts, and distribute to beneficiaries. Small estates under $250,000 with only one beneficiary may not require probate. The process involves obtaining death certificates, searching for wills, identifying assets and liabilities, and obtaining asset valuations. Lawyers ensure executors comply with their duties and protect them from personal liability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intestacy in NSW</h4>
      <p>
        When someone dies without a valid will, intestacy rules under Chapter 4 Succession Act determine distribution. Spouses receive priority, with specific provisions for children. The intestacy formula depends on family composition - spouse only, spouse and children, or children only. De facto partners have the same rights as married spouses. The NSW Trustee & Guardian may be appointed administrator if no family member applies. Intestacy often results in unintended outcomes and family disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contesting Wills and Family Provision Claims</h3>
      <p>
        NSW's family provision regime under Chapter 3 Succession Act allows eligible persons to apply for greater provision from an estate. Eligible persons include spouses, children (including adult children), former spouses, dependents, and certain domestic relationships. Applications must be filed within 12 months of death. The Court considers financial resources, health, relationship with the deceased, contributions to the estate, and any provision already made. Successful claims can significantly alter inheritance distributions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Powers of Attorney</h3>
      <p>
        NSW recognizes general powers of attorney (for specific purposes or periods) and enduring powers of attorney (continuing after loss of capacity). Enduring powers must be properly executed with witnesses and can cover financial and property matters. Attorneys must act in the principal's best interests, keep proper records, and avoid conflicts of interest. The NSW Civil and Administrative Tribunal can review attorney conduct and suspected abuse. Registration with Land Registry Services NSW is required for some property transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Enduring Guardianship and Advance Care Directives</h3>
      <p>
        Enduring guardians make personal, lifestyle, and health decisions if you lose capacity. Appointments must be made while you have capacity and witnessed appropriately. Advance care directives document your wishes for medical treatment including end-of-life decisions. These are legally binding on health practitioners. NSW's Guardianship Division of NCAT can appoint guardians if you lose capacity without valid appointments, and review guardian decisions.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Wills & Estates Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>NSW Supreme Court (Probate Registry):</strong> (02) 9230 8111</li>
          <li><strong>NSW Trustee & Guardian:</strong> 1300 364 103</li>
          <li><strong>Office of the Public Guardian:</strong> 1800 451 510</li>
          <li><strong>Legal Aid NSW (Wills):</strong> 1300 888 529</li>
          <li><strong>Law Society of NSW - Will search:</strong> (02) 9926 0156</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Guardianship and Financial Management</h3>
      <p>
        NCAT's Guardianship Division can appoint guardians for personal decisions and financial managers for financial decisions when adults lose capacity without valid appointments. The NSW Trustee & Guardian or private professional guardians/managers may be appointed. NCAT can review decisions and make orders protecting vulnerable adults from abuse. Applications are free and NCAT operates less formally than courts.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Wills & Estates Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.nsw.gov.au/life-events/plan-your-will-and-estate" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Government - Wills and Estates</a></li>
          <li><a href="https://www.tag.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Trustee & Guardian</a></li>
          <li><a href="https://www.opg.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Public Guardian</a></li>
          <li><a href="https://www.ncat.nsw.gov.au/ncat/how-ncat-works/ncat-divisions/guardianship-division.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NCAT Guardianship Division</a></li>
        </ul>
      </div>
    </>
  ),

  'employment-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Employment Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Employment law in NSW operates primarily under federal legislation including the Fair Work Act 2009, with state-based workers compensation and work health and safety laws. As Australia's largest employment market, NSW has extensive resources for resolving workplace disputes, unfair dismissals, and discrimination claims. Employment lawyers protect employee and employer rights in this complex regulatory environment.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Employment Law in NSW</h3>
      <p>
        Most NSW employment matters fall under the federal Fair Work system, covering minimum entitlements, working conditions, unfair dismissal, and general protections. However, NSW state laws govern workers compensation through icare, work health and safety under the Work Health and Safety Act 2011, and public sector employment. The NSW Industrial Relations Commission handles some state award matters and public sector disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Unfair Dismissal Claims</h3>
      <p>
        Employees dismissed from their position may file unfair dismissal applications with the Fair Work Commission if they've served the minimum employment period (six months for small businesses, 12 months for larger employers) and earn below the high income threshold. Applications must be lodged within 21 days of dismissal. NSW employment lawyers assess dismissal fairness, prepare applications, and represent clients at conferences and hearings. Remedies include reinstatement or compensation up to six months' wages.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">General Protections Claims</h4>
      <p>
        General protections prohibit adverse action for exercising workplace rights, union membership, discrimination, or sham contracting. These claims have 60-day time limits but can result in uncapped compensation. NSW has significant case law on general protections, particularly regarding discrimination and dismissals related to temporary absence. Anti-bullying applications can be made to the Fair Work Commission while still employed.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Discrimination and Harassment</h3>
      <p>
        NSW's Anti-Discrimination Act 1977 prohibits discrimination based on age, sex, pregnancy, disability, race, and other protected attributes. The NSW Anti-Discrimination Board investigates complaints and attempts conciliation. Unresolved matters proceed to the NSW Civil and Administrative Tribunal. Federal discrimination laws also apply through the Australian Human Rights Commission. Sexual harassment claims have increased following legislative reforms and #MeToo movement awareness.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Employment Contracts and Agreements</h3>
      <p>
        Employment lawyers review and draft employment contracts, executive agreements, restraint of trade clauses, confidentiality agreements, and enterprise agreements. NSW courts have extensive jurisprudence on restraint of trade enforceability, requiring restraints to protect legitimate business interests and be reasonable in scope, duration, and geography. Post-employment restraints are frequently litigated in NSW Supreme Court.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers' Compensation</h3>
      <p>
        icare (Insurance & Care NSW) administers workers compensation for most NSW workers. Claims cover medical expenses, weekly payments, lump sum compensation for permanent impairment, and common law damages for work injuries. NSW workers can pursue common law damages for injuries caused by employer negligence where whole person impairment exceeds 15% (or for psychological injuries, the injury must be severe). Time limits apply - workers compensation claims should be lodged promptly, common law claims within three years.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Redundancy and Restructuring</h3>
      <p>
        Redundancy in NSW requires the position to be genuinely redundant. Large-scale redundancies may require consultation under the Fair Work Act. Redundancy pay depends on years of service. NSW employees can challenge sham redundancies or unfair selection processes. Public sector redundancies in NSW have specific provisions under the Government Sector Employment Act 2013. Employment lawyers ensure proper processes and maximum entitlements.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Employment Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Fair Work Commission:</strong> 1300 799 675</li>
          <li><strong>Fair Work Ombudsman:</strong> 13 13 94</li>
          <li><strong>NSW Anti-Discrimination Board:</strong> 1800 670 812</li>
          <li><strong>icare (Workers Compensation):</strong> 13 44 22</li>
          <li><strong>SafeWork NSW:</strong> 13 10 50</li>
          <li><strong>NSW Industrial Relations Commission:</strong> (02) 9230 8400</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Bullying and Safety</h3>
      <p>
        The Fair Work Commission handles workplace bullying applications under federal jurisdiction. SafeWork NSW enforces work health and safety laws, including psychosocial hazards and bullying. NSW employers must provide safe systems of work and address workplace bullying. Workers compensation claims for psychological injury from workplace bullying are common. Employment lawyers advise on prevention, responding to complaints, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Employment Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.fairwork.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a></li>
          <li><a href="https://www.antidiscrimination.justice.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Anti-Discrimination Board</a></li>
          <li><a href="https://www.safework.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SafeWork NSW</a></li>
          <li><a href="https://www.icare.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">icare NSW</a></li>
        </ul>
      </div>
    </>
  ),

  'personal-injury': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Personal Injury Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Personal injury law in NSW helps victims of accidents and negligence obtain compensation. NSW operates comprehensive compensation schemes including Compulsory Third Party (CTP) insurance for motor accidents, workers compensation, public liability, and medical negligence under the Civil Liability Act 2002. Experienced NSW personal injury lawyers navigate these schemes to maximize your compensation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Motor Vehicle Accidents</h3>
      <p>
        NSW's CTP Green Slip scheme provides compensation for injuries in motor vehicle accidents. The Motor Accidents Injuries Act 2017 creates a statutory benefits scheme providing treatment, care, and lost income support regardless of fault. For more serious injuries exceeding the permanent impairment threshold, damages claims provide compensation for economic loss, gratuitous care, and non-economic loss (pain and suffering). Claims must be lodged with the insurer within specific timeframes, with late notice potentially barring claims.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Statutory Benefits and Damages</h4>
      <p>
        All injured persons receive statutory benefits for medical treatment (up to 26 weeks), income replacement, and care for the first 26 weeks. Extended benefits apply for injuries meeting certain thresholds. Damages claims require whole person impairment over 10% (or "minor injury" soft tissue injuries cannot claim non-economic loss). The State Insurance Regulatory Authority (SIRA) regulates the scheme. Personal injury lawyers ensure maximum statutory benefits and damages.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Medical Negligence</h3>
      <p>
        Medical negligence claims in NSW arise from substandard medical care causing injury. This includes misdiagnosis, surgical errors, medication mistakes, birth injuries, and failure to warn of risks. NSW public hospitals are covered by the NSW Treasury Managed Fund, while private practitioners have professional indemnity insurance. The Civil Liability Act 2002 imposes specific requirements for expert evidence and modified causation tests. Time limits are generally three years from awareness of negligence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public Liability Claims</h3>
      <p>
        Public liability claims compensate injuries on another person's property or due to their negligence. Common claims include slip and fall in shopping centres, council property injuries, dog attacks, and defective products. NSW's Civil Liability Act 2002 requires proving breach of duty of care and causation. Contributory negligence reduces compensation if you were partly at fault. Dangerous recreational activities may have limited liability. Personal injury lawyers investigate liability, obtain evidence, and negotiate with insurers.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Work Injury Compensation</h3>
      <p>
        NSW workers injured at work claim workers compensation through icare for medical expenses, weekly payments, and permanent impairment lump sums. For injuries with whole person impairment exceeding 15%, common law damages claims against employers provide significantly higher compensation. Psychological injury claims require employment being the "main contributing factor." Time limits are strict - claims should be lodged promptly, common law within three years. Specialist lawyers assess both statutory and common law entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Total and Permanent Disability (TPD)</h3>
      <p>
        TPD insurance, usually held through superannuation, pays lump sums to workers unable to work due to injury or illness. NSW has high volumes of TPD claims, with insurers frequently denying legitimate claims. Disputes involve medical evidence, policy interpretation, and TPD definitions. The Australian Financial Complaints Authority (AFCA) handles complaints against insurers. TPD lawyers represent claimants and appeal denied claims.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dust Diseases and Asbestos</h3>
      <p>
        NSW workers exposed to asbestos, silica, or other harmful dusts can develop serious diseases decades later. The Dust Diseases Tribunal provides specialist jurisdiction for asbestos-related claims including mesothelioma, asbestosis, and lung cancer. icare Dust Diseases Care administers statutory benefits. Common law claims can be brought against former employers and asbestos product manufacturers. Time limits are extended for dust diseases due to long latency periods. Specialist asbestos lawyers trace exposure history and maximize compensation.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Personal Injury Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>State Insurance Regulatory Authority (SIRA):</strong> 1300 656 919</li>
          <li><strong>icare (Workers Compensation):</strong> 13 44 22</li>
          <li><strong>Health Care Complaints Commission:</strong> 1800 043 159</li>
          <li><strong>Legal Aid NSW:</strong> 1300 888 529</li>
          <li><strong>Dust Diseases Tribunal:</strong> (02) 9230 8482</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Personal Injury Commission</h3>
      <p>
        The NSW Personal Injury Commission handles disputes arising from motor accidents, workers compensation, and dust diseases. It replaced the Workers Compensation Commission, Motor Accidents Authority dispute resolution, and Dust Diseases Tribunal as a one-stop tribunal. The Commission operates less formally than courts, with medical assessments by independent experts. Most claims settle at pre-filing or early conciliation stages.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Personal Injury Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.sira.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Insurance Regulatory Authority</a></li>
          <li><a href="https://www.icare.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">icare NSW</a></li>
          <li><a href="https://www.pi.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Personal Injury Commission</a></li>
          <li><a href="https://www.hccc.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Health Care Complaints Commission</a></li>
        </ul>
      </div>
    </>
  ),

  'business-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Business Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Business and commercial law in NSW encompasses company formation, contracts, mergers and acquisitions, commercial disputes, and regulatory compliance. As Australia's largest business centre, NSW has sophisticated commercial legal services. NSW business lawyers provide strategic advice for startups through to ASX-listed companies, protecting commercial interests and achieving business objectives.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Formation and Structure</h3>
      <p>
        Choosing the right business structure is fundamental. Options include sole trader, partnership, company, or trust structures. NSW businesses must comply with the federal Corporations Act 2001 for companies, register business names with ASIC, and obtain necessary NSW licenses. Business lawyers advise on optimal structures considering tax efficiency, asset protection, liability limitation, and succession planning. They prepare company constitutions, shareholders agreements, and partnership agreements to prevent disputes and protect rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Contracts</h3>
      <p>
        Well-drafted commercial contracts protect business interests and prevent costly disputes. NSW commercial lawyers prepare and review supply agreements, distribution contracts, service agreements, licensing deals, and terms and conditions. Contracts must comply with Australian Consumer Law, include appropriate dispute resolution clauses, allocate risks fairly, and protect intellectual property. NSW law governs many national commercial contracts due to Sydney's commercial dominance.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Australian Consumer Law Compliance</h4>
      <p>
        The Australian Consumer Law prohibits misleading conduct, unconscionable conduct, and unfair contract terms. NSW Fair Trading and the ACCC enforce consumer law, with penalties reaching millions of dollars. High-profile NSW cases have shaped consumer law interpretation. Businesses must provide consumer guarantees on goods and services. Lawyers ensure marketing materials, website terms, and business practices comply with consumer law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mergers and Acquisitions</h3>
      <p>
        Sydney's position as Australia's financial capital means NSW lawyers handle many of Australia's largest M&A transactions. Buying or selling businesses involves complex legal due diligence, contract negotiation, and regulatory approvals. Transactions may be structured as share sales or asset sales, each with different tax and liability implications. Due diligence examines financial records, contracts, intellectual property, employment matters, environmental issues, and regulatory compliance. For larger transactions, ACCC merger clearance or FIRB approval may be required.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Sales and Purchases</h3>
      <p>
        NSW business sales require careful attention to goodwill valuation, stock takes, lease assignments, employee transfers under Transfer of Business provisions, and vendor warranties. Restraints of trade prevent vendors from competing, with NSW courts applying strict enforceability tests. Business sale lawyers conduct due diligence, negotiate sale agreements, and manage settlement. Disclosure obligations are significant, with vendors liable for non-disclosure of material matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Disputes</h3>
      <p>
        Commercial disputes in NSW include breach of contract, partnership disputes, shareholder oppression, debt recovery, and trade practices claims. The NSW Supreme Court has a Commercial List providing specialist judges and streamlined procedures for complex commercial cases. Arbitration and mediation are common, with the Australian Centre for International Commercial Arbitration (ACICA) and Resolution Institute providing dispute resolution services. Commercial litigation lawyers protect interests and pursue cost-effective resolutions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Franchising</h3>
      <p>
        NSW has significant franchise activity with many national franchise systems headquartered in Sydney. The Franchising Code of Conduct requires disclosure documents, cooling-off periods, and good faith obligations. Franchise disputes involve breach of franchise agreement, territorial encroachment, and franchisor obligations. Lawyers advise franchisors on system documentation and assist franchisees with reviewing agreements and resolving disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Partnership Agreements</h3>
      <p>
        NSW partnerships are governed by the Partnership Act 1892 and partnership agreements. Professional services firms including law firms, medical practices, and accounting firms commonly use partnership structures. Well-drafted partnership agreements address profit sharing, decision-making, capital contributions, admission and retirement of partners, and dispute resolution. Business lawyers prepare comprehensive agreements preventing costly partnership disputes.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Business Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Service NSW (Business):</strong> 13 77 88</li>
          <li><strong>NSW Fair Trading:</strong> 13 32 20</li>
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Australian Competition and Consumer Commission (ACCC):</strong> 1300 302 502</li>
          <li><strong>NSW Small Business Commissioner:</strong> 1300 795 534</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Business Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.service.nsw.gov.au/business" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Service NSW - Business</a></li>
          <li><a href="https://www.fairtrading.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Fair Trading</a></li>
          <li><a href="https://www.smallbusiness.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Small Business Commissioner</a></li>
          <li><a href="https://asic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC</a></li>
        </ul>
      </div>
    </>
  ),

  'immigration-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Immigration Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Immigration to Australia is governed by federal legislation including the Migration Act 1958, administered by the Department of Home Affairs. Sydney is Australia's largest immigrant destination, attracting skilled workers, students, family reunion migrants, and refugees. Registered Migration Agents and immigration lawyers help navigate the complex visa system and maximize success prospects.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Applications in NSW</h3>
      <p>
        Australia offers numerous visa categories including temporary work visas, permanent residence, student visas, visitor visas, protection visas, and partner visas. Each has specific eligibility criteria, documentation requirements, and processing times. Sydney's diverse economy creates opportunities for skilled migrants in finance, technology, healthcare, education, and professional services. Immigration lawyers assess eligibility, prepare comprehensive applications, and address compliance issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Skilled Migration</h3>
      <p>
        Skilled migration pathways include General Skilled Migration (independent skilled visas), employer-sponsored visas, and NSW state nomination through the NSW Skilled Occupation List. NSW offers state nomination for skilled workers in priority occupations, with separate streams for Sydney and regional NSW. Points-tested visas require occupation assessment, English language proficiency, age criteria, and work experience. Migration agents help maximize points scores and navigate skilled migration complexities.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Regional Migration in NSW</h4>
      <p>
        Regional NSW including Newcastle, Wollongong, and the Illawarra region offers additional migration pathways through regional skilled visas and regional sponsorship. These programs have more flexible requirements and faster processing. Regional migrants must commit to living and working in designated regional areas for specified periods. The Regional NSW program actively attracts skilled migrants to address regional skill shortages.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Family Migration</h3>
      <p>
        Family reunion visas allow Australian citizens and permanent residents in NSW to sponsor overseas family members. Partner visas (spouse and de facto) are most common, involving onshore and offshore pathways. Temporary partner visas lead to permanent residence after two years. Relationship evidence is critical including financial aspects, household matters, social recognition, and commitment. Parent visas have long processing times and substantial costs. Immigration lawyers compile evidence and address visa refusals.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business and Investment Migration</h3>
      <p>
        NSW welcomes business migrants through Business Innovation and Investment Program visas. Sydney's position as Australia's financial capital attracts significant business migration. NSW offers state nomination for business migrants meeting investment and turnover requirements. The Significant Investor visa requires $5 million investment in complying investments. Business migrants must demonstrate successful business history and commitment to NSW economic development. Migration lawyers advise on business structuring and nomination applications.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Student Visas</h3>
      <p>
        NSW has Australia's largest international student population across universities including UNSW, Sydney University, UTS, Macquarie, and numerous private colleges. Student visa requirements include enrollment in CRICOS-registered courses, Genuine Temporary Entrant criteria, financial capacity, and health insurance (OSHC). Student visa holders have work rights and pathways to permanent residence through post-study work visas and skilled migration. Education agents and migration lawyers assist with visa compliance and post-study planning.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Refusals and Appeals</h3>
      <p>
        Visa refusals can be challenged through Administrative Review Tribunal (ART) review. Time limits are strict - generally 21 days for visa decisions. Appeals involve hearings before tribunal members where applicants present evidence and submissions. Merits review allows reconsideration based on law and evidence. The Federal Court hears judicial review applications for jurisdictional error. Migration lawyers represent clients at tribunal hearings and prepare comprehensive submissions addressing refusal reasons.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Deportation and Removal</h3>
      <p>
        Visa cancellation can occur for character reasons under s501, compliance breaches, or providing false information. NSW has significant detention facilities at Villawood Immigration Detention Centre. Character cancellations apply to persons with substantial criminal records. Cancellation can be challenged through revocation requests or tribunal review. Ministerial intervention provides last resort relief in compelling cases. Deportation has serious consequences including re-entry bans. Urgent legal advice is essential.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Protection Visas and Refugees</h3>
      <p>
        NSW, particularly Sydney, receives many asylum seekers and refugees. Protection visa applications must demonstrate well-founded fear of persecution for Convention reasons (race, religion, nationality, political opinion, or particular social group). Fast Track assessment applies to certain applicants. The Refugee Review Tribunal (now ART) reviews refusals. NSW has extensive refugee support services and legal aid for asylum seekers. Immigration lawyers represent protection visa applicants through complex assessment processes.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Immigration Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Home Affairs:</strong> 131 881</li>
          <li><strong>Refugee Advice & Casework Service (RACS):</strong> (02) 8234 0700</li>
          <li><strong>Immigration Advice and Rights Centre:</strong> (02) 8234 0700</li>
          <li><strong>Migration Agents Registration Authority (MARA):</strong> (07) 3360 3700</li>
          <li><strong>Legal Aid NSW (Immigration):</strong> 1800 733 944</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Immigration Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://immi.homeaffairs.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Home Affairs</a></li>
          <li><a href="https://www.racs.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Refugee Advice & Casework Service</a></li>
          <li><a href="https://www.mara.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Migration Agents Registration Authority</a></li>
          <li><a href="https://iarc.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Immigration Advice and Rights Centre</a></li>
        </ul>
      </div>
    </>
  ),

  'litigation': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Litigation and Dispute Resolution in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Litigation in NSW involves resolving disputes through the court system including the Local Court, District Court, Supreme Court, and specialist tribunals. As Australia's largest legal jurisdiction, NSW has sophisticated litigation infrastructure and extensive case law. Litigation lawyers protect your interests through negotiation, mediation, arbitration, or court proceedings.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding NSW Courts</h3>
      <p>
        NSW's civil court hierarchy starts with the Local Court handling claims up to $100,000 ($20,000 in Small Claims Division). The District Court has jurisdiction for claims $100,001 to $750,000. The Supreme Court hears claims over $750,000 and has unlimited jurisdiction. The NSW Civil and Administrative Tribunal (NCAT) provides accessible justice for administrative, consumer, and tenancy disputes. Choosing the appropriate court and understanding its rules is critical for success.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Civil Litigation</h3>
      <p>
        Civil litigation in NSW encompasses breach of contract, negligence, defamation, estate disputes, and various civil wrongs. The Uniform Civil Procedure Rules 2005 govern NSW court procedures. Litigation involves pleadings (statement of claim and defence), discovery of documents, evidence, settlement negotiations, and trial. NSW courts emphasize case management and early resolution through mediation. Legal costs often exceed the amount in dispute, making cost-benefit analysis essential.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Litigation</h3>
      <p>
        Sydney is Australia's commercial litigation centre. The Supreme Court Commercial List handles complex commercial disputes with specialist judges and streamlined procedures. Common disputes include breach of contract, partnership disputes, shareholder oppression, insolvency matters, and trade practices claims. Commercial litigation often involves substantial documentation, expert witnesses, and significant legal costs. Many commercial contracts mandate arbitration or expert determination before litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Alternative Dispute Resolution</h3>
      <p>
        Alternative Dispute Resolution (ADR) includes mediation, arbitration, expert determination, and early neutral evaluation. NSW courts actively encourage ADR, with mandatory mediation referrals common. Private mediators facilitate confidential settlement negotiations. The Australian Centre for International Commercial Arbitration (ACICA) and Australian Disputes Centre provide institutional arbitration. ADR is particularly effective for commercial disputes, building disputes, and family provision claims where relationships matter.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">NSW Community Justice Centres</h4>
      <p>
        Community Justice Centres provide free mediation services for disputes including neighbourhood conflicts, minor civil claims, and workplace issues. These government-funded services help resolve disputes without legal proceedings. Commercial mediation through private mediators involves fees but can save substantial litigation costs. Litigation lawyers advise when ADR is appropriate and represent clients in mediation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Recovery</h3>
      <p>
        Debt recovery litigation in NSW involves demand letters, statement of claim, default judgment, and enforcement through garnishee orders, writs of execution, or bankruptcy. The Local Court handles most debt recovery matters through the Statement of Claim process. Disputed debts proceed to defended hearings. Enforcement options include examination summons to discover assets, and appointing sheriffs to seize property. Creditors must comply with debt collection laws and avoid prohibited conduct.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Building and Construction Disputes</h3>
      <p>
        Construction disputes in NSW involve defective work, payment disputes, variations, delays, and contract termination. The Building and Construction Industry Security of Payment Act 1999 provides rapid adjudication of payment disputes. Adjudication determines payment disputes within 10-15 business days. Larger disputes proceed through NCAT, District Court, or Supreme Court Technology and Construction List. Expert evidence on building standards and costs is critical.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Defamation</h3>
      <p>
        NSW defamation law under the Defamation Act 2005 has significant case law development, particularly regarding social media and online defamation. Defamation involves publishing false statements damaging reputation. Defences include truth, honest opinion, qualified privilege, and public interest. Concerns notices must precede proceedings, allowing settlement opportunities. The serious harm threshold must be met. Defamation proceedings must start within one year. Sydney is frequently chosen for defamation litigation due to specialist judges.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Litigation Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>NSW Courts:</strong> (02) 9230 8111</li>
          <li><strong>NSW Civil and Administrative Tribunal:</strong> 1300 006 228</li>
          <li><strong>Community Justice Centres:</strong> 1800 990 777</li>
          <li><strong>Law Society of NSW:</strong> (02) 9926 0333</li>
          <li><strong>Legal Aid NSW:</strong> 1300 888 529</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Litigation Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.courts.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Courts</a></li>
          <li><a href="https://www.ncat.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.cjc.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Community Justice Centres NSW</a></li>
          <li><a href="https://www.lawsociety.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Law Society of NSW</a></li>
        </ul>
      </div>
    </>
  ),

  'bankruptcy-insolvency': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Bankruptcy and Insolvency Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Bankruptcy and insolvency laws help individuals and businesses manage overwhelming debt. Governed by federal legislation including the Bankruptcy Act 1966 and Corporations Act 2001, these processes provide structured debt solutions. NSW has Australia's highest volume of insolvency matters. NSW insolvency lawyers advise on bankruptcy alternatives, navigate insolvency proceedings, and protect creditors' rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Personal Bankruptcy</h3>
      <p>
        Bankruptcy is a legal process where individuals unable to pay debts are declared bankrupt. It can be voluntary (debtor's petition) or involuntary (creditor's petition). Bankruptcy typically lasts three years but can extend to eight years for non-compliance. A trustee takes control of the bankrupt's assets (except protected items), sells non-exempt property, and distributes proceeds to creditors. Bankruptcy provides relief from debt collection and harassment but has serious consequences including travel restrictions, employment limitations, and credit history impacts.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternatives to Bankruptcy</h4>
      <p>
        Before bankruptcy, explore debt agreements (Part IX), personal insolvency agreements (Part X), and informal arrangements with creditors. Debt agreements allow paying a proportion of debts over time, avoiding bankruptcy's severe consequences. Personal insolvency agreements are more flexible, negotiated individually with creditors. Both require registered trustees. NSW financial counsellors and insolvency lawyers assess which option suits your circumstances and financial capacity.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Corporate Insolvency</h3>
      <p>
        Companies facing financial difficulty have several insolvency options. Voluntary administration allows an independent administrator to investigate the company's affairs and recommend to creditors whether to liquidate, execute a deed of company arrangement, or return to directors' control. Liquidation involves appointing a liquidator to realize assets and distribute to creditors according to statutory priorities. Receivership occurs when secured creditors appoint receivers over charged assets. Each process serves different purposes and produces different outcomes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Liquidation</h3>
      <p>
        Liquidation ends a company's existence. It can be voluntary (members' or creditors') or court-ordered through winding up applications to the Supreme Court. The liquidator investigates the company's affairs, recovers assets, examines director conduct, and distributes proceeds to creditors according to priority. Employees have statutory priority for unpaid wages and superannuation. Directors can face personal liability for insolvent trading - incurring debts when the company cannot pay them. NSW insolvency lawyers advise directors on duties and potential liabilities.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Voluntary Administration</h3>
      <p>
        Voluntary administration provides breathing space for struggling companies. Directors appoint an administrator who convenes meetings of creditors to decide the company's future. A Deed of Company Arrangement (DOCA) can allow the company to continue trading while repaying creditors over time. Administration provides a statutory moratorium preventing creditor action. It's used when companies have restructuring prospects or a DOCA could return better outcomes than immediate liquidation. NSW has high volumes of voluntary administrations due to its large business population.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Agreements</h3>
      <p>
        Part IX debt agreements are formal bankruptcy alternatives for individuals with regular income and unsecured debts under statutory limits (currently $127,068.90). Debtors propose paying creditors a portion of debts over time, typically three to five years. If creditors representing 50% in value accept, all unsecured creditors are bound. Debt agreements avoid bankruptcy but appear on the National Personal Insolvency Index and affect credit ratings. They suit people who can make regular payments but cannot pay debts in full.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Bankruptcy and Insolvency Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Financial Security Authority (AFSA):</strong> 1300 364 785</li>
          <li><strong>National Debt Helpline:</strong> 1800 007 007</li>
          <li><strong>Financial Counselling NSW:</strong> 1800 007 007</li>
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Australian Restructuring Insolvency & Turnaround Association:</strong> (02) 9290 5700</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Creditors' Rights</h3>
      <p>
        Creditors protect their interests through security agreements, guarantees, and timely debt recovery. When debtors become insolvent, secured creditors have priority over unsecured creditors. Unsecured creditors can issue bankruptcy notices or creditor's petitions against individuals, or apply to wind up companies through Supreme Court applications. Proving debts in insolvency administrations is essential to receive distributions. Creditors can challenge voidable transactions including unfair preferences, uncommercial transactions, and unreasonable director-related transactions. Insolvency lawyers represent creditors in administrations and recovery litigation.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Bankruptcy and Insolvency Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.afsa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Financial Security Authority</a></li>
          <li><a href="https://ndh.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">National Debt Helpline</a></li>
          <li><a href="https://arita.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ARITA</a></li>
          <li><a href="https://asic.gov.au/regulatory-resources/insolvency/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC - Insolvency Information</a></li>
        </ul>
      </div>
    </>
  ),

  'intellectual-property': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Intellectual property (IP) protects creations of the mind including inventions, artistic works, designs, brands, and trade secrets. Australian IP law is primarily federal, administered by IP Australia. Sydney is Australia's IP centre with the Federal Court's IP jurisdiction and extensive IP legal services. NSW businesses and creators need IP lawyers to protect, commercialise, and enforce intellectual property rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trademark Law</h3>
      <p>
        Trademarks identify and distinguish goods and services from competitors. They can be words, logos, sounds, colours, shapes, or scents. Registration through IP Australia provides exclusive rights to use the trademark for registered classes throughout Australia. NSW businesses should register trademarks before use to prevent others registering identical or similar marks. The registration process involves searching existing trademarks, filing applications, examination by IP Australia, and potential opposition. Registered trademarks last 10 years and can be renewed indefinitely.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Trademark Enforcement</h4>
      <p>
        Trademark owners can take legal action against infringing use through cease and desist letters, Federal Court litigation, or Australian Consumer Law claims for misleading conduct. The Federal Court in Sydney handles most significant trademark litigation in Australia. Remedies include injunctions, damages, account of profits, and corrective advertising. Online trademark infringement through domain names, social media handles, and e-commerce platforms is increasingly common. IP lawyers enforce trademark rights and defend infringement claims.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Copyright Law</h3>
      <p>
        Copyright automatically protects original literary, dramatic, musical, and artistic works, as well as films, sound recordings, and broadcasts. No registration is required in Australia. Copyright generally lasts 70 years after the creator's death for original works. NSW creators, artists, authors, software developers, and content creators rely on copyright protection. Copyright licenses allow others to use works while retaining ownership. Moral rights protect authors' reputation and connection to their works, preventing derogatory treatment.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Copyright Infringement</h4>
      <p>
        Copyright infringement occurs when someone reproduces, communicates, adapts, or performs protected works without permission. Common issues include software piracy, image theft, music downloading, and plagiarism. Fair dealing exceptions allow limited use for research, criticism, news reporting, parody, and satire. Copyright owners can seek injunctions, damages, additional damages for flagrant infringement, and account of profits. The Copyright Tribunal determines licensing disputes. NSW businesses should ensure all used content is licensed or owned.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Patent Law</h3>
      <p>
        Patents protect inventions that are novel, inventive, and useful. Standard patents last 20 years; innovation patents (now abolished for new applications after August 2021) lasted 8 years. NSW has significant innovation in technology, medical devices, pharmaceuticals, and engineering. Patent applications require detailed specifications and claims defining the invention's scope. Examination assesses novelty and inventiveness against prior art worldwide. Patents are expensive but provide strong protection for commercially valuable inventions. Patent lawyers draft applications, prosecute examinations, and enforce patent rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trade Secrets and Confidential Information</h3>
      <p>
        Trade secrets include formulas, processes, customer lists, algorithms, and business methods kept confidential. Unlike patents or trademarks, trade secrets don't require registration but rely on confidentiality measures. NSW businesses protect trade secrets through non-disclosure agreements, employment contracts with confidentiality clauses, restricted access, and digital security. Legal action for breach of confidence can restrain disclosure and claim damages. NSW courts have developed significant equitable principles protecting confidential information.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Design Rights</h3>
      <p>
        Registered designs protect the visual appearance of products including shape, configuration, pattern, and ornamentation. Registration lasts 10 years and requires novelty and distinctiveness. NSW designers of furniture, fashion, industrial products, packaging, and consumer goods benefit from design registration. Unregistered designs receive limited automatic protection for two years. Design registration is quicker and cheaper than patents while providing strong protection for aesthetic features of products.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Commercialisation</h3>
      <p>
        Intellectual property can be commercialised through licensing, franchising, merchandising, joint ventures, and assignment. License agreements allow others to use IP in exchange for royalties or fees. Exclusive licenses grant rights to one party; non-exclusive licenses allow multiple licensees. IP lawyers draft agreements addressing territory, duration, royalties, quality control, improvements, and termination. NSW businesses, particularly technology startups and creative industries, monetise IP assets while retaining ownership through strategic licensing.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Intellectual Property Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>IP Australia:</strong> 1300 65 10 10</li>
          <li><strong>Australian Copyright Council:</strong> (02) 9101 2377</li>
          <li><strong>Copyright Agency:</strong> 1800 066 844</li>
          <li><strong>Federal Court of Australia (Sydney):</strong> (02) 9230 8567</li>
          <li><strong>Law Society of NSW - IP Specialists:</strong> (02) 9926 0333</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Intellectual Property Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ipaustralia.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IP Australia</a></li>
          <li><a href="https://www.copyright.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Copyright Council</a></li>
          <li><a href="https://www.business.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business NSW</a></li>
          <li><a href="https://www.fedcourt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Federal Court of Australia</a></li>
        </ul>
      </div>
    </>
  ),

  'tax-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Tax Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Australian taxation is governed by federal legislation administered by the Australian Taxation Office (ATO). NSW taxpayers and businesses navigate income tax, GST, capital gains tax, fringe benefits tax, and various state taxes including payroll tax, land tax, and transfer duty. Sydney is Australia's tax centre with major accounting firms and tax lawyers providing advice on tax planning, compliance, disputes, and structuring.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Income Tax</h3>
      <p>
        Income tax applies to individuals, companies, trusts, and partnerships on assessable income. NSW residents pay federal income tax with rates depending on income levels and entity types. Individuals receive tax-free thresholds and marginal rates up to 45% plus Medicare Levy. Companies pay 25% or 30% depending on size. Tax lawyers advise on minimising tax through legitimate deductions, offsets, and concessions including small business CGT concessions, research and development tax incentives, and investment property deductions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Goods and Services Tax (GST)</h3>
      <p>
        GST is a 10% tax on most goods and services sold in Australia. NSW businesses with turnover exceeding $75,000 ($150,000 for non-profits) must register for GST. Registered businesses charge GST on taxable supplies, claim input tax credits on business purchases, and lodge Business Activity Statements (BAS) reporting GST collected and paid. Some supplies are GST-free (food, health, education) or input-taxed (financial services, residential rent). Tax advisors ensure correct GST treatment, avoiding costly errors and ATO disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Disputes</h3>
      <p>
        Tax disputes arise from ATO audits, amended assessments, transfer pricing adjustments, denied deductions, or R&D claims. NSW taxpayers can object to assessments within prescribed timeframes, typically two or four years depending on the tax type. Unresolved objections can be appealed to the Administrative Review Tribunal or Federal Court. The ATO's dispute resolution service offers early resolution through facilitation. Tax lawyers represent clients in objections, appeals, litigation, and negotiate settlement agreements.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">ATO Audits</h4>
      <p>
        ATO audits examine taxpayers' compliance with tax laws. They can be random or triggered by data matching, industry benchmarks, or risk profiling. Audits involve extensive information requests, interviews, and detailed review of records. Taxpayers have rights including representation by tax agents or lawyers, reasonable timeframes, and review of adverse findings. Tax lawyers manage audit processes, respond to information requests, challenge unreasonable positions, and negotiate outcomes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Planning and Structuring</h3>
      <p>
        Effective tax planning minimises tax within legal bounds through appropriate structures, timing of income and deductions, and utilising concessions. NSW businesses choose between sole trader, partnership, company, and trust structures based on tax, asset protection, and succession objectives. Family trusts offer flexibility for income distribution. Companies provide certainty and limited liability. Hybrid structures including unit trusts and corporate trustees combine benefits. Tax lawyers advise on optimal structures and restructuring when circumstances change.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Capital Gains Tax (CGT)</h3>
      <p>
        CGT applies to profits from selling assets including property, shares, and businesses. The main residence exemption excludes family homes. Small businesses receive generous CGT concessions including 15-year exemption, 50% active asset reduction, retirement exemption (up to $500,000), and rollover relief. NSW property investors calculate CGT on investment properties considering purchase price, improvements, selling costs, and holding period. Tax planning can significantly reduce CGT through timing sales, using concessions, and structuring ownership.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">State Taxes in NSW</h3>
      <p>
        NSW imposes several state taxes administered by Revenue NSW. Payroll tax applies to employers with NSW wages exceeding the threshold (currently $1.2 million). Transfer duty (stamp duty) applies to property transfers with progressive rates - Sydney's high property prices mean substantial stamp duty liabilities. Land tax applies to investment and commercial property (not principal residences) with progressive rates and surcharges for foreign owners. Motor vehicle registration includes stamp duty. Tax lawyers advise on minimisation strategies and challenge assessments.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Fringe Benefits Tax (FBT)</h3>
      <p>
        FBT is a federal tax on benefits employers provide to employees or their associates, including cars, loans, entertainment, and living-away-from-home allowances. The FBT year runs April 1 to March 31. Employers pay 47% on the grossed-up value of benefits. Certain benefits are exempt or concessionally treated including minor benefits, work-related items, and salary packaging for charities and public hospitals. NSW employers need advice on FBT compliance, employee benefit arrangements, and minimisation strategies.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tax Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Taxation Office:</strong> 13 28 61 (individuals) / 13 28 66 (business)</li>
          <li><strong>Revenue NSW:</strong> 1300 139 814</li>
          <li><strong>Tax Practitioners Board:</strong> 1300 362 829</li>
          <li><strong>Inspector-General of Taxation:</strong> 1300 770 454</li>
          <li><strong>Administrative Review Tribunal:</strong> 1800 228 333</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tax Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ato.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Taxation Office</a></li>
          <li><a href="https://www.revenue.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Revenue NSW</a></li>
          <li><a href="https://www.igt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Inspector-General of Taxation</a></li>
          <li><a href="https://www.tpb.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tax Practitioners Board</a></li>
        </ul>
      </div>
    </>
  ),

  'environmental-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Environmental Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Environmental law in NSW protects natural resources, regulates development, and manages environmental impacts. Governed by the Protection of the Environment Operations Act 1997, Environmental Planning and Assessment Act 1979, and various federal laws including the Environment Protection and Biodiversity Conservation Act 1999, environmental law affects property development, mining, agriculture, and industrial operations across NSW.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Environmental Protection in NSW</h3>
      <p>
        NSW's Protection of the Environment Operations Act 1997 (POEO Act) regulates environmentally relevant activities including scheduled activities requiring environment protection licenses. The NSW Environment Protection Authority (EPA) administers environmental approvals, monitoring, and enforcement. Businesses conducting scheduled activities require environment protection licenses setting operational conditions. Non-compliance can result in penalty notices, enforceable undertakings, prosecution, or prevention and clean-up notices. Environmental lawyers advise on compliance, license applications, and defending enforcement action.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Planning and Development</h3>
      <p>
        NSW's Environmental Planning and Assessment Act 1979 (EP&A Act) governs land use planning and development assessment. Local councils prepare Local Environmental Plans (LEPs) zoning land and setting development requirements. Development applications require assessment against LEPs, Development Control Plans, and State Environmental Planning Policies (SEPPs). Integrated development requires concurrence from multiple agencies. Designated development has special assessment requirements. The Land and Environment Court hears merit appeals and judicial review applications. Planning lawyers represent applicants, objectors, and councils.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Environmental Impact Assessment</h4>
      <p>
        Major projects in NSW require Environmental Impact Statements (EIS) under Part 4 or Part 5.1 of the EP&A Act. State Significant Development and State Significant Infrastructure have special assessment processes by the Department of Planning and Environment. The EIS process involves scoping requirements, detailed environmental studies, public exhibition, community consultation, and government assessment. Planning Secretary approval is required for State Significant projects. Environmental lawyers and consultants guide proponents through complex assessment requirements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mining and Resources</h3>
      <p>
        NSW's resources sector operates under the Mining Act 1992 and Petroleum (Onshore) Act 1991. Mining projects require exploration licenses, mining leases, and development consents. State Significant Development assessment applies to major mining projects. Mining requires environment protection licenses under the POEO Act, and rehabilitation security deposits. The Land and Environment Court has specialist mining jurisdiction. Coal seam gas developments face additional regulatory requirements. Resources lawyers advise on approvals, compliance, land access agreements, and community engagement.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Native Title and Aboriginal Heritage</h3>
      <p>
        Native title recognises Aboriginal peoples' traditional rights to land and waters. NSW has determined and claimed native title areas, particularly in western NSW. The Native Title Act 1993 (Commonwealth) requires the future act process for many government and development actions affecting land. Aboriginal Land Rights Act 1983 (NSW) provides land rights for Aboriginal Land Councils. Aboriginal heritage is protected under the National Parks and Wildlife Act 1974, requiring Aboriginal Heritage Impact Permits for harm to Aboriginal objects or places. Native title and heritage lawyers represent Aboriginal groups, developers, and government.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Water Rights and Management</h3>
      <p>
        NSW's Water Management Act 2000 regulates water resource planning, water access licenses, and water use approvals. Water sharing plans allocate water between environmental flows, basic landholder rights, and extractive uses. Water access licenses can be traded on water markets. The Murray-Darling Basin Plan affects water management across northern and western NSW. Groundwater, surface water, and coastal water have different regulatory frameworks. Aquifer interference requires specific approvals. Water lawyers advise on allocations, trading, compliance, and enforcement matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contaminated Land</h3>
      <p>
        NSW's contaminated land regime under the Contaminated Land Management Act 1997 requires investigation and remediation of contaminated sites. The EPA maintains a Register of contaminated land posing significant risk. Site audits by EPA-accredited auditors provide independent assessment of contamination and remediation. Property transactions should include contaminated land searches and environmental due diligence. Liability for remediation can extend to current and former owners and polluters. Environmental lawyers advise on contaminated land risks, remediation requirements, and liability allocation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Biodiversity and Conservation</h3>
      <p>
        NSW's Biodiversity Conservation Act 2016 protects threatened species, populations, and ecological communities. The Biodiversity Offsets Scheme requires major developments to offset biodiversity impacts. Koala protection has special provisions under State Environmental Planning Policy requirements. National parks and marine parks protect significant areas. The Environment Protection and Biodiversity Conservation Act 1999 (Commonwealth) protects matters of national environmental significance. Environmental lawyers advise on biodiversity assessments, offset requirements, and threatened species management.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Environmental Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>NSW Environment Protection Authority:</strong> 131 555</li>
          <li><strong>Department of Planning and Environment:</strong> 1300 305 695</li>
          <li><strong>Land and Environment Court:</strong> (02) 9113 8600</li>
          <li><strong>Natural Resources Access Regulator:</strong> 1800 633 362</li>
          <li><strong>Heritage NSW:</strong> (02) 9274 6410</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Environmental Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.epa.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Environment Protection Authority</a></li>
          <li><a href="https://www.planning.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Department of Planning and Environment</a></li>
          <li><a href="https://www.lec.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Land and Environment Court</a></li>
          <li><a href="https://www.environment.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Department of Climate Change, Energy, the Environment and Water</a></li>
        </ul>
      </div>
    </>
  ),

  'administrative-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrative Law in New South Wales</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Administrative law governs how government bodies make decisions and exercise power. In NSW, this includes judicial review of government decisions, tribunal proceedings, freedom of information, and oversight of government administration. Administrative lawyers challenge unlawful decisions, represent clients before tribunals, and ensure government accountability through courts and oversight bodies.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Judicial Review of Government Decisions</h3>
      <p>
        Judicial review allows courts to examine the legality of government decisions. NSW's common law jurisdiction and the Administrative Decisions Review Act 1997 provide review mechanisms. Grounds for review include jurisdictional error, procedural unfairness, unreasonableness (Wednesbury unreasonableness), relevant/irrelevant considerations, and error of law. Applications must be filed promptly - typically within three months. The NSW Supreme Court has judicial review jurisdiction for state decisions. The Federal Court reviews Commonwealth decisions. Remedies include certiorari (quashing decisions), mandamus (compelling action), prohibition, and injunctions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">NSW Civil and Administrative Tribunal (NCAT)</h3>
      <p>
        NCAT provides accessible justice for reviewing government and private decisions. Established in 2014, NCAT consolidated numerous tribunals. Jurisdiction includes administrative review, occupational and professional discipline, guardianship, residential tenancy, consumer claims, and equal opportunity. NCAT operates four divisions: Administrative and Equal Opportunity, Consumer and Commercial, Guardianship, and Occupational. Appeals from NCAT go to the Internal Appeal Panel or NSW Court of Appeal. NCAT makes NSW administrative law accessible to ordinary citizens without legal representation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Government Information (Public Access) Act</h3>
      <p>
        NSW's Government Information (Public Access) Act 2009 (GIPA Act) provides public access to government information. There's a presumption in favour of disclosure. Government agencies must proactively release certain information. Individuals can request information from NSW Government agencies, local councils, and state-owned corporations. Applications can be refused for overriding public interest against disclosure including cabinet documents, law enforcement, personal information, or commercial confidentiality. The Information Commissioner reviews GIPA decisions. NCAT hears external appeals. GIPA lawyers assist with applications, internal reviews, and appeals.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Privacy and Personal Information</h3>
      <p>
        NSW's Privacy and Personal Information Protection Act 1998 (PPIPA) governs how NSW public sector agencies collect, use, store, and disclose personal information. Information Protection Principles regulate privacy practices. Individuals can access and correct their personal information held by government. The Privacy Commissioner investigates privacy complaints and conducts privacy audits. Privacy breaches can result in compensation orders and remedial action. The federal Privacy Act 1988 applies to Commonwealth agencies and private sector organisations. Privacy lawyers advise on compliance and represent parties in complaints.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">NSW Ombudsman</h3>
      <p>
        The NSW Ombudsman investigates complaints about NSW Government administrative action, local councils, universities, and corrective services. The Ombudsman can investigate maladministration, conduct of conduct, and provision of services. Investigations can result in recommendations for remedial action, apologies, and compensation. The Ombudsman reports to Parliament on systemic issues. Complaints to the Ombudsman are free and can be made anonymously. The Ombudsman provides an accessible avenue for administrative justice outside courts and tribunals.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Independent Commission Against Corruption (ICAC)</h3>
      <p>
        ICAC investigates and exposes corruption in the NSW public sector. ICAC has strong investigative powers including compelling witnesses and documents. ICAC hearings can be public or private. ICAC makes findings of corrupt conduct and refers serious matters for prosecution. The Public Interest Disclosures Act 1994 protects whistleblowers reporting corruption. ICAC's corruption prevention work includes developing best practice guidelines. ICAC investigations have led to significant reforms in NSW government administration.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Administrative Appeals and Reviews</h3>
      <p>
        Many NSW government decisions have internal review and external appeal rights. Internal reviews allow the decision-maker or senior officer to reconsider. External appeals may go to NCAT, specialist tribunals, or courts depending on the enabling legislation. Time limits are strict - often 28 days or less. Appeals may be limited to questions of law (appeals to Court of Appeal) or allow full merits review (NCAT). Understanding the correct review pathway and time limits is critical. Administrative lawyers navigate complex review processes and maximize prospects of success.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Government Sector Employment</h3>
      <p>
        The Government Sector Employment Act 2013 governs NSW public sector employment. The Public Service Commission oversees recruitment, conduct, and capability. Public sector employees have specific rights and obligations. Employment disputes can be resolved through internal review, NSW Industrial Relations Commission, or NCAT. Misconduct investigations follow specific procedures. Senior executive employment involves performance agreements and statutory roles. Government employment lawyers advise agencies and employees on employment issues, investigations, and disputes.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important NSW Administrative Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>NSW Civil and Administrative Tribunal:</strong> 1300 006 228</li>
          <li><strong>NSW Ombudsman:</strong> 1800 451 524</li>
          <li><strong>Information and Privacy Commission:</strong> 1800 472 679</li>
          <li><strong>Independent Commission Against Corruption:</strong> (02) 8281 5999</li>
          <li><strong>NSW Supreme Court:</strong> (02) 9230 8111</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful NSW Administrative Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ncat.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.ombo.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NSW Ombudsman</a></li>
          <li><a href="https://www.ipc.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Information and Privacy Commission NSW</a></li>
          <li><a href="https://www.icac.nsw.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Independent Commission Against Corruption</a></li>
        </ul>
      </div>
    </>
  ),
}

// Victoria Practice Area Content
const VIC_CONTENT: Record<string, React.ReactElement> = {
  'family-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Family Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Family law in Victoria operates under federal legislation including the Family Law Act 1975, with state courts handling specific matters such as family violence intervention orders. Victoria has extensive family law resources across Melbourne and regional centres, with the Federal Circuit and Family Court providing comprehensive services for families dealing with separation, divorce, and parenting disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Family Law in Victoria</h3>
      <p>
        Victorian family lawyers handle divorce, property settlements, parenting arrangements, spousal maintenance, and de facto relationship matters. The Federal Circuit and Family Court of Australia operates from Melbourne (Dandenong and Melbourne CBD), Geelong, and Shepparton. Victoria's Magistrates' Court handles family violence intervention orders, which frequently intersect with family law proceedings.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Areas of Family Law Practice</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Divorce and Separation</h4>
      <p>
        Divorce in Victoria requires 12 months separation. Separation under one roof is recognized where couples can demonstrate living separately. Victoria has high divorce volumes, particularly in Melbourne. Victorian lawyers assist with divorce applications, address service complications including international service, and handle disputed separation dates. The cooling-off period and mediation requirements apply to protect parties' interests.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Child Custody and Parenting Arrangements</h4>
      <p>
        Parenting matters prioritize children's best interests under the Family Law Act. Victoria encourages parenting plans negotiated between parents without court intervention. When agreement isn't possible, parenting orders address living arrangements, parenting time, parental responsibility, and child support. Victorian courts consider children's views, relationship with both parents, family violence, and the benefit of meaningful relationships. Independent Children's Lawyers are appointed in complex cases.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Property Settlement</h4>
      <p>
        Property settlement involves identifying the asset pool, assessing contributions (financial and non-financial), considering future needs including health and earning capacity, and determining just and equitable division. Melbourne's high property values require expert valuations. Superannuation splitting and complex assets including businesses, trusts, and overseas assets require specialist legal advice. Victorian property settlements often involve sophisticated asset structures.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">De Facto Relationships</h4>
      <p>
        Victoria's relationship property laws largely mirror married couple provisions under federal jurisdiction. De facto couples in Victoria have the same family law rights as married couples if the relationship lasted two years or there are children. Victoria recognizes same-sex de facto relationships. Evidence requirements include cohabitation, financial interdependence, sexual relationship, and social recognition. Disputes about relationship existence are common.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Family Violence Intervention Orders</h4>
      <p>
        Victoria's Family Violence Protection Act 2008 provides for Family Violence Intervention Orders (FVIOs) through Magistrates' Courts. FVIOs protect victims from family violence including physical, sexual, psychological, economic, and coercive control. Police can apply for FVIOs and issue interim orders. Breaching an FVIO is a criminal offence. Victoria has comprehensive family violence support services. Legal aid is available for FVIO matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Victoria-Specific Resources</h3>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Family Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Safe Steps Family Violence Response Centre:</strong> 1800 015 188 (24/7)</li>
          <li><strong>Men's Referral Service:</strong> 1300 766 491 (24/7)</li>
          <li><strong>Family Relationship Advice Line:</strong> 1800 050 321</li>
          <li><strong>Victoria Legal Aid Family Law:</strong> 1300 792 387</li>
          <li><strong>Federal Circuit and Family Court (Melbourne):</strong> (03) 9603 9333</li>
          <li><strong>Women's Legal Service Victoria:</strong> (03) 8622 0600</li>
          <li><strong>Family Violence Support and Safety Hub:</strong> 1800 633 937</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Locations in Victoria</h3>
      <p>
        The Federal Circuit and Family Court operates from Melbourne (Dandenong and CBD), Geelong, and Shepparton. Victoria's Magistrates' Courts across the state handle family violence matters. Melbourne has multiple family law registries. Regional Victoria is serviced through circuit sittings and video conferencing. Victoria's integrated family violence service system coordinates legal, support, and protection services.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Family Dispute Resolution</h3>
      <p>
        Family Dispute Resolution (FDR) is required before filing parenting applications, with parties obtaining section 60I certificates. Victoria has Family Relationship Centres in Melbourne, Geelong, Bendigo, and other regional areas offering FDR services. Private mediators and collaborative law approaches are available. FDR isn't required where family violence exists or urgency dictates immediate court intervention.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Legal Aid and Support Services</h3>
      <p>
        Victoria Legal Aid provides family law assistance to eligible Victorians, prioritizing victims of family violence and matters involving children. Women's Legal Service Victoria, Aboriginal Family Violence Prevention & Legal Service Victoria, and community legal centres across Melbourne and regional Victoria offer free advice and representation. Family violence duty lawyers assist FVIO applicants at court.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Government Links:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.vic.gov.au/family-and-children" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victoria Government - Family and Children</a></li>
          <li><a href="https://www.legalaid.vic.gov.au/family-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victoria Legal Aid - Family Law</a></li>
          <li><a href="https://www.womenslegal.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Women's Legal Service Victoria</a></li>
          <li><a href="https://www.safesteps.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Safe Steps</a></li>
        </ul>
      </div>
    </>
  ),

  'criminal-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Criminal Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Criminal law in Victoria operates under the Crimes Act 1958, Criminal Procedure Act 2009, and numerous other state and Commonwealth statutes. Victoria has a comprehensive criminal justice system from the Magistrates' Court through to the Supreme Court and Court of Appeal. If you're facing criminal charges in Victoria, experienced legal representation is essential to protect your rights and achieve the best possible outcome.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Victorian Criminal Law</h3>
      <p>
        Victorian criminal lawyers defend clients charged with offences ranging from traffic matters to serious indictable crimes. The Magistrates' Court handles summary offences and committal proceedings. The County Court hears most indictable offences including drug trafficking, serious assaults, and sexual offences. The Supreme Court deals with murder, large-scale drug importation, and complex fraud. Victoria's criminal justice system emphasizes rehabilitation alongside punishment.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Common Criminal Matters</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drink Driving and Traffic Offences</h4>
      <p>
        Victoria has strict drink driving laws with immediate licence suspensions. Offences include low range (.05-.069), mid-range (.07-.149), high range (.15+), and exceed prescribed content of drugs. Loss of licence mandatory minimum periods apply. Dangerous driving causing death or serious injury carries substantial imprisonment. Diversion programs may be available for first offenders with minor charges. Traffic lawyers challenge testing procedures, apply for limited licenses, and minimize penalties.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Assault and Violence Offences</h4>
      <p>
        Victorian assault charges include common assault, intentionally causing injury, recklessly causing injury, and intentionally/recklessly causing serious injury. Aggravated offences (e.g., in company, with weapons) carry enhanced penalties. One-punch laws create special offences for assaults causing death. Family violence assaults are prosecuted vigorously. Self-defence under section 322K Crimes Act requires reasonable belief that conduct was necessary. Victorian courts consider rehabilitation prospects in sentencing.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drug Offences</h4>
      <p>
        Victorian drug offences under the Drugs, Poisons and Controlled Substances Act 1981 include possession, trafficking, cultivation, and manufacturing. Traffickable, commercial, and large commercial quantities determine offence severity. Victoria's Drug Court provides intensive supervision and treatment for addicted offenders. The Cannabis Cautioning Program diverts first-time minor possession offenders. Drug lawyers challenge search legality, contest deemed trafficking presumptions, and pursue diversion or treatment options.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Fraud and White Collar Crime</h4>
      <p>
        Fraud in Victoria includes obtaining property by deception, false accounting, identity theft, and computer offences. Victoria Police Fraud and Extortion Squad investigates serious matters. Corporate fraud, ASIC prosecutions, and Centrelink fraud are common. Victorian courts consider restitution and cooperation in sentencing. Complex fraud requires specialist defence lawyers who understand financial transactions and corporate structures.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Sexual Offences</h4>
      <p>
        Sexual assault offences in Victoria carry maximum penalties of 25 years imprisonment, with aggravated circumstances attracting higher penalties. Child abuse material offences are prosecuted extensively. Complainant evidence can be given via CCTV or recorded statements. Sexual assault counselling privilege protects confidential communications. Historical sexual assault prosecutions are common. Specialist criminal lawyers experienced in sexual offence trials are essential for proper defence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights When Charged</h3>
      <p>
        Victorian law protects accused persons' rights. You have the right to silence, the right to contact a lawyer before police interview, and the right to refuse participation in identification procedures. Police must caution you before interview. Record of interview procedures must be followed. You're not required to provide anything beyond identifying information. Victoria Legal Aid provides duty lawyer services at police stations and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Process in Victoria</h3>
      <p>
        Most criminal matters start at the Magistrates' Court. Summary offences are finalized there. Indictable offences proceed to committal hearings testing the prosecution case before trial at County or Supreme Court. Victoria's Court Integrated Services Program (CISP) provides intensive support and supervision as an alternative to remand. Plea hearings involve detailed submissions on sentencing factors including rehabilitation prospects.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Criminal Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Victoria Legal Aid Criminal Law:</strong> 1300 792 387</li>
          <li><strong>Victorian Aboriginal Legal Service:</strong> (03) 9419 3888</li>
          <li><strong>Law Institute of Victoria (Referrals):</strong> (03) 9607 9311</li>
          <li><strong>Youth Law Australia (under 25):</strong> (03) 9611 2411</li>
          <li><strong>Victoria Police Assistance Line:</strong> (03) 9247 6666</li>
          <li><strong>Victims Support Agency:</strong> 1800 819 817</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Sentencing in Victoria</h3>
      <p>
        Victorian sentencing follows the Sentencing Act 1991. Penalties include dismissal or discharge without conviction, fines, Community Correction Orders (CCOs), intensive correction orders, and imprisonment. Guilty plea discounts of up to 25% apply for early pleas. Baseline sentencing applies for serious offences. Victorian courts emphasize rehabilitation, with therapeutic courts including Drug Court, CISP, and Koori Court available. Character references, psychological reports, and rehabilitation evidence influence sentencing.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Criminal Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.vic.gov.au/criminal-justice-system" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victoria Government - Criminal Justice</a></li>
          <li><a href="https://www.legalaid.vic.gov.au/criminal-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victoria Legal Aid - Criminal Law</a></li>
          <li><a href="https://www.magistratescourt.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Magistrates' Court of Victoria</a></li>
          <li><a href="https://www.countycourt.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">County Court of Victoria</a></li>
        </ul>
      </div>
    </>
  ),

  'property-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Property law in Victoria operates under the Sale of Land Act 1962, Transfer of Land Act 1958, and numerous other statutes. Melbourne's property market is among Australia's most active, with Victoria's property transactions involving complex legal requirements. Victorian property lawyers ensure smooth conveyancing, protect your interests, and navigate Victoria's unique property law framework.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Conveyancing in Victoria</h3>
      <p>
        Victorian conveyancing involves contract exchange, cooling-off period (3 business days for buyers on standard contracts), building and pest inspections, settlement, and registration. Section 32 Vendor Statements must disclose property information. Electronic conveyancing through PEXA is mandatory. Victoria's land tax and transfer duty (stamp duty) apply with various concessions available. Searches reveal council rates, planning restrictions, and title encumbrances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Residential Property Transactions</h3>
      <p>
        Buying property in Victoria requires careful attention to Section 32 Vendor Statements, building inspections, and contract terms. The cooling-off period allows buyers to withdraw with 0.2% penalty. Off-the-plan purchases have special protections including sunset clauses. Melbourne's property market requires expert legal advice on contract negotiation. First home buyers can access stamp duty exemptions and concessions for properties under certain values.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">First Home Buyers in Victoria</h4>
      <p>
        Victoria offers first home buyer concessions including full stamp duty exemption for properties up to $600,000 and reduced duty up to $750,000. The First Home Owner Grant provides $10,000 for newly built or substantially renovated homes. Regional Victoria may have additional benefits. HomesVic assists eligible first home buyers. Your property lawyer ensures you receive all available concessions and proper Section 32 disclosure.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Property</h3>
      <p>
        Victorian commercial property transactions involve complex due diligence on leases, environmental issues, GST, and business operations. Commercial contracts have shorter cooling-off periods and different disclosure requirements. Lease assignments require landlord consent under the Retail Leases Act 2003. Melbourne CBD commercial property has unique considerations including building classifications and development potential. Commercial property lawyers conduct comprehensive due diligence and negotiate favorable terms.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Leasing and Tenancy</h3>
      <p>
        Victoria's Residential Tenancies Act 1997 governs residential tenancies. The Victorian Civil and Administrative Tribunal (VCAT) resolves tenancy disputes including bond claims, repairs, and termination. Recent reforms provide greater tenant protections including minimum standards, limits on rent increases, and restrictions on evictions. Retail leases under the Retail Leases Act 2003 require comprehensive disclosure and minimum five-year terms for most leases.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Owners Corporations and Strata</h3>
      <p>
        Victoria's Owners Corporation Act 2006 governs apartments and townhouses. Owners corporations manage common property, levy collection, and rule enforcement. Owners corporation certificates disclose financial position, rules, major works, and disputes. Building defects in new developments are addressed through builders' warranties and statutory warranties. VCAT resolves owners corporation disputes including rule breaches and building defects.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Development</h3>
      <p>
        Property development in Victoria requires planning permits from local councils under the Planning and Environment Act 1987. The permit process assesses development against planning schemes and state planning policies. VCAT hears planning appeals. Victorian planning law is complex with significant case law development. Development contribution plans, Section 173 agreements, and infrastructure contributions apply to larger developments. Planning lawyers coordinate applications, appeals, and compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Property Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>State Revenue Office Victoria (Stamp Duty):</strong> (03) 9628 0550</li>
          <li><strong>Consumer Affairs Victoria (Tenancy):</strong> 1300 558 181</li>
          <li><strong>Victorian Civil and Administrative Tribunal:</strong> 1300 018 228</li>
          <li><strong>Land Use Victoria:</strong> 1300 650 460</li>
          <li><strong>Victorian Building Authority:</strong> 1300 815 127</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Disputes</h3>
      <p>
        Property disputes in Victoria include boundary disputes, easements, caveats, breach of contract, building defects, and owners corporation conflicts. VCAT provides accessible resolution for many disputes. The Supreme Court handles complex property litigation. The Planning and Environment List of VCAT has specialist jurisdiction for planning disputes. The Fences Act 1968 and Trees Act 1972 govern neighbor disputes. Experienced property lawyers resolve disputes through negotiation or litigation.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Property Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.vic.gov.au/housing-and-property" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victoria Government - Housing and Property</a></li>
          <li><a href="https://www.consumer.vic.gov.au/housing" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer Affairs Victoria - Housing</a></li>
          <li><a href="https://www.sro.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Revenue Office Victoria</a></li>
          <li><a href="https://www.vcat.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victorian Civil and Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'wills-estates': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Wills and Estates Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Wills and estates law in Victoria is governed by the Wills Act 1997, Administration and Probate Act 1958, and Powers of Attorney Act 2014. Proper estate planning protects your assets, provides for loved ones, and minimizes disputes. Victorian wills and estates lawyers provide comprehensive advice on succession planning, estate administration, and contesting wills.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Will Drafting in Victoria</h3>
      <p>
        A valid Victorian will must be in writing, signed by the testator, and witnessed by two independent witnesses who sign in the testator's presence. Informal wills can be admitted to probate in limited circumstances under section 9A Wills Act. Professional will drafting addresses blended families, business succession, asset protection, and tax planning. Testamentary trusts protect beneficiaries from bankruptcy, relationship breakdowns, and provide tax benefits. Regular reviews ensure wills reflect changed circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Estate Planning Strategies</h3>
      <p>
        Comprehensive estate planning in Victoria includes wills, enduring powers of attorney (financial and medical treatment), advance care directives, and superannuation binding death benefit nominations. Proper planning minimizes family provision claims, provides for disabled beneficiaries through special disability trusts, and structures inheritances for asset protection. Melbourne's high property values make estate planning particularly important for managing wealth transfer and tax efficiency.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Probate and Estate Administration</h3>
      <p>
        Probate is the Supreme Court's grant of representation to executors. Victorian executors must collect assets, pay debts, lodge tax returns, and distribute to beneficiaries according to the will. Small estates under certain thresholds may use the Resealing procedure. The process involves obtaining death certificate, locating the will, identifying assets and liabilities, obtaining valuations, and preparing estate accounts. Lawyers ensure executors comply with duties and protect against personal liability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intestacy in Victoria</h4>
      <p>
        When someone dies without a valid will, intestacy rules under Part IV Administration and Probate Act determine distribution. Spouses receive priority with provisions for children. The intestacy formula considers family composition. Domestic partners have the same rights as married spouses. The State Trustees may be appointed administrator if no family applies. Intestacy often results in unintended outcomes and family disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contesting Wills and Family Provision Claims</h3>
      <p>
        Victoria's family provision regime under Part IV Administration and Probate Act allows eligible persons to apply for greater provision from an estate. Eligible persons include spouses, children (including adult children), domestic partners, stepchildren, and registered caring partners. Applications must be filed within six months of probate grant. Victorian courts consider financial resources, health, relationship with deceased, contributions, and provision made. Successful claims significantly alter distributions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Powers of Attorney</h3>
      <p>
        Victoria recognizes enduring powers of attorney (financial), enduring powers of attorney (medical treatment), and general powers of attorney. Enduring powers must be properly executed with witnesses and continue after loss of capacity. Attorneys must act in the principal's best interests, keep proper accounts, and avoid conflicts of interest. VCAT reviews attorney conduct and suspected financial abuse. Registration may be required for property transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Medical Treatment Decision Making</h3>
      <p>
        Enduring powers of attorney (medical treatment) allow appointed persons to make medical decisions if you lose capacity. Appointments must be witnessed by two authorized witnesses. Advance care directives document your medical treatment preferences. Victoria's Medical Treatment Planning and Decisions Act 2016 provides the framework. VCAT's Guardianship List can appoint guardians for medical decisions if you lose capacity without valid appointments.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Wills & Estates Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of Victoria (Probate Office):</strong> (03) 9603 6111</li>
          <li><strong>State Trustees Victoria:</strong> 1300 138 672</li>
          <li><strong>Office of the Public Advocate:</strong> 1300 309 337</li>
          <li><strong>Victoria Legal Aid (Wills):</strong> 1300 792 387</li>
          <li><strong>Law Institute of Victoria:</strong> (03) 9607 9311</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Guardianship and Administration</h3>
      <p>
        VCAT's Guardianship List appoints guardians for personal/lifestyle decisions and administrators for financial decisions when adults lose capacity without valid appointments. State Trustees or private professional administrators may be appointed. VCAT reviews decisions and protects vulnerable adults from abuse. Applications are accessible with VCAT operating less formally than courts. Guardianship lawyers represent parties in appointment and review applications.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Wills & Estates Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.vic.gov.au/wills-and-estates" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victoria Government - Wills and Estates</a></li>
          <li><a href="https://www.statetrustees.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Trustees Victoria</a></li>
          <li><a href="https://www.publicadvocate.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Public Advocate</a></li>
          <li><a href="https://www.vcat.vic.gov.au/case-types/guardianship" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">VCAT Guardianship List</a></li>
        </ul>
      </div>
    </>
  ),

  'employment-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Employment Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Employment law in Victoria operates primarily under federal legislation including the Fair Work Act 2009, with state-based workers compensation and workplace safety laws. Victoria has extensive employment law resources including the Fair Work Commission, Victorian WorkCover Authority, and WorkSafe Victoria. Employment lawyers protect employee and employer rights in this complex regulatory environment.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Employment Law in Victoria</h3>
      <p>
        Most Victorian employment matters fall under the federal Fair Work system covering minimum wages, working conditions, unfair dismissal, and general protections. However, Victorian state laws govern workers compensation through WorkSafe Victoria, workplace safety under the Occupational Health and Safety Act 2004, and certain public sector employment matters. The Victorian Civil and Administrative Tribunal handles some employment disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Unfair Dismissal Claims</h3>
      <p>
        Employees dismissed from employment may file unfair dismissal applications with the Fair Work Commission if they've served the minimum employment period (six months for small businesses, 12 months otherwise) and earn below the high income threshold. Applications must be lodged within 21 days of dismissal. Victorian employment lawyers assess dismissal fairness, prepare applications, and represent clients at conciliation conferences and hearings. Remedies include reinstatement or compensation up to six months' wages.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">General Protections Claims</h4>
      <p>
        General protections prohibit adverse action for exercising workplace rights, union membership, discrimination, or sham contracting. These claims have 60-day time limits but can result in uncapped compensation. Victoria has significant case law on general protections particularly regarding COVID-19 related terminations and vaccine mandate disputes. Anti-bullying applications can be made to Fair Work Commission while still employed.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Discrimination and Harassment</h3>
      <p>
        Victoria's Equal Opportunity Act 2010 prohibits discrimination based on protected attributes including age, disability, employment activity, gender identity, industrial activity, marital status, parental status, physical features, political belief, pregnancy, race, religious belief, sex, sexual orientation, and personal association. The Victorian Equal Opportunity and Human Rights Commission investigates complaints and attempts conciliation. Unresolved matters proceed to VCAT. Sexual harassment reforms have strengthened protections and employer obligations.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Employment Contracts and Agreements</h3>
      <p>
        Employment lawyers review and draft employment contracts, executive service agreements, restraint of trade clauses, confidentiality agreements, and enterprise agreements. Victorian courts have developed significant case law on restraint of trade enforceability, requiring restraints to protect legitimate business interests and be reasonable. Post-employment restraints are frequently litigated in Victorian Supreme Court, particularly in professional services and technology sectors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers' Compensation</h3>
      <p>
        WorkSafe Victoria administers workers compensation for Victorian workers. Claims cover medical expenses, weekly payments, impairment benefits, and common law damages for work injuries. Victorian workers can pursue common law damages where employer negligence caused serious injury (significant impairment threshold). Time limits apply - workers compensation claims should be lodged promptly, common law claims within three years. Lawyers maximize both statutory and common law entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Redundancy and Restructuring</h3>
      <p>
        Genuine redundancy requires the position to no longer exist. Large-scale redundancies may require consultation under Fair Work Act provisions. Redundancy pay depends on years of service. Victorian employees can challenge sham redundancies or unfair selection processes. Victorian public sector redundancies have specific provisions under the Public Administration Act 2004. Employment lawyers ensure proper processes and maximum entitlements.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Employment Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Fair Work Commission:</strong> 1300 799 675</li>
          <li><strong>Fair Work Ombudsman:</strong> 13 13 94</li>
          <li><strong>Victorian Equal Opportunity and Human Rights Commission:</strong> 1300 292 153</li>
          <li><strong>WorkSafe Victoria:</strong> 1800 136 089</li>
          <li><strong>WorkSafe Advisory Service:</strong> 1800 136 089</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Safety and Bullying</h3>
      <p>
        WorkSafe Victoria enforces Victoria's Occupational Health and Safety Act 2004, including psychosocial hazards and workplace bullying. Victorian employers must provide safe systems of work and address workplace bullying. The Fair Work Commission handles workplace bullying applications. Workers compensation claims for psychological injury from workplace bullying are common. Employment lawyers advise on prevention, responding to complaints, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Employment Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.fairwork.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a></li>
          <li><a href="https://www.humanrights.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victorian Equal Opportunity and Human Rights Commission</a></li>
          <li><a href="https://www.worksafe.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkSafe Victoria</a></li>
          <li><a href="https://www.vic.gov.au/workplace-rights" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victoria Government - Workplace Rights</a></li>
        </ul>
      </div>
    </>
  ),

  'personal-injury': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Personal Injury Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Personal injury law in Victoria helps victims of accidents and negligence obtain compensation. Victoria operates comprehensive compensation schemes including Transport Accident Commission (TAC) for motor accidents, WorkSafe Victoria for workplace injuries, and common law claims for public liability and medical negligence. Experienced Victorian personal injury lawyers navigate these schemes to maximize your compensation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Transport Accidents</h3>
      <p>
        Victoria's Transport Accident Commission (TAC) provides no-fault compensation for injuries in transport accidents involving cars, motorcycles, bicycles, pedestrians, and other road users. TAC covers medical treatment, income support, and attendant care regardless of fault. For more serious injuries, common law damages claims provide additional compensation for pain and suffering, economic loss, and gratuitous care. The serious injury threshold requires significant injury or impairment percentage. Claims must be lodged within specific timeframes.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">TAC Benefits and Common Law Claims</h4>
      <p>
        All injured persons receive TAC benefits including medical treatment, income replacement, attendant care, and travel expenses. These benefits continue as needed. Common law damages require meeting the serious injury threshold - either narrative test (significant injury) or impairment test (over 30% whole person impairment). Personal injury lawyers ensure maximum TAC benefits and assess common law prospects. Victoria's modified common law system balances compensation with scheme sustainability.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Medical Negligence</h3>
      <p>
        Medical negligence claims in Victoria arise from substandard medical care causing injury. This includes misdiagnosis, surgical errors, medication mistakes, birth injuries, and failure to obtain informed consent. Victorian public hospitals are covered by the Victorian Managed Insurance Authority, while private practitioners have professional indemnity insurance. The Wrongs Act 1958 governs liability and damages. Expert medical evidence is essential. Time limits are generally three years from awareness of negligence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public Liability Claims</h3>
      <p>
        Public liability claims compensate injuries on another person's property or due to their negligence. Common claims include slip and fall in shopping centres, council property injuries, dog attacks, and defective products. Victoria's Wrongs Act 1958 requires proving breach of duty of care and causation. Contributory negligence reduces compensation if you were partly at fault. Dangerous recreational activities may have limited liability. Personal injury lawyers investigate liability and negotiate with insurers.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">WorkCover Claims</h3>
      <p>
        Victorian workers injured at work claim WorkCover through WorkSafe Victoria for medical expenses, weekly payments, and impairment benefits. For serious injuries caused by employer negligence, common law damages claims provide substantially higher compensation. The serious injury test requires significant injury or permanent impairment over 30%. Time limits are strict - WorkCover claims should be lodged immediately, common law claims within three years. Specialist lawyers assess both statutory and common law entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Total and Permanent Disability (TPD)</h3>
      <p>
        TPD insurance, typically held through superannuation, pays lump sum benefits when unable to work due to injury or illness. Victorian TPD claims are common, with insurers frequently denying legitimate claims. Disputes involve medical evidence, policy interpretation, and TPD definitions. The Australian Financial Complaints Authority (AFCA) handles complaints. TPD lawyers represent claimants through the claims and appeals process.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dust Diseases and Asbestos</h3>
      <p>
        Victorian workers exposed to asbestos, silica, or other harmful dusts can develop serious diseases decades later. Asbestos-related diseases including mesothelioma, asbestosis, and asbestos-related lung cancer have special compensation provisions. WorkSafe Victoria administers workers compensation for dust diseases. Common law claims against former employers and asbestos product manufacturers provide additional compensation. Time limits are extended due to long latency periods. Specialist asbestos lawyers trace exposure history.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Personal Injury Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Transport Accident Commission (TAC):</strong> 1300 654 329</li>
          <li><strong>WorkSafe Victoria:</strong> 1800 136 089</li>
          <li><strong>Health Complaints Commissioner:</strong> 1300 582 113</li>
          <li><strong>Victoria Legal Aid:</strong> 1300 792 387</li>
          <li><strong>Victorian WorkCover Authority:</strong> 1800 136 089</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dispute Resolution</h3>
      <p>
        TAC disputes are resolved through internal review, Conciliation Service, and VCAT. WorkCover disputes proceed through Conciliation and Arbitration services. Medical panels determine impairment percentages. Most claims settle through negotiation or alternative dispute resolution. Supreme Court litigation is reserved for complex or high-value disputes. Personal injury lawyers guide clients through dispute resolution processes.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Personal Injury Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.tac.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Transport Accident Commission</a></li>
          <li><a href="https://www.worksafe.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkSafe Victoria</a></li>
          <li><a href="https://hcc.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Health Complaints Commissioner</a></li>
          <li><a href="https://www.legalaid.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victoria Legal Aid</a></li>
        </ul>
      </div>
    </>
  ),

  'business-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Business Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Business law in Victoria encompasses corporate law, commercial contracts, mergers and acquisitions, and regulatory compliance. Melbourne is Australia's second-largest business centre, with Victoria having sophisticated business law frameworks. Victorian business lawyers advise on business formation, operations, transactions, and disputes to help businesses succeed while managing legal risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Formation and Structure</h3>
      <p>
        Choosing the right business structure is crucial. Options include sole trader, partnership, trust, or company. Companies are regulated by ASIC under the Corporations Act 2001. Victorian lawyers advise on tax implications, asset protection, liability, succession planning, and compliance requirements. Company incorporation involves registration with ASIC, constitution drafting, shareholder agreements, and compliance frameworks. Trusts require careful structuring to achieve tax and asset protection benefits.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Contracts</h3>
      <p>
        Commercial contracts underpin Victorian businesses. Common contracts include supply agreements, distribution agreements, service agreements, licensing, franchise agreements, and joint ventures. Victorian contract law requires offer, acceptance, consideration, and intention. The Australian Consumer Law imposes mandatory guarantees and unfair contract term prohibitions. Lawyers draft, review, and negotiate contracts protecting your business interests and ensuring enforceability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Franchising</h4>
      <p>
        Franchising in Victoria is regulated by the Franchising Code of Conduct requiring comprehensive disclosure before franchise sale. Franchisors must provide disclosure documents, financial information, and cooling-off periods. Victorian franchise disputes include misleading conduct, breach of franchise agreements, and goodwill claims. The Federal Court and Supreme Court hear franchise matters. Specialist franchise lawyers represent franchisors and franchisees in disputes and transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mergers and Acquisitions</h3>
      <p>
        Business acquisitions in Victoria involve due diligence, contract negotiation, regulatory approvals, and completion. Due diligence examines financial records, contracts, litigation, intellectual property, employment, and tax. Share sales transfer ownership of the company entity. Asset sales transfer specific business assets. Earn-out provisions, warranties, and indemnities protect buyers. Competition law clearance may be required. Corporate lawyers coordinate complex acquisitions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Partnership and Shareholder Agreements</h3>
      <p>
        Partnership agreements govern business partnerships under the Partnership Act 1958. Shareholder agreements regulate relationships between company shareholders addressing management, share transfers, dispute resolution, and exit strategies. Buy-sell provisions, drag-along and tag-along rights, and valuation mechanisms prevent deadlocks. Victorian Supreme Court handles partnership and shareholder disputes including oppression claims under section 232 Corporations Act. Proper agreements prevent costly disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Disputes</h3>
      <p>
        Victorian businesses face disputes including contract breaches, partnership disputes, shareholder disputes, trade practices claims, and debt recovery. The Victorian Civil and Administrative Tribunal handles smaller commercial matters. Supreme Court hears larger disputes. Mediation and arbitration provide alternatives to litigation. Business lawyers resolve disputes efficiently through negotiation, alternative dispute resolution, or court proceedings when necessary.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Business Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Business Victoria:</strong> 13 22 15</li>
          <li><strong>Consumer Affairs Victoria:</strong> 1300 558 181</li>
          <li><strong>Australian Competition and Consumer Commission:</strong> 1300 302 502</li>
          <li><strong>Victorian Small Business Commission:</strong> 13 8722</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Regulatory Compliance</h3>
      <p>
        Victorian businesses must comply with extensive regulation including Australian Consumer Law, workplace relations laws, privacy laws, taxation laws, and industry-specific regulation. Directors have statutory duties including duty of care, duty to prevent insolvent trading, and duty to avoid conflicts. ASIC enforces corporate regulation. The Victorian Small Business Commission assists small businesses with disputes and compliance. Business lawyers ensure regulatory compliance and defend investigations.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Business Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.business.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business Victoria</a></li>
          <li><a href="https://www.consumer.vic.gov.au/business" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer Affairs Victoria - Business</a></li>
          <li><a href="https://www.vsbc.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victorian Small Business Commission</a></li>
          <li><a href="https://asic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC</a></li>
        </ul>
      </div>
    </>
  ),

  'immigration-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Immigration Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Immigration law in Victoria operates under federal legislation including the Migration Act 1958 and Migration Regulations. Melbourne is Australia's fastest-growing major city with significant migration. Victoria attracts skilled migrants, international students, family migrants, and business migrants. Registered migration agents and immigration lawyers guide applicants through complex visa processes and represent clients in tribunals and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Categories</h3>
      <p>
        Australia's visa system includes temporary visas (visitor, student, temporary work) and permanent visas (skilled, family, business). Victoria's state nomination program for skilled migrants provides pathways to permanent residence. Melbourne's diverse economy creates opportunities across multiple occupations. Visa applications require meeting health, character, and specific visa criteria. Processing times vary significantly by visa type and applicant circumstances.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Skilled Migration</h4>
      <p>
        Skilled migration to Victoria includes independent skilled visas, state-nominated visas, and employer-sponsored visas. Victoria's state nomination program targets occupations in demand including healthcare, education, engineering, and IT. Points-tested visas require meeting points threshold through age, English, qualifications, and work experience. Skills assessments verify qualifications meet Australian standards. Employer sponsorship requires approved sponsor status and labor market testing.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Family Migration</h3>
      <p>
        Partner visas allow Australian citizens, permanent residents, and eligible New Zealand citizens to sponsor spouses and de facto partners. Prospective marriage visas require intent to marry within nine months. Parent visas have long waiting periods with contributory options providing faster processing. Child visas and remaining relative visas complete family migration categories. Victoria's multicultural population makes family reunification common.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business and Investment Migration</h3>
      <p>
        Business Innovation and Investment visas attract entrepreneurs and investors to Victoria. The Business Innovation stream requires successful business experience and genuine intention to operate Victorian business. Investor streams require designated investments in Australian assets. Victoria's state nomination program prioritizes genuine business establishment and job creation. Business Plan Victoria assists migrant entrepreneurs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Student Visas</h3>
      <p>
        Melbourne's universities and colleges attract international students worldwide. Student visas require enrollment in registered courses, sufficient funds, health insurance, and genuine temporary entrant requirements. Post-study work visas allow graduates to gain Australian work experience. Visa conditions restrict work hours during studies. Education agents and migration lawyers assist with visa applications and compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Citizenship</h3>
      <p>
        Australian citizenship requires permanent residence, residency period (usually four years including 12 months as permanent resident), good character, and knowledge of Australia. Citizenship confers voting rights, passport eligibility, and government employment access. Children born in Australia to permanent residents or citizens are usually Australian citizens. Citizenship by descent applies to children born overseas to Australian citizen parents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Refusals and Cancellations</h3>
      <p>
        Visa refusals and cancellations can be reviewed by the Administrative Review Tribunal (ART, formerly AAT). Character cancellations under section 501 Migration Act affect visa holders with criminal records. Direction 99 guides decision-makers on character cancellations considering family ties and community protection. Federal Circuit and Family Court and Federal Court hear judicial review applications. Immigration lawyers represent clients in tribunal and court proceedings.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Immigration Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Home Affairs:</strong> 131 881</li>
          <li><strong>Administrative Review Tribunal:</strong> 1800 228 333</li>
          <li><strong>Refugee Council of Australia:</strong> (02) 9211 9333</li>
          <li><strong>Victorian Multicultural Commission:</strong> (03) 9651 0651</li>
          <li><strong>Migration Agents Registration Authority:</strong> (07) 3360 3888</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Deportation and Removal</h3>
      <p>
        Unlawful non-citizens face detention and removal from Australia. Visa cancellations for character or compliance reasons result in removal. Ministerial intervention under sections 48B, 351, or 417 provides last resort options. Bridging visas allow lawful stay while matters are resolved. Detention reviews are available through the Administrative Review Tribunal. Immigration lawyers urgently respond to detention and deportation matters.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Immigration Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.homeaffairs.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Home Affairs</a></li>
          <li><a href="https://www.aat.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Administrative Review Tribunal</a></li>
          <li><a href="https://www.liveinvictoria.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Live in Victoria</a></li>
          <li><a href="https://www.study.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Study Melbourne</a></li>
        </ul>
      </div>
    </>
  ),

  'litigation': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Litigation in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Litigation in Victoria encompasses civil and commercial disputes resolved through courts and tribunals. Victoria's court system includes the Magistrates' Court, County Court, Supreme Court, and specialized tribunals. Effective litigation requires strategic advice, thorough preparation, and skilled advocacy. Victorian litigation lawyers represent clients in all forums, from small claims to complex commercial disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Victorian Court System</h3>
      <p>
        Victoria's Magistrates' Court handles claims up to $100,000 and criminal summary matters. The County Court has unlimited civil jurisdiction and hears most criminal trials. The Supreme Court handles complex commercial matters, judicial review, and appeals. The Victorian Civil and Administrative Tribunal (VCAT) provides accessible dispute resolution for civil, administrative, and planning matters. The Federal Circuit and Family Court and Federal Court operate in Victoria for federal matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Civil Litigation</h3>
      <p>
        Civil litigation includes contract disputes, negligence claims, property disputes, and debt recovery. Victorian civil procedure follows the Civil Procedure Act 2010 emphasizing case management, proportionality, and alternative dispute resolution. The overarching purpose requires just, efficient, timely, and cost-effective dispute resolution. Pre-action procedures encourage early resolution. Discovery, expert evidence, and interlocutory applications require compliance with practice directions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Commercial Litigation</h4>
      <p>
        Commercial litigation involves business disputes including contract breaches, shareholder disputes, partnership disputes, intellectual property, and trade practices. The Supreme Court's Commercial Court provides specialized case management. Freezing orders, search orders, and security for costs protect parties' positions. Victorian commercial litigation often involves sophisticated legal issues requiring specialist barristers. Litigation lawyers strategically manage disputes to achieve commercial outcomes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Alternative Dispute Resolution</h3>
      <p>
        Mediation and arbitration offer alternatives to court litigation. Victorian courts mandate mediation in many matters. The Supreme Court operates a mediation service. Private mediators and arbitrators resolve disputes confidentially and efficiently. Arbitration awards are enforceable like court judgments. Expert determination resolves technical disputes. ADR reduces costs and provides flexible outcomes. Lawyers advise on ADR suitability and represent clients in ADR processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Recovery</h3>
      <p>
        Debt recovery through Victorian courts involves issuing proceedings, default judgments, or defended hearings. Judgment enforcement includes garnishee orders, instalment orders, warrants for seizure and sale, and examination summonses. Bankruptcy and winding up proceedings pressure debtors to pay. Victorian debt collection laws protect debtors from harassment. Creditors' lawyers strategically recover debts while managing costs and risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Building and Construction Disputes</h3>
      <p>
        Building disputes in Victoria involve defective work, cost overruns, delays, and payment disputes. The Domestic Building Contracts Act 1995 regulates residential building. Security of payment legislation provides rapid adjudication of payment claims. The Victorian Building Authority investigates builder conduct. VCAT's Building and Property List resolves domestic building disputes. Supreme Court handles complex commercial construction litigation. Building lawyers advise on contracts, compliance, and disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Defamation</h3>
      <p>
        Defamation in Victoria involves publication of material harming reputation. The Defamation Act 2005 provides uniform national defamation law. Defences include truth, honest opinion, and qualified privilege. Offers to make amends can resolve matters early. Concerns notices and limitation periods require prompt action. Social media defamation is increasingly common. Supreme Court handles defamation proceedings. Defamation lawyers advise publishers and plaintiffs on rights and risks.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Litigation Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of Victoria:</strong> (03) 9603 6111</li>
          <li><strong>County Court of Victoria:</strong> (03) 8636 6000</li>
          <li><strong>Magistrates' Court of Victoria:</strong> (03) 9658 8911</li>
          <li><strong>Victorian Civil and Administrative Tribunal:</strong> 1300 018 228</li>
          <li><strong>Victorian Bar:</strong> (03) 9225 7111</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Costs and Funding</h3>
      <p>
        Victorian litigation costs follow the principle that unsuccessful parties pay winners' costs. Security for costs may be ordered against plaintiffs. Costs disclosure obligations require lawyers to inform clients of likely costs. No win, no fee arrangements are available for some matters. Litigation funding provides financial support for claims in exchange for success fees. Victorian courts scrutinize disproportionate costs. Lawyers provide realistic cost estimates and strategic advice on litigation economics.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Litigation Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.supremecourt.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Supreme Court of Victoria</a></li>
          <li><a href="https://www.countycourt.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">County Court of Victoria</a></li>
          <li><a href="https://www.magistratescourt.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Magistrates' Court of Victoria</a></li>
          <li><a href="https://www.vcat.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">VCAT</a></li>
        </ul>
      </div>
    </>
  ),

  'bankruptcy-insolvency': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Bankruptcy and Insolvency in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Bankruptcy and insolvency law in Victoria helps individuals and companies facing financial difficulties. The Bankruptcy Act 1966 governs personal insolvency, while the Corporations Act 2001 governs corporate insolvency. Victoria has experienced insolvency practitioners and lawyers who advise on bankruptcy alternatives, restructuring, and formal insolvency processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Personal Bankruptcy</h3>
      <p>
        Bankruptcy is a formal process where an individual is declared unable to pay debts. Bankruptcy can be voluntary (debtor's petition) or involuntary (creditor's petition). A trustee takes control of assets, realizes them, and distributes to creditors. Bankruptcy typically lasts three years. During bankruptcy, travel restrictions apply, credit reporting continues for five years, and certain assets are protected including household items, tools of trade, and some superannuation. Bankruptcy discharges most debts excluding child support, HECS, and fraud debts.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternatives to Bankruptcy</h4>
      <p>
        Debt agreements under Part IX Bankruptcy Act allow debtors to propose reduced payment arrangements to creditors avoiding bankruptcy. Personal insolvency agreements (Part X) provide flexible arrangements for higher-value estates. Informal arrangements negotiate payment plans with creditors. These alternatives avoid bankruptcy's consequences while addressing debt. Victorian insolvency practitioners assess options and implement solutions. Early advice maximizes options and prevents forced bankruptcy.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Corporate Insolvency</h3>
      <p>
        Companies facing insolvency have several options. Voluntary administration under Part 5.3A Corporations Act provides breathing space while administrators investigate rescue prospects. Creditors vote on proposals including deeds of company arrangement. Liquidation winds up companies and distributes assets to creditors. Receivers can be appointed by secured creditors. Directors facing insolvent trading allegations face personal liability. Early advice prevents wrongful trading and maximizes restructuring options.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Liquidation</h3>
      <p>
        Liquidation ends company existence through voluntary liquidation (members' or creditors') or court-ordered winding up. Liquidators realize assets, investigate company affairs, and distribute to creditors according to priority. Employees rank ahead of unsecured creditors for wages and entitlements. Liquidators pursue voidable transactions including unfair preferences and uncommercial transactions. ASIC regulates liquidators. Creditors receive dividends if assets remain after secured and priority creditors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Voluntary Administration</h3>
      <p>
        Voluntary administration provides companies with temporary protection from creditors while exploring rescue options. Administrators investigate company affairs and report to creditors on prospects of saving business. Creditors vote on proposals including deeds of company arrangement, liquidation, or returning company to directors. Victorian administrators work with directors, creditors, and employees to achieve optimal outcomes. Administration can result in successful restructuring saving businesses and jobs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Creditors' Rights</h3>
      <p>
        Creditors can initiate bankruptcy or winding up proceedings to recover debts. Statutory demands under section 459E Corporations Act require companies to pay debts or face presumed insolvency. Creditors lodge proofs of debt in administrations and liquidations. Committees of inspection represent creditor interests. Creditors can challenge administrators' and liquidators' decisions. Security interests under the Personal Property Securities Act provide priority. Insolvency lawyers represent creditors maximizing recoveries.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Bankruptcy & Insolvency Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Financial Security Authority:</strong> 1300 364 785</li>
          <li><strong>ASIC Insolvency Practitioners:</strong> 1300 300 630</li>
          <li><strong>National Debt Helpline:</strong> 1800 007 007</li>
          <li><strong>Financial Counselling Victoria:</strong> 1800 007 007</li>
          <li><strong>Victorian Small Business Commission:</strong> 13 8722</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Directors' Duties and Insolvent Trading</h3>
      <p>
        Directors must prevent insolvent trading - incurring debts when company cannot pay them. Section 588G Corporations Act imposes personal liability on directors for insolvent trading. Safe harbour protections apply when directors develop and implement restructuring plans. The business judgment rule protects informed, good faith decisions. ASIC prosecutes serious director breaches. Victorian insolvency lawyers advise directors on duties, safe harbour, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Bankruptcy & Insolvency Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.afsa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Financial Security Authority</a></li>
          <li><a href="https://asic.gov.au/regulatory-resources/insolvency/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC Insolvency Information</a></li>
          <li><a href="https://www.arita.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ARITA - Australian Restructuring Insolvency & Turnaround Association</a></li>
          <li><a href="https://www.vsbc.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victorian Small Business Commission</a></li>
        </ul>
      </div>
    </>
  ),

  'intellectual-property': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Intellectual property law protects creations of the mind including inventions, brands, designs, and creative works. Victoria's innovation economy, particularly in Melbourne's technology and creative sectors, makes IP protection essential. Victorian IP lawyers advise on registration, protection, commercialization, and enforcement of intellectual property rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trademarks</h3>
      <p>
        Trademarks protect brand names, logos, and other identifiers under the Trade Marks Act 1995. Registration with IP Australia provides exclusive rights to use marks for registered goods and services. Victorian businesses should conduct searches before adoption, register in relevant classes, and monitor for infringement. Trademark protection prevents consumer confusion and protects brand investment. Opposition and cancellation proceedings defend trademark rights. Lawyers advise on selection, registration, and enforcement.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Copyright</h3>
      <p>
        Copyright automatically protects original works including literary works, artistic works, music, films, sound recordings, and broadcasts under the Copyright Act 1968. Protection lasts life of author plus 70 years. Copyright protects expression, not ideas. Fair dealing exceptions allow limited use for research, criticism, and news reporting. Digital copyright issues are increasingly important. Copyright assignment and licensing agreements commercialize works. Infringement remedies include damages, accounts of profits, and injunctions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Patents</h3>
      <p>
        Patents protect inventions that are novel, inventive, and useful under the Patents Act 1990. Standard patents last 20 years; innovation patents (abolished 2021 for new applications) lasted 8 years. The patent process involves search, application, examination, and grant. Provisional applications establish priority for 12 months. Victorian innovation in medical devices, software, and manufacturing generates significant patent activity. Patent lawyers conduct searches, draft specifications, prosecute applications, and enforce patents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Designs</h3>
      <p>
        Registered designs protect visual appearance of products including shape, configuration, pattern, and ornamentation under the Designs Act 2003. Protection lasts up to 10 years. Designs must be new and distinctive. Registration is relatively quick and affordable. Product designers and manufacturers should register designs before public disclosure. Design infringement involves making, importing, or selling products embodying registered designs. Victorian product design industries benefit from design protection.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trade Secrets and Confidential Information</h3>
      <p>
        Trade secrets protect confidential business information including formulas, processes, customer lists, and know-how. Unlike registered IP rights, trade secrets rely on maintaining secrecy. Breach of confidence claims prevent unauthorized disclosure or use. Employment contracts and non-disclosure agreements protect confidential information. Victorian courts grant injunctions preventing disclosure and damages for breaches. IP lawyers draft protection agreements and pursue breaches.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Commercialization</h3>
      <p>
        IP commercialization includes licensing, assignment, and joint ventures. Licensing agreements grant rights to use IP while retaining ownership. Exclusive licenses provide sole licensee rights; non-exclusive licenses permit multiple licensees. Royalty structures compensate IP owners. Due diligence examines IP ownership and validity. R&D tax incentives support Victorian innovation. IP lawyers negotiate and draft commercialization agreements maximizing value while protecting rights.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian IP Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>IP Australia:</strong> 1300 65 10 10</li>
          <li><strong>Copyright Agency:</strong> 1800 066 844</li>
          <li><strong>Australian Copyright Council:</strong> (02) 8815 9777</li>
          <li><strong>Law Institute of Victoria (IP Referrals):</strong> (03) 9607 9311</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Enforcement</h3>
      <p>
        IP infringement is enforced through Federal Court proceedings. Remedies include injunctions, damages, accounts of profits, and delivery up of infringing goods. Australian Border Force can seize counterfeit imports. Anton Piller orders (search orders) preserve evidence. Cease and desist letters often resolve matters without litigation. Victorian IP owners should actively monitor and enforce rights. Lawyers advise on infringement, conduct negotiations, and litigate when necessary.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian IP Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ipaustralia.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IP Australia</a></li>
          <li><a href="https://www.copyright.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Copyright Council</a></li>
          <li><a href="https://ipta.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Intellectual Property Society of Australia and New Zealand</a></li>
          <li><a href="https://www.business.vic.gov.au/business-information/innovation-and-technology" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business Victoria - Innovation</a></li>
        </ul>
      </div>
    </>
  ),

  'tax-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Tax Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Tax law in Victoria encompasses federal taxation administered by the Australian Taxation Office and state taxes administered by the State Revenue Office Victoria. Victorian tax lawyers advise individuals and businesses on tax planning, compliance, disputes, and restructuring to minimize tax liabilities and resolve ATO disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Income Tax</h3>
      <p>
        Income tax applies to individuals, companies, trusts, and superannuation funds under federal tax law. Victorian taxpayers face the same income tax rates as other Australians. Tax planning includes structuring income, maximizing deductions, timing transactions, and utilizing concessions. Small business CGT concessions provide significant relief for business asset sales. Negative gearing remains important for Victorian property investors despite periodic policy debates. Tax lawyers advise on complex transactions, restructures, and ATO audits.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Goods and Services Tax (GST)</h4>
      <p>
        GST at 10% applies to most supplies of goods and services. Businesses with turnover over $75,000 ($150,000 for non-profits) must register. Input tax credits allow GST-registered businesses to claim back GST on purchases. GST-free supplies include basic food, health, and education. Complex GST issues arise in property transactions, financial supplies, and margin schemes. Victorian property developments involve significant GST considerations. Tax advisers ensure GST compliance and optimal structuring.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">State Taxes - Stamp Duty and Land Tax</h3>
      <p>
        Victoria imposes stamp duty (transfer duty) on property transfers, business asset sales, motor vehicle transfers, and insurance. Rates vary by transaction type. Property stamp duty uses progressive rates with first home buyer concessions. Land tax applies annually to Victorian land holdings above thresholds with aggregation rules. Principal place of residence exemption excludes main homes. Trusts face surcharges. State Revenue Office Victoria administers these taxes with objection and appeal rights to VCAT and Supreme Court.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Payroll Tax</h3>
      <p>
        Victorian employers with wages exceeding the threshold ($700,000 for 2023-24) pay payroll tax at 4.85%. Grouping provisions aggregate related businesses' wages. Contractors may be deemed employees for payroll tax. Regional employers receive rate reductions. SRO audits ensure compliance. Voluntary disclosures provide penalty relief. Tax lawyers advise on payroll tax obligations, grouping, and disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Disputes and Audits</h3>
      <p>
        ATO audits examine tax returns for compliance. Taxpayers have rights including representation and reasonable time to respond. Objections challenge ATO decisions with 60-day time limits (four years for small businesses). The Administrative Review Tribunal reviews objection decisions. Federal Court hears appeals on questions of law. Victorian taxpayers frequently dispute Part IVA general anti-avoidance provisions, transfer pricing, and thin capitalization. Tax lawyers represent clients in audits, objections, and litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Planning and Restructuring</h3>
      <p>
        Tax planning minimizes tax within legal boundaries. Common strategies include income splitting through family trusts, superannuation contributions, negative gearing, and asset protection structures. Business restructures utilize rollover provisions avoiding immediate tax. Victorian businesses expanding interstate consider federal vs. state tax implications. Voluntary disclosures to ATO reduce penalties for past non-compliance. Tax lawyers design compliant structures achieving tax efficiency.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Tax Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Taxation Office:</strong> 13 28 61 (individuals), 13 28 66 (businesses)</li>
          <li><strong>State Revenue Office Victoria:</strong> (03) 9628 0550</li>
          <li><strong>Tax Practitioners Board:</strong> (03) 9200 8800</li>
          <li><strong>Inspector-General of Taxation:</strong> 1800 199 010</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Superannuation</h3>
      <p>
        Superannuation enjoys concessional tax treatment to encourage retirement savings. Contributions are taxed at 15% (30% for high earners). Earnings taxed at 15% in accumulation phase, tax-free in pension phase. Superannuation death benefits have tax implications depending on beneficiary and payment type. Self-managed superannuation funds (SMSFs) require careful administration and compliance. Victorian SMSF trustees face auditor and ATO scrutiny. Tax advisers optimize superannuation strategies.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Tax Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ato.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Taxation Office</a></li>
          <li><a href="https://www.sro.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Revenue Office Victoria</a></li>
          <li><a href="https://www.tpb.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tax Practitioners Board</a></li>
          <li><a href="https://www.igt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Inspector-General of Taxation</a></li>
        </ul>
      </div>
    </>
  ),

  'environmental-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Environmental Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Environmental law in Victoria regulates environmental protection, land use planning, and natural resource management. The Environment Protection Act 2017 provides Victoria's modern environmental framework with the Environment Protection Authority Victoria as principal regulator. Victorian environmental lawyers advise on compliance, planning, contaminated land, climate change, and environmental litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Environment Protection</h3>
      <p>
        Victoria's Environment Protection Act 2017 implements a general environmental duty requiring all persons to minimize environmental risks. The EPA Victoria issues environmental reference standards and permissions. Industrial premises require EPA licenses or permits. Pollution incidents must be reported. EPA can issue improvement notices, prohibition notices, and environmental audits. Prosecution for serious breaches carries significant penalties. Environmental lawyers advise on duty compliance and respond to EPA action.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Planning and Development</h3>
      <p>
        Victoria's Planning and Environment Act 1987 regulates land use and development. Planning schemes (state and local) control development through zones, overlays, and provisions. Planning permits are required for most development. Councils assess applications against planning schemes. VCAT reviews permit refusals and appeals. Major projects can access streamlined assessment. Environmental effects may require environmental effects statements. Planning lawyers obtain permits, defend objections, and appeal decisions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Contaminated Land</h4>
      <p>
        Contaminated land creates liability for current and former owners, occupiers, and polluters. EPA maintains contaminated land register. Environmental audits under Environment Protection Act certify land as suitable for use. Section 53V certificates provide protection for new owners. Due diligence investigations identify contamination risks. Cleanup costs can be substantial. Environmental lawyers advise purchasers, vendors, and responsible parties on contaminated land issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Native Title and Cultural Heritage</h3>
      <p>
        Native title recognizes Indigenous rights to traditional lands. Native title claims in Victoria are determined by Federal Court. Aboriginal Victoria administers Victoria's Aboriginal Heritage Act 2006 protecting Aboriginal cultural heritage. Cultural heritage management plans are required for high-impact activities. Traditional owners must be consulted. Unauthorized harm to Aboriginal heritage is an offence. Developers engage with traditional owner groups and obtain cultural heritage permits.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mining and Resources</h3>
      <p>
        Mining in Victoria requires licenses under the Mineral Resources (Sustainable Development) Act 1990. Earth Resources Regulation regulates mining and extractive industries. Work plans address environmental management. Rehabilitation bonds ensure site restoration. Victorian coal, gold, and construction materials industries are significant. The permanent ban on unconventional gas (fracking) prohibits certain activities. Mining lawyers obtain approvals and advise on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Climate Change and Renewable Energy</h3>
      <p>
        Victoria has ambitious renewable energy and emissions reduction targets. The Climate Change Act 2017 establishes net zero by 2050 target. Victorian Renewable Energy Target drives wind and solar development. Planning reforms facilitate renewable energy projects. National Greenhouse and Energy Reporting requires emissions reporting. Carbon farming opportunities exist. Climate litigation is emerging. Environmental lawyers advise on renewable energy projects, climate governance, and regulatory compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Environmental Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Environment Protection Authority Victoria:</strong> 1300 372 842</li>
          <li><strong>Department of Energy, Environment and Climate Action:</strong> 136 186</li>
          <li><strong>Planning Victoria:</strong> (03) 9096 5800</li>
          <li><strong>Aboriginal Victoria:</strong> (03) 7022 2600</li>
          <li><strong>Earth Resources Regulation:</strong> 136 186</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Water and Biodiversity</h3>
      <p>
        Victorian water resources are managed under the Water Act 1989. Water authorities supply water and manage catchments. Environmental water holders protect environmental flows. Groundwater extraction requires licenses. Victoria's catchment management authorities coordinate regional natural resource management. The Flora and Fauna Guarantee Act 1988 protects threatened species and communities. Developers must consider biodiversity impacts and offset requirements.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Environmental Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.epa.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Environment Protection Authority Victoria</a></li>
          <li><a href="https://www.planning.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Planning Victoria</a></li>
          <li><a href="https://www.aboriginalvictoria.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Aboriginal Victoria</a></li>
          <li><a href="https://earthresources.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Earth Resources</a></li>
        </ul>
      </div>
    </>
  ),

  'administrative-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrative Law in Victoria</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Administrative law in Victoria governs the exercise of government power and review of government decisions. The Victorian Civil and Administrative Tribunal (VCAT), Ombudsman Victoria, and courts review administrative action. Administrative lawyers challenge unlawful decisions, ensure procedural fairness, and hold government accountable to the rule of law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">VCAT Review</h3>
      <p>
        VCAT reviews state government decisions across diverse areas including planning, building, tenancy, guardianship, occupational regulation, and discrimination. VCAT provides accessible, low-cost review with less formality than courts. The enabling Act for each decision specifies review rights and grounds. VCAT conducts hearings de novo, reconsidering matters afresh. Lawyers represent parties in VCAT proceedings, ensuring procedural rights and presenting persuasive cases.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Judicial Review</h3>
      <p>
        Judicial review challenges government decisions on legal grounds including jurisdictional error, procedural unfairness, taking irrelevant considerations into account, failing to consider relevant matters, and unreasonableness. The Supreme Court's judicial review jurisdiction covers Victorian government decisions. Federal Court reviews Commonwealth decisions. Judicial review doesn't substitute decision-maker's discretion but ensures lawful exercise. Remedies include quashing decisions, mandamus compelling action, and declarations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Procedural Fairness</h4>
      <p>
        Procedural fairness (natural justice) requires fair hearing and unbiased decision-makers. The hearing rule requires notice, opportunity to be heard, and consideration of submissions. The bias rule requires actual or apprehended freedom from bias. Victorian decision-makers must comply unless legislation clearly excludes fairness. Lawyers challenge decisions lacking procedural fairness and advise government on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Ombudsman Victoria</h3>
      <p>
        Ombudsman Victoria investigates complaints about Victorian government agencies, local councils, and certain public bodies. The Ombudsman can investigate administrative action, conduct own-motion investigations, and make recommendations. Ombudsman investigations are free and accessible. Findings aren't binding but carry significant weight. Protected disclosures (whistleblowing) about government wrongdoing are protected. The Ombudsman's annual reports highlight systemic issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Freedom of Information</h3>
      <p>
        Victoria's Freedom of Information Act 1982 provides rights to access government documents. Victorian government agencies, local councils, and statutory authorities are subject to FOI. FOI requests are made in writing. Agencies must respond within 30 days. Exemptions protect cabinet documents, personal privacy, law enforcement, and commercial confidentiality. OVIC (Office of the Victorian Information Commissioner) reviews FOI decisions. VCAT provides further review. FOI promotes government transparency and accountability.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Privacy and Data Protection</h3>
      <p>
        Victoria's Privacy and Data Protection Act 2014 regulates Victorian public sector information handling. Information Privacy Principles govern collection, use, disclosure, and security of personal information. OVIC enforces privacy law and investigates complaints. Data breaches must be notified. Victorian health services comply with the Health Records Act 2001. The Commissioner can make binding determinations. Privacy lawyers advise government and complainants on privacy rights and obligations.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Victorian Administrative Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Victorian Civil and Administrative Tribunal:</strong> 1300 018 228</li>
          <li><strong>Ombudsman Victoria:</strong> 1800 806 314</li>
          <li><strong>Office of the Victorian Information Commissioner:</strong> 1300 006 842</li>
          <li><strong>Supreme Court of Victoria:</strong> (03) 9603 6111</li>
          <li><strong>Victorian Equal Opportunity and Human Rights Commission:</strong> 1300 292 153</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Government and Public Law</h3>
      <p>
        Victorian constitutional law governs Parliament, Executive, and Judiciary relationships. The Constitution Act 1975 establishes Victoria's constitutional framework. Parliamentary sovereignty, separation of powers, and rule of law are fundamental principles. Statutory interpretation principles guide understanding legislation. Victorian public lawyers advise government on lawful exercise of power, legislative drafting, and constitutional issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Human Rights</h3>
      <p>
        Victoria's Charter of Human Rights and Responsibilities Act 2006 protects fundamental rights including equality, liberty, fair hearing, and privacy. Public authorities must act compatibly with human rights and consider human rights in decisions. Courts interpret legislation compatibly with rights where possible. Declarations of inconsistent interpretation don't invalidate laws but prompt parliamentary reconsideration. The Victorian Equal Opportunity and Human Rights Commission promotes rights. Administrative lawyers argue human rights in judicial review and VCAT proceedings.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Victorian Administrative Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.vcat.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victorian Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.ombudsman.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Ombudsman Victoria</a></li>
          <li><a href="https://ovic.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Victorian Information Commissioner</a></li>
          <li><a href="https://www.humanrights.vic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Victorian Equal Opportunity and Human Rights Commission</a></li>
        </ul>
      </div>
    </>
  ),
}

// South Australia Practice Area Content
const SA_CONTENT: Record<string, React.ReactElement> = {
  'family-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Family Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Family law in South Australia operates under federal legislation including the Family Law Act 1975, with state courts handling specific matters such as intervention orders. South Australia has comprehensive family law resources across Adelaide and regional centres, with the Federal Circuit and Family Court providing services for families dealing with separation, divorce, and parenting disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Family Law in South Australia</h3>
      <p>
        South Australian family lawyers handle divorce, property settlements, parenting arrangements, spousal maintenance, and de facto relationship matters. The Federal Circuit and Family Court of Australia operates from Adelaide. South Australia's Magistrates Court handles intervention orders for family violence, which frequently intersect with family law proceedings. The state has a strong network of family law practitioners and support services.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Areas of Family Law Practice</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Divorce and Separation</h4>
      <p>
        Divorce in South Australia requires 12 months separation. Separation under one roof is recognized where couples can demonstrate living separately and apart. South Australian lawyers assist with divorce applications, address service complications, and handle disputed separation dates. The Federal Circuit and Family Court in Adelaide processes divorce applications, with most matters proceeding on an undefended basis after satisfying separation requirements.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Child Custody and Parenting Arrangements</h4>
      <p>
        Parenting matters prioritize children's best interests under the Family Law Act. South Australia encourages parenting plans negotiated between parents without court intervention. When agreement isn't possible, parenting orders address living arrangements, parenting time, parental responsibility, and child support. South Australian courts consider children's views, relationship with both parents, family violence history, and the benefit of meaningful relationships. Independent Children's Lawyers are appointed in complex cases.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Property Settlement</h4>
      <p>
        Property settlement involves identifying the asset pool, assessing contributions (financial and non-financial), considering future needs including health and earning capacity, and determining just and equitable division. Adelaide's property values require expert valuations. Superannuation splitting and complex assets including businesses, trusts, and overseas assets require specialist legal advice. South Australian property settlements often involve family farms and rural properties requiring specialized valuation.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">De Facto Relationships</h4>
      <p>
        South Australia's relationship property laws largely mirror married couple provisions under federal jurisdiction. De facto couples in South Australia have the same family law rights as married couples if the relationship lasted two years or there are children. South Australia recognizes same-sex de facto relationships. Evidence requirements include cohabitation, financial interdependence, sexual relationship, and social recognition. Disputes about relationship existence require comprehensive evidence.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intervention Orders for Family Violence</h4>
      <p>
        South Australia's Intervention Orders (Prevention of Abuse) Act 2009 provides for intervention orders through Magistrates' Courts. Intervention orders protect victims from family violence including physical, sexual, psychological, economic abuse, and coercive control. Police can apply for intervention orders and issue interim orders. Breaching an intervention order is a criminal offence. South Australia has comprehensive family violence support services. Legal aid is available for intervention order matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">South Australia-Specific Resources</h3>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Family Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>1800RESPECT (National Family Violence Counselling):</strong> 1800 737 732 (24/7)</li>
          <li><strong>Men's Referral Service:</strong> 1300 766 491 (24/7)</li>
          <li><strong>Family Relationship Advice Line:</strong> 1800 050 321</li>
          <li><strong>Legal Services Commission SA:</strong> 1300 366 424</li>
          <li><strong>Federal Circuit and Family Court (Adelaide):</strong> (08) 8219 2000</li>
          <li><strong>Women's Legal Service SA:</strong> (08) 8231 8929</li>
          <li><strong>Domestic Violence Crisis Line:</strong> 1800 800 098 (24/7)</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Locations in South Australia</h3>
      <p>
        The Federal Circuit and Family Court operates from Adelaide, servicing metropolitan and regional South Australia. South Australia's Magistrates' Courts across the state handle intervention order matters. Adelaide has the principal family law registry. Regional South Australia is serviced through circuit sittings, video conferencing, and regional court appearances. South Australia's integrated family violence service system coordinates legal, support, and protection services.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Family Dispute Resolution</h3>
      <p>
        Family Dispute Resolution (FDR) is required before filing parenting applications, with parties obtaining section 60I certificates. South Australia has Family Relationship Centres in Adelaide and regional areas offering FDR services. Private mediators and collaborative law approaches are available. FDR isn't required where family violence exists or urgency dictates immediate court intervention. South Australian family lawyers facilitate dispute resolution and represent clients when court proceedings are necessary.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Legal Aid and Support Services</h3>
      <p>
        Legal Services Commission of South Australia provides family law assistance to eligible South Australians, prioritizing victims of family violence and matters involving children. Women's Legal Service SA, Aboriginal Family Legal Service SA, and community legal centres across Adelaide and regional South Australia offer free advice and representation. Family violence duty lawyers assist intervention order applicants at court.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Government Links:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.sa.gov.au/topics/family-and-community" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SA Government - Family and Community</a></li>
          <li><a href="https://lsc.sa.gov.au/family-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Services Commission SA - Family Law</a></li>
          <li><a href="https://wlsa.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Women's Legal Service SA</a></li>
          <li><a href="https://www.dvsupportline.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Domestic Violence Support Line SA</a></li>
        </ul>
      </div>
    </>
  ),

  'criminal-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Criminal Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Criminal law in South Australia operates under the Criminal Law Consolidation Act 1935, Summary Offences Act 1953, and numerous other state and Commonwealth statutes. South Australia has a comprehensive criminal justice system from the Magistrates Court through to the Supreme Court and Court of Criminal Appeal. If you're facing criminal charges in South Australia, experienced legal representation is essential to protect your rights and achieve the best possible outcome.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding South Australian Criminal Law</h3>
      <p>
        South Australian criminal lawyers defend clients charged with offences ranging from traffic matters to serious indictable crimes. The Magistrates Court handles summary offences and committal proceedings. The District Court hears most indictable offences including drug trafficking, serious assaults, and robberies. The Supreme Court deals with murder, manslaughter, and complex fraud. South Australia's criminal justice system emphasizes rehabilitation alongside punishment, with specialized courts including the Drug Court.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Common Criminal Matters</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drink Driving and Traffic Offences</h4>
      <p>
        South Australia has strict drink driving laws with immediate licence disqualifications. Offences include prescribed concentration of alcohol (.05-.079 low range, .08-.149 mid range, .15+ high range) and driving under the influence. Drug driving offences detect prescribed drugs. Loss of licence mandatory minimum periods apply. Dangerous driving causing death or harm carries substantial imprisonment. First offenders with minor charges may access diversionary programs. Traffic lawyers challenge testing procedures, apply for work licenses, and minimize penalties.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Assault and Violence Offences</h4>
      <p>
        South Australian assault charges include basic assault, assault causing harm, aggravated assault, and causing serious harm. Aggravating factors include weapons, victim vulnerability, and group offending. South Australia's one-punch laws create special offences for assaults causing death. Family violence assaults are prosecuted vigorously under specific legislation. Self-defence under section 15 Criminal Law Consolidation Act requires reasonable belief that conduct was necessary. South Australian courts consider rehabilitation prospects in sentencing.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drug Offences</h4>
      <p>
        South Australian drug offences under the Controlled Substances Act 1984 include possession, trafficking, cultivation, and manufacturing. Trafficable, commercial, and large commercial quantities determine offence severity. South Australia's Cannabis Expiation Notice system allows on-the-spot fines for minor cannabis possession. Drug Court provides intensive supervision and treatment for addicted offenders. Drug lawyers challenge search legality, contest deemed trafficking presumptions, and pursue diversion or treatment options.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Fraud and White Collar Crime</h4>
      <p>
        Fraud in South Australia includes deception offences, dishonest dealing, identity theft, and computer offences under the Criminal Law Consolidation Act. South Australia Police's Serious and Organised Crime Branch investigates major fraud. Corporate fraud, ASIC prosecutions, and Centrelink fraud are common. South Australian courts consider restitution and cooperation in sentencing. Complex fraud requires specialist defence lawyers who understand financial transactions and corporate structures.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Sexual Offences</h4>
      <p>
        Sexual assault offences in South Australia carry maximum penalties up to life imprisonment for aggravated offences. Child abuse material offences are prosecuted extensively. Complainant evidence can be given via CCTV or recorded statements. Counselling privilege protects confidential communications. Historical sexual assault prosecutions are common, with South Australia establishing specialized investigation teams. Specialist criminal lawyers experienced in sexual offence trials are essential for proper defence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights When Charged</h3>
      <p>
        South Australian law protects accused persons' rights. You have the right to silence, the right to contact a lawyer before police interview, and the right to refuse participation in identification procedures. Police must caution you before interview. Record of interview procedures must be followed. You're not required to provide anything beyond identifying information. Legal Services Commission SA provides duty lawyer services at police stations and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Process in South Australia</h3>
      <p>
        Most criminal matters start at the Magistrates Court. Summary offences are finalized there. Indictable offences proceed to committal hearings testing the prosecution case before trial at District or Supreme Court. South Australia's Drug Court provides intensive support and supervision as an alternative to imprisonment. Plea hearings involve detailed submissions on sentencing factors including rehabilitation prospects. South Australian courts emphasize restorative justice principles where appropriate.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Criminal Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Legal Services Commission SA Criminal Law:</strong> 1300 366 424</li>
          <li><strong>Aboriginal Legal Rights Movement:</strong> (08) 8113 3777</li>
          <li><strong>Law Society of SA (Referrals):</strong> (08) 8229 0200</li>
          <li><strong>JusticeNet SA:</strong> (08) 8410 3777</li>
          <li><strong>SA Police Assistance Line:</strong> 131 444</li>
          <li><strong>Commissioner for Victims' Rights:</strong> 1800 182 368</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Sentencing in South Australia</h3>
      <p>
        South Australian sentencing follows the Sentencing Act 2017. Penalties include absolute or conditional discharge, good behaviour bonds, fines, community corrections orders, home detention, intensive correction orders, and imprisonment. Guilty plea discounts of up to 40% apply for early pleas, with greater discounts for earlier pleas. South Australian courts emphasize rehabilitation, with therapeutic courts including Drug Court and specialist Aboriginal sentencing considerations available. Character references, psychological reports, and rehabilitation evidence influence sentencing.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Criminal Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.sa.gov.au/topics/justice-and-law/criminal-justice" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SA Government - Criminal Justice</a></li>
          <li><a href="https://lsc.sa.gov.au/criminal-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Services Commission SA - Criminal Law</a></li>
          <li><a href="https://www.courts.sa.gov.au/for-defendants-accused/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Courts Administration Authority SA</a></li>
          <li><a href="https://www.lawsocietysa.asn.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Law Society of South Australia</a></li>
        </ul>
      </div>
    </>
  ),

  'property-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Property law in South Australia operates under the Real Property Act 1886 (Torrens Title system), Land and Business (Sale and Conveyancing) Act 1994, and numerous other statutes. Adelaide's property market is active, with South Australia's property transactions involving specific legal requirements. South Australian property lawyers ensure smooth conveyancing, protect your interests, and navigate the state's unique property law framework.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Conveyancing in South Australia</h3>
      <p>
        South Australian conveyancing involves contract exchange, cooling-off period (2 clear business days for buyers on standard contracts), building and pest inspections, settlement, and registration through Land Services SA. Form 1 vendor disclosure statements must disclose property information including title particulars and material facts. Electronic conveyancing through PEXA operates in South Australia. Stamp duty (land tax) and transfer fees apply with various concessions available. Searches reveal council rates, planning restrictions, and title encumbrances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Residential Property Transactions</h3>
      <p>
        Buying property in South Australia requires careful attention to Form 1 disclosures, building inspections, and contract terms. The cooling-off period allows buyers to withdraw with prescribed penalty. Off-the-plan purchases have special protections including sunset clauses. Adelaide's property market requires expert legal advice on contract negotiation. First home buyers can access stamp duty exemptions and concessions for properties under certain values, with additional benefits for new builds.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">First Home Buyers in South Australia</h4>
      <p>
        South Australia offers first home buyer concessions including stamp duty exemption for properties up to $650,000 and reduced duty up to $700,000 (as of 2024). Additional discounts apply for new builds. The First Home Owner Grant provides funds for newly built or substantially renovated homes. HomeStart Finance assists eligible first home buyers with finance. Your property lawyer ensures you receive all available concessions and proper Form 1 disclosure.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Property</h3>
      <p>
        South Australian commercial property transactions involve complex due diligence on leases, environmental issues, GST, and business operations. Commercial contracts have different cooling-off and disclosure requirements. Lease assignments require landlord consent under the Retail and Commercial Leases Act 1995. Adelaide CBD commercial property has unique considerations including development potential and heritage overlays. Commercial property lawyers conduct comprehensive due diligence and negotiate favorable terms.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Leasing and Tenancy</h3>
      <p>
        South Australia's Residential Tenancies Act 1995 governs residential tenancies. The South Australian Civil and Administrative Tribunal (SACAT) resolves tenancy disputes including bond claims, repairs, and termination. Recent reforms provide greater tenant protections including limits on rent increases and restrictions on evictions. Retail and commercial leases under the Retail and Commercial Leases Act 1995 require disclosure and minimum lease terms for retail premises.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Strata and Community Titles</h3>
      <p>
        South Australia's Community Titles Act 1996 governs apartments, townhouses, and community schemes. Community corporations manage common property, levy collection, and by-law enforcement. Strata certificates disclose financial position, by-laws, major works, and disputes. Building defects in new developments are addressed through builders' warranties and statutory warranties under the Building Work Contractors Act 1995. SACAT resolves community corporation disputes including by-law breaches and building defects.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Development</h3>
      <p>
        Property development in South Australia requires development approval from local councils or the State Commission Assessment Panel under the Planning, Development and Infrastructure Act 2016. The assessment process considers development plans and state planning policies. Public notification and objection processes apply. SACAT and the Environment, Resources and Development Court hear planning appeals. Development contributions, infrastructure levies, and affordable housing contributions apply to larger developments. Planning lawyers coordinate applications, appeals, and compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Property Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>RevenueSA (Stamp Duty):</strong> (08) 8226 3750</li>
          <li><strong>Consumer and Business Services (Tenancy):</strong> 131 882</li>
          <li><strong>South Australian Civil and Administrative Tribunal:</strong> 1800 723 767</li>
          <li><strong>Land Services SA:</strong> (08) 8423 5000</li>
          <li><strong>Consumer and Business Services (Building):</strong> 131 882</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Disputes</h3>
      <p>
        Property disputes in South Australia include boundary disputes, easements, encroachments, breach of contract, building defects, and community corporation conflicts. SACAT provides accessible resolution for many disputes. The District Court and Supreme Court handle complex property litigation. The Environment, Resources and Development Court has specialist jurisdiction for planning and environmental disputes. The Fences Act 1975 governs neighbor fence disputes. Experienced property lawyers resolve disputes through negotiation or litigation.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Property Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.sa.gov.au/topics/housing-property-and-land" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SA Government - Housing and Property</a></li>
          <li><a href="https://www.cbs.sa.gov.au/housing-and-property" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer and Business Services - Property</a></li>
          <li><a href="https://www.revenuesa.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">RevenueSA</a></li>
          <li><a href="https://www.sacat.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">South Australian Civil and Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'wills-estates': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Wills and Estates Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Wills and estates law in South Australia is governed by the Wills Act 1936, Administration and Probate Act 1919, and Advance Care Directives Act 2013. Proper estate planning protects your assets, provides for loved ones, and minimizes disputes. South Australian wills and estates lawyers provide comprehensive advice on succession planning, estate administration, and contesting wills.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Will Drafting in South Australia</h3>
      <p>
        A valid South Australian will must be in writing, signed by the testator, and witnessed by two independent witnesses who sign in the testator's presence. Informal wills can be admitted to probate in limited circumstances under section 12 Wills Act. Professional will drafting addresses blended families, business succession, asset protection, and tax planning. Testamentary trusts protect beneficiaries from bankruptcy, relationship breakdowns, and provide tax benefits. Regular reviews ensure wills reflect changed circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Estate Planning Strategies</h3>
      <p>
        Comprehensive estate planning in South Australia includes wills, enduring powers of attorney, advance care directives, and superannuation binding death benefit nominations. Proper planning minimizes family provision claims, provides for disabled beneficiaries through special disability trusts, and structures inheritances for asset protection. Adelaide's property values and family business structures make estate planning particularly important for managing wealth transfer and tax efficiency.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Probate and Estate Administration</h3>
      <p>
        Probate is the Supreme Court's grant of representation to executors. South Australian executors must collect assets, pay debts, lodge tax returns, and distribute to beneficiaries according to the will. Small estates under certain thresholds may proceed without formal probate. The process involves obtaining death certificate, locating the will, identifying assets and liabilities, obtaining valuations, and preparing estate accounts. Lawyers ensure executors comply with duties and protect against personal liability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intestacy in South Australia</h4>
      <p>
        When someone dies without a valid will, intestacy rules under Part 3A Administration and Probate Act determine distribution. Spouses receive priority with provisions for children. The intestacy formula considers family composition. Domestic partners have the same rights as married spouses. The Public Trustee may be appointed administrator if no family applies. Intestacy often results in unintended outcomes and family disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contesting Wills and Family Provision Claims</h3>
      <p>
        South Australia's family provision regime under the Inheritance (Family Provision) Act 1972 allows eligible persons to apply for greater provision from an estate. Eligible persons include spouses, children (including adult children), domestic partners, and certain dependents. Applications must be filed within six months of probate grant (or within six months of the deceased's death if no grant). South Australian courts consider financial resources, health, relationship with deceased, contributions, and provision made. Successful claims significantly alter distributions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Powers of Attorney</h3>
      <p>
        South Australia recognizes enduring powers of attorney (financial and legal matters) and general powers of attorney under the Powers of Attorney and Agency Act 1984. Enduring powers must be properly executed with witnesses and continue after loss of capacity. Attorneys must act in the principal's best interests, keep proper accounts, and avoid conflicts of interest. SACAT reviews attorney conduct and suspected financial abuse. Registration is required with the Land Services SA for some property transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Advance Care Directives</h3>
      <p>
        South Australia's Advance Care Directives Act 2013 allows adults to give directions about future health care, accommodation, and personal matters if they lose decision-making capacity. Advance care directives must be witnessed by authorized witnesses. Substitute decision-makers can be appointed. The Office of the Public Advocate maintains the Advance Care Directives Registry. SACAT's Guardianship List can appoint guardians if you lose capacity without valid directives.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Wills & Estates Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of SA (Probate Office):</strong> (08) 8204 0289</li>
          <li><strong>Public Trustee SA:</strong> 1800 673 119</li>
          <li><strong>Office of the Public Advocate:</strong> 1800 066 969</li>
          <li><strong>Legal Services Commission SA:</strong> 1300 366 424</li>
          <li><strong>Law Society of SA:</strong> (08) 8229 0200</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Guardianship and Administration</h3>
      <p>
        SACAT's Guardianship List appoints guardians for personal/lifestyle decisions and administrators for financial decisions when adults lose capacity without valid appointments. The Public Trustee or private professional administrators may be appointed. SACAT reviews decisions and protects vulnerable adults from abuse. Applications are accessible with SACAT operating less formally than courts. Guardianship lawyers represent parties in appointment and review applications.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Wills & Estates Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.sa.gov.au/topics/family-and-community/wills-and-estates" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SA Government - Wills and Estates</a></li>
          <li><a href="https://ptsa.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Public Trustee SA</a></li>
          <li><a href="https://opa.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Public Advocate</a></li>
          <li><a href="https://www.sacat.sa.gov.au/guardianship" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SACAT Guardianship List</a></li>
        </ul>
      </div>
    </>
  ),

  'employment-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Employment Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Employment law in South Australia operates primarily under federal legislation including the Fair Work Act 2009, with state-based workers compensation and workplace safety laws. South Australia has employment law resources including the Fair Work Commission, ReturnToWorkSA, and SafeWork SA. Employment lawyers protect employee and employer rights in this complex regulatory environment.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Employment Law in South Australia</h3>
      <p>
        Most South Australian employment matters fall under the federal Fair Work system covering minimum wages, working conditions, unfair dismissal, and general protections. However, South Australian state laws govern workers compensation through ReturnToWorkSA, workplace safety under the Work Health and Safety Act 2012, and certain public sector employment matters under the Public Sector Act 2009. SACAT handles some employment disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Unfair Dismissal Claims</h3>
      <p>
        Employees dismissed from employment may file unfair dismissal applications with the Fair Work Commission if they've served the minimum employment period (six months for small businesses, 12 months otherwise) and earn below the high income threshold. Applications must be lodged within 21 days of dismissal. South Australian employment lawyers assess dismissal fairness, prepare applications, and represent clients at conciliation conferences and hearings. Remedies include reinstatement or compensation up to six months' wages.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">General Protections Claims</h4>
      <p>
        General protections prohibit adverse action for exercising workplace rights, union membership, discrimination, or sham contracting. These claims have 60-day time limits but can result in uncapped compensation. South Australia has significant case law on general protections particularly regarding workplace rights and discrimination. Anti-bullying applications can be made to Fair Work Commission while still employed.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Discrimination and Harassment</h3>
      <p>
        South Australia's Equal Opportunity Act 1984 prohibits discrimination based on protected attributes including sex, race, age, disability, sexual orientation, gender identity, marital status, pregnancy, and association with a person with protected attributes. The South Australian Equal Opportunity Commission investigates complaints and attempts conciliation. Unresolved matters proceed to SACAT. Sexual harassment reforms have strengthened protections and employer obligations.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Employment Contracts and Agreements</h3>
      <p>
        Employment lawyers review and draft employment contracts, executive service agreements, restraint of trade clauses, confidentiality agreements, and enterprise agreements. South Australian courts have developed case law on restraint of trade enforceability, requiring restraints to protect legitimate business interests and be reasonable. Post-employment restraints are frequently litigated in South Australian courts, particularly in professional services sectors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers' Compensation</h3>
      <p>
        ReturnToWorkSA administers workers compensation for South Australian workers under the Return to Work Act 2014. Claims cover medical expenses, weekly payments, impairment benefits, and compensation for permanent impairment. South Australian workers can pursue common law damages where employer negligence caused serious injury (30% whole person impairment threshold). Time limits apply - workers compensation claims should be lodged promptly, common law claims within three years. Lawyers maximize both statutory and common law entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Redundancy and Restructuring</h3>
      <p>
        Genuine redundancy requires the position to no longer exist. Large-scale redundancies may require consultation under Fair Work Act provisions. Redundancy pay depends on years of service. South Australian employees can challenge sham redundancies or unfair selection processes. South Australian public sector redundancies have specific provisions under the Public Sector Act 2009. Employment lawyers ensure proper processes and maximum entitlements.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Employment Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Fair Work Commission:</strong> 1300 799 675</li>
          <li><strong>Fair Work Ombudsman:</strong> 13 13 94</li>
          <li><strong>SA Equal Opportunity Commission:</strong> (08) 7322 7070</li>
          <li><strong>ReturnToWorkSA:</strong> 13 18 55</li>
          <li><strong>SafeWork SA:</strong> 1300 365 255</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Safety and Bullying</h3>
      <p>
        SafeWork SA enforces South Australia's Work Health and Safety Act 2012, including psychosocial hazards and workplace bullying. South Australian employers must provide safe systems of work and address workplace bullying. The Fair Work Commission handles workplace bullying applications. Workers compensation claims for psychological injury from workplace bullying are common. Employment lawyers advise on prevention, responding to complaints, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Employment Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.fairwork.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a></li>
          <li><a href="https://eoc.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SA Equal Opportunity Commission</a></li>
          <li><a href="https://www.rtwsa.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ReturnToWorkSA</a></li>
          <li><a href="https://www.safework.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SafeWork SA</a></li>
        </ul>
      </div>
    </>
  ),

  'personal-injury': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Personal Injury Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Personal injury law in South Australia helps victims of accidents and negligence obtain compensation. South Australia operates comprehensive compensation schemes including Compulsory Third Party (CTP) insurance for motor accidents, ReturnToWorkSA for workplace injuries, and common law claims for public liability and medical negligence. Experienced South Australian personal injury lawyers navigate these schemes to maximize your compensation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Motor Vehicle Accidents</h3>
      <p>
        South Australia's Compulsory Third Party (CTP) insurance scheme under the Civil Liability Act 1936 and Motor Vehicles Act 1959 provides compensation for injuries in motor accidents. CTP claims provide damages for medical expenses, loss of earnings, future care, pain and suffering, and economic loss. The 30% whole person impairment threshold applies for pain and suffering damages. Claims must be lodged within three years. Pre-court procedures including notice requirements and conferences are mandatory.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">CTP Claims Process</h4>
      <p>
        CTP claims involve notifying the insurer, gathering medical evidence, assessing impairment, and negotiating settlement or proceeding to court. South Australia's CTP scheme is fault-based, requiring proof of negligence. Personal injury lawyers conduct thorough investigations, obtain expert evidence, and maximize compensation. The District Court hears most CTP claims, with Supreme Court handling high-value matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Medical Negligence</h3>
      <p>
        Medical negligence claims in South Australia arise from substandard medical care causing injury. This includes misdiagnosis, surgical errors, medication mistakes, birth injuries, and failure to obtain informed consent. South Australian public hospitals are covered by the Crown, while private practitioners have professional indemnity insurance. The Civil Liability Act 1936 governs liability and damages. Expert medical evidence is essential. Time limits are generally three years from awareness of negligence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public Liability Claims</h3>
      <p>
        Public liability claims compensate injuries on another person's property or due to their negligence. Common claims include slip and fall in shopping centres, council property injuries, dog attacks, and defective products. South Australia's Civil Liability Act 1936 requires proving breach of duty of care and causation. Contributory negligence reduces compensation if you were partly at fault. Dangerous recreational activities may have limited liability. Personal injury lawyers investigate liability and negotiate with insurers.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers Compensation Claims</h3>
      <p>
        South Australian workers injured at work claim workers compensation through ReturnToWorkSA under the Return to Work Act 2014 for medical expenses, weekly payments, and impairment benefits. For serious injuries caused by employer negligence, common law damages claims provide substantially higher compensation. The serious injury test requires 30% whole person impairment. Time limits are strict - workers compensation claims should be lodged immediately, common law claims within three years. Specialist lawyers assess both statutory and common law entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Total and Permanent Disability (TPD)</h3>
      <p>
        TPD insurance, typically held through superannuation, pays lump sum benefits when unable to work due to injury or illness. South Australian TPD claims are common, with insurers frequently denying legitimate claims. Disputes involve medical evidence, policy interpretation, and TPD definitions. The Australian Financial Complaints Authority (AFCA) handles complaints. TPD lawyers represent claimants through the claims and appeals process.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dust Diseases and Asbestos</h3>
      <p>
        South Australian workers exposed to asbestos, silica, or other harmful dusts can develop serious diseases decades later. Asbestos-related diseases including mesothelioma, asbestosis, and asbestos-related lung cancer have special compensation provisions. ReturnToWorkSA administers workers compensation for dust diseases. Common law claims against former employers and asbestos product manufacturers provide additional compensation. Time limits are extended due to long latency periods. Specialist asbestos lawyers trace exposure history.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Personal Injury Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>ReturnToWorkSA:</strong> 13 18 55</li>
          <li><strong>Health and Community Services Complaints Commissioner:</strong> 1800 232 007</li>
          <li><strong>Legal Services Commission SA:</strong> 1300 366 424</li>
          <li><strong>Motor Accident Commission (Information):</strong> (08) 8233 2222</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dispute Resolution</h3>
      <p>
        Personal injury disputes in South Australia are often resolved through negotiation, mediation, or pre-trial conferences. The District Court and Supreme Court hear personal injury litigation. Mediation is encouraged before trial. Workers compensation disputes proceed through conciliation and arbitration. Medical panels determine impairment percentages. Personal injury lawyers guide clients through dispute resolution processes.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Personal Injury Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.rtwsa.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ReturnToWorkSA</a></li>
          <li><a href="https://www.hcscc.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Health and Community Services Complaints Commissioner</a></li>
          <li><a href="https://lsc.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Services Commission SA</a></li>
          <li><a href="https://www.courts.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Courts Administration Authority SA</a></li>
        </ul>
      </div>
    </>
  ),

  'business-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Business Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Business law in South Australia encompasses corporate law, commercial contracts, mergers and acquisitions, and regulatory compliance. Adelaide is an important business centre, with South Australia having diverse industries including defence, mining, agriculture, and technology. South Australian business lawyers advise on business formation, operations, transactions, and disputes to help businesses succeed while managing legal risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Formation and Structure</h3>
      <p>
        Choosing the right business structure is crucial. Options include sole trader, partnership, trust, or company. Companies are regulated by ASIC under the Corporations Act 2001. South Australian lawyers advise on tax implications, asset protection, liability, succession planning, and compliance requirements. Company incorporation involves registration with ASIC, constitution drafting, shareholder agreements, and compliance frameworks. Family businesses and agricultural enterprises often use trust structures.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Contracts</h3>
      <p>
        Commercial contracts underpin South Australian businesses. Common contracts include supply agreements, distribution agreements, service agreements, licensing, franchise agreements, and joint ventures. South Australian contract law requires offer, acceptance, consideration, and intention. The Australian Consumer Law imposes mandatory guarantees and unfair contract term prohibitions. Lawyers draft, review, and negotiate contracts protecting your business interests and ensuring enforceability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Franchising</h4>
      <p>
        Franchising in South Australia is regulated by the Franchising Code of Conduct requiring comprehensive disclosure before franchise sale. Franchisors must provide disclosure documents, financial information, and cooling-off periods. South Australian franchise disputes include misleading conduct, breach of franchise agreements, and goodwill claims. The Federal Court and Supreme Court hear franchise matters. Specialist franchise lawyers represent franchisors and franchisees in disputes and transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mergers and Acquisitions</h3>
      <p>
        Business acquisitions in South Australia involve due diligence, contract negotiation, regulatory approvals, and completion. Due diligence examines financial records, contracts, litigation, intellectual property, employment, and tax. Share sales transfer ownership of the company entity. Asset sales transfer specific business assets. Earn-out provisions, warranties, and indemnities protect buyers. Competition law clearance may be required. Corporate lawyers coordinate complex acquisitions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Partnership and Shareholder Agreements</h3>
      <p>
        Partnership agreements govern business partnerships under the Partnership Act 1891 (SA). Shareholder agreements regulate relationships between company shareholders addressing management, share transfers, dispute resolution, and exit strategies. Buy-sell provisions, drag-along and tag-along rights, and valuation mechanisms prevent deadlocks. South Australian courts handle partnership and shareholder disputes including oppression claims under section 232 Corporations Act. Proper agreements prevent costly disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Disputes</h3>
      <p>
        South Australian businesses face disputes including contract breaches, partnership disputes, shareholder disputes, trade practices claims, and debt recovery. SACAT handles smaller commercial matters. District Court and Supreme Court hear larger disputes. Mediation and arbitration provide alternatives to litigation. Business lawyers resolve disputes efficiently through negotiation, alternative dispute resolution, or court proceedings when necessary.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Business Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Business SA:</strong> (08) 8300 0000</li>
          <li><strong>Consumer and Business Services:</strong> 131 882</li>
          <li><strong>Australian Competition and Consumer Commission:</strong> 1300 302 502</li>
          <li><strong>Small Business Commissioner SA:</strong> 131 882</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Regulatory Compliance</h3>
      <p>
        South Australian businesses must comply with extensive regulation including Australian Consumer Law, workplace relations laws, privacy laws, taxation laws, and industry-specific regulation. Directors have statutory duties including duty of care, duty to prevent insolvent trading, and duty to avoid conflicts. ASIC enforces corporate regulation. Consumer and Business Services regulates various industries. Business lawyers ensure regulatory compliance and defend investigations.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Business Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.business.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business SA</a></li>
          <li><a href="https://www.cbs.sa.gov.au/businesses" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer and Business Services - Business</a></li>
          <li><a href="https://www.treasury.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SA Treasury</a></li>
          <li><a href="https://asic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC</a></li>
        </ul>
      </div>
    </>
  ),

  'immigration-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Immigration Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Immigration law in South Australia operates under federal legislation including the Migration Act 1958 and Migration Regulations. Adelaide attracts skilled migrants, international students, family migrants, and business migrants. South Australia's state nomination program provides pathways to permanent residence. Registered migration agents and immigration lawyers guide applicants through complex visa processes and represent clients in tribunals and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Categories</h3>
      <p>
        Australia's visa system includes temporary visas (visitor, student, temporary work) and permanent visas (skilled, family, business). South Australia's state nomination program for skilled migrants targets occupations in demand including healthcare, education, engineering, IT, and trades. Adelaide's growing economy creates opportunities across multiple sectors. Visa applications require meeting health, character, and specific visa criteria. Processing times vary significantly by visa type and applicant circumstances.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Skilled Migration</h4>
      <p>
        Skilled migration to South Australia includes independent skilled visas, state-nominated visas, and employer-sponsored visas. South Australia's state nomination program provides pathways for occupations on the state's skilled occupation list. Points-tested visas require meeting points threshold through age, English, qualifications, and work experience. Skills assessments verify qualifications meet Australian standards. Regional South Australia offers additional migration pathways with lower point requirements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Family Migration</h3>
      <p>
        Partner visas allow Australian citizens, permanent residents, and eligible New Zealand citizens to sponsor spouses and de facto partners. Prospective marriage visas require intent to marry within nine months. Parent visas have long waiting periods with contributory options providing faster processing. Child visas and remaining relative visas complete family migration categories. South Australia's multicultural population makes family reunification common.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business and Investment Migration</h3>
      <p>
        Business Innovation and Investment visas attract entrepreneurs and investors to South Australia. The Business Innovation stream requires successful business experience and genuine intention to operate South Australian business. Investor streams require designated investments in Australian assets. South Australia's state nomination program prioritizes genuine business establishment in growth sectors including agribusiness, defence, and technology. Business advisers assist migrant entrepreneurs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Student Visas</h3>
      <p>
        Adelaide's universities and colleges attract international students. Student visas require enrollment in registered courses, sufficient funds, health insurance, and genuine temporary entrant requirements. Post-study work visas allow graduates to gain Australian work experience. Adelaide's regional classification may provide additional visa benefits. Visa conditions restrict work hours during studies. Education agents and migration lawyers assist with visa applications and compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Citizenship</h3>
      <p>
        Australian citizenship requires permanent residence, residency period (usually four years including 12 months as permanent resident), good character, and knowledge of Australia. Citizenship confers voting rights, passport eligibility, and government employment access. Children born in Australia to permanent residents or citizens are usually Australian citizens. Citizenship by descent applies to children born overseas to Australian citizen parents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Refusals and Cancellations</h3>
      <p>
        Visa refusals and cancellations can be reviewed by the Administrative Review Tribunal (ART, formerly AAT). Character cancellations under section 501 Migration Act affect visa holders with criminal records. Direction 99 guides decision-makers on character cancellations considering family ties and community protection. Federal Circuit and Family Court and Federal Court hear judicial review applications. Immigration lawyers represent clients in tribunal and court proceedings.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Immigration Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Home Affairs:</strong> 131 881</li>
          <li><strong>Administrative Review Tribunal:</strong> 1800 228 333</li>
          <li><strong>Refugee Council of Australia:</strong> (02) 9211 9333</li>
          <li><strong>Multicultural Communities Council of SA:</strong> (08) 8345 5266</li>
          <li><strong>Migration Agents Registration Authority:</strong> (07) 3360 3888</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Deportation and Removal</h3>
      <p>
        Unlawful non-citizens face detention and removal from Australia. Visa cancellations for character or compliance reasons result in removal. Ministerial intervention under sections 48B, 351, or 417 provides last resort options. Bridging visas allow lawful stay while matters are resolved. Detention reviews are available through the Administrative Review Tribunal. Immigration lawyers urgently respond to detention and deportation matters.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Immigration Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.homeaffairs.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Home Affairs</a></li>
          <li><a href="https://www.aat.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Administrative Review Tribunal</a></li>
          <li><a href="https://www.studyadelaide.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Study Adelaide</a></li>
          <li><a href="https://www.migration.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Migration SA</a></li>
        </ul>
      </div>
    </>
  ),

  'litigation': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Litigation in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Litigation in South Australia encompasses civil and commercial disputes resolved through courts and tribunals. South Australia's court system includes the Magistrates Court, District Court, Supreme Court, and specialized tribunals. Effective litigation requires strategic advice, thorough preparation, and skilled advocacy. South Australian litigation lawyers represent clients in all forums, from small claims to complex commercial disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">South Australian Court System</h3>
      <p>
        South Australia's Magistrates Court handles claims up to $100,000 and criminal summary matters. The District Court has unlimited civil jurisdiction (with some exceptions) and hears most criminal trials. The Supreme Court handles complex commercial matters, judicial review, and appeals. The South Australian Civil and Administrative Tribunal (SACAT) provides accessible dispute resolution for civil, administrative, and tenancy matters. The Federal Circuit and Family Court and Federal Court operate in Adelaide for federal matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Civil Litigation</h3>
      <p>
        Civil litigation includes contract disputes, negligence claims, property disputes, and debt recovery. South Australian civil procedure follows the Magistrates Court Act 1991, District Court Act 1991, and Supreme Court Civil Rules 2006 emphasizing case management, proportionality, and alternative dispute resolution. Pre-action procedures encourage early resolution. Discovery, expert evidence, and interlocutory applications require compliance with rules and practice directions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Commercial Litigation</h4>
      <p>
        Commercial litigation involves business disputes including contract breaches, shareholder disputes, partnership disputes, intellectual property, and trade practices. The Supreme Court's Commercial List provides specialized case management. Freezing orders, search orders, and security for costs protect parties' positions. South Australian commercial litigation often involves agricultural, mining, and defence industry disputes. Litigation lawyers strategically manage disputes to achieve commercial outcomes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Alternative Dispute Resolution</h3>
      <p>
        Mediation and arbitration offer alternatives to court litigation. South Australian courts encourage mediation in many matters. The courts operate mediation services. Private mediators and arbitrators resolve disputes confidentially and efficiently. Arbitration awards are enforceable like court judgments. Expert determination resolves technical disputes. ADR reduces costs and provides flexible outcomes. Lawyers advise on ADR suitability and represent clients in ADR processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Recovery</h3>
      <p>
        Debt recovery through South Australian courts involves issuing proceedings, default judgments, or defended hearings. Judgment enforcement includes garnishee orders, instalment orders, warrants for sale, and examination summonses. Bankruptcy and winding up proceedings pressure debtors to pay. South Australian debt collection laws protect debtors from harassment under the Fair Trading Act 1987. Creditors' lawyers strategically recover debts while managing costs and risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Building and Construction Disputes</h3>
      <p>
        Building disputes in South Australia involve defective work, cost overruns, delays, and payment disputes. The Building Work Contractors Act 1995 regulates residential building. Security of payment legislation provides rapid adjudication of payment claims under the Building and Construction Industry Security of Payment Act 2009. Consumer and Business Services investigates builder conduct. SACAT resolves domestic building disputes. District Court and Supreme Court handle complex commercial construction litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Defamation</h3>
      <p>
        Defamation in South Australia involves publication of material harming reputation. The Defamation Act 2005 provides uniform national defamation law. Defences include truth, honest opinion, and qualified privilege. Offers to make amends can resolve matters early. Concerns notices and limitation periods require prompt action. Social media defamation is increasingly common. Supreme Court handles defamation proceedings. Defamation lawyers advise publishers and plaintiffs on rights and risks.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Litigation Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of South Australia:</strong> (08) 8204 0289</li>
          <li><strong>District Court of South Australia:</strong> (08) 8204 0533</li>
          <li><strong>Magistrates Court of SA:</strong> (08) 8204 2444</li>
          <li><strong>South Australian Civil and Administrative Tribunal:</strong> 1800 723 767</li>
          <li><strong>Law Society of South Australia:</strong> (08) 8229 0200</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Costs and Funding</h3>
      <p>
        South Australian litigation costs follow the principle that unsuccessful parties pay winners' costs. Security for costs may be ordered against plaintiffs. Costs disclosure obligations require lawyers to inform clients of likely costs. No win, no fee arrangements are available for some matters. Litigation funding provides financial support for claims in exchange for success fees. South Australian courts scrutinize disproportionate costs. Lawyers provide realistic cost estimates and strategic advice on litigation economics.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Litigation Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.courts.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Courts Administration Authority SA</a></li>
          <li><a href="https://www.sacat.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SACAT</a></li>
          <li><a href="https://www.lawsocietysa.asn.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Law Society of South Australia</a></li>
          <li><a href="https://lsc.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Services Commission SA</a></li>
        </ul>
      </div>
    </>
  ),

  'bankruptcy-insolvency': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Bankruptcy and Insolvency in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Bankruptcy and insolvency law in South Australia helps individuals and companies facing financial difficulties. The Bankruptcy Act 1966 governs personal insolvency, while the Corporations Act 2001 governs corporate insolvency. South Australia has experienced insolvency practitioners and lawyers who advise on bankruptcy alternatives, restructuring, and formal insolvency processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Personal Bankruptcy</h3>
      <p>
        Bankruptcy is a formal process where an individual is declared unable to pay debts. Bankruptcy can be voluntary (debtor's petition) or involuntary (creditor's petition). A trustee takes control of assets, realizes them, and distributes to creditors. Bankruptcy typically lasts three years. During bankruptcy, travel restrictions apply, credit reporting continues for five years, and certain assets are protected including household items, tools of trade, and some superannuation. Bankruptcy discharges most debts excluding child support, HECS, and fraud debts.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternatives to Bankruptcy</h4>
      <p>
        Debt agreements under Part IX Bankruptcy Act allow debtors to propose reduced payment arrangements to creditors avoiding bankruptcy. Personal insolvency agreements (Part X) provide flexible arrangements for higher-value estates. Informal arrangements negotiate payment plans with creditors. These alternatives avoid bankruptcy's consequences while addressing debt. South Australian insolvency practitioners assess options and implement solutions. Early advice maximizes options and prevents forced bankruptcy.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Corporate Insolvency</h3>
      <p>
        Companies facing insolvency have several options. Voluntary administration under Part 5.3A Corporations Act provides breathing space while administrators investigate rescue prospects. Creditors vote on proposals including deeds of company arrangement. Liquidation winds up companies and distributes assets to creditors. Receivers can be appointed by secured creditors. Directors facing insolvent trading allegations face personal liability. Early advice prevents wrongful trading and maximizes restructuring options.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Liquidation</h3>
      <p>
        Liquidation ends company existence through voluntary liquidation (members' or creditors') or court-ordered winding up. Liquidators realize assets, investigate company affairs, and distribute to creditors according to priority. Employees rank ahead of unsecured creditors for wages and entitlements. Liquidators pursue voidable transactions including unfair preferences and uncommercial transactions. ASIC regulates liquidators. Creditors receive dividends if assets remain after secured and priority creditors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Voluntary Administration</h3>
      <p>
        Voluntary administration provides companies with temporary protection from creditors while exploring rescue options. Administrators investigate company affairs and report to creditors on prospects of saving business. Creditors vote on proposals including deeds of company arrangement, liquidation, or returning company to directors. South Australian administrators work with directors, creditors, and employees to achieve optimal outcomes. Administration can result in successful restructuring saving businesses and jobs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Creditors' Rights</h3>
      <p>
        Creditors can initiate bankruptcy or winding up proceedings to recover debts. Statutory demands under section 459E Corporations Act require companies to pay debts or face presumed insolvency. Creditors lodge proofs of debt in administrations and liquidations. Committees of inspection represent creditor interests. Creditors can challenge administrators' and liquidators' decisions. Security interests under the Personal Property Securities Act provide priority. Insolvency lawyers represent creditors maximizing recoveries.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Bankruptcy & Insolvency Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Financial Security Authority:</strong> 1300 364 785</li>
          <li><strong>ASIC Insolvency Practitioners:</strong> 1300 300 630</li>
          <li><strong>National Debt Helpline:</strong> 1800 007 007</li>
          <li><strong>Financial Counselling SA:</strong> 1800 007 007</li>
          <li><strong>Small Business Commissioner SA:</strong> 131 882</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Directors' Duties and Insolvent Trading</h3>
      <p>
        Directors must prevent insolvent trading - incurring debts when company cannot pay them. Section 588G Corporations Act imposes personal liability on directors for insolvent trading. Safe harbour protections apply when directors develop and implement restructuring plans. The business judgment rule protects informed, good faith decisions. ASIC prosecutes serious director breaches. South Australian insolvency lawyers advise directors on duties, safe harbour, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Bankruptcy & Insolvency Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.afsa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Financial Security Authority</a></li>
          <li><a href="https://asic.gov.au/regulatory-resources/insolvency/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC Insolvency Information</a></li>
          <li><a href="https://www.arita.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ARITA - Australian Restructuring Insolvency & Turnaround Association</a></li>
          <li><a href="https://www.cbs.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer and Business Services SA</a></li>
        </ul>
      </div>
    </>
  ),

  'intellectual-property': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Intellectual property law protects creations of the mind including inventions, brands, designs, and creative works. South Australia's growing innovation economy, particularly in defence, technology, wine, and creative sectors, makes IP protection essential. South Australian IP lawyers advise on registration, protection, commercialization, and enforcement of intellectual property rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trademarks</h3>
      <p>
        Trademarks protect brand names, logos, and other identifiers under the Trade Marks Act 1995. Registration with IP Australia provides exclusive rights to use marks for registered goods and services. South Australian businesses should conduct searches before adoption, register in relevant classes, and monitor for infringement. Trademark protection prevents consumer confusion and protects brand investment. Opposition and cancellation proceedings defend trademark rights. Lawyers advise on selection, registration, and enforcement.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Copyright</h3>
      <p>
        Copyright automatically protects original works including literary works, artistic works, music, films, sound recordings, and broadcasts under the Copyright Act 1968. Protection lasts life of author plus 70 years. Copyright protects expression, not ideas. Fair dealing exceptions allow limited use for research, criticism, and news reporting. Digital copyright issues are increasingly important. Copyright assignment and licensing agreements commercialize works. Infringement remedies include damages, accounts of profits, and injunctions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Patents</h3>
      <p>
        Patents protect inventions that are novel, inventive, and useful under the Patents Act 1990. Standard patents last 20 years; innovation patents (abolished 2021 for new applications) lasted 8 years. The patent process involves search, application, examination, and grant. Provisional applications establish priority for 12 months. South Australian innovation in defence technology, medical devices, and agriculture generates significant patent activity. Patent lawyers conduct searches, draft specifications, prosecute applications, and enforce patents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Designs</h3>
      <p>
        Registered designs protect visual appearance of products including shape, configuration, pattern, and ornamentation under the Designs Act 2003. Protection lasts up to 10 years. Designs must be new and distinctive. Registration is relatively quick and affordable. Product designers and manufacturers should register designs before public disclosure. Design infringement involves making, importing, or selling products embodying registered designs. South Australian product design industries benefit from design protection.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trade Secrets and Confidential Information</h3>
      <p>
        Trade secrets protect confidential business information including formulas, processes, customer lists, and know-how. Unlike registered IP rights, trade secrets rely on maintaining secrecy. Breach of confidence claims prevent unauthorized disclosure or use. Employment contracts and non-disclosure agreements protect confidential information. South Australian courts grant injunctions preventing disclosure and damages for breaches. IP lawyers draft protection agreements and pursue breaches.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Commercialization</h3>
      <p>
        IP commercialization includes licensing, assignment, and joint ventures. Licensing agreements grant rights to use IP while retaining ownership. Exclusive licenses provide sole licensee rights; non-exclusive licenses permit multiple licensees. Royalty structures compensate IP owners. Due diligence examines IP ownership and validity. R&D tax incentives support South Australian innovation. IP lawyers negotiate and draft commercialization agreements maximizing value while protecting rights.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian IP Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>IP Australia:</strong> 1300 65 10 10</li>
          <li><strong>Copyright Agency:</strong> 1800 066 844</li>
          <li><strong>Australian Copyright Council:</strong> (02) 8815 9777</li>
          <li><strong>Law Society of SA (IP Referrals):</strong> (08) 8229 0200</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Enforcement</h3>
      <p>
        IP infringement is enforced through Federal Court proceedings. Remedies include injunctions, damages, accounts of profits, and delivery up of infringing goods. Australian Border Force can seize counterfeit imports. Anton Piller orders (search orders) preserve evidence. Cease and desist letters often resolve matters without litigation. South Australian IP owners should actively monitor and enforce rights. Lawyers advise on infringement, conduct negotiations, and litigate when necessary.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian IP Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ipaustralia.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IP Australia</a></li>
          <li><a href="https://www.copyright.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Copyright Council</a></li>
          <li><a href="https://ipta.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Intellectual Property Society of Australia and New Zealand</a></li>
          <li><a href="https://www.business.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business SA</a></li>
        </ul>
      </div>
    </>
  ),

  'tax-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Tax Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Tax law in South Australia encompasses federal taxation administered by the Australian Taxation Office and state taxes administered by RevenueSA. South Australian tax lawyers advise individuals and businesses on tax planning, compliance, disputes, and restructuring to minimize tax liabilities and resolve ATO disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Income Tax</h3>
      <p>
        Income tax applies to individuals, companies, trusts, and superannuation funds under federal tax law. South Australian taxpayers face the same income tax rates as other Australians. Tax planning includes structuring income, maximizing deductions, timing transactions, and utilizing concessions. Small business CGT concessions provide significant relief for business asset sales. Negative gearing remains important for South Australian property investors. Tax lawyers advise on complex transactions, restructures, and ATO audits.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Goods and Services Tax (GST)</h4>
      <p>
        GST at 10% applies to most supplies of goods and services. Businesses with turnover over $75,000 ($150,000 for non-profits) must register. Input tax credits allow GST-registered businesses to claim back GST on purchases. GST-free supplies include basic food, health, and education. Complex GST issues arise in property transactions, financial supplies, and margin schemes. South Australian property developments and agricultural businesses involve significant GST considerations. Tax advisers ensure GST compliance and optimal structuring.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">State Taxes - Stamp Duty and Land Tax</h3>
      <p>
        South Australia imposes stamp duty on property transfers, business asset sales, motor vehicle transfers, and insurance. Rates vary by transaction type. Property stamp duty uses progressive rates with first home buyer concessions. Land tax applies annually to South Australian land holdings above thresholds with aggregation rules. Principal place of residence exemption excludes main homes. Primary production land has special provisions. RevenueSA administers these taxes with objection and appeal rights to SACAT and Supreme Court.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Payroll Tax</h3>
      <p>
        South Australian employers with Australian wages exceeding the threshold ($1.5 million for 2023-24) pay payroll tax at 4.95%. Regional employers receive rate reductions. Grouping provisions aggregate related businesses' wages. Contractors may be deemed employees for payroll tax. RevenueSA audits ensure compliance. Voluntary disclosures provide penalty relief. Tax lawyers advise on payroll tax obligations, grouping, and disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Disputes and Audits</h3>
      <p>
        ATO audits examine tax returns for compliance. Taxpayers have rights including representation and reasonable time to respond. Objections challenge ATO decisions with 60-day time limits (four years for small businesses). The Administrative Review Tribunal reviews objection decisions. Federal Court hears appeals on questions of law. South Australian taxpayers frequently dispute Part IVA general anti-avoidance provisions, transfer pricing, and trust distributions. Tax lawyers represent clients in audits, objections, and litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Planning and Restructuring</h3>
      <p>
        Tax planning minimizes tax within legal boundaries. Common strategies include income splitting through family trusts, superannuation contributions, negative gearing, and asset protection structures. Business restructures utilize rollover provisions avoiding immediate tax. South Australian agricultural businesses have specific tax planning opportunities. Voluntary disclosures to ATO reduce penalties for past non-compliance. Tax lawyers design compliant structures achieving tax efficiency.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Tax Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Taxation Office:</strong> 13 28 61 (individuals), 13 28 66 (businesses)</li>
          <li><strong>RevenueSA:</strong> (08) 8226 3750</li>
          <li><strong>Tax Practitioners Board:</strong> (03) 9200 8800</li>
          <li><strong>Inspector-General of Taxation:</strong> 1800 199 010</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Superannuation</h3>
      <p>
        Superannuation enjoys concessional tax treatment to encourage retirement savings. Contributions are taxed at 15% (30% for high earners). Earnings taxed at 15% in accumulation phase, tax-free in pension phase. Superannuation death benefits have tax implications depending on beneficiary and payment type. Self-managed superannuation funds (SMSFs) require careful administration and compliance. South Australian SMSF trustees face auditor and ATO scrutiny. Tax advisers optimize superannuation strategies.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Tax Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ato.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Taxation Office</a></li>
          <li><a href="https://www.revenuesa.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">RevenueSA</a></li>
          <li><a href="https://www.tpb.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tax Practitioners Board</a></li>
          <li><a href="https://www.igt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Inspector-General of Taxation</a></li>
        </ul>
      </div>
    </>
  ),

  'environmental-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Environmental Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Environmental law in South Australia regulates environmental protection, land use planning, and natural resource management. The Environment Protection Act 1993 provides South Australia's environmental framework with the Environment Protection Authority as principal regulator. South Australian environmental lawyers advise on compliance, planning, contaminated land, mining, and environmental litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Environment Protection</h3>
      <p>
        South Australia's Environment Protection Act 1993 implements general environmental duty requiring persons not to cause environmental harm. The EPA SA issues environmental authorizations for activities with pollution potential. Industrial premises require EPA licenses. Pollution incidents must be reported. EPA can issue environment protection orders, clean-up orders, and prosecution. Environmental lawyers advise on duty compliance and respond to EPA action.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Planning and Development</h3>
      <p>
        South Australia's Planning, Development and Infrastructure Act 2016 regulates land use and development. The Planning and Design Code controls development through zones and overlays. Development approval required for most development. Assessment may be by local councils, regional assessment panels, or the State Commission Assessment Panel. The Environment, Resources and Development Court hears planning appeals. Environmental impact assessments may be required. Planning lawyers obtain approvals, defend objections, and appeal decisions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Contaminated Land</h4>
      <p>
        Contaminated land creates liability for current and former owners, occupiers, and polluters under the Environment Protection Act. EPA maintains site contamination register. Site contamination audits certify land as suitable for use. Due diligence investigations identify contamination risks. Cleanup costs can be substantial. Environmental lawyers advise purchasers, vendors, and responsible parties on contaminated land issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Native Title and Cultural Heritage</h3>
      <p>
        Native title recognizes Indigenous rights to traditional lands. Native title claims in South Australia are determined by Federal Court. The Aboriginal Heritage Act 1988 protects Aboriginal heritage. Heritage surveys and consultations with traditional owners are required for development. Unauthorized damage to Aboriginal heritage is an offence. Developers engage with traditional owner groups and obtain heritage clearances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mining and Resources</h3>
      <p>
        Mining in South Australia requires licenses under the Mining Act 1971 and Petroleum and Geothermal Energy Act 2000. The Department for Energy and Mining regulates mining and resources. Program for Environment Protection and Rehabilitation (PEPR) addresses environmental management. Rehabilitation bonds ensure site restoration. South Australia's copper, uranium, gold, and oil and gas industries are significant. Mining lawyers obtain approvals and advise on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Climate Change and Renewable Energy</h3>
      <p>
        South Australia has ambitious renewable energy targets with high renewable energy penetration. The Climate Change and Greenhouse Emissions Reduction Act 2007 establishes targets. South Australia leads wind and solar development. Planning reforms facilitate renewable energy projects. National Greenhouse and Energy Reporting requires emissions reporting. Environmental lawyers advise on renewable energy projects, climate governance, and regulatory compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Environmental Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Environment Protection Authority SA:</strong> (08) 8204 2004</li>
          <li><strong>Department for Environment and Water:</strong> (08) 8204 1910</li>
          <li><strong>Planning and Land Use Services:</strong> 1800 752 664</li>
          <li><strong>Aboriginal Affairs and Reconciliation:</strong> (08) 8226 8900</li>
          <li><strong>Department for Energy and Mining:</strong> (08) 8463 3000</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Water and Biodiversity</h3>
      <p>
        South Australian water resources are managed under the Natural Resources Management Act 2004 and Landscape South Australia Act 2019. Water licenses required for taking water. Environmental water protects environmental flows. South Australia's Murray-Darling Basin water management is significant. The National Parks and Wildlife Act 1972 protects native vegetation and wildlife. Developers must consider biodiversity impacts and native vegetation clearance approvals.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Environmental Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.epa.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Environment Protection Authority SA</a></li>
          <li><a href="https://www.environment.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department for Environment and Water</a></li>
          <li><a href="https://plan.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SA Planning Portal</a></li>
          <li><a href="https://www.energymining.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department for Energy and Mining</a></li>
        </ul>
      </div>
    </>
  ),

  'administrative-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrative Law in South Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Administrative law in South Australia governs the exercise of government power and review of government decisions. The South Australian Civil and Administrative Tribunal (SACAT), Ombudsman SA, and courts review administrative action. Administrative lawyers challenge unlawful decisions, ensure procedural fairness, and hold government accountable to the rule of law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">SACAT Review</h3>
      <p>
        SACAT reviews state government decisions across diverse areas including planning, building, tenancy, guardianship, occupational regulation, and discrimination. SACAT provides accessible, low-cost review with less formality than courts. The enabling Act for each decision specifies review rights and grounds. SACAT conducts hearings de novo or on review basis depending on jurisdiction. Lawyers represent parties in SACAT proceedings, ensuring procedural rights and presenting persuasive cases.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Judicial Review</h3>
      <p>
        Judicial review challenges government decisions on legal grounds including jurisdictional error, procedural unfairness, taking irrelevant considerations into account, failing to consider relevant matters, and unreasonableness. The Supreme Court's judicial review jurisdiction covers South Australian government decisions. Federal Court reviews Commonwealth decisions. Judicial review doesn't substitute decision-maker's discretion but ensures lawful exercise. Remedies include quashing decisions, mandamus compelling action, and declarations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Procedural Fairness</h4>
      <p>
        Procedural fairness (natural justice) requires fair hearing and unbiased decision-makers. The hearing rule requires notice, opportunity to be heard, and consideration of submissions. The bias rule requires actual or apprehended freedom from bias. South Australian decision-makers must comply unless legislation clearly excludes fairness. Lawyers challenge decisions lacking procedural fairness and advise government on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Ombudsman SA</h3>
      <p>
        Ombudsman SA investigates complaints about South Australian government agencies, local councils, and certain public bodies under the Ombudsman Act 1972. The Ombudsman can investigate administrative action, conduct own-motion investigations, and make recommendations. Ombudsman investigations are free and accessible. Findings aren't binding but carry significant weight. Whistleblower protections apply for public interest disclosures. The Ombudsman's annual reports highlight systemic issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Freedom of Information</h3>
      <p>
        South Australia's Freedom of Information Act 1991 provides rights to access government documents. South Australian government agencies, local councils, and statutory authorities are subject to FOI. FOI requests are made in writing. Agencies must respond within 30 days. Exemptions protect cabinet documents, personal privacy, law enforcement, and commercial confidentiality. Ombudsman SA reviews FOI decisions. SACAT provides further review. FOI promotes government transparency and accountability.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Privacy and Data Protection</h3>
      <p>
        South Australia doesn't have standalone privacy legislation but public sector agencies are subject to Information Privacy Principles under administrative directions. The Health Care Act 2008 regulates health information. Personal information must be handled appropriately. Data breaches should be managed appropriately. Privacy lawyers advise government and individuals on privacy rights and obligations under applicable frameworks.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important South Australian Administrative Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>South Australian Civil and Administrative Tribunal:</strong> 1800 723 767</li>
          <li><strong>Ombudsman SA:</strong> (08) 8226 8699</li>
          <li><strong>Supreme Court of SA:</strong> (08) 8204 0289</li>
          <li><strong>SA Equal Opportunity Commission:</strong> (08) 7322 7070</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Government and Public Law</h3>
      <p>
        South Australian constitutional law governs Parliament, Executive, and Judiciary relationships. The Constitution Act 1934 establishes South Australia's constitutional framework. Parliamentary sovereignty, separation of powers, and rule of law are fundamental principles. Statutory interpretation principles guide understanding legislation. South Australian public lawyers advise government on lawful exercise of power, legislative drafting, and constitutional issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Equal Opportunity</h3>
      <p>
        South Australia's Equal Opportunity Act 1984 prohibits discrimination based on protected attributes including sex, race, age, disability, sexual orientation, and gender identity. The South Australian Equal Opportunity Commission investigates complaints and attempts conciliation. Unresolved matters proceed to SACAT. Public authorities must eliminate discrimination and promote equal opportunity. Administrative lawyers argue discrimination matters in SACAT proceedings.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful South Australian Administrative Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.sacat.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">South Australian Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.ombudsman.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Ombudsman SA</a></li>
          <li><a href="https://eoc.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">SA Equal Opportunity Commission</a></li>
          <li><a href="https://www.courts.sa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Courts Administration Authority SA</a></li>
        </ul>
      </div>
    </>
  ),
}

// Western Australia Practice Area Content
const WA_CONTENT: Record<string, React.ReactElement> = {
  'family-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Family Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Family law in Western Australia operates under federal legislation including the Family Law Act 1975, with state courts handling specific matters such as violence restraining orders. Western Australia has comprehensive family law resources across Perth and regional centres, with the Federal Circuit and Family Court providing services for families dealing with separation, divorce, and parenting disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Family Law in Western Australia</h3>
      <p>
        Western Australian family lawyers handle divorce, property settlements, parenting arrangements, spousal maintenance, and de facto relationship matters. The Federal Circuit and Family Court of Australia operates from Perth (Central Law Courts). Western Australia's Magistrates Court handles family violence restraining orders and violence restraining orders, which frequently intersect with family law proceedings. The state has extensive family law practitioners across metropolitan and regional areas.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Areas of Family Law Practice</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Divorce and Separation</h4>
      <p>
        Divorce in Western Australia requires 12 months separation. Separation under one roof is recognized where couples can demonstrate living separately. Western Australian lawyers assist with divorce applications, address service complications including remote service requirements, and handle disputed separation dates. The Federal Circuit and Family Court in Perth processes divorce applications, with most matters proceeding undefended after satisfying the 12-month separation requirement.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Child Custody and Parenting Arrangements</h4>
      <p>
        Parenting matters prioritize children's best interests under the Family Law Act. Western Australia encourages parenting plans negotiated between parents without court intervention. When agreement isn't possible, parenting orders address living arrangements, parenting time, parental responsibility, and child support. Western Australian courts consider children's views, relationship with both parents, family violence history, and the benefit of meaningful relationships. Independent Children's Lawyers are appointed in complex cases.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Property Settlement</h4>
      <p>
        Property settlement involves identifying the asset pool, assessing contributions (financial and non-financial), considering future needs including health and earning capacity, and determining just and equitable division. Perth's property values and Western Australia's mining industry wealth require expert valuations. Superannuation splitting and complex assets including businesses, trusts, and mining interests require specialist legal advice. Western Australian property settlements often involve FIFO workers and remote employment considerations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">De Facto Relationships</h4>
      <p>
        Western Australia's relationship property laws largely mirror married couple provisions under federal jurisdiction, with state laws also applying under the Family Court Act 1997 (WA). De facto couples in Western Australia have the same family law rights as married couples if the relationship lasted two years or there are children. Western Australia recognizes same-sex de facto relationships. Evidence requirements include cohabitation, financial interdependence, sexual relationship, and social recognition.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Family Violence Restraining Orders</h4>
      <p>
        Western Australia's Restraining Orders Act 1997 provides for family violence restraining orders (FVROs) and violence restraining orders (VROs) through Magistrates' Courts. FVROs protect family members from family violence including physical, sexual, psychological, and economic abuse. Police can apply for restraining orders and issue police orders. Breaching a restraining order is a criminal offence. Western Australia has comprehensive family violence support services. Legal aid is available for restraining order matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Western Australia-Specific Resources</h3>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Family Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Women's Domestic Violence Helpline:</strong> 1800 007 339 (24/7)</li>
          <li><strong>Men's Domestic Violence Helpline:</strong> 1800 000 599 (24/7)</li>
          <li><strong>Family Relationship Advice Line:</strong> 1800 050 321</li>
          <li><strong>Legal Aid WA Family Law:</strong> 1300 650 579</li>
          <li><strong>Federal Circuit and Family Court (Perth):</strong> (08) 9268 7222</li>
          <li><strong>Women's Legal Service WA:</strong> (08) 9272 8800</li>
          <li><strong>Aboriginal Family Law Service WA:</strong> (08) 9328 3990</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Locations in Western Australia</h3>
      <p>
        The Federal Circuit and Family Court operates from Perth's Central Law Courts. Western Australia's Magistrates Courts across the state handle restraining order matters. Perth has the principal family law registry. Regional Western Australia including Bunbury, Geraldton, Kalgoorlie, and the Kimberley is serviced through circuit sittings, video conferencing, and regional court appearances. Western Australia's vast geography creates unique access to justice challenges.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Family Dispute Resolution</h3>
      <p>
        Family Dispute Resolution (FDR) is required before filing parenting applications, with parties obtaining section 60I certificates. Western Australia has Family Relationship Centres in Perth and regional areas offering FDR services. Private mediators and collaborative law approaches are available. FDR isn't required where family violence exists or urgency dictates immediate court intervention. Western Australian family lawyers facilitate dispute resolution and represent clients when court proceedings are necessary.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Legal Aid and Support Services</h3>
      <p>
        Legal Aid Western Australia provides family law assistance to eligible Western Australians, prioritizing victims of family violence and matters involving children. Women's Legal Service WA, Aboriginal Family Law Service WA, and community legal centres across Perth and regional Western Australia offer free advice and representation. Family violence duty lawyers assist restraining order applicants at court.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Government Links:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.wa.gov.au/organisation/department-of-communities/family-and-domestic-violence" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WA Government - Family and Domestic Violence</a></li>
          <li><a href="https://www.legalaid.wa.gov.au/about-us/what-we-do/family-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid WA - Family Law</a></li>
          <li><a href="https://www.wlswa.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Women's Legal Service WA</a></li>
          <li><a href="https://www.aflswa.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Aboriginal Family Law Service WA</a></li>
        </ul>
      </div>
    </>
  ),

  'criminal-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Criminal Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Criminal law in Western Australia operates under the Criminal Code Act Compilation Act 1913, one of Australia's oldest criminal codes. Western Australia has a comprehensive criminal justice system from the Magistrates Court through to the District Court and Supreme Court. If you're facing criminal charges in Western Australia, experienced legal representation is essential to protect your rights and achieve the best possible outcome.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Western Australian Criminal Law</h3>
      <p>
        Western Australian criminal lawyers defend clients charged with offences ranging from traffic matters to serious indictable crimes. The Magistrates Court handles summary offences and committal proceedings. The District Court hears most indictable offences including drug trafficking, serious assaults, and armed robbery. The Supreme Court deals with murder, manslaughter, and complex serious crimes. Western Australia's criminal justice system includes rehabilitation programs and therapeutic courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Common Criminal Matters</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drink Driving and Traffic Offences</h4>
      <p>
        Western Australia has strict drink driving laws with immediate licence disqualifications. Offences include exceeding .05 blood alcohol concentration (.08 for prescribed offence), driving under the influence, and drug driving. Loss of licence mandatory minimum periods apply. Dangerous driving causing death or grievous bodily harm carries substantial imprisonment. Extraordinary licence applications allow limited driving for work or hardship. Traffic lawyers challenge testing procedures, apply for extraordinary licences, and minimize penalties.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Assault and Violence Offences</h4>
      <p>
        Western Australian assault charges include common assault, assault causing bodily harm, assault occasioning bodily harm, and grievous bodily harm. Aggravated offences (circumstances of aggravation) carry enhanced penalties including domestic violence, weapons, and vulnerable victims. One-punch laws under section 281 create special offences for assaults causing death. Self-defence under section 248 Criminal Code requires reasonable belief that force was necessary. Western Australian courts consider rehabilitation prospects in sentencing.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drug Offences</h4>
      <p>
        Western Australian drug offences under the Misuse of Drugs Act 1981 include possession, possession with intent to sell or supply, selling or supplying, and cultivation. Trafficking presumptions apply above specified quantities. Western Australia's Cannabis Intervention Requirement diverts minor cannabis offenders to education sessions. The Drug Court provides intensive supervision and treatment for eligible offenders. Drug lawyers challenge search legality, contest trafficking presumptions, and pursue diversion or treatment options.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Fraud and White Collar Crime</h4>
      <p>
        Fraud in Western Australia includes stealing, fraud offences, and dishonest dealings under the Criminal Code. WA Police's Fraud Squad investigates serious matters. Corporate fraud, ASIC prosecutions, and Centrelink fraud are common. Mining and resources sector fraud occurs given Western Australia's industry profile. Western Australian courts consider restitution and cooperation in sentencing. Complex fraud requires specialist defence lawyers who understand financial transactions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Sexual Offences</h4>
      <p>
        Sexual assault offences in Western Australia carry maximum penalties up to life imprisonment for aggravated sexual penetration. Child sexual abuse offences are prosecuted extensively. Complainant evidence can be given via CCTV or recorded statements. Sexual assault counselling privilege protects confidential communications. Historical sexual assault prosecutions are common. Specialist criminal lawyers experienced in sexual offence trials are essential for proper defence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights When Charged</h3>
      <p>
        Western Australian law protects accused persons' rights. You have the right to silence, the right to contact a lawyer before police interview, and the right to refuse participation in identification procedures. Police must caution you before interview. Record of interview procedures must be followed. You're not required to provide anything beyond identifying information. Legal Aid WA provides duty lawyer services at police stations and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Process in Western Australia</h3>
      <p>
        Most criminal matters start at the Magistrates Court. Summary offences are finalized there. Indictable offences proceed to committal hearings testing the prosecution case before trial at District or Supreme Court. Western Australia's Pre-Sentence Order scheme allows assessment and treatment before sentencing. Plea hearings involve detailed submissions on sentencing factors including rehabilitation prospects. Western Australian courts emphasize restorative justice where appropriate.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Criminal Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Legal Aid WA Criminal Law:</strong> 1300 650 579</li>
          <li><strong>Aboriginal Legal Service WA:</strong> (08) 9265 6666</li>
          <li><strong>Law Society of WA (Referrals):</strong> (08) 9324 8600</li>
          <li><strong>Youth Legal Service:</strong> (08) 9202 1688</li>
          <li><strong>WA Police Assistance:</strong> 131 444</li>
          <li><strong>Victim Support Service:</strong> 1800 818 988</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Sentencing in Western Australia</h3>
      <p>
        Western Australian sentencing follows the Sentencing Act 1995. Penalties include conditional release orders, fines, community based orders, intensive supervision orders, conditional suspended imprisonment, and imprisonment. Guilty plea discounts apply for early pleas. Western Australia's mandatory sentencing provisions apply to certain offences including third-strike burglary and assaults on police. Sentencing guidelines and appeal decisions guide sentencing ranges. Character references, psychological reports, and rehabilitation evidence influence sentencing.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Criminal Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.wa.gov.au/organisation/department-of-justice/criminal-justice" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WA Government - Criminal Justice</a></li>
          <li><a href="https://www.legalaid.wa.gov.au/about-us/what-we-do/criminal-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid WA - Criminal Law</a></li>
          <li><a href="https://www.magistratescourt.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Magistrates Court of WA</a></li>
          <li><a href="https://www.districtcourt.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">District Court of WA</a></li>
        </ul>
      </div>
    </>
  ),

  'property-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Property law in Western Australia operates under the Transfer of Land Act 1893 (Torrens Title system), Settlement Agents Act 1981, and numerous other statutes. Perth's property market is active, with Western Australia's property transactions involving specific legal requirements. Western Australian property lawyers and settlement agents ensure smooth conveyancing, protect your interests, and navigate the state's unique property law framework.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Conveyancing in Western Australia</h3>
      <p>
        Western Australian conveyancing involves contract exchange, cooling-off period (generally not applicable for most contracts), building and pest inspections, settlement, and registration through Landgate. Vendor disclosure requirements are less prescriptive than eastern states. Electronic conveyancing through PEXA operates in Western Australia. Stamp duty (transfer duty) applies with various concessions available. Searches reveal council rates, planning restrictions, and title encumbrances. Settlement agents conduct most residential conveyancing in Western Australia.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Residential Property Transactions</h3>
      <p>
        Buying property in Western Australia typically uses the standard REIWA (Real Estate Institute of Western Australia) contract. Building inspections are strongly recommended but not mandatory. Most residential contracts don't provide cooling-off rights (except off-the-plan purchases). Perth's property market requires expert advice on contract negotiation. First home buyers can access stamp duty concessions and grants for properties meeting eligibility criteria.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">First Home Buyers in Western Australia</h4>
      <p>
        Western Australia offers first home buyer concessions including stamp duty rebates for properties up to certain values. The First Home Owner Grant provides funds for newly built homes. Off-the-plan purchases provide additional benefits. Regional Western Australia may have additional incentives. Settlement agents and property lawyers ensure you receive all available concessions and proper contract protections.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Property</h3>
      <p>
        Western Australian commercial property transactions involve complex due diligence on leases, environmental issues, GST, and business operations. Commercial contracts require careful negotiation. Lease assignments require landlord consent under common law and lease terms. Perth CBD commercial property has unique considerations including resource sector tenant demand and development potential. Commercial property lawyers conduct comprehensive due diligence and negotiate favorable terms.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Leasing and Tenancy</h3>
      <p>
        Western Australia's Residential Tenancies Act 1987 governs residential tenancies. The Magistrates Court resolves tenancy disputes including bond claims, repairs, and termination. Reforms provide tenant protections including limits on rent increases and restrictions on evictions without grounds. Commercial leases are governed by common law and the Commercial Tenancy (Retail Shops) Agreements Act 1985 for retail premises requiring disclosure and minimum lease terms.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Strata and Community Titles</h3>
      <p>
        Western Australia's Strata Titles Act 1985 governs apartments and townhouses. Strata companies manage common property, levy collection, and by-law enforcement. Strata information certificates disclose financial position, by-laws, major works, and disputes. Building defects in new developments are addressed through builders' registration requirements and statutory warranties under the Home Building Contracts Act 1991. The State Administrative Tribunal (SAT) resolves strata disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Development</h3>
      <p>
        Property development in Western Australia requires development approval under the Planning and Development Act 2005. Local governments assess development applications against local planning schemes. The Development Assessment Panels assess larger applications. The State Administrative Tribunal hears planning appeals. Environmental considerations may require environmental impact assessments. Development contribution plans and infrastructure contributions apply to larger developments. Planning lawyers coordinate applications, appeals, and compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Property Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Finance (Stamp Duty):</strong> (08) 9262 1100</li>
          <li><strong>Consumer Protection (Tenancy):</strong> 1300 304 054</li>
          <li><strong>State Administrative Tribunal:</strong> (08) 9219 3111</li>
          <li><strong>Landgate:</strong> (08) 9273 7373</li>
          <li><strong>Building Commission:</strong> 1300 489 099</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Disputes</h3>
      <p>
        Property disputes in Western Australia include boundary disputes, easements, caveats, breach of contract, building defects, and strata conflicts. SAT provides accessible resolution for tenancy, strata, and retail tenancy disputes. The Magistrates Court, District Court, and Supreme Court handle property litigation depending on value and complexity. Fencing disputes are resolved under the Dividing Fences Act 1961. Experienced property lawyers resolve disputes through negotiation or litigation.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Property Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.wa.gov.au/organisation/department-of-mines-industry-regulation-and-safety/consumer-protection/housing-and-property" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer Protection - Housing and Property</a></li>
          <li><a href="https://www.wa.gov.au/organisation/department-of-finance/revenue" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Finance - Revenue</a></li>
          <li><a href="https://www.landgate.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Landgate</a></li>
          <li><a href="https://www.sat.justice.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'wills-estates': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Wills and Estates Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Wills and estates law in Western Australia is governed by the Wills Act 1970, Administration Act 1903, and Guardianship and Administration Act 1990. Proper estate planning protects your assets, provides for loved ones, and minimizes disputes. Western Australian wills and estates lawyers provide comprehensive advice on succession planning, estate administration, and contesting wills.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Will Drafting in Western Australia</h3>
      <p>
        A valid Western Australian will must be in writing, signed by the testator, and witnessed by two independent witnesses who sign in the testator's presence. Informal wills can be admitted to probate in limited circumstances under section 37 Wills Act. Professional will drafting addresses blended families, business succession, asset protection, and tax planning. Testamentary trusts protect beneficiaries from bankruptcy, relationship breakdowns, and provide tax benefits. Regular reviews ensure wills reflect changed circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Estate Planning Strategies</h3>
      <p>
        Comprehensive estate planning in Western Australia includes wills, enduring powers of attorney, enduring powers of guardianship, and superannuation binding death benefit nominations. Proper planning minimizes family provision claims, provides for disabled beneficiaries through special disability trusts, and structures inheritances for asset protection. Perth's property values and mining industry wealth make estate planning particularly important for managing wealth transfer and tax efficiency.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Probate and Estate Administration</h3>
      <p>
        Probate is the Supreme Court's grant of representation to executors. Western Australian executors must collect assets, pay debts, lodge tax returns, and distribute to beneficiaries according to the will. Small estates under certain thresholds may not require formal probate. The process involves obtaining death certificate, locating the will, identifying assets and liabilities, obtaining valuations, and preparing estate accounts. Lawyers ensure executors comply with duties and protect against personal liability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intestacy in Western Australia</h4>
      <p>
        When someone dies without a valid will, intestacy rules under Part III Administration Act determine distribution. Spouses receive priority with provisions for children. The intestacy formula considers family composition. De facto partners have the same rights as married spouses. The Public Trustee may be appointed administrator if no family applies. Intestacy often results in unintended outcomes and family disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contesting Wills and Family Provision Claims</h3>
      <p>
        Western Australia's family provision regime under Part III Inheritance (Family and Dependants Provision) Act 1972 allows eligible persons to apply for greater provision from an estate. Eligible persons include spouses, children (including adult children), domestic partners, and certain dependents. Applications must be filed within six months of probate grant. Western Australian courts consider financial resources, health, relationship with deceased, contributions, and provision made. Successful claims significantly alter distributions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Powers of Attorney</h3>
      <p>
        Western Australia recognizes enduring powers of attorney (financial and legal matters) under the Guardianship and Administration Act 1990. Enduring powers must be properly executed with prescribed witnesses and continue after loss of capacity. Attorneys must act in the principal's best interests, keep proper accounts, and avoid conflicts of interest. SAT reviews attorney conduct and suspected financial abuse. Registration may be required with Landgate for property transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Enduring Powers of Guardianship</h3>
      <p>
        Enduring powers of guardianship under the Guardianship and Administration Act allow appointed persons to make personal, lifestyle, and treatment decisions if you lose capacity. Appointments must be witnessed by authorized witnesses. Advance health directives document your medical treatment preferences. SAT's Guardianship and Administration jurisdiction can appoint guardians for personal decisions if you lose capacity without valid appointments.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Wills & Estates Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of WA (Probate Office):</strong> (08) 9421 5333</li>
          <li><strong>Public Trustee WA:</strong> 1300 746 116</li>
          <li><strong>Office of the Public Advocate:</strong> 1300 858 455</li>
          <li><strong>Legal Aid WA:</strong> 1300 650 579</li>
          <li><strong>Law Society of WA:</strong> (08) 9324 8600</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Guardianship and Administration</h3>
      <p>
        SAT's Guardianship and Administration jurisdiction appoints guardians for personal/lifestyle decisions and administrators for financial decisions when adults lose capacity without valid appointments. The Public Trustee or private professional administrators may be appointed. SAT reviews decisions and protects vulnerable adults from abuse. Applications are accessible with SAT operating less formally than courts. Guardianship lawyers represent parties in appointment and review applications.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Wills & Estates Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.wa.gov.au/organisation/department-of-justice/wills-and-estates" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WA Government - Wills and Estates</a></li>
          <li><a href="https://www.publictrustee.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Public Trustee WA</a></li>
          <li><a href="https://www.publicadvocate.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Public Advocate</a></li>
          <li><a href="https://www.sat.justice.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'employment-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Employment Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Employment law in Western Australia operates primarily under federal legislation including the Fair Work Act 2009, with state-based workers compensation and workplace safety laws. Western Australia has extensive employment law resources including the Fair Work Commission, WorkCover WA, and the Department of Mines, Industry Regulation and Safety. Employment lawyers protect employee and employer rights in this complex regulatory environment.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Employment Law in Western Australia</h3>
      <p>
        Most Western Australian employment matters fall under the federal Fair Work system covering minimum wages, working conditions, unfair dismissal, and general protections. However, Western Australian state laws govern workers compensation under the Workers' Compensation and Injury Management Act 1981, workplace safety under the Work Health and Safety Act 2020, and certain state public sector employment under the Public Sector Management Act 1994. The State Administrative Tribunal handles some employment disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Unfair Dismissal Claims</h3>
      <p>
        Employees dismissed from employment may file unfair dismissal applications with the Fair Work Commission if they've served the minimum employment period (six months for small businesses, 12 months otherwise) and earn below the high income threshold. Applications must be lodged within 21 days of dismissal. Western Australian employment lawyers assess dismissal fairness, prepare applications, and represent clients at conciliation conferences and hearings. Remedies include reinstatement or compensation up to six months' wages.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">General Protections Claims</h4>
      <p>
        General protections prohibit adverse action for exercising workplace rights, union membership, discrimination, or sham contracting. These claims have 60-day time limits but can result in uncapped compensation. Western Australia has significant case law on general protections particularly regarding FIFO employment and mining industry disputes. Anti-bullying applications can be made to Fair Work Commission while still employed.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Discrimination and Harassment</h3>
      <p>
        Western Australia's Equal Opportunity Act 1984 prohibits discrimination based on protected attributes including sex, race, age, disability, sexual orientation, gender identity, marital status, pregnancy, and family responsibility. The Equal Opportunity Commission investigates complaints and attempts conciliation. Unresolved matters proceed to SAT. Sexual harassment reforms have strengthened protections and employer obligations.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Employment Contracts and Agreements</h3>
      <p>
        Employment lawyers review and draft employment contracts, executive service agreements, FIFO rosters and agreements, restraint of trade clauses, confidentiality agreements, and enterprise agreements. Western Australian courts have developed case law on restraint of trade enforceability, requiring restraints to protect legitimate business interests and be reasonable. Post-employment restraints are frequently litigated, particularly in mining and resources sectors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers' Compensation</h3>
      <p>
        WorkCover WA administers workers compensation for Western Australian workers. Claims cover medical expenses, weekly payments, and permanent impairment benefits. Common law claims are not available in Western Australia - the workers compensation scheme provides exclusive remedy. Time limits apply - workers compensation claims should be lodged promptly. Lawyers ensure maximum statutory entitlements and navigate the WorkCover system.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Redundancy and Restructuring</h3>
      <p>
        Genuine redundancy requires the position to no longer exist. Large-scale redundancies may require consultation under Fair Work Act provisions. Redundancy pay depends on years of service. Western Australian employees can challenge sham redundancies or unfair selection processes. Mining and resources sector downturns create significant redundancy issues. Employment lawyers ensure proper processes and maximum entitlements.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Employment Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Fair Work Commission:</strong> 1300 799 675</li>
          <li><strong>Fair Work Ombudsman:</strong> 13 13 94</li>
          <li><strong>Equal Opportunity Commission WA:</strong> (08) 9216 3900</li>
          <li><strong>WorkCover WA:</strong> 1300 794 744</li>
          <li><strong>WorkSafe WA:</strong> 1300 307 877</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Safety and Bullying</h3>
      <p>
        WorkSafe WA enforces Western Australia's Work Health and Safety Act 2020, including psychosocial hazards and workplace bullying. Western Australian employers must provide safe systems of work and address workplace bullying. The Fair Work Commission handles workplace bullying applications. Workers compensation claims for psychological injury from workplace bullying are common. Employment lawyers advise on prevention, responding to complaints, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Employment Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.fairwork.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a></li>
          <li><a href="https://www.eoc.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Equal Opportunity Commission WA</a></li>
          <li><a href="https://www.workcover.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkCover WA</a></li>
          <li><a href="https://www.worksafe.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkSafe WA</a></li>
        </ul>
      </div>
    </>
  ),

  'personal-injury': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Personal Injury Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Personal injury law in Western Australia helps victims of accidents and negligence obtain compensation. Western Australia operates comprehensive compensation schemes including compulsory third party (CTP) insurance for motor accidents, WorkCover WA for workplace injuries, and common law claims for public liability and medical negligence. Experienced Western Australian personal injury lawyers navigate these schemes to maximize your compensation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Motor Vehicle Accidents</h3>
      <p>
        Western Australia's compulsory third party (CTP) insurance scheme provides compensation for injuries in motor accidents. Claims are made against the at-fault driver's CTP insurer under common law principles. Damages include medical expenses, loss of earnings, future care, pain and suffering, and economic loss. The Motor Vehicle (Catastrophic Injuries) Act 2016 provides no-fault catastrophic injury cover for severe injuries. Claims must be lodged within three years. Pre-litigation procedures including offers to settle are required.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">CTP Claims Process</h4>
      <p>
        CTP claims involve notifying the insurer, gathering medical evidence, establishing liability, and negotiating settlement or proceeding to court. Western Australia's fault-based system requires proving negligence. Personal injury lawyers conduct thorough investigations, obtain expert evidence, and maximize compensation. The District Court hears most CTP claims, with Supreme Court handling high-value matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Medical Negligence</h3>
      <p>
        Medical negligence claims in Western Australia arise from substandard medical care causing injury. This includes misdiagnosis, surgical errors, medication mistakes, birth injuries, and failure to obtain informed consent. Public hospitals are covered by the Department of Health, while private practitioners have professional indemnity insurance. The Civil Liability Act 2002 governs liability and damages. Expert medical evidence is essential. Time limits are generally three years from awareness of negligence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public Liability Claims</h3>
      <p>
        Public liability claims compensate injuries on another person's property or due to their negligence. Common claims include slip and fall in shopping centres, local government property injuries, dog attacks, and defective products. Western Australia's Civil Liability Act 2002 requires proving breach of duty of care and causation. Contributory negligence reduces compensation if you were partly at fault. Dangerous recreational activities may have limited liability. Personal injury lawyers investigate liability and negotiate with insurers.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers Compensation Claims</h3>
      <p>
        Western Australian workers injured at work claim workers compensation through WorkCover WA for medical expenses, weekly payments, and permanent impairment benefits. Western Australia does not allow common law damages claims - the workers compensation scheme provides exclusive remedy. Redemptions (lump sum settlements) are available in limited circumstances. Time limits are strict - workers compensation claims should be lodged immediately. Specialist lawyers ensure maximum statutory entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Total and Permanent Disability (TPD)</h3>
      <p>
        TPD insurance, typically held through superannuation, pays lump sum benefits when unable to work due to injury or illness. Western Australian TPD claims are common, with insurers frequently denying legitimate claims. Disputes involve medical evidence, policy interpretation, and TPD definitions. The Australian Financial Complaints Authority (AFCA) handles complaints. TPD lawyers represent claimants through the claims and appeals process.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dust Diseases and Asbestos</h3>
      <p>
        Western Australian workers exposed to asbestos, silica, or other harmful dusts can develop serious diseases decades later. Asbestos-related diseases including mesothelioma, asbestosis, and asbestos-related lung cancer have special compensation provisions. WorkCover WA administers workers compensation for dust diseases. Common law claims against former employers (where available) and asbestos product manufacturers provide additional compensation. Time limits are extended due to long latency periods. Specialist asbestos lawyers trace exposure history.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Personal Injury Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>WorkCover WA:</strong> 1300 794 744</li>
          <li><strong>Health and Disability Services Complaints Office:</strong> 1800 813 583</li>
          <li><strong>Legal Aid WA:</strong> 1300 650 579</li>
          <li><strong>Insurance Commission of WA:</strong> (08) 9264 3333</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dispute Resolution</h3>
      <p>
        Personal injury disputes in Western Australia are often resolved through negotiation, mediation, or pre-trial conferences. The District Court and Supreme Court hear personal injury litigation. Mediation is encouraged before trial. Workers compensation disputes proceed through conciliation and arbitration. Medical panels determine impairment assessments. Personal injury lawyers guide clients through dispute resolution processes.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Personal Injury Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.workcover.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkCover WA</a></li>
          <li><a href="https://www.hadsco.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Health and Disability Services Complaints Office</a></li>
          <li><a href="https://www.legalaid.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid WA</a></li>
          <li><a href="https://www.courts.justice.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Courts of WA</a></li>
        </ul>
      </div>
    </>
  ),

  'business-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Business Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Business law in Western Australia encompasses corporate law, commercial contracts, mergers and acquisitions, and regulatory compliance. Perth is an important business centre with strong mining, resources, energy, and agricultural sectors. Western Australian business lawyers advise on business formation, operations, transactions, and disputes to help businesses succeed while managing legal risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Formation and Structure</h3>
      <p>
        Choosing the right business structure is crucial. Options include sole trader, partnership, trust, or company. Companies are regulated by ASIC under the Corporations Act 2001. Western Australian lawyers advise on tax implications, asset protection, liability, succession planning, and compliance requirements. Company incorporation involves registration with ASIC, constitution drafting, shareholder agreements, and compliance frameworks. Family businesses and resource sector ventures often use trust structures.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Contracts</h3>
      <p>
        Commercial contracts underpin Western Australian businesses. Common contracts include supply agreements, distribution agreements, service agreements, licensing, franchise agreements, joint ventures, and mining services contracts. Western Australian contract law requires offer, acceptance, consideration, and intention. The Australian Consumer Law imposes mandatory guarantees and unfair contract term prohibitions. Lawyers draft, review, and negotiate contracts protecting your business interests and ensuring enforceability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Franchising</h4>
      <p>
        Franchising in Western Australia is regulated by the Franchising Code of Conduct requiring comprehensive disclosure before franchise sale. Franchisors must provide disclosure documents, financial information, and cooling-off periods. Western Australian franchise disputes include misleading conduct, breach of franchise agreements, and goodwill claims. The Federal Court and Supreme Court hear franchise matters. Specialist franchise lawyers represent franchisors and franchisees in disputes and transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mergers and Acquisitions</h3>
      <p>
        Business acquisitions in Western Australia involve due diligence, contract negotiation, regulatory approvals, and completion. Due diligence examines financial records, contracts, litigation, intellectual property, employment, and tax. Mining and resources sector acquisitions require specialized due diligence on tenements, environmental compliance, and native title. Share sales transfer ownership of the company entity. Asset sales transfer specific business assets. Corporate lawyers coordinate complex acquisitions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Partnership and Shareholder Agreements</h3>
      <p>
        Partnership agreements govern business partnerships under the Partnership Act 1895 (WA). Shareholder agreements regulate relationships between company shareholders addressing management, share transfers, dispute resolution, and exit strategies. Buy-sell provisions, drag-along and tag-along rights, and valuation mechanisms prevent deadlocks. Western Australian courts handle partnership and shareholder disputes including oppression claims under section 232 Corporations Act. Proper agreements prevent costly disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Disputes</h3>
      <p>
        Western Australian businesses face disputes including contract breaches, partnership disputes, shareholder disputes, trade practices claims, and debt recovery. SAT handles smaller commercial matters. District Court and Supreme Court hear larger disputes. Mediation and arbitration provide alternatives to litigation. Mining and resources sector disputes are common. Business lawyers resolve disputes efficiently through negotiation, alternative dispute resolution, or court proceedings when necessary.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Business Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Small Business Development Corporation:</strong> 13 12 49</li>
          <li><strong>Consumer Protection WA:</strong> 1300 304 054</li>
          <li><strong>Australian Competition and Consumer Commission:</strong> 1300 302 502</li>
          <li><strong>Chamber of Commerce and Industry WA:</strong> (08) 9365 7555</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Regulatory Compliance</h3>
      <p>
        Western Australian businesses must comply with extensive regulation including Australian Consumer Law, workplace relations laws, privacy laws, taxation laws, and industry-specific regulation. Mining and resources businesses face additional regulation under the Mining Act 1978 and Environmental Protection Act 1986. Directors have statutory duties including duty of care, duty to prevent insolvent trading, and duty to avoid conflicts. Business lawyers ensure regulatory compliance and defend investigations.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Business Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.smallbusiness.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Small Business Development Corporation</a></li>
          <li><a href="https://www.consumerprotection.wa.gov.au/business" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer Protection - Business</a></li>
          <li><a href="https://www.cciwa.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Chamber of Commerce and Industry WA</a></li>
          <li><a href="https://asic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC</a></li>
        </ul>
      </div>
    </>
  ),

  'immigration-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Immigration Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Immigration law in Western Australia operates under federal legislation including the Migration Act 1958 and Migration Regulations. Perth attracts skilled migrants, international students, family migrants, and business migrants. Western Australia's state nomination program provides pathways to permanent residence. Registered migration agents and immigration lawyers guide applicants through complex visa processes and represent clients in tribunals and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Categories</h3>
      <p>
        Australia's visa system includes temporary visas (visitor, student, temporary work) and permanent visas (skilled, family, business). Western Australia's state nomination program for skilled migrants targets occupations in demand including healthcare, engineering, IT, trades, and mining professionals. Perth and regional Western Australia offer different migration pathways. Visa applications require meeting health, character, and specific visa criteria. Processing times vary significantly by visa type and applicant circumstances.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Skilled Migration</h4>
      <p>
        Skilled migration to Western Australia includes independent skilled visas, state-nominated visas, and employer-sponsored visas. Western Australia's state nomination program provides pathways for occupations on the state's skilled occupation list. Points-tested visas require meeting points threshold through age, English, qualifications, and work experience. Regional Western Australia (outside Perth) offers additional migration pathways with lower requirements. Mining and resources sector skills are in demand.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Family Migration</h3>
      <p>
        Partner visas allow Australian citizens, permanent residents, and eligible New Zealand citizens to sponsor spouses and de facto partners. Prospective marriage visas require intent to marry within nine months. Parent visas have long waiting periods with contributory options providing faster processing. Child visas and remaining relative visas complete family migration categories. Western Australia's multicultural population makes family reunification common.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business and Investment Migration</h3>
      <p>
        Business Innovation and Investment visas attract entrepreneurs and investors to Western Australia. The Business Innovation stream requires successful business experience and genuine intention to operate Western Australian business. Investor streams require designated investments in Australian assets. Western Australia's state nomination program prioritizes genuine business establishment in growth sectors including technology, agriculture, and resources services. Business advisers assist migrant entrepreneurs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Student Visas</h3>
      <p>
        Perth's universities and colleges attract international students. Student visas require enrollment in registered courses, sufficient funds, health insurance, and genuine temporary entrant requirements. Post-study work visas allow graduates to gain Australian work experience. Regional classification may provide additional visa benefits. Visa conditions restrict work hours during studies. Education agents and migration lawyers assist with visa applications and compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Citizenship</h3>
      <p>
        Australian citizenship requires permanent residence, residency period (usually four years including 12 months as permanent resident), good character, and knowledge of Australia. Citizenship confers voting rights, passport eligibility, and government employment access. Children born in Australia to permanent residents or citizens are usually Australian citizens. Citizenship by descent applies to children born overseas to Australian citizen parents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Refusals and Cancellations</h3>
      <p>
        Visa refusals and cancellations can be reviewed by the Administrative Review Tribunal (ART, formerly AAT). Character cancellations under section 501 Migration Act affect visa holders with criminal records. Direction 99 guides decision-makers on character cancellations considering family ties and community protection. Federal Circuit and Family Court and Federal Court hear judicial review applications. Immigration lawyers represent clients in tribunal and court proceedings.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Immigration Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Home Affairs:</strong> 131 881</li>
          <li><strong>Administrative Review Tribunal:</strong> 1800 228 333</li>
          <li><strong>Refugee Council of Australia:</strong> (02) 9211 9333</li>
          <li><strong>Office of Multicultural Interests:</strong> (08) 6552 1700</li>
          <li><strong>Migration Agents Registration Authority:</strong> (07) 3360 3888</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Deportation and Removal</h3>
      <p>
        Unlawful non-citizens face detention and removal from Australia. Visa cancellations for character or compliance reasons result in removal. Ministerial intervention under sections 48B, 351, or 417 provides last resort options. Bridging visas allow lawful stay while matters are resolved. Detention reviews are available through the Administrative Review Tribunal. Immigration lawyers urgently respond to detention and deportation matters.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Immigration Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.homeaffairs.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Home Affairs</a></li>
          <li><a href="https://www.aat.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Administrative Review Tribunal</a></li>
          <li><a href="https://www.migration.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Migration WA</a></li>
          <li><a href="https://www.studyperth.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Study Perth</a></li>
        </ul>
      </div>
    </>
  ),

  'litigation': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Litigation in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Litigation in Western Australia encompasses civil and commercial disputes resolved through courts and tribunals. Western Australia's court system includes the Magistrates Court, District Court, Supreme Court, and specialized tribunals. Effective litigation requires strategic advice, thorough preparation, and skilled advocacy. Western Australian litigation lawyers represent clients in all forums, from small claims to complex commercial and mining disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Western Australian Court System</h3>
      <p>
        Western Australia's Magistrates Court handles claims up to $75,000 and criminal summary matters. The District Court has unlimited civil jurisdiction (with some exceptions) and hears most criminal trials. The Supreme Court handles complex commercial matters, judicial review, and appeals. The State Administrative Tribunal (SAT) provides accessible dispute resolution for administrative, commercial, tenancy, and other matters. The Federal Circuit and Family Court and Federal Court operate in Perth for federal matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Civil Litigation</h3>
      <p>
        Civil litigation includes contract disputes, negligence claims, property disputes, and debt recovery. Western Australian civil procedure follows the Magistrates Court (Civil Proceedings) Act 2004, District Court of Western Australia Act 1969, and Supreme Court Rules emphasizing case management, proportionality, and alternative dispute resolution. Pre-action protocols encourage early resolution. Discovery, expert evidence, and interlocutory applications require compliance with rules and practice directions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Commercial Litigation</h4>
      <p>
        Commercial litigation involves business disputes including contract breaches, shareholder disputes, partnership disputes, intellectual property, and trade practices. The Supreme Court's Commercial and Managed Cases List provides specialized case management. Mining and resources disputes are common in Western Australia. Freezing orders, search orders, and security for costs protect parties' positions. Litigation lawyers strategically manage disputes to achieve commercial outcomes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Alternative Dispute Resolution</h3>
      <p>
        Mediation and arbitration offer alternatives to court litigation. Western Australian courts encourage mediation in many matters. The courts operate mediation services. Private mediators and arbitrators resolve disputes confidentially and efficiently. Arbitration awards are enforceable like court judgments. Expert determination resolves technical disputes common in mining and construction. ADR reduces costs and provides flexible outcomes. Lawyers advise on ADR suitability and represent clients in ADR processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Recovery</h3>
      <p>
        Debt recovery through Western Australian courts involves issuing proceedings, default judgments, or defended hearings. Judgment enforcement includes garnishee orders, instalment orders, warrants of execution, and examination summonses. Bankruptcy and winding up proceedings pressure debtors to pay. Western Australian debt collection laws protect debtors from harassment. Creditors' lawyers strategically recover debts while managing costs and risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Building and Construction Disputes</h3>
      <p>
        Building disputes in Western Australia involve defective work, cost overruns, delays, and payment disputes. The Home Building Contracts Act 1991 regulates residential building. Security of payment legislation under the Construction Contracts Act 2004 provides rapid adjudication of payment claims. The Building Services Board investigates builder conduct. SAT resolves domestic building disputes. District Court and Supreme Court handle complex commercial construction litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Defamation</h3>
      <p>
        Defamation in Western Australia involves publication of material harming reputation. The Defamation Act 2005 provides uniform national defamation law. Defences include truth, honest opinion, and qualified privilege. Offers to make amends can resolve matters early. Concerns notices and limitation periods require prompt action. Social media defamation is increasingly common. District Court handles defamation proceedings. Defamation lawyers advise publishers and plaintiffs on rights and risks.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Litigation Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of WA:</strong> (08) 9421 5333</li>
          <li><strong>District Court of WA:</strong> (08) 9425 2222</li>
          <li><strong>Magistrates Court of WA:</strong> (08) 9425 2222</li>
          <li><strong>State Administrative Tribunal:</strong> (08) 9219 3111</li>
          <li><strong>Law Society of WA:</strong> (08) 9324 8600</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Costs and Funding</h3>
      <p>
        Western Australian litigation costs follow the principle that unsuccessful parties pay winners' costs. Security for costs may be ordered against plaintiffs. Costs disclosure obligations require lawyers to inform clients of likely costs. No win, no fee arrangements are available for some matters. Litigation funding provides financial support for claims in exchange for success fees. Western Australian courts scrutinize disproportionate costs. Lawyers provide realistic cost estimates and strategic advice on litigation economics.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Litigation Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.courts.justice.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Courts of Western Australia</a></li>
          <li><a href="https://www.sat.justice.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Administrative Tribunal</a></li>
          <li><a href="https://www.lawsocietywa.asn.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Law Society of Western Australia</a></li>
          <li><a href="https://www.legalaid.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid WA</a></li>
        </ul>
      </div>
    </>
  ),

  'bankruptcy-insolvency': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Bankruptcy and Insolvency in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Bankruptcy and insolvency law in Western Australia helps individuals and companies facing financial difficulties. The Bankruptcy Act 1966 governs personal insolvency, while the Corporations Act 2001 governs corporate insolvency. Western Australia has experienced insolvency practitioners and lawyers who advise on bankruptcy alternatives, restructuring, and formal insolvency processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Personal Bankruptcy</h3>
      <p>
        Bankruptcy is a formal process where an individual is declared unable to pay debts. Bankruptcy can be voluntary (debtor's petition) or involuntary (creditor's petition). A trustee takes control of assets, realizes them, and distributes to creditors. Bankruptcy typically lasts three years. During bankruptcy, travel restrictions apply, credit reporting continues for five years, and certain assets are protected including household items, tools of trade, and some superannuation. Bankruptcy discharges most debts excluding child support, HECS, and fraud debts.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternatives to Bankruptcy</h4>
      <p>
        Debt agreements under Part IX Bankruptcy Act allow debtors to propose reduced payment arrangements to creditors avoiding bankruptcy. Personal insolvency agreements (Part X) provide flexible arrangements for higher-value estates. Informal arrangements negotiate payment plans with creditors. These alternatives avoid bankruptcy's consequences while addressing debt. Western Australian insolvency practitioners assess options and implement solutions. Early advice maximizes options and prevents forced bankruptcy.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Corporate Insolvency</h3>
      <p>
        Companies facing insolvency have several options. Voluntary administration under Part 5.3A Corporations Act provides breathing space while administrators investigate rescue prospects. Creditors vote on proposals including deeds of company arrangement. Liquidation winds up companies and distributes assets to creditors. Receivers can be appointed by secured creditors. Directors facing insolvent trading allegations face personal liability. Mining and resources sector volatility creates insolvency issues. Early advice prevents wrongful trading and maximizes restructuring options.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Liquidation</h3>
      <p>
        Liquidation ends company existence through voluntary liquidation (members' or creditors') or court-ordered winding up. Liquidators realize assets, investigate company affairs, and distribute to creditors according to priority. Employees rank ahead of unsecured creditors for wages and entitlements. Liquidators pursue voidable transactions including unfair preferences and uncommercial transactions. ASIC regulates liquidators. Creditors receive dividends if assets remain after secured and priority creditors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Voluntary Administration</h3>
      <p>
        Voluntary administration provides companies with temporary protection from creditors while exploring rescue options. Administrators investigate company affairs and report to creditors on prospects of saving business. Creditors vote on proposals including deeds of company arrangement, liquidation, or returning company to directors. Western Australian administrators work with directors, creditors, and employees to achieve optimal outcomes. Administration can result in successful restructuring saving businesses and jobs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Creditors' Rights</h3>
      <p>
        Creditors can initiate bankruptcy or winding up proceedings to recover debts. Statutory demands under section 459E Corporations Act require companies to pay debts or face presumed insolvency. Creditors lodge proofs of debt in administrations and liquidations. Committees of inspection represent creditor interests. Creditors can challenge administrators' and liquidators' decisions. Security interests under the Personal Property Securities Act provide priority. Insolvency lawyers represent creditors maximizing recoveries.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Bankruptcy & Insolvency Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Financial Security Authority:</strong> 1300 364 785</li>
          <li><strong>ASIC Insolvency Practitioners:</strong> 1300 300 630</li>
          <li><strong>National Debt Helpline:</strong> 1800 007 007</li>
          <li><strong>Financial Counsellors' Association of WA:</strong> (08) 9325 1617</li>
          <li><strong>Small Business Development Corporation:</strong> 13 12 49</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Directors' Duties and Insolvent Trading</h3>
      <p>
        Directors must prevent insolvent trading - incurring debts when company cannot pay them. Section 588G Corporations Act imposes personal liability on directors for insolvent trading. Safe harbour protections apply when directors develop and implement restructuring plans. The business judgment rule protects informed, good faith decisions. ASIC prosecutes serious director breaches. Western Australian insolvency lawyers advise directors on duties, safe harbour, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Bankruptcy & Insolvency Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.afsa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Financial Security Authority</a></li>
          <li><a href="https://asic.gov.au/regulatory-resources/insolvency/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC Insolvency Information</a></li>
          <li><a href="https://www.arita.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ARITA - Australian Restructuring Insolvency & Turnaround Association</a></li>
          <li><a href="https://www.smallbusiness.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Small Business Development Corporation</a></li>
        </ul>
      </div>
    </>
  ),

  'intellectual-property': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Intellectual property law protects creations of the mind including inventions, brands, designs, and creative works. Western Australia's innovation economy, particularly in mining technology, resources technology, agricultural innovation, and creative sectors, makes IP protection essential. Western Australian IP lawyers advise on registration, protection, commercialization, and enforcement of intellectual property rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trademarks</h3>
      <p>
        Trademarks protect brand names, logos, and other identifiers under the Trade Marks Act 1995. Registration with IP Australia provides exclusive rights to use marks for registered goods and services. Western Australian businesses should conduct searches before adoption, register in relevant classes, and monitor for infringement. Trademark protection prevents consumer confusion and protects brand investment. Opposition and cancellation proceedings defend trademark rights. Lawyers advise on selection, registration, and enforcement.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Copyright</h3>
      <p>
        Copyright automatically protects original works including literary works, artistic works, music, films, sound recordings, and broadcasts under the Copyright Act 1968. Protection lasts life of author plus 70 years. Copyright protects expression, not ideas. Fair dealing exceptions allow limited use for research, criticism, and news reporting. Digital copyright issues are increasingly important. Copyright assignment and licensing agreements commercialize works. Infringement remedies include damages, accounts of profits, and injunctions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Patents</h3>
      <p>
        Patents protect inventions that are novel, inventive, and useful under the Patents Act 1990. Standard patents last 20 years; innovation patents (abolished 2021 for new applications) lasted 8 years. The patent process involves search, application, examination, and grant. Provisional applications establish priority for 12 months. Western Australian innovation in mining technology, automation, agricultural technology, and marine technology generates significant patent activity. Patent lawyers conduct searches, draft specifications, prosecute applications, and enforce patents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Designs</h3>
      <p>
        Registered designs protect visual appearance of products including shape, configuration, pattern, and ornamentation under the Designs Act 2003. Protection lasts up to 10 years. Designs must be new and distinctive. Registration is relatively quick and affordable. Product designers and manufacturers should register designs before public disclosure. Design infringement involves making, importing, or selling products embodying registered designs. Western Australian product design industries benefit from design protection.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trade Secrets and Confidential Information</h3>
      <p>
        Trade secrets protect confidential business information including formulas, processes, customer lists, and know-how. Unlike registered IP rights, trade secrets rely on maintaining secrecy. Breach of confidence claims prevent unauthorized disclosure or use. Employment contracts and non-disclosure agreements protect confidential information. Mining technology and resources sector innovations often rely on trade secret protection. Western Australian courts grant injunctions preventing disclosure and damages for breaches.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Commercialization</h3>
      <p>
        IP commercialization includes licensing, assignment, and joint ventures. Licensing agreements grant rights to use IP while retaining ownership. Exclusive licenses provide sole licensee rights; non-exclusive licenses permit multiple licensees. Royalty structures compensate IP owners. Due diligence examines IP ownership and validity. R&D tax incentives support Western Australian innovation. IP lawyers negotiate and draft commercialization agreements maximizing value while protecting rights.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian IP Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>IP Australia:</strong> 1300 65 10 10</li>
          <li><strong>Copyright Agency:</strong> 1800 066 844</li>
          <li><strong>Australian Copyright Council:</strong> (02) 8815 9777</li>
          <li><strong>Law Society of WA (IP Referrals):</strong> (08) 9324 8600</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Enforcement</h3>
      <p>
        IP infringement is enforced through Federal Court proceedings. Remedies include injunctions, damages, accounts of profits, and delivery up of infringing goods. Australian Border Force can seize counterfeit imports. Anton Piller orders (search orders) preserve evidence. Cease and desist letters often resolve matters without litigation. Western Australian IP owners should actively monitor and enforce rights. Lawyers advise on infringement, conduct negotiations, and litigate when necessary.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian IP Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ipaustralia.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IP Australia</a></li>
          <li><a href="https://www.copyright.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Copyright Council</a></li>
          <li><a href="https://ipta.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Intellectual Property Society of Australia and New Zealand</a></li>
          <li><a href="https://www.smallbusiness.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Small Business Development Corporation</a></li>
        </ul>
      </div>
    </>
  ),

  'tax-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Tax Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Tax law in Western Australia encompasses federal taxation administered by the Australian Taxation Office and state taxes administered by the Department of Finance. Western Australian tax lawyers advise individuals and businesses on tax planning, compliance, disputes, and restructuring to minimize tax liabilities and resolve ATO disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Income Tax</h3>
      <p>
        Income tax applies to individuals, companies, trusts, and superannuation funds under federal tax law. Western Australian taxpayers face the same income tax rates as other Australians. Tax planning includes structuring income, maximizing deductions, timing transactions, and utilizing concessions. Small business CGT concessions provide significant relief for business asset sales. Mining and resources sector taxation involves specific considerations. Tax lawyers advise on complex transactions, restructures, and ATO audits.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Goods and Services Tax (GST)</h4>
      <p>
        GST at 10% applies to most supplies of goods and services. Businesses with turnover over $75,000 ($150,000 for non-profits) must register. Input tax credits allow GST-registered businesses to claim back GST on purchases. GST-free supplies include basic food, health, and education. Complex GST issues arise in property transactions, financial supplies, mining operations, and margin schemes. Tax advisers ensure GST compliance and optimal structuring.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">State Taxes - Transfer Duty and Land Tax</h3>
      <p>
        Western Australia imposes transfer duty (stamp duty) on property transfers, business asset sales, motor vehicle transfers, and insurance. Rates vary by transaction type. Property transfer duty uses progressive rates with first home buyer concessions. Land tax applies annually to Western Australian land holdings above thresholds with aggregation rules. Principal place of residence exemption excludes main homes. Primary production land has exemptions. Department of Finance administers these taxes with objection and appeal rights to SAT.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Payroll Tax</h3>
      <p>
        Western Australian employers with Australian wages exceeding the threshold ($1 million for 2023-24) pay payroll tax at 5.5%. Regional employers receive rate reductions. Grouping provisions aggregate related businesses' wages. Contractors may be deemed employees for payroll tax. Department of Finance audits ensure compliance. Voluntary disclosures provide penalty relief. Tax lawyers advise on payroll tax obligations, grouping, and disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Disputes and Audits</h3>
      <p>
        ATO audits examine tax returns for compliance. Taxpayers have rights including representation and reasonable time to respond. Objections challenge ATO decisions with 60-day time limits (four years for small businesses). The Administrative Review Tribunal reviews objection decisions. Federal Court hears appeals on questions of law. Western Australian taxpayers frequently dispute Part IVA general anti-avoidance provisions, transfer pricing, and thin capitalization. Tax lawyers represent clients in audits, objections, and litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Planning and Restructuring</h3>
      <p>
        Tax planning minimizes tax within legal boundaries. Common strategies include income splitting through family trusts, superannuation contributions, negative gearing, and asset protection structures. Business restructures utilize rollover provisions avoiding immediate tax. Mining and resources businesses have specific tax planning opportunities including immediate deductibility of exploration expenditure. Voluntary disclosures to ATO reduce penalties for past non-compliance. Tax lawyers design compliant structures achieving tax efficiency.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Tax Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Taxation Office:</strong> 13 28 61 (individuals), 13 28 66 (businesses)</li>
          <li><strong>Department of Finance (Revenue):</strong> (08) 9262 1100</li>
          <li><strong>Tax Practitioners Board:</strong> (03) 9200 8800</li>
          <li><strong>Inspector-General of Taxation:</strong> 1800 199 010</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Superannuation</h3>
      <p>
        Superannuation enjoys concessional tax treatment to encourage retirement savings. Contributions are taxed at 15% (30% for high earners). Earnings taxed at 15% in accumulation phase, tax-free in pension phase. Superannuation death benefits have tax implications depending on beneficiary and payment type. Self-managed superannuation funds (SMSFs) require careful administration and compliance. Western Australian SMSF trustees face auditor and ATO scrutiny. Tax advisers optimize superannuation strategies.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Tax Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ato.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Taxation Office</a></li>
          <li><a href="https://www.wa.gov.au/organisation/department-of-finance/revenue" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Finance - Revenue</a></li>
          <li><a href="https://www.tpb.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tax Practitioners Board</a></li>
          <li><a href="https://www.igt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Inspector-General of Taxation</a></li>
        </ul>
      </div>
    </>
  ),

  'environmental-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Environmental Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Environmental law in Western Australia regulates environmental protection, land use planning, and natural resource management. The Environmental Protection Act 1986 provides Western Australia's environmental framework with the Environmental Protection Authority as principal regulator. Western Australian environmental lawyers advise on compliance, planning, contaminated land, mining approvals, and environmental litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Environment Protection</h3>
      <p>
        Western Australia's Environmental Protection Act 1986 requires proponents not to cause environmental harm. The EPA assesses significant proposals and provides environmental impact assessments. Ministerial approval required for clearing native vegetation and prescribed premises require licenses. Pollution must be controlled and reported. EPA can issue directions, environmental protection notices, and prosecutions. Mining and resources projects undergo rigorous environmental assessment. Environmental lawyers advise on approvals, compliance, and respond to EPA action.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Planning and Development</h3>
      <p>
        Western Australia's Planning and Development Act 2005 regulates land use and development. Local planning schemes control development through zones and provisions. Development approval required for most development. Local governments, Development Assessment Panels, or WAPC assess applications. The State Administrative Tribunal hears planning appeals. Major projects can access streamlined state assessment. Environmental impact assessments integrate with planning. Planning lawyers obtain approvals, defend objections, and appeal decisions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Contaminated Land</h4>
      <p>
        Contaminated land creates liability for current and former owners, occupiers, and polluters under the Contaminated Sites Act 2003. Department of Water and Environmental Regulation maintains contaminated sites database. Site classification and remediation required for contaminated sites. Auditors certify remediation. Due diligence investigations identify contamination risks. Mining and industrial legacy creates contamination issues. Environmental lawyers advise purchasers, vendors, and responsible parties on contaminated land issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Native Title and Cultural Heritage</h3>
      <p>
        Native title recognizes Indigenous rights to traditional lands. Native title claims in Western Australia are extensive and determined by Federal Court. The Aboriginal Heritage Act 1972 protects Aboriginal heritage sites. Section 18 approvals required to impact Aboriginal heritage. Heritage surveys and consultations with traditional owners are required for development. Unauthorized damage to Aboriginal heritage is an offence. Developers engage with traditional owner groups and obtain heritage approvals.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mining and Resources</h3>
      <p>
        Mining in Western Australia requires tenements under the Mining Act 1978 and approvals under environmental and heritage legislation. Department of Mines, Industry Regulation and Safety administers mining tenements. Mining proposals require environmental approvals, mine closure plans, and financial assurances. Western Australia's iron ore, gold, nickel, lithium, and LNG industries are globally significant. Native title and heritage approvals are critical. Mining lawyers obtain approvals and advise on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Climate Change and Renewable Energy</h3>
      <p>
        Western Australia has renewable energy targets with significant solar and wind development. No standalone climate change legislation exists but carbon considerations affect project approvals. Offshore wind potential is being developed. Environmental approvals consider greenhouse gas emissions. National Greenhouse and Energy Reporting requires emissions reporting. Environmental lawyers advise on renewable energy projects and regulatory compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Environmental Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Environmental Protection Authority:</strong> (08) 6364 7000</li>
          <li><strong>Department of Water and Environmental Regulation:</strong> (08) 6364 7000</li>
          <li><strong>Department of Planning, Lands and Heritage:</strong> (08) 6551 8002</li>
          <li><strong>Department of Mines, Industry Regulation and Safety:</strong> (08) 9222 3333</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Water and Biodiversity</h3>
      <p>
        Western Australian water resources are managed under the Rights in Water and Irrigation Act 1914. Water licenses required for taking water. Environmental water provisions protect environmental flows. Western Australia's biodiversity is globally significant with high endemism. The Biodiversity Conservation Act 2016 protects threatened species and ecological communities. Native vegetation clearing requires permits. Developers must consider biodiversity impacts and offset requirements.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Environmental Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.epa.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Environmental Protection Authority WA</a></li>
          <li><a href="https://www.der.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Water and Environmental Regulation</a></li>
          <li><a href="https://www.dplh.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Planning, Lands and Heritage</a></li>
          <li><a href="https://www.dmirs.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">DMIRS</a></li>
        </ul>
      </div>
    </>
  ),

  'administrative-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrative Law in Western Australia</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Administrative law in Western Australia governs the exercise of government power and review of government decisions. The State Administrative Tribunal (SAT), Ombudsman Western Australia, and courts review administrative action. Administrative lawyers challenge unlawful decisions, ensure procedural fairness, and hold government accountable to the rule of law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">SAT Review</h3>
      <p>
        SAT reviews state government decisions across diverse areas including planning, building, tenancy, guardianship, occupational regulation, commercial tenancy, and mining warden appeals. SAT provides accessible, low-cost review with less formality than courts. The enabling Act for each decision specifies review rights and grounds. SAT conducts hearings de novo or on review basis depending on jurisdiction. Lawyers represent parties in SAT proceedings, ensuring procedural rights and presenting persuasive cases.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Judicial Review</h3>
      <p>
        Judicial review challenges government decisions on legal grounds including jurisdictional error, procedural unfairness, taking irrelevant considerations into account, failing to consider relevant matters, and unreasonableness. The Supreme Court's judicial review jurisdiction covers Western Australian government decisions. Federal Court reviews Commonwealth decisions. Judicial review doesn't substitute decision-maker's discretion but ensures lawful exercise. Remedies include quashing decisions, mandamus compelling action, and declarations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Procedural Fairness</h4>
      <p>
        Procedural fairness (natural justice) requires fair hearing and unbiased decision-makers. The hearing rule requires notice, opportunity to be heard, and consideration of submissions. The bias rule requires actual or apprehended freedom from bias. Western Australian decision-makers must comply unless legislation clearly excludes fairness. Lawyers challenge decisions lacking procedural fairness and advise government on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Ombudsman Western Australia</h3>
      <p>
        Ombudsman Western Australia investigates complaints about Western Australian government agencies, local governments, universities, and certain public bodies. The Ombudsman can investigate administrative action, conduct own-motion investigations, and make recommendations. Ombudsman investigations are free and accessible. Findings aren't binding but carry significant weight. Public interest disclosures (whistleblowing) about government wrongdoing are protected. The Ombudsman's annual reports highlight systemic issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Freedom of Information</h3>
      <p>
        Western Australia's Freedom of Information Act 1992 provides rights to access government documents. Western Australian government agencies, local governments, and statutory authorities are subject to FOI. FOI applications are made in writing. Agencies must respond within 45 days. Exemptions protect cabinet documents, personal privacy, law enforcement, and commercial confidentiality. Information Commissioner reviews FOI decisions. SAT provides further review. FOI promotes government transparency and accountability.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Privacy and Data Protection</h3>
      <p>
        Western Australia doesn't have standalone privacy legislation but public sector agencies are subject to Information Privacy Principles under administrative directions. Personal information must be handled appropriately. Data breaches should be managed appropriately. Privacy lawyers advise government and individuals on privacy rights and obligations under applicable frameworks including federal Privacy Act for some entities.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Western Australian Administrative Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>State Administrative Tribunal:</strong> (08) 9219 3111</li>
          <li><strong>Ombudsman Western Australia:</strong> (08) 9220 7555</li>
          <li><strong>Office of the Information Commissioner:</strong> (08) 6551 7888</li>
          <li><strong>Supreme Court of WA:</strong> (08) 9421 5333</li>
          <li><strong>Equal Opportunity Commission WA:</strong> (08) 9216 3900</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Government and Public Law</h3>
      <p>
        Western Australian constitutional law governs Parliament, Executive, and Judiciary relationships. The Constitution Acts Amendment Act 1899 establishes Western Australia's constitutional framework. Parliamentary sovereignty, separation of powers, and rule of law are fundamental principles. Statutory interpretation principles guide understanding legislation. Western Australian public lawyers advise government on lawful exercise of power, legislative drafting, and constitutional issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Equal Opportunity</h3>
      <p>
        Western Australia's Equal Opportunity Act 1984 prohibits discrimination based on protected attributes including sex, race, age, disability, sexual orientation, and gender identity. The Equal Opportunity Commission investigates complaints and attempts conciliation. Unresolved matters proceed to SAT. Public authorities must eliminate discrimination and promote equal opportunity. Administrative lawyers argue discrimination matters in SAT proceedings.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Western Australian Administrative Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.sat.justice.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Administrative Tribunal</a></li>
          <li><a href="https://www.ombudsman.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Ombudsman Western Australia</a></li>
          <li><a href="https://www.oic.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Information Commissioner</a></li>
          <li><a href="https://www.eoc.wa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Equal Opportunity Commission WA</a></li>
        </ul>
      </div>
    </>
  ),
}

// Northern Territory Practice Area Content
const NT_CONTENT: Record<string, React.ReactElement> = {
  'family-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Family Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Family law in the Northern Territory operates under federal legislation including the Family Law Act 1975, with local courts handling specific matters such as domestic violence orders. The Northern Territory has comprehensive family law resources across Darwin, Alice Springs, and regional centres, with the Federal Circuit and Family Court providing services for families dealing with separation, divorce, and parenting disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Family Law in the Northern Territory</h3>
      <p>
        Northern Territory family lawyers handle divorce, property settlements, parenting arrangements, spousal maintenance, and de facto relationship matters. The Federal Circuit and Family Court of Australia operates from Darwin. The Northern Territory Local Court handles domestic violence orders, which frequently intersect with family law proceedings. The Territory has unique considerations including remote Indigenous communities and cross-border issues with Western Australia and South Australia.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Areas of Family Law Practice</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Divorce and Separation</h4>
      <p>
        Divorce in the Northern Territory requires 12 months separation. Separation under one roof is recognized where couples can demonstrate living separately. Northern Territory lawyers assist with divorce applications, address service complications including remote service requirements, and handle disputed separation dates. The Federal Circuit and Family Court in Darwin processes divorce applications, with circuit services to Alice Springs and regional centres.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Child Custody and Parenting Arrangements</h4>
      <p>
        Parenting matters prioritize children's best interests under the Family Law Act. The Northern Territory encourages parenting plans negotiated between parents without court intervention. When agreement isn't possible, parenting orders address living arrangements, parenting time, parental responsibility, and child support. Northern Territory courts consider children's views, relationship with both parents, Indigenous cultural connections, family violence history, and the benefit of meaningful relationships. Independent Children's Lawyers are appointed in complex cases.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Property Settlement</h4>
      <p>
        Property settlement involves identifying the asset pool, assessing contributions (financial and non-financial), considering future needs including health and earning capacity, and determining just and equitable division. Darwin's property market and unique Territory considerations require expert valuations. Superannuation splitting and complex assets including businesses and pastoral properties require specialist legal advice. Northern Territory property settlements often involve remote property and Indigenous land considerations.
      </p>

      <h4 className="text-xl font-semibold text=text-xl font-semibold text-slate-900 mt-6 mb-3">De Facto Relationships</h4>
      <p>
        The Northern Territory's relationship property laws largely mirror married couple provisions under federal jurisdiction, with state laws also applying under the De Facto Relationships Act 1991 (NT). De facto couples in the Northern Territory have the same family law rights as married couples if the relationship lasted two years or there are children. The Northern Territory recognizes same-sex de facto relationships. Evidence requirements include cohabitation, financial interdependence, sexual relationship, and social recognition.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Domestic Violence Orders</h4>
      <p>
        The Northern Territory's Domestic and Family Violence Act 2007 provides for domestic violence orders through Local Courts. Domestic violence orders protect victims from family and domestic violence including physical, sexual, psychological, and economic abuse. Police can apply for domestic violence orders and issue police family violence orders. Breaching a domestic violence order is a criminal offence. The Northern Territory has comprehensive family violence support services. Legal aid is available for domestic violence order matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Northern Territory-Specific Resources</h3>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Family Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>1800RESPECT (National Family Violence Counselling):</strong> 1800 737 732 (24/7)</li>
          <li><strong>Dawn House (NT Domestic Violence Crisis Service):</strong> 1800 019 116 (24/7)</li>
          <li><strong>Men's Referral Service:</strong> 1300 766 491 (24/7)</li>
          <li><strong>Family Relationship Advice Line:</strong> 1800 050 321</li>
          <li><strong>Northern Territory Legal Aid Commission:</strong> 1800 019 343</li>
          <li><strong>Federal Circuit and Family Court (Darwin):</strong> (08) 8943 0340</li>
          <li><strong>Top End Women's Legal Service:</strong> (08) 8982 3000</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Locations in the Northern Territory</h3>
      <p>
        The Federal Circuit and Family Court operates from Darwin, servicing the entire Northern Territory. The Northern Territory Local Courts across the Territory handle domestic violence order matters. Darwin has the principal family law registry. Regional Northern Territory including Alice Springs, Katherine, Tennant Creek, and remote communities is serviced through circuit sittings, video conferencing, and regional court appearances. The Northern Territory's vast geography and remote communities create unique access to justice challenges.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Family Dispute Resolution</h3>
      <p>
        Family Dispute Resolution (FDR) is required before filing parenting applications, with parties obtaining section 60I certificates. The Northern Territory has Family Relationship Centres in Darwin offering FDR services. Private mediators and collaborative law approaches are available. FDR isn't required where family violence exists or urgency dictates immediate court intervention. Northern Territory family lawyers facilitate dispute resolution and represent clients when court proceedings are necessary.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Legal Aid and Support Services</h3>
      <p>
        Northern Territory Legal Aid Commission provides family law assistance to eligible Territorians, prioritizing victims of family violence and matters involving children. Top End Women's Legal Service, Central Australian Women's Legal Service, and community legal centres across Darwin, Alice Springs, and remote communities offer free advice and representation. Family violence duty lawyers assist domestic violence order applicants at court.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Government Links:</h4>
        <ul className="space-y-2">
          <li><a href="https://nt.gov.au/law/crime/domestic-and-family-violence" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Government - Domestic and Family Violence</a></li>
          <li><a href="https://www.ntlac.nt.gov.au/family-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Legal Aid Commission - Family Law</a></li>
          <li><a href="https://www.topendwomenslegalsevice.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Top End Women's Legal Service</a></li>
          <li><a href="https://www.cawls.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Central Australian Women's Legal Service</a></li>
        </ul>
      </div>
    </>
  ),

  'criminal-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Criminal Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Criminal law in the Northern Territory operates under the Criminal Code Act 1983, one of Australia's criminal codes. The Northern Territory has a comprehensive criminal justice system from the Local Court through to the Supreme Court. If you're facing criminal charges in the Northern Territory, experienced legal representation is essential to protect your rights and achieve the best possible outcome.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Northern Territory Criminal Law</h3>
      <p>
        Northern Territory criminal lawyers defend clients charged with offences ranging from traffic matters to serious indictable crimes. The Local Court handles summary offences and committal proceedings. The Supreme Court hears indictable offences including drug trafficking, serious assaults, sexual offences, and murder. The Northern Territory has unique considerations including mandatory sentencing for certain offences, high Indigenous incarceration rates, and remote court operations.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Common Criminal Matters</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drink Driving and Traffic Offences</h4>
      <p>
        The Northern Territory has strict drink driving laws with immediate licence suspensions. Offences include prescribed concentration of alcohol (.05-.079, .08-.149, .15+) and driving under the influence. Drug driving offences detect prescribed drugs. Loss of licence mandatory minimum periods apply. Dangerous driving causing death or serious harm carries substantial imprisonment. Work licenses may be available for certain offenders. Traffic lawyers challenge testing procedures, apply for work licenses, and minimize penalties.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Assault and Violence Offences</h4>
      <p>
        Northern Territory assault charges include assault, aggravated assault, serious harm, and grievous harm offences under the Criminal Code. Domestic violence aggravated assaults carry enhanced penalties. Mandatory sentencing applies to certain assault offences particularly assaults on workers and police. Self-defence under section 29 Criminal Code requires reasonable belief that force was necessary. Northern Territory courts consider rehabilitation prospects but face mandatory sentencing constraints.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drug Offences</h4>
      <p>
        Northern Territory drug offences under the Misuse of Drugs Act 1990 include possession, supply, trafficking, and cultivation. Commercial quantities trigger presumptions and higher penalties. Cannabis is illegal in the Northern Territory with infringement notices for minor possession. Drug Court provides intensive supervision and treatment for eligible offenders. Drug lawyers challenge search legality, contest trafficking presumptions, and pursue diversion or treatment options.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Fraud and White Collar Crime</h4>
      <p>
        Fraud in the Northern Territory includes dishonest dealings, stealing, and fraud offences under the Criminal Code. NT Police's Major Crime Squad investigates serious matters. ASIC prosecutions and Centrelink fraud occur. Northern Territory courts consider restitution and cooperation in sentencing. Complex fraud requires specialist defence lawyers who understand financial transactions and corporate structures.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Sexual Offences</h4>
      <p>
        Sexual assault offences in the Northern Territory carry maximum penalties up to life imprisonment for aggravated sexual assault. Child sexual abuse offences are prosecuted extensively. Complainant evidence can be given via CCTV or recorded statements. Sexual assault counselling privilege protects confidential communications. Historical sexual assault prosecutions are common. Specialist criminal lawyers experienced in sexual offence trials are essential for proper defence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights When Charged</h3>
      <p>
        Northern Territory law protects accused persons' rights. You have the right to silence, the right to contact a lawyer before police interview, and the right to refuse participation in identification procedures. Police must caution you before interview. Record of interview procedures must be followed. You're not required to provide anything beyond identifying information. NT Legal Aid Commission provides duty lawyer services at police stations and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Process in the Northern Territory</h3>
      <p>
        Most criminal matters start at the Local Court. Summary offences are finalized there. Indictable offences proceed to committal hearings before trial at Supreme Court. The Northern Territory's Drug Court provides intensive support and supervision as an alternative to imprisonment. Plea hearings involve detailed submissions on sentencing factors. Remote court circuits serve communities across the Territory. The Northern Territory has specialist courts for Indigenous offenders.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Criminal Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>NT Legal Aid Commission Criminal Law:</strong> 1800 019 343</li>
          <li><strong>North Australian Aboriginal Justice Agency:</strong> 1800 898 251</li>
          <li><strong>Central Australian Aboriginal Legal Aid Service:</strong> 1800 636 079</li>
          <li><strong>Law Society NT (Referrals):</strong> (08) 8981 5104</li>
          <li><strong>NT Police Assistance:</strong> 131 444</li>
          <li><strong>Victims of Crime NT:</strong> 1800 672 242</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Sentencing in the Northern Territory</h3>
      <p>
        Northern Territory sentencing follows the Sentencing Act 1995. Penalties include discharge, fines, good behaviour bonds, community work orders, home detention, suspended sentences, and imprisonment. Mandatory sentencing applies to certain offences including property offences and assaults on workers. The Northern Territory has controversial mandatory sentencing laws criticized for disproportionate impact on Indigenous offenders. Character references, cultural reports, and rehabilitation evidence influence sentencing where discretion exists.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Criminal Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://nt.gov.au/law/crime" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Government - Crime and Justice</a></li>
          <li><a href="https://www.ntlac.nt.gov.au/criminal-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Legal Aid Commission - Criminal Law</a></li>
          <li><a href="https://localcourt.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Northern Territory Local Court</a></li>
          <li><a href="https://supremecourt.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Supreme Court of the Northern Territory</a></li>
        </ul>
      </div>
    </>
  ),

  'property-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Property law in the Northern Territory operates under the Law of Property Act 2000, Land Title Act 2000, and numerous other statutes. Darwin's property market and unique Territory considerations make property transactions distinctive. Northern Territory property lawyers ensure smooth conveyancing, protect your interests, and navigate the Territory's unique property law framework including Aboriginal land rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Conveyancing in the Northern Territory</h3>
      <p>
        Northern Territory conveyancing involves contract exchange, cooling-off period (generally 5 business days for buyers), building and pest inspections, settlement, and registration through NT Land Titles Office. Vendor disclosure requirements apply. Electronic conveyancing through PEXA operates in the Northern Territory. Stamp duty applies with various concessions available including first home buyer concessions. Searches reveal rates, planning, and title information. Unique Territory considerations include Aboriginal land, pastoral leases, and strata title issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Residential Property Transactions</h3>
      <p>
        Buying property in the Northern Territory requires attention to vendor disclosure, building inspections, and contract terms. The 5 business day cooling-off period allows buyers to withdraw with penalty. Darwin's property market has unique characteristics including tropical climate building considerations. First home buyers can access stamp duty concessions and grants for properties meeting eligibility criteria. Aboriginal land rights affect some property transactions requiring careful due diligence.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">First Home Buyers in the Northern Territory</h4>
      <p>
        The Northern Territory offers first home buyer concessions including stamp duty concessions and exemptions. The First Home Owner Grant provides funds for newly built or substantially renovated homes with enhanced amounts for Territory builds. Home owner grants aim to encourage Territory residence and construction. Property lawyers ensure you receive all available concessions and proper contract protections.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Property</h3>
      <p>
        Northern Territory commercial property transactions involve due diligence on leases, environmental issues, GST, and business operations. Commercial leases require careful negotiation. Darwin CBD commercial property has unique considerations including cyclone building requirements and tropical climate. Commercial property lawyers conduct comprehensive due diligence and negotiate favorable terms.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Leasing and Tenancy</h3>
      <p>
        The Northern Territory's Residential Tenancies Act 1999 governs residential tenancies. The Northern Territory Civil and Administrative Tribunal (NTCAT) resolves tenancy disputes including bond claims, repairs, and termination. Recent reforms provide tenant protections. Commercial leases are governed by common law and specific legislation for retail tenancies. Remote community housing has specific frameworks under Northern Territory legislation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Unit Titles and Community Titles</h3>
      <p>
        The Northern Territory's Unit Titles Act 2009 and Community Land Act 1999 govern apartments, townhouses, and community schemes. Unit title corporations and community associations manage common property, levies, and by-laws. Unit title certificates disclose financial position, by-laws, and disputes. Building defects are addressed through building regulations. NTCAT resolves unit title disputes including by-law breaches and building defects.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Development</h3>
      <p>
        Property development in the Northern Territory requires development consent under the Planning Act 1999. Development consent authorities assess applications against the NT Planning Scheme and area plans. NTCAT hears planning appeals. Environmental considerations require assessment under NT environmental legislation. Aboriginal land rights and sacred sites require careful consideration. Planning lawyers coordinate applications, appeals, and compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Property Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Territory Revenue Office (Stamp Duty):</strong> (08) 8999 7368</li>
          <li><strong>Consumer Affairs (Tenancy):</strong> 1800 019 319</li>
          <li><strong>NT Civil and Administrative Tribunal:</strong> (08) 8999 1800</li>
          <li><strong>Land Titles Office:</strong> (08) 8995 5354</li>
          <li><strong>NT Planning Commission:</strong> (08) 8999 5511</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Disputes</h3>
      <p>
        Property disputes in the Northern Territory include boundary disputes, easements, caveats, breach of contract, building defects, and unit title conflicts. NTCAT provides accessible resolution for tenancy, unit title, and some property disputes. The Local Court and Supreme Court handle property litigation. Fencing disputes are resolved under the Fences Act 1972. Experienced property lawyers resolve disputes through negotiation or litigation.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Property Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://nt.gov.au/property" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Government - Property</a></li>
          <li><a href="https://nt.gov.au/industry/consumer-affairs" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer Affairs NT</a></li>
          <li><a href="https://revenue.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Territory Revenue Office</a></li>
          <li><a href="https://ntcat.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Civil and Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'wills-estates': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Wills and Estates Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Wills and estates law in the Northern Territory is governed by the Wills Act 2000, Administration and Probate Act 1969, and Advance Personal Planning Act 2013. Proper estate planning protects your assets, provides for loved ones, and minimizes disputes. Northern Territory wills and estates lawyers provide comprehensive advice on succession planning, estate administration, and contesting wills.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Will Drafting in the Northern Territory</h3>
      <p>
        A valid Northern Territory will must be in writing, signed by the testator, and witnessed by two independent witnesses who sign in the testator's presence. Informal wills can be admitted to probate in limited circumstances under section 13 Wills Act. Professional will drafting addresses blended families, business succession, asset protection, and tax planning. Testamentary trusts protect beneficiaries from bankruptcy, relationship breakdowns, and provide tax benefits. Regular reviews ensure wills reflect changed circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Estate Planning Strategies</h3>
      <p>
        Comprehensive estate planning in the Northern Territory includes wills, advance personal plans (combining power of attorney and advance care directives), and superannuation binding death benefit nominations. Proper planning minimizes family provision claims, provides for disabled beneficiaries, and structures inheritances for asset protection. Territory-specific considerations include remote property, pastoral leases, and Indigenous cultural considerations.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Probate and Estate Administration</h3>
      <p>
        Probate is the Supreme Court's grant of representation to executors. Northern Territory executors must collect assets, pay debts, lodge tax returns, and distribute to beneficiaries according to the will. Small estates under certain thresholds may not require formal probate. The process involves obtaining death certificate, locating the will, identifying assets and liabilities, obtaining valuations, and preparing estate accounts. Lawyers ensure executors comply with duties and protect against personal liability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intestacy in the Northern Territory</h4>
      <p>
        When someone dies without a valid will, intestacy rules under Part 2 Administration and Probate Act determine distribution. Spouses receive priority with provisions for children. The intestacy formula considers family composition. De facto partners have the same rights as married spouses. The Public Trustee may be appointed administrator if no family applies. Intestacy often results in unintended outcomes and family disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contesting Wills and Family Provision Claims</h3>
      <p>
        The Northern Territory's family provision regime under Part IV Administration and Probate Act allows eligible persons to apply for greater provision from an estate. Eligible persons include spouses, children (including adult children), domestic partners, and certain dependents. Applications must be filed within 12 months of death (or probate grant with court permission). Northern Territory courts consider financial resources, health, relationship with deceased, contributions, and provision made. Successful claims significantly alter distributions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Advance Personal Plans</h3>
      <p>
        The Northern Territory's Advance Personal Planning Act 2013 provides for advance personal plans combining enduring powers of attorney (decision-making for financial and personal matters) and advance care directives (health care decisions). Advance personal plans must be properly executed with witnesses. Decision-makers must act in the principal's best interests. NTCAT reviews decision-maker conduct and suspected abuse.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Advance Care Directives</h3>
      <p>
        Advance care directives under the Advance Personal Planning Act allow you to document health care preferences and appoint health care decision-makers. Directives must be witnessed by authorized witnesses. NTCAT's Guardianship jurisdiction can appoint guardians if you lose capacity without valid appointments. The Office of the Public Guardian supports vulnerable adults.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Wills & Estates Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of NT (Probate):</strong> (08) 8999 6562</li>
          <li><strong>Public Trustee NT:</strong> (08) 8999 7271</li>
          <li><strong>Office of the Public Guardian:</strong> (08) 8901 3560</li>
          <li><strong>NT Legal Aid Commission:</strong> 1800 019 343</li>
          <li><strong>Law Society NT:</strong> (08) 8981 5104</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Guardianship and Administration</h3>
      <p>
        NTCAT's Guardianship jurisdiction appoints guardians for personal decisions and administrators for financial decisions when adults lose capacity without valid appointments. The Public Trustee or private administrators may be appointed. NTCAT reviews decisions and protects vulnerable adults from abuse. Applications are accessible with NTCAT operating less formally than courts. Guardianship lawyers represent parties in appointment and review applications.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Wills & Estates Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://nt.gov.au/law/wills-and-estates" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Government - Wills and Estates</a></li>
          <li><a href="https://nt.gov.au/law/attorney/advance-personal-planning" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Government - Advance Personal Planning</a></li>
          <li><a href="https://publictrustee.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Public Trustee NT</a></li>
          <li><a href="https://ntcat.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Civil and Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'employment-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Employment Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Employment law in the Northern Territory operates primarily under federal legislation including the Fair Work Act 2009, with Territory-based workers compensation and workplace safety laws. The Northern Territory has employment law resources including the Fair Work Commission, NT WorkSafe, and Care and Support Scheme. Employment lawyers protect employee and employer rights in this complex regulatory environment.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Employment Law in the Northern Territory</h3>
      <p>
        Most Northern Territory employment matters fall under the federal Fair Work system covering minimum wages, working conditions, unfair dismissal, and general protections. However, Northern Territory laws govern workers compensation under the Return to Work Act 2020, workplace safety under the Work Health and Safety (National Uniform Legislation) Act 2011, and Territory public sector employment. NTCAT handles some employment disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Unfair Dismissal Claims</h3>
      <p>
        Employees dismissed from employment may file unfair dismissal applications with the Fair Work Commission if they've served the minimum employment period (six months for small businesses, 12 months otherwise) and earn below the high income threshold. Applications must be lodged within 21 days of dismissal. Northern Territory employment lawyers assess dismissal fairness, prepare applications, and represent clients at conciliation conferences and hearings. Remedies include reinstatement or compensation up to six months' wages.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">General Protections Claims</h4>
      <p>
        General protections prohibit adverse action for exercising workplace rights, union membership, discrimination, or sham contracting. These claims have 60-day time limits but can result in uncapped compensation. The Northern Territory's unique employment context includes remote work, FIFO arrangements, and Indigenous employment considerations. Anti-bullying applications can be made to Fair Work Commission while still employed.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Discrimination and Harassment</h3>
      <p>
        The Northern Territory's Anti-Discrimination Act 1992 prohibits discrimination based on protected attributes including race, sex, sexuality, age, marital status, pregnancy, parenthood, religious belief, political opinion, disability, and industrial activity. The Anti-Discrimination Commission investigates complaints and attempts conciliation. Unresolved matters proceed to the Local Court. Sexual harassment and workplace bullying protections apply.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Employment Contracts and Agreements</h3>
      <p>
        Employment lawyers review and draft employment contracts, executive service agreements, restraint of trade clauses, confidentiality agreements, and enterprise agreements. Northern Territory courts enforce restraint of trade clauses where they protect legitimate business interests and are reasonable. Remote work agreements and FIFO arrangements require specific consideration. Post-employment restraints are enforceable where properly drafted.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers' Compensation</h3>
      <p>
        NT WorkSafe administers workers compensation for Northern Territory workers under the Return to Work Act 2020. Claims cover medical expenses, weekly payments, lump sum benefits, and treatment and care. Common law damages claims are not available - the workers compensation scheme provides exclusive remedy. Time limits apply - workers compensation claims should be lodged promptly. Lawyers ensure maximum statutory entitlements and navigate the NT WorkSafe system.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Redundancy and Restructuring</h3>
      <p>
        Genuine redundancy requires the position to no longer exist. Large-scale redundancies may require consultation under Fair Work Act provisions. Redundancy pay depends on years of service. Northern Territory employees can challenge sham redundancies or unfair selection processes. Territory government and private sector restructures create redundancy issues. Employment lawyers ensure proper processes and maximum entitlements.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Employment Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Fair Work Commission:</strong> 1300 799 675</li>
          <li><strong>Fair Work Ombudsman:</strong> 13 13 94</li>
          <li><strong>Anti-Discrimination Commission NT:</strong> (08) 8999 1444</li>
          <li><strong>NT WorkSafe:</strong> 1800 019 115</li>
          <li><strong>NT Legal Aid Commission:</strong> 1800 019 343</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Safety and Bullying</h3>
      <p>
        NT WorkSafe enforces the Northern Territory's Work Health and Safety (National Uniform Legislation) Act 2011, including psychosocial hazards and workplace bullying. Northern Territory employers must provide safe systems of work and address workplace bullying. The Fair Work Commission handles workplace bullying applications. Workers compensation claims for psychological injury from workplace bullying are common. Employment lawyers advise on prevention, responding to complaints, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Employment Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.fairwork.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a></li>
          <li><a href="https://adc.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Anti-Discrimination Commission NT</a></li>
          <li><a href="https://worksafe.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT WorkSafe</a></li>
          <li><a href="https://nt.gov.au/employ" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Government - Employment</a></li>
        </ul>
      </div>
    </>
  ),

  'personal-injury': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Personal Injury Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Personal injury law in the Northern Territory helps victims of accidents and negligence obtain compensation. The Northern Territory operates comprehensive compensation schemes including compulsory third party (CTP) insurance for motor accidents, NT WorkSafe for workplace injuries, and common law claims for public liability and medical negligence. Experienced Northern Territory personal injury lawyers navigate these schemes to maximize your compensation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Motor Vehicle Accidents</h3>
      <p>
        The Northern Territory's Motor Accidents (Compensation) Act 1979 provides compulsory third party insurance compensation for injuries in motor accidents. CTP claims are made under the no-fault scheme administered by Territory Insurance Office (TIO). Benefits include medical expenses, loss of earnings, rehabilitation, attendant care, and lump sum benefits for permanent impairment. Common law damages are not available - the CTP scheme provides exclusive remedy. Claims must be lodged within strict time limits.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">CTP Claims Process</h4>
      <p>
        CTP claims in the Northern Territory are no-fault, meaning you don't need to prove negligence. Claims involve notifying TIO, gathering medical evidence, assessing impairment, and negotiating benefits. Personal injury lawyers ensure maximum entitlements including weekly benefits, medical treatment, rehabilitation, and lump sum compensation. The no-fault scheme provides certainty but limits compensation compared to fault-based systems.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Medical Negligence</h3>
      <p>
        Medical negligence claims in the Northern Territory arise from substandard medical care causing injury. This includes misdiagnosis, surgical errors, medication mistakes, birth injuries, and failure to obtain informed consent. Public hospitals and Territory Health Services are covered by the Territory, while private practitioners have professional indemnity insurance. Common law negligence principles apply. Expert medical evidence is essential. Time limits are generally three years from awareness of negligence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public Liability Claims</h3>
      <p>
        Public liability claims compensate injuries on another person's property or due to their negligence. Common claims include slip and fall, government property injuries, and defective products. Common law negligence requires proving breach of duty of care and causation. Contributory negligence reduces compensation if you were partly at fault. Dangerous recreational activities may have limited liability. Personal injury lawyers investigate liability and negotiate with insurers.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers Compensation Claims</h3>
      <p>
        Northern Territory workers injured at work claim workers compensation through NT WorkSafe under the Return to Work Act 2020 for medical expenses, weekly payments, and permanent impairment benefits. Common law damages claims are not available - the workers compensation scheme provides exclusive remedy. Rehabilitation and return to work support are provided. Time limits are strict - workers compensation claims should be lodged immediately. Specialist lawyers ensure maximum statutory entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Total and Permanent Disability (TPD)</h3>
      <p>
        TPD insurance, typically held through superannuation, pays lump sum benefits when unable to work due to injury or illness. Northern Territory TPD claims follow standard insurance dispute processes. Insurers frequently deny legitimate claims. Disputes involve medical evidence, policy interpretation, and TPD definitions. The Australian Financial Complaints Authority (AFCA) handles complaints. TPD lawyers represent claimants through the claims and appeals process.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dust Diseases and Asbestos</h3>
      <p>
        Northern Territory workers exposed to asbestos, silica, or other harmful dusts can develop serious diseases decades later. Asbestos-related diseases including mesothelioma, asbestosis, and asbestos-related lung cancer have special compensation provisions. NT WorkSafe administers workers compensation for dust diseases. Common law claims against former employers (where available) and asbestos product manufacturers provide compensation. Specialist asbestos lawyers trace exposure history.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Personal Injury Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>NT WorkSafe:</strong> 1800 019 115</li>
          <li><strong>Territory Insurance Office (TIO):</strong> (08) 8924 3711</li>
          <li><strong>Health and Community Services Complaints Commission:</strong> 1800 004 474</li>
          <li><strong>NT Legal Aid Commission:</strong> 1800 019 343</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dispute Resolution</h3>
      <p>
        Personal injury disputes in the Northern Territory are resolved through negotiation, administrative review, or court proceedings. Workers compensation disputes proceed through conciliation and review processes. Medical assessment panels determine impairment percentages. The Local Court and Supreme Court hear personal injury litigation. Personal injury lawyers guide clients through dispute resolution processes.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Personal Injury Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://worksafe.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT WorkSafe</a></li>
          <li><a href="https://www.tio.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Territory Insurance Office</a></li>
          <li><a href="https://hcscc.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Health and Community Services Complaints Commission</a></li>
          <li><a href="https://nt.gov.au/law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Government - Law and Justice</a></li>
        </ul>
      </div>
    </>
  ),

  'business-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Business Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Business law in the Northern Territory encompasses corporate law, commercial contracts, mergers and acquisitions, and regulatory compliance. Darwin is the Territory's business centre with strong defence, government services, tourism, mining, and agricultural sectors. Northern Territory business lawyers advise on business formation, operations, transactions, and disputes to help businesses succeed while managing legal risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Formation and Structure</h3>
      <p>
        Choosing the right business structure is crucial. Options include sole trader, partnership, trust, or company. Companies are regulated by ASIC under the Corporations Act 2001. Northern Territory lawyers advise on tax implications, asset protection, liability, succession planning, and compliance requirements. Company incorporation involves registration with ASIC, constitution drafting, shareholder agreements, and compliance frameworks. Family businesses and pastoral operations often use trust structures.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Contracts</h3>
      <p>
        Commercial contracts underpin Northern Territory businesses. Common contracts include supply agreements, distribution agreements, service agreements, licensing, and government contracts. Territory businesses deal extensively with government contracts given public sector prominence. The Australian Consumer Law imposes mandatory guarantees and unfair contract term prohibitions. Lawyers draft, review, and negotiate contracts protecting your business interests and ensuring enforceability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Franchising</h4>
      <p>
        Franchising in the Northern Territory is regulated by the Franchising Code of Conduct requiring comprehensive disclosure before franchise sale. Franchisors must provide disclosure documents, financial information, and cooling-off periods. Territory franchise disputes are handled by Federal Court and Supreme Court. Specialist franchise lawyers represent franchisors and franchisees in disputes and transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mergers and Acquisitions</h3>
      <p>
        Business acquisitions in the Northern Territory involve due diligence, contract negotiation, regulatory approvals, and completion. Due diligence examines financial records, contracts, litigation, intellectual property, employment, and tax. Territory business acquisitions may involve pastoral properties, tourism operations, or defence sector businesses. Share sales transfer ownership of the company entity. Asset sales transfer specific business assets. Corporate lawyers coordinate complex acquisitions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Partnership and Shareholder Agreements</h3>
      <p>
        Partnership agreements govern business partnerships. Shareholder agreements regulate relationships between company shareholders addressing management, share transfers, dispute resolution, and exit strategies. Buy-sell provisions, drag-along and tag-along rights, and valuation mechanisms prevent deadlocks. Northern Territory courts handle partnership and shareholder disputes including oppression claims under section 232 Corporations Act. Proper agreements prevent costly disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Disputes</h3>
      <p>
        Northern Territory businesses face disputes including contract breaches, partnership disputes, shareholder disputes, trade practices claims, and debt recovery. NTCAT handles smaller commercial matters. The Local Court and Supreme Court hear larger disputes. Mediation and arbitration provide alternatives to litigation. Business lawyers resolve disputes efficiently through negotiation, alternative dispute resolution, or court proceedings when necessary.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Business Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Business Enterprise Centres NT:</strong> (08) 8945 0800</li>
          <li><strong>Consumer Affairs NT:</strong> 1800 019 319</li>
          <li><strong>Australian Competition and Consumer Commission:</strong> 1300 302 502</li>
          <li><strong>NT Chamber of Commerce and Industry:</strong> (08) 8982 8100</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Regulatory Compliance</h3>
      <p>
        Northern Territory businesses must comply with extensive regulation including Australian Consumer Law, workplace relations laws, privacy laws, taxation laws, and Territory-specific regulation. Directors have statutory duties including duty of care, duty to prevent insolvent trading, and duty to avoid conflicts. ASIC enforces corporate regulation. Consumer Affairs NT regulates various industries. Business lawyers ensure regulatory compliance and defend investigations.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Business Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://business.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business NT</a></li>
          <li><a href="https://nt.gov.au/industry/consumer-affairs" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer Affairs NT</a></li>
          <li><a href="https://www.ntcci.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Chamber of Commerce and Industry</a></li>
          <li><a href="https://asic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC</a></li>
        </ul>
      </div>
    </>
  ),

  'immigration-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Immigration Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Immigration law in the Northern Territory operates under federal legislation including the Migration Act 1958 and Migration Regulations. Darwin and the Northern Territory attract skilled migrants, international students, family migrants, and business migrants. The Territory's state nomination program provides pathways to permanent residence. Registered migration agents and immigration lawyers guide applicants through complex visa processes and represent clients in tribunals and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Categories</h3>
      <p>
        Australia's visa system includes temporary visas (visitor, student, temporary work) and permanent visas (skilled, family, business). The Northern Territory's state nomination program for skilled migrants targets occupations in demand including healthcare, education, engineering, IT, trades, and hospitality. Darwin and regional Northern Territory offer migration pathways with lower requirements than major cities. Visa applications require meeting health, character, and specific visa criteria.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Skilled Migration</h4>
      <p>
        Skilled migration to the Northern Territory includes independent skilled visas, state-nominated visas, and employer-sponsored visas. The Territory's state nomination program provides pathways for occupations on the state's skilled occupation list. Points-tested visas require meeting points threshold through age, English, qualifications, and work experience. Regional Northern Territory classification provides additional migration benefits. Skills assessments verify qualifications meet Australian standards.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Family Migration</h3>
      <p>
        Partner visas allow Australian citizens, permanent residents, and eligible New Zealand citizens to sponsor spouses and de facto partners. Prospective marriage visas require intent to marry within nine months. Parent visas have long waiting periods with contributory options providing faster processing. Child visas and remaining relative visas complete family migration categories. The Territory's multicultural population supports family reunification.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business and Investment Migration</h3>
      <p>
        Business Innovation and Investment visas attract entrepreneurs and investors to the Northern Territory. The Business Innovation stream requires successful business experience and genuine intention to operate Territory business. Investor streams require designated investments in Australian assets. The Territory's state nomination program prioritizes genuine business establishment in growth sectors. Business advisers assist migrant entrepreneurs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Student Visas</h3>
      <p>
        Darwin and Alice Springs educational institutions attract international students. Student visas require enrollment in registered courses, sufficient funds, health insurance, and genuine temporary entrant requirements. Post-study work visas allow graduates to gain Australian work experience. Regional classification provides additional visa benefits. Visa conditions restrict work hours during studies. Education agents and migration lawyers assist with visa applications and compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Citizenship</h3>
      <p>
        Australian citizenship requires permanent residence, residency period (usually four years including 12 months as permanent resident), good character, and knowledge of Australia. Citizenship confers voting rights, passport eligibility, and government employment access. Children born in Australia to permanent residents or citizens are usually Australian citizens. Citizenship by descent applies to children born overseas to Australian citizen parents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Refusals and Cancellations</h3>
      <p>
        Visa refusals and cancellations can be reviewed by the Administrative Review Tribunal (ART, formerly AAT). Character cancellations under section 501 Migration Act affect visa holders with criminal records. Direction 99 guides decision-makers on character cancellations considering family ties and community protection. Federal Circuit and Family Court and Federal Court hear judicial review applications. Immigration lawyers represent clients in tribunal and court proceedings.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Immigration Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Home Affairs:</strong> 131 881</li>
          <li><strong>Administrative Review Tribunal:</strong> 1800 228 333</li>
          <li><strong>Refugee Council of Australia:</strong> (02) 9211 9333</li>
          <li><strong>Office of Multicultural Affairs:</strong> (08) 8999 5846</li>
          <li><strong>Migration Agents Registration Authority:</strong> (07) 3360 3888</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Deportation and Removal</h3>
      <p>
        Unlawful non-citizens face detention and removal from Australia. Visa cancellations for character or compliance reasons result in removal. Ministerial intervention under sections 48B, 351, or 417 provides last resort options. Bridging visas allow lawful stay while matters are resolved. Detention reviews are available through the Administrative Review Tribunal. Immigration lawyers urgently respond to detention and deportation matters.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Immigration Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.homeaffairs.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Home Affairs</a></li>
          <li><a href="https://www.aat.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Administrative Review Tribunal</a></li>
          <li><a href="https://business.nt.gov.au/migration" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Migration</a></li>
          <li><a href="https://studynt.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Study NT</a></li>
        </ul>
      </div>
    </>
  ),

  'litigation': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Litigation in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Litigation in the Northern Territory encompasses civil and commercial disputes resolved through courts and tribunals. The Territory's court system includes the Local Court, Supreme Court, and specialized tribunals. Effective litigation requires strategic advice, thorough preparation, and skilled advocacy. Northern Territory litigation lawyers represent clients in all forums, from small claims to complex commercial disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Northern Territory Court System</h3>
      <p>
        The Northern Territory's Local Court handles civil claims up to $100,000 and criminal summary matters. The Supreme Court has unlimited civil jurisdiction and hears indictable criminal offences. The Northern Territory Civil and Administrative Tribunal (NTCAT) provides accessible dispute resolution for administrative, tenancy, and other matters. The Federal Circuit and Family Court and Federal Court operate in Darwin for federal matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Civil Litigation</h3>
      <p>
        Civil litigation includes contract disputes, negligence claims, property disputes, and debt recovery. Northern Territory civil procedure follows the Local Court (Civil Jurisdiction) Act 1989 and Supreme Court Rules emphasizing case management, proportionality, and alternative dispute resolution. Pre-action protocols encourage early resolution. Discovery, expert evidence, and interlocutory applications require compliance with rules and practice directions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Commercial Litigation</h4>
      <p>
        Commercial litigation involves business disputes including contract breaches, shareholder disputes, partnership disputes, and trade practices. The Supreme Court handles commercial matters with case management procedures. Freezing orders, search orders, and security for costs protect parties' positions. Territory commercial litigation often involves government contracts and resource sector disputes. Litigation lawyers strategically manage disputes to achieve commercial outcomes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Alternative Dispute Resolution</h3>
      <p>
        Mediation and arbitration offer alternatives to court litigation. Northern Territory courts encourage mediation in many matters. Private mediators and arbitrators resolve disputes confidentially and efficiently. Arbitration awards are enforceable like court judgments. Expert determination resolves technical disputes. ADR reduces costs and provides flexible outcomes. Lawyers advise on ADR suitability and represent clients in ADR processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Recovery</h3>
      <p>
        Debt recovery through Northern Territory courts involves issuing proceedings, default judgments, or defended hearings. Judgment enforcement includes garnishee orders, instalment orders, warrants of execution, and examination summonses. Bankruptcy and winding up proceedings pressure debtors to pay. Territory debt collection laws protect debtors from harassment. Creditors' lawyers strategically recover debts while managing costs and risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Building and Construction Disputes</h3>
      <p>
        Building disputes in the Northern Territory involve defective work, cost overruns, delays, and payment disputes. Building regulations govern residential building. Security of payment legislation under the Construction Contracts (Security of Payments) Act 2004 provides rapid adjudication of payment claims. The Building Practitioners Board investigates builder conduct. NTCAT resolves domestic building disputes. Supreme Court handles complex commercial construction litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Defamation</h3>
      <p>
        Defamation in the Northern Territory involves publication of material harming reputation. Defamation follows common law principles. Defences include truth, honest opinion, and qualified privilege. Offers to make amends can resolve matters early. Limitation periods require prompt action. Social media defamation is increasingly common. Supreme Court handles defamation proceedings. Defamation lawyers advise publishers and plaintiffs on rights and risks.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Litigation Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of NT:</strong> (08) 8999 6562</li>
          <li><strong>Local Court of NT:</strong> (08) 8999 7290</li>
          <li><strong>NT Civil and Administrative Tribunal:</strong> (08) 8999 1800</li>
          <li><strong>Law Society NT:</strong> (08) 8981 5104</li>
          <li><strong>NT Legal Aid Commission:</strong> 1800 019 343</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Costs and Funding</h3>
      <p>
        Northern Territory litigation costs follow the principle that unsuccessful parties pay winners' costs. Security for costs may be ordered against plaintiffs. Costs disclosure obligations require lawyers to inform clients of likely costs. No win, no fee arrangements are available for some matters. Litigation funding provides financial support for claims in exchange for success fees. Territory courts scrutinize disproportionate costs. Lawyers provide realistic cost estimates and strategic advice on litigation economics.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Litigation Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://nt.gov.au/law/courts" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Government - Courts</a></li>
          <li><a href="https://localcourt.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Local Court of NT</a></li>
          <li><a href="https://supremecourt.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Supreme Court of NT</a></li>
          <li><a href="https://ntcat.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Civil and Administrative Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'bankruptcy-insolvency': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Bankruptcy and Insolvency in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Bankruptcy and insolvency law in the Northern Territory helps individuals and companies facing financial difficulties. The Bankruptcy Act 1966 governs personal insolvency, while the Corporations Act 2001 governs corporate insolvency. The Northern Territory has experienced insolvency practitioners and lawyers who advise on bankruptcy alternatives, restructuring, and formal insolvency processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Personal Bankruptcy</h3>
      <p>
        Bankruptcy is a formal process where an individual is declared unable to pay debts. Bankruptcy can be voluntary (debtor's petition) or involuntary (creditor's petition). A trustee takes control of assets, realizes them, and distributes to creditors. Bankruptcy typically lasts three years. During bankruptcy, travel restrictions apply, credit reporting continues for five years, and certain assets are protected including household items, tools of trade, and some superannuation. Bankruptcy discharges most debts excluding child support, HECS, and fraud debts.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternatives to Bankruptcy</h4>
      <p>
        Debt agreements under Part IX Bankruptcy Act allow debtors to propose reduced payment arrangements to creditors avoiding bankruptcy. Personal insolvency agreements (Part X) provide flexible arrangements for higher-value estates. Informal arrangements negotiate payment plans with creditors. These alternatives avoid bankruptcy's consequences while addressing debt. Northern Territory insolvency practitioners assess options and implement solutions. Early advice maximizes options and prevents forced bankruptcy.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Corporate Insolvency</h3>
      <p>
        Companies facing insolvency have several options. Voluntary administration under Part 5.3A Corporations Act provides breathing space while administrators investigate rescue prospects. Creditors vote on proposals including deeds of company arrangement. Liquidation winds up companies and distributes assets to creditors. Receivers can be appointed by secured creditors. Directors facing insolvent trading allegations face personal liability. Early advice prevents wrongful trading and maximizes restructuring options.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Liquidation</h3>
      <p>
        Liquidation ends company existence through voluntary liquidation (members' or creditors') or court-ordered winding up. Liquidators realize assets, investigate company affairs, and distribute to creditors according to priority. Employees rank ahead of unsecured creditors for wages and entitlements. Liquidators pursue voidable transactions including unfair preferences and uncommercial transactions. ASIC regulates liquidators. Creditors receive dividends if assets remain after secured and priority creditors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Voluntary Administration</h3>
      <p>
        Voluntary administration provides companies with temporary protection from creditors while exploring rescue options. Administrators investigate company affairs and report to creditors on prospects of saving business. Creditors vote on proposals including deeds of company arrangement, liquidation, or returning company to directors. Territory administrators work with directors, creditors, and employees to achieve optimal outcomes. Administration can result in successful restructuring saving businesses and jobs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Creditors' Rights</h3>
      <p>
        Creditors can initiate bankruptcy or winding up proceedings to recover debts. Statutory demands under section 459E Corporations Act require companies to pay debts or face presumed insolvency. Creditors lodge proofs of debt in administrations and liquidations. Committees of inspection represent creditor interests. Creditors can challenge administrators' and liquidators' decisions. Security interests under the Personal Property Securities Act provide priority. Insolvency lawyers represent creditors maximizing recoveries.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Bankruptcy & Insolvency Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Financial Security Authority:</strong> 1300 364 785</li>
          <li><strong>ASIC Insolvency Practitioners:</strong> 1300 300 630</li>
          <li><strong>National Debt Helpline:</strong> 1800 007 007</li>
          <li><strong>Financial Counselling NT:</strong> 1800 007 007</li>
          <li><strong>NT Consumer Affairs:</strong> 1800 019 319</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Directors' Duties and Insolvent Trading</h3>
      <p>
        Directors must prevent insolvent trading - incurring debts when company cannot pay them. Section 588G Corporations Act imposes personal liability on directors for insolvent trading. Safe harbour protections apply when directors develop and implement restructuring plans. The business judgment rule protects informed, good faith decisions. ASIC prosecutes serious director breaches. Northern Territory insolvency lawyers advise directors on duties, safe harbour, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Bankruptcy & Insolvency Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.afsa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Financial Security Authority</a></li>
          <li><a href="https://asic.gov.au/regulatory-resources/insolvency/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC Insolvency Information</a></li>
          <li><a href="https://www.arita.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ARITA - Australian Restructuring Insolvency & Turnaround Association</a></li>
          <li><a href="https://nt.gov.au/industry/consumer-affairs" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer Affairs NT</a></li>
        </ul>
      </div>
    </>
  ),

  'intellectual-property': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Intellectual property law protects creations of the mind including inventions, brands, designs, and creative works. The Northern Territory's innovation economy, particularly in defence technology, tropical agriculture, Indigenous arts, and tourism, makes IP protection important. Northern Territory IP lawyers advise on registration, protection, commercialization, and enforcement of intellectual property rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trademarks</h3>
      <p>
        Trademarks protect brand names, logos, and other identifiers under the Trade Marks Act 1995. Registration with IP Australia provides exclusive rights to use marks for registered goods and services. Northern Territory businesses should conduct searches before adoption, register in relevant classes, and monitor for infringement. Trademark protection prevents consumer confusion and protects brand investment. Opposition and cancellation proceedings defend trademark rights. Lawyers advise on selection, registration, and enforcement.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Copyright</h3>
      <p>
        Copyright automatically protects original works including literary works, artistic works, music, films, sound recordings, and broadcasts under the Copyright Act 1968. Protection lasts life of author plus 70 years. Copyright protects expression, not ideas. Fair dealing exceptions allow limited use for research, criticism, and news reporting. Indigenous cultural expression and art require specific copyright considerations. Copyright assignment and licensing agreements commercialize works. Infringement remedies include damages, accounts of profits, and injunctions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Patents</h3>
      <p>
        Patents protect inventions that are novel, inventive, and useful under the Patents Act 1990. Standard patents last 20 years; innovation patents (abolished 2021 for new applications) lasted 8 years. The patent process involves search, application, examination, and grant. Provisional applications establish priority for 12 months. Northern Territory innovation in tropical agriculture, defence technology, and environmental solutions generates patent activity. Patent lawyers conduct searches, draft specifications, prosecute applications, and enforce patents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Designs</h3>
      <p>
        Registered designs protect visual appearance of products including shape, configuration, pattern, and ornamentation under the Designs Act 2003. Protection lasts up to 10 years. Designs must be new and distinctive. Registration is relatively quick and affordable. Product designers and manufacturers should register designs before public disclosure. Design infringement involves making, importing, or selling products embodying registered designs. Territory design industries benefit from design protection.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trade Secrets and Confidential Information</h3>
      <p>
        Trade secrets protect confidential business information including formulas, processes, customer lists, and know-how. Unlike registered IP rights, trade secrets rely on maintaining secrecy. Breach of confidence claims prevent unauthorized disclosure or use. Employment contracts and non-disclosure agreements protect confidential information. Territory businesses protect trade secrets through contracts and security measures. Courts grant injunctions preventing disclosure and damages for breaches.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Commercialization</h3>
      <p>
        IP commercialization includes licensing, assignment, and joint ventures. Licensing agreements grant rights to use IP while retaining ownership. Exclusive licenses provide sole licensee rights; non-exclusive licenses permit multiple licensees. Royalty structures compensate IP owners. Due diligence examines IP ownership and validity. R&D tax incentives support Territory innovation. IP lawyers negotiate and draft commercialization agreements maximizing value while protecting rights.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory IP Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>IP Australia:</strong> 1300 65 10 10</li>
          <li><strong>Copyright Agency:</strong> 1800 066 844</li>
          <li><strong>Australian Copyright Council:</strong> (02) 8815 9777</li>
          <li><strong>Law Society NT (IP Referrals):</strong> (08) 8981 5104</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Enforcement</h3>
      <p>
        IP infringement is enforced through Federal Court proceedings. Remedies include injunctions, damages, accounts of profits, and delivery up of infringing goods. Australian Border Force can seize counterfeit imports. Anton Piller orders (search orders) preserve evidence. Cease and desist letters often resolve matters without litigation. Territory IP owners should actively monitor and enforce rights. Lawyers advise on infringement, conduct negotiations, and litigate when necessary.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory IP Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ipaustralia.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IP Australia</a></li>
          <li><a href="https://www.copyright.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Copyright Council</a></li>
          <li><a href="https://ipta.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Intellectual Property Society of Australia and New Zealand</a></li>
          <li><a href="https://business.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business NT</a></li>
        </ul>
      </div>
    </>
  ),

  'tax-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Tax Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Tax law in the Northern Territory encompasses federal taxation administered by the Australian Taxation Office and Territory taxes administered by the Territory Revenue Office. Northern Territory tax lawyers advise individuals and businesses on tax planning, compliance, disputes, and restructuring to minimize tax liabilities and resolve ATO disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Income Tax</h3>
      <p>
        Income tax applies to individuals, companies, trusts, and superannuation funds under federal tax law. Northern Territory taxpayers face the same income tax rates as other Australians, with the Northern Territory offering zone tax offsets for residents. Tax planning includes structuring income, maximizing deductions including zone rebates, timing transactions, and utilizing concessions. Small business CGT concessions provide significant relief for business asset sales. Tax lawyers advise on complex transactions, restructures, and ATO audits.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Goods and Services Tax (GST)</h4>
      <p>
        GST at 10% applies to most supplies of goods and services. Businesses with turnover over $75,000 ($150,000 for non-profits) must register. Input tax credits allow GST-registered businesses to claim back GST on purchases. GST-free supplies include basic food, health, and education. Complex GST issues arise in property transactions and business operations. Tax advisers ensure GST compliance and optimal structuring.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Territory Taxes - Stamp Duty and Land Tax</h3>
      <p>
        The Northern Territory imposes stamp duty on property transfers, business asset sales, motor vehicle transfers, and insurance. Rates vary by transaction type. Property stamp duty has first home buyer concessions. The Northern Territory abolished land tax in 2010. Principal place of residence has duty concessions. Territory Revenue Office administers stamp duty with objection and appeal rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Payroll Tax</h3>
      <p>
        Northern Territory employers with Australian wages exceeding the threshold ($1.5 million for 2023-24) pay payroll tax at 5.5%. Regional employers receive rate reductions. Grouping provisions aggregate related businesses' wages. Contractors may be deemed employees for payroll tax. Territory Revenue Office audits ensure compliance. Voluntary disclosures provide penalty relief. Tax lawyers advise on payroll tax obligations, grouping, and disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Disputes and Audits</h3>
      <p>
        ATO audits examine tax returns for compliance. Taxpayers have rights including representation and reasonable time to respond. Objections challenge ATO decisions with 60-day time limits (four years for small businesses). The Administrative Review Tribunal reviews objection decisions. Federal Court hears appeals on questions of law. Territory taxpayers dispute Part IVA general anti-avoidance provisions and tax residency issues. Tax lawyers represent clients in audits, objections, and litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Planning and Restructuring</h3>
      <p>
        Tax planning minimizes tax within legal boundaries. Common strategies include income splitting through family trusts, superannuation contributions, zone tax offsets, and asset protection structures. Business restructures utilize rollover provisions avoiding immediate tax. Territory businesses have specific tax planning opportunities. Voluntary disclosures to ATO reduce penalties for past non-compliance. Tax lawyers design compliant structures achieving tax efficiency.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Tax Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Taxation Office:</strong> 13 28 61 (individuals), 13 28 66 (businesses)</li>
          <li><strong>Territory Revenue Office:</strong> (08) 8999 7368</li>
          <li><strong>Tax Practitioners Board:</strong> (03) 9200 8800</li>
          <li><strong>Inspector-General of Taxation:</strong> 1800 199 010</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Superannuation</h3>
      <p>
        Superannuation enjoys concessional tax treatment to encourage retirement savings. Contributions are taxed at 15% (30% for high earners). Earnings taxed at 15% in accumulation phase, tax-free in pension phase. Superannuation death benefits have tax implications depending on beneficiary and payment type. Self-managed superannuation funds (SMSFs) require careful administration and compliance. Territory SMSF trustees face auditor and ATO scrutiny. Tax advisers optimize superannuation strategies.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Tax Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ato.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Taxation Office</a></li>
          <li><a href="https://revenue.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Territory Revenue Office</a></li>
          <li><a href="https://www.tpb.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tax Practitioners Board</a></li>
          <li><a href="https://www.igt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Inspector-General of Taxation</a></li>
        </ul>
      </div>
    </>
  ),

  'environmental-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Environmental Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Environmental law in the Northern Territory regulates environmental protection, land use planning, and natural resource management. The Environment Protection Act 2019 provides the Territory's environmental framework with the NT Environment Protection Authority as principal regulator. Northern Territory environmental lawyers advise on compliance, planning, contaminated land, mining approvals, Aboriginal land, and environmental litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Environment Protection</h3>
      <p>
        The Northern Territory's Environment Protection Act 2019 requires environmental duty holders to avoid environmental harm. The NT EPA assesses significant proposals requiring environmental impact assessments. Environmental approvals and permits required for prescribed activities. Pollution must be controlled and reported. EPA can issue environment protection orders and prosecutions. Mining, pastoral, and development projects undergo environmental assessment. Environmental lawyers advise on approvals, compliance, and respond to EPA action.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Planning and Development</h3>
      <p>
        The Northern Territory's Planning Act 1999 regulates land use and development. The NT Planning Scheme and area plans control development through zones and provisions. Development consent required for most development. Development consent authorities assess applications. NTCAT hears planning appeals. Environmental considerations integrate with planning assessment. Sacred sites and Aboriginal land require specific approvals. Planning lawyers obtain approvals, defend objections, and appeal decisions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Contaminated Land</h4>
      <p>
        Contaminated land creates liability for current and former owners, occupiers, and polluters under the Waste Management and Pollution Control Act 1998. Site contamination must be assessed and remediated. Due diligence investigations identify contamination risks. Mining legacy and defence sites create contamination issues. Environmental lawyers advise purchasers, vendors, and responsible parties on contaminated land issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Aboriginal Land and Sacred Sites</h3>
      <p>
        Aboriginal land in the Northern Territory is extensive under the Aboriginal Land Rights (Northern Territory) Act 1976. Development on Aboriginal land requires consent from land councils. The Northern Territory Aboriginal Sacred Sites Act 1989 protects sacred sites. Authority certificates required before works on or near sacred sites. Traditional owner consultation is essential. Unauthorized damage to sacred sites is an offence. Developers engage with land councils and Aboriginal Areas Protection Authority.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mining and Resources</h3>
      <p>
        Mining in the Northern Territory requires mineral titles under the Mineral Titles Act 2010 and environmental approvals. The Department of Industry, Tourism and Trade administers mining titles. Mining management plans address environmental management. Environmental bonds ensure rehabilitation. The Territory's mineral resources including gold, manganese, bauxite, uranium, and oil and gas are significant. Aboriginal land and sacred site approvals are critical. Mining lawyers obtain approvals and advise on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Climate Change and Renewable Energy</h3>
      <p>
        The Northern Territory has renewable energy potential with excellent solar resources. No standalone climate change legislation exists. Environmental approvals consider environmental impacts. Large-scale solar projects are developing. National Greenhouse and Energy Reporting requires emissions reporting. Environmental lawyers advise on renewable energy projects and regulatory compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Environmental Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>NT Environment Protection Authority:</strong> (08) 8924 4218</li>
          <li><strong>Department of Environment, Parks and Water Security:</strong> (08) 8999 4676</li>
          <li><strong>NT Planning Commission:</strong> (08) 8999 5511</li>
          <li><strong>Aboriginal Areas Protection Authority:</strong> (08) 8981 4365</li>
          <li><strong>Department of Industry, Tourism and Trade:</strong> (08) 8999 5511</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Water and Biodiversity</h3>
      <p>
        Northern Territory water resources are managed under the Water Act 1992. Water extraction licenses required for taking water. Environmental water provisions protect environmental flows. The Territory's biodiversity is significant with unique tropical ecosystems. The Territory Parks and Wildlife Conservation Act 2014 protects native species and reserves. Clearing native vegetation requires permits. Developers must consider biodiversity impacts and offset requirements.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Environmental Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://ntepa.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Environment Protection Authority</a></li>
          <li><a href="https://depws.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Environment, Parks and Water Security</a></li>
          <li><a href="https://planningcommission.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Planning Commission</a></li>
          <li><a href="https://aapa.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Aboriginal Areas Protection Authority</a></li>
        </ul>
      </div>
    </>
  ),

  'administrative-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrative Law in Northern Territory</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Administrative law in the Northern Territory governs the exercise of government power and review of government decisions. The Northern Territory Civil and Administrative Tribunal (NTCAT), Ombudsman NT, and courts review administrative action. Administrative lawyers challenge unlawful decisions, ensure procedural fairness, and hold government accountable to the rule of law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">NTCAT Review</h3>
      <p>
        NTCAT reviews Territory government decisions across diverse areas including planning, building, tenancy, guardianship, occupational regulation, and anti-discrimination. NTCAT provides accessible, low-cost review with less formality than courts. The enabling Act for each decision specifies review rights and grounds. NTCAT conducts hearings de novo or on review basis depending on jurisdiction. Lawyers represent parties in NTCAT proceedings, ensuring procedural rights and presenting persuasive cases.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Judicial Review</h3>
      <p>
        Judicial review challenges government decisions on legal grounds including jurisdictional error, procedural unfairness, taking irrelevant considerations into account, failing to consider relevant matters, and unreasonableness. The Supreme Court's judicial review jurisdiction covers Territory government decisions. Federal Court reviews Commonwealth decisions. Judicial review doesn't substitute decision-maker's discretion but ensures lawful exercise. Remedies include quashing decisions, mandamus compelling action, and declarations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Procedural Fairness</h4>
      <p>
        Procedural fairness (natural justice) requires fair hearing and unbiased decision-makers. The hearing rule requires notice, opportunity to be heard, and consideration of submissions. The bias rule requires actual or apprehended freedom from bias. Territory decision-makers must comply unless legislation clearly excludes fairness. Lawyers challenge decisions lacking procedural fairness and advise government on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Ombudsman NT</h3>
      <p>
        Ombudsman NT investigates complaints about Territory government agencies, local councils, and certain public bodies. The Ombudsman can investigate administrative action, conduct own-motion investigations, and make recommendations. Ombudsman investigations are free and accessible. Findings aren't binding but carry significant weight. Public interest disclosures (whistleblowing) about government wrongdoing are protected. The Ombudsman's annual reports highlight systemic issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Freedom of Information</h3>
      <p>
        The Northern Territory's Information Act 2002 provides rights to access government documents. Territory government agencies and local councils are subject to FOI. FOI applications are made in writing. Agencies must respond within 30 days. Exemptions protect cabinet documents, personal privacy, law enforcement, and commercial confidentiality. Information Commissioner reviews FOI decisions. NTCAT provides further review. FOI promotes government transparency and accountability.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Privacy and Data Protection</h3>
      <p>
        The Northern Territory's Information Act 2002 includes Information Privacy Principles governing public sector information handling. Personal information must be collected, used, disclosed, and stored appropriately. The Information Commissioner enforces privacy principles. Data breaches must be managed appropriately. Privacy lawyers advise government and individuals on privacy rights and obligations.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Northern Territory Administrative Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>NT Civil and Administrative Tribunal:</strong> (08) 8999 1800</li>
          <li><strong>Ombudsman NT:</strong> 1800 806 380</li>
          <li><strong>Information Commissioner NT:</strong> (08) 8999 1800</li>
          <li><strong>Supreme Court of NT:</strong> (08) 8999 6562</li>
          <li><strong>Anti-Discrimination Commission NT:</strong> (08) 8999 1444</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Government and Public Law</h3>
      <p>
        Northern Territory constitutional law governs the Legislative Assembly, Executive, and Judiciary relationships. The Northern Territory (Self-Government) Act 1978 establishes the Territory's constitutional framework. Parliamentary sovereignty, separation of powers, and rule of law are fundamental principles. Statutory interpretation principles guide understanding legislation. Territory public lawyers advise government on lawful exercise of power, legislative drafting, and constitutional issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Anti-Discrimination</h3>
      <p>
        The Northern Territory's Anti-Discrimination Act 1992 prohibits discrimination based on protected attributes including race, sex, sexuality, age, marital status, pregnancy, disability, and religious belief. The Anti-Discrimination Commission investigates complaints and attempts conciliation. Unresolved matters proceed to the Local Court. Public authorities must eliminate discrimination and promote equal opportunity. Administrative lawyers argue discrimination matters in court proceedings.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Northern Territory Administrative Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://ntcat.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">NT Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.ombudsman.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Ombudsman NT</a></li>
          <li><a href="https://infocomm.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Information Commissioner NT</a></li>
          <li><a href="https://adc.nt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Anti-Discrimination Commission NT</a></li>
        </ul>
      </div>
    </>
  ),
}

// Tasmania Practice Area Content
const TAS_CONTENT: Record<string, React.ReactElement> = {
  'family-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Family Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Family law in Tasmania operates under federal legislation including the Family Law Act 1975, with state courts handling specific matters such as family violence orders. Tasmania has comprehensive family law resources across Hobart, Launceston, and regional centres, with the Federal Circuit and Family Court providing services for families dealing with separation, divorce, and parenting disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Family Law in Tasmania</h3>
      <p>
        Tasmanian family lawyers handle divorce, property settlements, parenting arrangements, spousal maintenance, and de facto relationship matters. The Federal Circuit and Family Court of Australia operates from Hobart and Launceston. Tasmania's Magistrates Court handles family violence orders, which frequently intersect with family law proceedings. The state has a strong network of family law practitioners and support services across the state.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Areas of Family Law Practice</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Divorce and Separation</h4>
      <p>
        Divorce in Tasmania requires 12 months separation. Separation under one roof is recognized where couples can demonstrate living separately. Tasmanian lawyers assist with divorce applications, address service complications, and handle disputed separation dates. The Federal Circuit and Family Court in Hobart processes divorce applications, with circuit services to Launceston and regional centres including Devonport and Burnie.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Child Custody and Parenting Arrangements</h4>
      <p>
        Parenting matters prioritize children's best interests under the Family Law Act. Tasmania encourages parenting plans negotiated between parents without court intervention. When agreement isn't possible, parenting orders address living arrangements, parenting time, parental responsibility, and child support. Tasmanian courts consider children's views, relationship with both parents, family violence history, and the benefit of meaningful relationships. Independent Children's Lawyers are appointed in complex cases.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Property Settlement</h4>
      <p>
        Property settlement involves identifying the asset pool, assessing contributions (financial and non-financial), considering future needs including health and earning capacity, and determining just and equitable division. Hobart's property values require expert valuations. Superannuation splitting and complex assets including businesses, farms, and trusts require specialist legal advice. Tasmanian property settlements often involve rural properties and family farms requiring specialized valuation and consideration.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">De Facto Relationships</h4>
      <p>
        Tasmania's relationship property laws largely mirror married couple provisions under federal jurisdiction, with state laws also applying under the Relationships Act 2003 (Tas). De facto couples in Tasmania have the same family law rights as married couples if the relationship lasted two years or there are children. Tasmania recognizes same-sex de facto relationships. Evidence requirements include cohabitation, financial interdependence, sexual relationship, and social recognition.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Family Violence Orders</h4>
      <p>
        Tasmania's Family Violence Act 2004 provides for family violence orders through Magistrates' Courts. Family violence orders protect victims from family violence including physical, sexual, psychological, economic abuse, and coercive control. Police can apply for police family violence orders and issue police family violence notices. Breaching a family violence order is a criminal offence. Tasmania has comprehensive family violence support services. Legal aid is available for family violence order matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tasmania-Specific Resources</h3>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Family Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>1800RESPECT (National Family Violence Counselling):</strong> 1800 737 732 (24/7)</li>
          <li><strong>Family Violence Counselling and Support Service:</strong> 1800 608 122 (24/7)</li>
          <li><strong>Men's Referral Service:</strong> 1300 766 491 (24/7)</li>
          <li><strong>Family Relationship Advice Line:</strong> 1800 050 321</li>
          <li><strong>Legal Aid Commission of Tasmania:</strong> 1300 366 611</li>
          <li><strong>Federal Circuit and Family Court (Hobart):</strong> (03) 6232 1040</li>
          <li><strong>Women's Legal Service Tasmania:</strong> (03) 6278 1888</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Locations in Tasmania</h3>
      <p>
        The Federal Circuit and Family Court operates from Hobart and Launceston. Tasmania's Magistrates Courts across the state handle family violence order matters. Hobart has the principal family law registry. Regional Tasmania including Devonport, Burnie, and other centres is serviced through circuit sittings and video conferencing. Tasmania's integrated family violence service system coordinates legal, support, and protection services.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mediation and Family Dispute Resolution</h3>
      <p>
        Family Dispute Resolution (FDR) is required before filing parenting applications, with parties obtaining section 60I certificates. Tasmania has Family Relationship Centres in Hobart and Launceston offering FDR services. Private mediators and collaborative law approaches are available. FDR isn't required where family violence exists or urgency dictates immediate court intervention. Tasmanian family lawyers facilitate dispute resolution and represent clients when court proceedings are necessary.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Legal Aid and Support Services</h3>
      <p>
        Legal Aid Commission of Tasmania provides family law assistance to eligible Tasmanians, prioritizing victims of family violence and matters involving children. Women's Legal Service Tasmania, Aboriginal legal services, and community legal centres across Hobart, Launceston, and regional Tasmania offer free advice and representation. Family violence duty lawyers assist family violence order applicants at court.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Government Links:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.communities.tas.gov.au/community_services/family-violence" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tasmanian Government - Family Violence</a></li>
          <li><a href="https://www.legalaid.tas.gov.au/family-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid Tasmania - Family Law</a></li>
          <li><a href="https://www.womenslegaltas.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Women's Legal Service Tasmania</a></li>
          <li><a href="https://www.fvactionplan.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Safe Homes, Families, Communities Action Plan</a></li>
        </ul>
      </div>
    </>
  ),

  'criminal-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Criminal Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Criminal law in Tasmania operates under the Criminal Code Act 1924, one of Australia's oldest criminal codes. Tasmania has a comprehensive criminal justice system from the Magistrates Court through to the Supreme Court. If you're facing criminal charges in Tasmania, experienced legal representation is essential to protect your rights and achieve the best possible outcome.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Tasmanian Criminal Law</h3>
      <p>
        Tasmanian criminal lawyers defend clients charged with offences ranging from traffic matters to serious indictable crimes. The Magistrates Court handles summary offences and committal proceedings. The Supreme Court hears indictable offences including drug trafficking, serious assaults, sexual offences, and murder. Tasmania's criminal justice system emphasizes rehabilitation alongside punishment, with therapeutic courts and diversion programs available.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Common Criminal Matters</h3>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drink Driving and Traffic Offences</h4>
      <p>
        Tasmania has strict drink driving laws with immediate licence suspensions. Offences include prescribed content of alcohol (.05 or more) and driving under the influence of alcohol or drugs. Special circumstances apply for learner and provisional licence holders. Dangerous driving causing death or injury carries substantial imprisonment. Extraordinary licences may be available for work or medical hardship. Traffic lawyers challenge testing procedures, apply for extraordinary licences, and minimize penalties.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Assault and Violence Offences</h4>
      <p>
        Tasmanian assault charges include common assault, assault causing bodily harm, causing grievous bodily harm, and wounding under the Criminal Code. Aggravated assaults (circumstances of aggravation including family violence, weapons, and vulnerable victims) carry enhanced penalties. Self-defence under section 46 Criminal Code requires reasonable belief that force was necessary and the force used was reasonable. Tasmanian courts consider rehabilitation prospects in sentencing.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drug Offences</h4>
      <p>
        Tasmanian drug offences under the Misuse of Drugs Act 2001 include possession, trafficking, supply, and cultivation. Commercial quantities trigger presumptions and higher penalties. Tasmania's cautioning scheme diverts minor cannabis offenders (up to 50 grams) to counselling. The Drug Treatment Court provides intensive supervision and treatment for eligible offenders. Drug lawyers challenge search legality, contest trafficking presumptions, and pursue diversion or treatment options.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Fraud and White Collar Crime</h4>
      <p>
        Fraud in Tasmania includes stealing, fraud, and dishonest dealings under the Criminal Code. Tasmania Police's Criminal Investigation Branch investigates serious matters. Corporate fraud, ASIC prosecutions, and Centrelink fraud occur. Tasmanian courts consider restitution and cooperation in sentencing. Complex fraud requires specialist defence lawyers who understand financial transactions and corporate structures.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Sexual Offences</h4>
      <p>
        Sexual assault offences in Tasmania carry maximum penalties up to 21 years imprisonment for aggravated sexual assault. Child sexual abuse offences are prosecuted extensively. Complainant evidence can be given via CCTV or recorded statements. Sexual assault communications privilege protects confidential communications. Historical sexual assault prosecutions are common. Specialist criminal lawyers experienced in sexual offence trials are essential for proper defence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights When Charged</h3>
      <p>
        Tasmanian law protects accused persons' rights. You have the right to silence, the right to contact a lawyer before police interview, and the right to refuse participation in identification procedures. Police must caution you before interview. Record of interview procedures must be followed. You're not required to provide anything beyond identifying information. Legal Aid Tasmania provides duty lawyer services at police stations and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Court Process in Tasmania</h3>
      <p>
        Most criminal matters start at the Magistrates Court. Summary offences are finalized there. Indictable offences proceed to committal hearings before trial at Supreme Court. Tasmania's Drug Treatment Court provides intensive support and supervision as an alternative to imprisonment. Plea hearings involve detailed submissions on sentencing factors including rehabilitation prospects. Tasmanian courts emphasize restorative justice principles where appropriate.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Criminal Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Legal Aid Commission of Tasmania:</strong> 1300 366 611</li>
          <li><strong>Aboriginal Legal Service Tasmania:</strong> 1800 066 019</li>
          <li><strong>Law Society of Tasmania (Referrals):</strong> (03) 6234 4133</li>
          <li><strong>Youth Legal Service:</strong> (03) 6236 3800</li>
          <li><strong>Tasmania Police Assistance:</strong> 131 444</li>
          <li><strong>Victims Support Services:</strong> 1300 300 238</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Sentencing in Tasmania</h3>
      <p>
        Tasmanian sentencing follows the Sentencing Act 1997. Penalties include dismissal or discharge, fines, community service orders, home detention, suspended sentences, and imprisonment. Guilty plea discounts apply for early pleas with up to 40% discount for very early pleas. Tasmanian courts emphasize rehabilitation, with therapeutic courts including Drug Treatment Court available. Character references, psychological reports, and rehabilitation evidence influence sentencing.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Criminal Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.justice.tas.gov.au/crime" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tasmanian Government - Crime and Justice</a></li>
          <li><a href="https://www.legalaid.tas.gov.au/criminal-law" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid Tasmania - Criminal Law</a></li>
          <li><a href="https://www.magistratescourt.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Magistrates Court of Tasmania</a></li>
          <li><a href="https://www.supremecourt.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Supreme Court of Tasmania</a></li>
        </ul>
      </div>
    </>
  ),

  'property-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Property law in Tasmania operates under the Land Titles Act 1980 (Torrens Title system), Conveyancing and Law of Property Act 1884, and numerous other statutes. Hobart and regional Tasmania's property markets have unique characteristics. Tasmanian property lawyers and conveyancers ensure smooth conveyancing, protect your interests, and navigate the state's property law framework.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Conveyancing in Tasmania</h3>
      <p>
        Tasmanian conveyancing involves contract exchange, cooling-off period (generally not applicable for most residential contracts), building and pest inspections, settlement, and registration through Land Titles Office Tasmania. Vendor disclosure requirements exist. Electronic conveyancing through PEXA operates in Tasmania. Stamp duty (transfer duty) applies with various concessions available. Searches reveal rates, planning, and title information. Conveyancers conduct most residential conveyancing in Tasmania.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Residential Property Transactions</h3>
      <p>
        Buying property in Tasmania typically uses the standard REIT (Real Estate Institute of Tasmania) contract. Building and pest inspections are strongly recommended. Most residential contracts don't provide cooling-off rights. Hobart's property market and regional Tasmania have unique considerations including heritage listings and rural properties. First home buyers can access stamp duty concessions and grants for properties meeting eligibility criteria.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">First Home Buyers in Tasmania</h4>
      <p>
        Tasmania offers first home buyer concessions including stamp duty exemptions for properties up to $400,000 and concessions up to $600,000. The First Home Owner Grant provides $20,000 for newly built homes (or $30,000 for new homes built in Tasmania). Additional benefits apply for builds in regional Tasmania. Conveyancers and property lawyers ensure you receive all available concessions and proper contract protections.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Property</h3>
      <p>
        Tasmanian commercial property transactions involve due diligence on leases, environmental issues, GST, and business operations. Commercial leases require careful negotiation. Hobart CBD commercial property has unique considerations including heritage requirements. Commercial property lawyers conduct comprehensive due diligence and negotiate favorable terms.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Leasing and Tenancy</h3>
      <p>
        Tasmania's Residential Tenancy Act 1997 governs residential tenancies. The Residential Tenancy Commissioner and Magistrates Court resolve tenancy disputes including bond claims, repairs, and termination. Recent reforms provide tenant protections including minimum housing standards. The Fair Trading (Code of Practice for Retail Leases) Regulations 1998 govern retail leases requiring disclosure.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Strata Titles</h3>
      <p>
        Tasmania's Strata Titles Act 1998 governs apartments and townhouses. Strata corporations manage common property, levy collection, and by-law enforcement. Strata certificates disclose financial position, by-laws, major works, and disputes. Building defects are addressed through building regulations and warranties. The Magistrates Court resolves strata disputes including by-law breaches and building defects.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Development</h3>
      <p>
        Property development in Tasmania requires planning approval under the Land Use Planning and Approvals Act 1993. Local councils assess development applications against planning schemes. The Tasmanian Planning Commission hears major project applications. The Resource Management and Planning Appeal Tribunal hears planning appeals. Heritage considerations, environmental impacts, and coastal development require specific assessment. Planning lawyers coordinate applications, appeals, and compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Property Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>State Revenue Office Tasmania (Stamp Duty):</strong> 1300 135 513</li>
          <li><strong>Consumer, Building and Occupational Services:</strong> 1300 654 499</li>
          <li><strong>Land Titles Office Tasmania:</strong> (03) 6165 4100</li>
          <li><strong>Residential Tenancy Commissioner:</strong> 1300 654 499</li>
          <li><strong>Tasmanian Planning Commission:</strong> (03) 6165 6828</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Property Disputes</h3>
      <p>
        Property disputes in Tasmania include boundary disputes, easements, caveats, breach of contract, building defects, and strata conflicts. The Magistrates Court handles tenancy and smaller property disputes. The Supreme Court handles complex property litigation. The Resource Management and Planning Appeal Tribunal hears planning disputes. The Boundary Fences Act 1908 governs fencing disputes. Experienced property lawyers resolve disputes through negotiation or litigation.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Property Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.cbos.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer, Building and Occupational Services</a></li>
          <li><a href="https://www.sro.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Revenue Office Tasmania</a></li>
          <li><a href="https://www.propertyservices.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Land Titles Office Tasmania</a></li>
          <li><a href="https://www.planningreform.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tasmanian Planning Reform</a></li>
        </ul>
      </div>
    </>
  ),

  'wills-estates': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Wills and Estates Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Wills and estates law in Tasmania is governed by the Wills Act 2008, Administration and Probate Act 1935, and Guardianship and Administration Act 1995. Proper estate planning protects your assets, provides for loved ones, and minimizes disputes. Tasmanian wills and estates lawyers provide comprehensive advice on succession planning, estate administration, and contesting wills.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Will Drafting in Tasmania</h3>
      <p>
        A valid Tasmanian will must be in writing, signed by the testator, and witnessed by two independent witnesses who sign in the testator's presence. Informal wills can be admitted to probate in limited circumstances under section 11 Wills Act. Professional will drafting addresses blended families, business succession, asset protection, and tax planning. Testamentary trusts protect beneficiaries from bankruptcy, relationship breakdowns, and provide tax benefits. Regular reviews ensure wills reflect changed circumstances.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Estate Planning Strategies</h3>
      <p>
        Comprehensive estate planning in Tasmania includes wills, enduring powers of attorney, enduring guardianship, advance care directives, and superannuation binding death benefit nominations. Proper planning minimizes family provision claims, provides for disabled beneficiaries through special disability trusts, and structures inheritances for asset protection. Tasmanian considerations include rural properties, family businesses, and fishing licenses.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Probate and Estate Administration</h3>
      <p>
        Probate is the Supreme Court's grant of representation to executors. Tasmanian executors must collect assets, pay debts, lodge tax returns, and distribute to beneficiaries according to the will. Small estates under certain thresholds may not require formal probate. The process involves obtaining death certificate, locating the will, identifying assets and liabilities, obtaining valuations, and preparing estate accounts. Lawyers ensure executors comply with duties and protect against personal liability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intestacy in Tasmania</h4>
      <p>
        When someone dies without a valid will, intestacy rules under Part III Administration and Probate Act determine distribution. Spouses receive priority with provisions for children. The intestacy formula considers family composition. De facto partners have the same rights as married spouses. The Public Trustee may be appointed administrator if no family applies. Intestacy often results in unintended outcomes and family disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contesting Wills and Family Provision Claims</h3>
      <p>
        Tasmania's family provision regime under the Testator's Family Maintenance Act 1912 allows eligible persons to apply for greater provision from an estate. Eligible persons include spouses, children (including adult children), domestic partners, and certain dependents. Applications must be filed within three months of probate grant (or six months of death if no grant). Tasmanian courts consider financial resources, health, relationship with deceased, contributions, and provision made. Successful claims significantly alter distributions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Powers of Attorney</h3>
      <p>
        Tasmania recognizes enduring powers of attorney under the Powers of Attorney Act 2000. Enduring powers of attorney cover financial and property matters and continue after loss of capacity. General powers of attorney cease on loss of capacity. Enduring powers must be properly executed with prescribed witnesses. Attorneys must act in the principal's best interests, keep proper accounts, and avoid conflicts of interest. The Guardianship and Administration Board reviews attorney conduct.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Enduring Guardianship and Advance Care Directives</h3>
      <p>
        Tasmania's Guardianship and Administration Act 1995 provides for enduring guardianship appointments for personal and lifestyle decisions. Advance care directives document your health care preferences under the Advance Care Directives Act 2013. Enduring guardians and advance care directives must be properly executed with witnesses. The Guardianship and Administration Board can appoint guardians if you lose capacity without valid appointments.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Wills & Estates Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of Tasmania (Probate):</strong> (03) 6165 7333</li>
          <li><strong>Public Trustee Tasmania:</strong> 1800 068 784</li>
          <li><strong>Office of the Public Guardian:</strong> 1300 799 625</li>
          <li><strong>Legal Aid Tasmania:</strong> 1300 366 611</li>
          <li><strong>Law Society of Tasmania:</strong> (03) 6234 4133</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Guardianship and Administration</h3>
      <p>
        The Guardianship and Administration Board appoints guardians for personal decisions and administrators for financial decisions when adults lose capacity without valid appointments. The Public Trustee or private administrators may be appointed. The Board reviews decisions and protects vulnerable adults from abuse. Applications are accessible with the Board operating less formally than courts. Guardianship lawyers represent parties in appointment and review applications.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Wills & Estates Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.justice.tas.gov.au/wills-and-estates" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tasmanian Government - Wills and Estates</a></li>
          <li><a href="https://www.publictrustee.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Public Trustee Tasmania</a></li>
          <li><a href="https://www.publicguardian.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Office of the Public Guardian</a></li>
          <li><a href="https://www.guardianship.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Guardianship and Administration Board</a></li>
        </ul>
      </div>
    </>
  ),

  'employment-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Employment Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Employment law in Tasmania operates primarily under federal legislation including the Fair Work Act 2009, with state-based workers compensation and workplace safety laws. Tasmania has employment law resources including the Fair Work Commission, WorkSafe Tasmania, and the Tasmanian Workers Rehabilitation and Compensation Tribunal. Employment lawyers protect employee and employer rights in this complex regulatory environment.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Understanding Employment Law in Tasmania</h3>
      <p>
        Most Tasmanian employment matters fall under the federal Fair Work system covering minimum wages, working conditions, unfair dismissal, and general protections. However, Tasmanian state laws govern workers compensation under the Workers Rehabilitation and Compensation Act 1988, workplace safety under the Work Health and Safety Act 2012, and certain state public sector employment. The Tasmanian Industrial Commission has limited jurisdiction for state system employees.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Unfair Dismissal Claims</h3>
      <p>
        Employees dismissed from employment may file unfair dismissal applications with the Fair Work Commission if they've served the minimum employment period (six months for small businesses, 12 months otherwise) and earn below the high income threshold. Applications must be lodged within 21 days of dismissal. Tasmanian employment lawyers assess dismissal fairness, prepare applications, and represent clients at conciliation conferences and hearings. Remedies include reinstatement or compensation up to six months' wages.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">General Protections Claims</h4>
      <p>
        General protections prohibit adverse action for exercising workplace rights, union membership, discrimination, or sham contracting. These claims have 60-day time limits but can result in uncapped compensation. Tasmania has significant case law on general protections particularly regarding workplace discrimination. Anti-bullying applications can be made to Fair Work Commission while still employed.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Discrimination and Harassment</h3>
      <p>
        Tasmania's Anti-Discrimination Act 1998 prohibits discrimination based on protected attributes including age, race, sex, sexual orientation, gender identity, disability, marital status, family responsibilities, pregnancy, and industrial activity. Equal Opportunity Tasmania investigates complaints and attempts conciliation. Unresolved matters proceed to the Tasmanian Civil and Administrative Tribunal (TasCAT). Sexual harassment and workplace bullying protections apply.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Employment Contracts and Agreements</h3>
      <p>
        Employment lawyers review and draft employment contracts, executive service agreements, restraint of trade clauses, confidentiality agreements, and enterprise agreements. Tasmanian courts enforce restraint of trade clauses where they protect legitimate business interests and are reasonable. Post-employment restraints are enforceable where properly drafted and reasonable in scope and duration.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers' Compensation</h3>
      <p>
        WorkSafe Tasmania administers workers compensation for Tasmanian workers under the Workers Rehabilitation and Compensation Act 1988. Claims cover medical expenses, weekly payments, permanent impairment benefits, and common law damages where serious injury occurred due to employer negligence. The serious injury threshold requires permanent impairment of 30% or more. Time limits apply - workers compensation claims should be lodged promptly, common law claims within three years. Lawyers maximize both statutory and common law entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Redundancy and Restructuring</h3>
      <p>
        Genuine redundancy requires the position to no longer exist. Large-scale redundancies may require consultation under Fair Work Act provisions. Redundancy pay depends on years of service. Tasmanian employees can challenge sham redundancies or unfair selection processes. State government and private sector restructures create redundancy issues. Employment lawyers ensure proper processes and maximum entitlements.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Employment Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Fair Work Commission:</strong> 1300 799 675</li>
          <li><strong>Fair Work Ombudsman:</strong> 13 13 94</li>
          <li><strong>Equal Opportunity Tasmania:</strong> 1300 305 062</li>
          <li><strong>WorkSafe Tasmania:</strong> 1300 366 322</li>
          <li><strong>Workers Rehabilitation and Compensation Tribunal:</strong> (03) 6166 4690</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workplace Safety and Bullying</h3>
      <p>
        WorkSafe Tasmania enforces Tasmania's Work Health and Safety Act 2012, including psychosocial hazards and workplace bullying. Tasmanian employers must provide safe systems of work and address workplace bullying. The Fair Work Commission handles workplace bullying applications. Workers compensation claims for psychological injury from workplace bullying are common. Employment lawyers advise on prevention, responding to complaints, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Employment Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.fairwork.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a></li>
          <li><a href="https://equalopportunity.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Equal Opportunity Tasmania</a></li>
          <li><a href="https://worksafe.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkSafe Tasmania</a></li>
          <li><a href="https://www.justice.tas.gov.au/tascattribunal" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">TasCAT</a></li>
        </ul>
      </div>
    </>
  ),

  'personal-injury': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Personal Injury Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Personal injury law in Tasmania helps victims of accidents and negligence obtain compensation. Tasmania operates comprehensive compensation schemes including compulsory third party (CTP) insurance for motor accidents, WorkCover Tasmania for workplace injuries, and common law claims for public liability and medical negligence. Experienced Tasmanian personal injury lawyers navigate these schemes to maximize your compensation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Motor Vehicle Accidents</h3>
      <p>
        Tasmania's Motor Accidents (Liabilities and Compensation) Act 1973 provides compulsory third party insurance compensation for injuries in motor accidents. CTP claims provide damages for medical expenses, loss of earnings, future care, pain and suffering, and economic loss where fault is established. The fault-based system requires proving negligence. Claims must be lodged within three years. Pre-litigation procedures including offers to settle are required.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">CTP Claims Process</h4>
      <p>
        CTP claims in Tasmania require proving fault through negligence. Claims involve notifying the insurer, gathering medical evidence, establishing liability, and negotiating settlement or proceeding to court. Personal injury lawyers conduct thorough investigations, obtain expert evidence, and maximize compensation. The Supreme Court and Magistrates Court hear CTP claims depending on value.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Medical Negligence</h3>
      <p>
        Medical negligence claims in Tasmania arise from substandard medical care causing injury. This includes misdiagnosis, surgical errors, medication mistakes, birth injuries, and failure to obtain informed consent. Public hospitals are covered by the State, while private practitioners have professional indemnity insurance. Common law negligence principles apply. Expert medical evidence is essential. Time limits are generally three years from awareness of negligence.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Public Liability Claims</h3>
      <p>
        Public liability claims compensate injuries on another person's property or due to their negligence. Common claims include slip and fall in shopping centres, council property injuries, and defective products. Common law negligence requires proving breach of duty of care and causation. Contributory negligence reduces compensation if you were partly at fault. Dangerous recreational activities may have limited liability under the Civil Liability Act 2002. Personal injury lawyers investigate liability and negotiate with insurers.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Workers Compensation Claims</h3>
      <p>
        Tasmanian workers injured at work claim workers compensation through WorkSafe Tasmania for medical expenses, weekly payments, and permanent impairment benefits. For serious injuries caused by employer negligence (30% or more permanent impairment), common law damages claims provide substantially higher compensation. Time limits are strict - workers compensation claims should be lodged immediately, common law claims within three years. Specialist lawyers assess both statutory and common law entitlements.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Total and Permanent Disability (TPD)</h3>
      <p>
        TPD insurance, typically held through superannuation, pays lump sum benefits when unable to work due to injury or illness. Tasmanian TPD claims are common, with insurers frequently denying legitimate claims. Disputes involve medical evidence, policy interpretation, and TPD definitions. The Australian Financial Complaints Authority (AFCA) handles complaints. TPD lawyers represent claimants through the claims and appeals process.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dust Diseases and Asbestos</h3>
      <p>
        Tasmanian workers exposed to asbestos, silica, or other harmful dusts can develop serious diseases decades later. Asbestos-related diseases including mesothelioma, asbestosis, and asbestos-related lung cancer have special compensation provisions. WorkCover Tasmania administers workers compensation for dust diseases. Common law claims against former employers and asbestos product manufacturers provide additional compensation. Specialist asbestos lawyers trace exposure history.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Personal Injury Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>WorkSafe Tasmania:</strong> 1300 366 322</li>
          <li><strong>Health Complaints Commissioner:</strong> 1800 001 170</li>
          <li><strong>Legal Aid Tasmania:</strong> 1300 366 611</li>
          <li><strong>Workers Rehabilitation and Compensation Tribunal:</strong> (03) 6166 4690</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dispute Resolution</h3>
      <p>
        Personal injury disputes in Tasmania are resolved through negotiation, mediation, or court proceedings. Workers compensation disputes proceed through the Workers Rehabilitation and Compensation Tribunal. Medical panels determine impairment assessments. The Supreme Court and Magistrates Court hear personal injury litigation. Personal injury lawyers guide clients through dispute resolution processes.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Personal Injury Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://worksafe.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">WorkSafe Tasmania</a></li>
          <li><a href="https://www.healthcomplaints.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Health Complaints Commissioner</a></li>
          <li><a href="https://www.legalaid.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid Tasmania</a></li>
          <li><a href="https://www.justice.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tasmanian Government - Justice</a></li>
        </ul>
      </div>
    </>
  ),

  'business-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Business Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Business law in Tasmania encompasses corporate law, commercial contracts, mergers and acquisitions, and regulatory compliance. Hobart is Tasmania's business centre with strong tourism, agriculture, aquaculture, forestry, and advanced manufacturing sectors. Tasmanian business lawyers advise on business formation, operations, transactions, and disputes to help businesses succeed while managing legal risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business Formation and Structure</h3>
      <p>
        Choosing the right business structure is crucial. Options include sole trader, partnership, trust, or company. Companies are regulated by ASIC under the Corporations Act 2001. Tasmanian lawyers advise on tax implications, asset protection, liability, succession planning, and compliance requirements. Company incorporation involves registration with ASIC, constitution drafting, shareholder agreements, and compliance frameworks. Family businesses including farms and tourism operations often use trust structures.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Contracts</h3>
      <p>
        Commercial contracts underpin Tasmanian businesses. Common contracts include supply agreements, distribution agreements, service agreements, licensing, tourism contracts, and aquaculture agreements. The Australian Consumer Law imposes mandatory guarantees and unfair contract term prohibitions. Lawyers draft, review, and negotiate contracts protecting your business interests and ensuring enforceability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Franchising</h4>
      <p>
        Franchising in Tasmania is regulated by the Franchising Code of Conduct requiring comprehensive disclosure before franchise sale. Franchisors must provide disclosure documents, financial information, and cooling-off periods. Tasmanian franchise disputes are handled by Federal Court and Supreme Court. Specialist franchise lawyers represent franchisors and franchisees in disputes and transactions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Mergers and Acquisitions</h3>
      <p>
        Business acquisitions in Tasmania involve due diligence, contract negotiation, regulatory approvals, and completion. Due diligence examines financial records, contracts, litigation, intellectual property, employment, and tax. Tasmanian business acquisitions may involve tourism operations, agricultural businesses, or aquaculture ventures. Share sales transfer ownership of the company entity. Asset sales transfer specific business assets. Corporate lawyers coordinate complex acquisitions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Partnership and Shareholder Agreements</h3>
      <p>
        Partnership agreements govern business partnerships under the Partnership Act 1891 (Tas). Shareholder agreements regulate relationships between company shareholders addressing management, share transfers, dispute resolution, and exit strategies. Buy-sell provisions, drag-along and tag-along rights, and valuation mechanisms prevent deadlocks. Tasmanian courts handle partnership and shareholder disputes including oppression claims under section 232 Corporations Act. Proper agreements prevent costly disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Commercial Disputes</h3>
      <p>
        Tasmanian businesses face disputes including contract breaches, partnership disputes, shareholder disputes, trade practices claims, and debt recovery. TasCAT handles smaller commercial matters. The Supreme Court hears larger disputes. Mediation and arbitration provide alternatives to litigation. Business lawyers resolve disputes efficiently through negotiation, alternative dispute resolution, or court proceedings when necessary.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Business Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Securities and Investments Commission (ASIC):</strong> 1300 300 630</li>
          <li><strong>Business Tasmania:</strong> 1800 440 026</li>
          <li><strong>Consumer, Building and Occupational Services:</strong> 1300 654 499</li>
          <li><strong>Australian Competition and Consumer Commission:</strong> 1300 302 502</li>
          <li><strong>Tasmanian Chamber of Commerce and Industry:</strong> (03) 6236 3600</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Regulatory Compliance</h3>
      <p>
        Tasmanian businesses must comply with extensive regulation including Australian Consumer Law, workplace relations laws, privacy laws, taxation laws, and industry-specific regulation. Directors have statutory duties including duty of care, duty to prevent insolvent trading, and duty to avoid conflicts. ASIC enforces corporate regulation. Consumer, Building and Occupational Services regulates various industries. Business lawyers ensure regulatory compliance and defend investigations.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Business Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.business.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business Tasmania</a></li>
          <li><a href="https://www.cbos.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Consumer, Building and Occupational Services</a></li>
          <li><a href="https://www.tcci.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tasmanian Chamber of Commerce and Industry</a></li>
          <li><a href="https://asic.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC</a></li>
        </ul>
      </div>
    </>
  ),

  'immigration-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Immigration Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Immigration law in Tasmania operates under federal legislation including the Migration Act 1958 and Migration Regulations. Tasmania attracts skilled migrants, international students, family migrants, and business migrants. Tasmania's state nomination program provides pathways to permanent residence. Registered migration agents and immigration lawyers guide applicants through complex visa processes and represent clients in tribunals and courts.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Categories</h3>
      <p>
        Australia's visa system includes temporary visas (visitor, student, temporary work) and permanent visas (skilled, family, business). Tasmania's state nomination program for skilled migrants targets occupations in demand including healthcare, education, trades, agriculture, and hospitality. Tasmania offers migration pathways with lower requirements than major cities as a regional destination. Visa applications require meeting health, character, and specific visa criteria.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Skilled Migration</h4>
      <p>
        Skilled migration to Tasmania includes independent skilled visas, state-nominated visas, and employer-sponsored visas. Tasmania's state nomination program provides pathways for occupations on the state's skilled occupation list. Points-tested visas require meeting points threshold through age, English, qualifications, and work experience. Regional classification provides additional migration benefits. Skills assessments verify qualifications meet Australian standards. Tasmania offers pathways for existing residents, job offers, and small business owners.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Family Migration</h3>
      <p>
        Partner visas allow Australian citizens, permanent residents, and eligible New Zealand citizens to sponsor spouses and de facto partners. Prospective marriage visas require intent to marry within nine months. Parent visas have long waiting periods with contributory options providing faster processing. Child visas and remaining relative visas complete family migration categories. Tasmania's growing population supports family reunification.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Business and Investment Migration</h3>
      <p>
        Business Innovation and Investment visas attract entrepreneurs and investors to Tasmania. The Business Innovation stream requires successful business experience and genuine intention to operate Tasmanian business. Investor streams require designated investments in Australian assets. Tasmania's state nomination program prioritizes genuine business establishment in growth sectors including agriculture, tourism, and advanced manufacturing. Business advisers assist migrant entrepreneurs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Student Visas</h3>
      <p>
        Tasmania's universities and colleges attract international students. Student visas require enrollment in registered courses, sufficient funds, health insurance, and genuine temporary entrant requirements. Post-study work visas allow graduates to gain Australian work experience. Regional classification provides additional visa benefits. Visa conditions restrict work hours during studies. Education agents and migration lawyers assist with visa applications and compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Citizenship</h3>
      <p>
        Australian citizenship requires permanent residence, residency period (usually four years including 12 months as permanent resident), good character, and knowledge of Australia. Citizenship confers voting rights, passport eligibility, and government employment access. Children born in Australia to permanent residents or citizens are usually Australian citizens. Citizenship by descent applies to children born overseas to Australian citizen parents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Visa Refusals and Cancellations</h3>
      <p>
        Visa refusals and cancellations can be reviewed by the Administrative Review Tribunal (ART, formerly AAT). Character cancellations under section 501 Migration Act affect visa holders with criminal records. Direction 99 guides decision-makers on character cancellations considering family ties and community protection. Federal Circuit and Family Court and Federal Court hear judicial review applications. Immigration lawyers represent clients in tribunal and court proceedings.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Immigration Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Department of Home Affairs:</strong> 131 881</li>
          <li><strong>Administrative Review Tribunal:</strong> 1800 228 333</li>
          <li><strong>Refugee Council of Australia:</strong> (02) 9211 9333</li>
          <li><strong>Multicultural Council of Tasmania:</strong> (03) 6221 0999</li>
          <li><strong>Migration Agents Registration Authority:</strong> (07) 3360 3888</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Deportation and Removal</h3>
      <p>
        Unlawful non-citizens face detention and removal from Australia. Visa cancellations for character or compliance reasons result in removal. Ministerial intervention under sections 48B, 351, or 417 provides last resort options. Bridging visas allow lawful stay while matters are resolved. Detention reviews are available through the Administrative Review Tribunal. Immigration lawyers urgently respond to detention and deportation matters.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Immigration Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.homeaffairs.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Home Affairs</a></li>
          <li><a href="https://www.aat.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Administrative Review Tribunal</a></li>
          <li><a href="https://www.migration.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Migration Tasmania</a></li>
          <li><a href="https://www.studytas.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Study Tasmania</a></li>
        </ul>
      </div>
    </>
  ),

  'litigation': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Litigation in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Litigation in Tasmania encompasses civil and commercial disputes resolved through courts and tribunals. Tasmania's court system includes the Magistrates Court, Supreme Court, and specialized tribunals. Effective litigation requires strategic advice, thorough preparation, and skilled advocacy. Tasmanian litigation lawyers represent clients in all forums, from small claims to complex commercial disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tasmanian Court System</h3>
      <p>
        Tasmania's Magistrates Court handles civil claims up to $50,000 and criminal summary matters. The Supreme Court has unlimited civil jurisdiction and hears indictable criminal offences. The Tasmanian Civil and Administrative Tribunal (TasCAT) provides accessible dispute resolution for administrative, tenancy, anti-discrimination, and other matters. The Federal Circuit and Family Court and Federal Court operate in Hobart for federal matters.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Civil Litigation</h3>
      <p>
        Civil litigation includes contract disputes, negligence claims, property disputes, and debt recovery. Tasmanian civil procedure follows court rules emphasizing case management, proportionality, and alternative dispute resolution. Pre-action protocols encourage early resolution. Discovery, expert evidence, and interlocutory applications require compliance with rules and practice directions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Commercial Litigation</h4>
      <p>
        Commercial litigation involves business disputes including contract breaches, shareholder disputes, partnership disputes, and trade practices. The Supreme Court handles commercial matters with case management procedures. Freezing orders, search orders, and security for costs protect parties' positions. Litigation lawyers strategically manage disputes to achieve commercial outcomes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Alternative Dispute Resolution</h3>
      <p>
        Mediation and arbitration offer alternatives to court litigation. Tasmanian courts encourage mediation in many matters. Private mediators and arbitrators resolve disputes confidentially and efficiently. Arbitration awards are enforceable like court judgments. Expert determination resolves technical disputes. ADR reduces costs and provides flexible outcomes. Lawyers advise on ADR suitability and represent clients in ADR processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Debt Recovery</h3>
      <p>
        Debt recovery through Tasmanian courts involves issuing proceedings, default judgments, or defended hearings. Judgment enforcement includes garnishee orders, instalment orders, warrants of execution, and examination summonses. Bankruptcy and winding up proceedings pressure debtors to pay. Tasmanian debt collection laws protect debtors from harassment. Creditors' lawyers strategically recover debts while managing costs and risks.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Building and Construction Disputes</h3>
      <p>
        Building disputes in Tasmania involve defective work, cost overruns, delays, and payment disputes. The Building Act 2016 regulates building work. Security of payment legislation under the Building and Construction Industry (Security of Payment) Act 2009 provides rapid adjudication of payment claims. Consumer, Building and Occupational Services investigates builder conduct. TasCAT and courts resolve building disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Defamation</h3>
      <p>
        Defamation in Tasmania involves publication of material harming reputation. The Defamation Act 2005 provides uniform national defamation law. Defences include truth, honest opinion, and qualified privilege. Offers to make amends can resolve matters early. Concerns notices and limitation periods require prompt action. Social media defamation is increasingly common. Supreme Court handles defamation proceedings. Defamation lawyers advise publishers and plaintiffs on rights and risks.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Litigation Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Supreme Court of Tasmania:</strong> (03) 6165 7333</li>
          <li><strong>Magistrates Court of Tasmania:</strong> 1300 366 322</li>
          <li><strong>Tasmanian Civil and Administrative Tribunal:</strong> (03) 6165 6968</li>
          <li><strong>Law Society of Tasmania:</strong> (03) 6234 4133</li>
          <li><strong>Legal Aid Tasmania:</strong> 1300 366 611</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Costs and Funding</h3>
      <p>
        Tasmanian litigation costs follow the principle that unsuccessful parties pay winners' costs. Security for costs may be ordered against plaintiffs. Costs disclosure obligations require lawyers to inform clients of likely costs. No win, no fee arrangements are available for some matters. Litigation funding provides financial support for claims in exchange for success fees. Tasmanian courts scrutinize disproportionate costs. Lawyers provide realistic cost estimates and strategic advice on litigation economics.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Litigation Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.supremecourt.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Supreme Court of Tasmania</a></li>
          <li><a href="https://www.magistratescourt.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Magistrates Court of Tasmania</a></li>
          <li><a href="https://www.justice.tas.gov.au/tascattribunal" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">TasCAT</a></li>
          <li><a href="https://www.legalaid.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Legal Aid Tasmania</a></li>
        </ul>
      </div>
    </>
  ),

  'bankruptcy-insolvency': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Bankruptcy and Insolvency in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Bankruptcy and insolvency law in Tasmania helps individuals and companies facing financial difficulties. The Bankruptcy Act 1966 governs personal insolvency, while the Corporations Act 2001 governs corporate insolvency. Tasmania has experienced insolvency practitioners and lawyers who advise on bankruptcy alternatives, restructuring, and formal insolvency processes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Personal Bankruptcy</h3>
      <p>
        Bankruptcy is a formal process where an individual is declared unable to pay debts. Bankruptcy can be voluntary (debtor's petition) or involuntary (creditor's petition). A trustee takes control of assets, realizes them, and distributes to creditors. Bankruptcy typically lasts three years. During bankruptcy, travel restrictions apply, credit reporting continues for five years, and certain assets are protected including household items, tools of trade, and some superannuation. Bankruptcy discharges most debts excluding child support, HECS, and fraud debts.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternatives to Bankruptcy</h4>
      <p>
        Debt agreements under Part IX Bankruptcy Act allow debtors to propose reduced payment arrangements to creditors avoiding bankruptcy. Personal insolvency agreements (Part X) provide flexible arrangements for higher-value estates. Informal arrangements negotiate payment plans with creditors. These alternatives avoid bankruptcy's consequences while addressing debt. Tasmanian insolvency practitioners assess options and implement solutions. Early advice maximizes options and prevents forced bankruptcy.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Corporate Insolvency</h3>
      <p>
        Companies facing insolvency have several options. Voluntary administration under Part 5.3A Corporations Act provides breathing space while administrators investigate rescue prospects. Creditors vote on proposals including deeds of company arrangement. Liquidation winds up companies and distributes assets to creditors. Receivers can be appointed by secured creditors. Directors facing insolvent trading allegations face personal liability. Early advice prevents wrongful trading and maximizes restructuring options.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Liquidation</h3>
      <p>
        Liquidation ends company existence through voluntary liquidation (members' or creditors') or court-ordered winding up. Liquidators realize assets, investigate company affairs, and distribute to creditors according to priority. Employees rank ahead of unsecured creditors for wages and entitlements. Liquidators pursue voidable transactions including unfair preferences and uncommercial transactions. ASIC regulates liquidators. Creditors receive dividends if assets remain after secured and priority creditors.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Voluntary Administration</h3>
      <p>
        Voluntary administration provides companies with temporary protection from creditors while exploring rescue options. Administrators investigate company affairs and report to creditors on prospects of saving business. Creditors vote on proposals including deeds of company arrangement, liquidation, or returning company to directors. Tasmanian administrators work with directors, creditors, and employees to achieve optimal outcomes. Administration can result in successful restructuring saving businesses and jobs.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Creditors' Rights</h3>
      <p>
        Creditors can initiate bankruptcy or winding up proceedings to recover debts. Statutory demands under section 459E Corporations Act require companies to pay debts or face presumed insolvency. Creditors lodge proofs of debt in administrations and liquidations. Committees of inspection represent creditor interests. Creditors can challenge administrators' and liquidators' decisions. Security interests under the Personal Property Securities Act provide priority. Insolvency lawyers represent creditors maximizing recoveries.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Bankruptcy & Insolvency Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Financial Security Authority:</strong> 1300 364 785</li>
          <li><strong>ASIC Insolvency Practitioners:</strong> 1300 300 630</li>
          <li><strong>National Debt Helpline:</strong> 1800 007 007</li>
          <li><strong>Financial Counselling Tasmania:</strong> 1800 007 007</li>
          <li><strong>Business Tasmania:</strong> 1800 440 026</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Directors' Duties and Insolvent Trading</h3>
      <p>
        Directors must prevent insolvent trading - incurring debts when company cannot pay them. Section 588G Corporations Act imposes personal liability on directors for insolvent trading. Safe harbour protections apply when directors develop and implement restructuring plans. The business judgment rule protects informed, good faith decisions. ASIC prosecutes serious director breaches. Tasmanian insolvency lawyers advise directors on duties, safe harbour, and defending claims.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Bankruptcy & Insolvency Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.afsa.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Financial Security Authority</a></li>
          <li><a href="https://asic.gov.au/regulatory-resources/insolvency/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ASIC Insolvency Information</a></li>
          <li><a href="https://www.arita.com.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">ARITA - Australian Restructuring Insolvency & Turnaround Association</a></li>
          <li><a href="https://www.business.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business Tasmania</a></li>
        </ul>
      </div>
    </>
  ),

  'intellectual-property': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Intellectual property law protects creations of the mind including inventions, brands, designs, and creative works. Tasmania's innovation economy, particularly in aquaculture technology, clean energy, advanced manufacturing, agriculture, and creative industries, makes IP protection important. Tasmanian IP lawyers advise on registration, protection, commercialization, and enforcement of intellectual property rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trademarks</h3>
      <p>
        Trademarks protect brand names, logos, and other identifiers under the Trade Marks Act 1995. Registration with IP Australia provides exclusive rights to use marks for registered goods and services. Tasmanian businesses should conduct searches before adoption, register in relevant classes, and monitor for infringement. Trademark protection prevents consumer confusion and protects brand investment. Opposition and cancellation proceedings defend trademark rights. Lawyers advise on selection, registration, and enforcement.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Copyright</h3>
      <p>
        Copyright automatically protects original works including literary works, artistic works, music, films, sound recordings, and broadcasts under the Copyright Act 1968. Protection lasts life of author plus 70 years. Copyright protects expression, not ideas. Fair dealing exceptions allow limited use for research, criticism, and news reporting. Digital copyright issues are increasingly important. Copyright assignment and licensing agreements commercialize works. Infringement remedies include damages, accounts of profits, and injunctions.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Patents</h3>
      <p>
        Patents protect inventions that are novel, inventive, and useful under the Patents Act 1990. Standard patents last 20 years; innovation patents (abolished 2021 for new applications) lasted 8 years. The patent process involves search, application, examination, and grant. Provisional applications establish priority for 12 months. Tasmanian innovation in aquaculture technology, clean energy, agricultural innovation, and advanced manufacturing generates patent activity. Patent lawyers conduct searches, draft specifications, prosecute applications, and enforce patents.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Designs</h3>
      <p>
        Registered designs protect visual appearance of products including shape, configuration, pattern, and ornamentation under the Designs Act 2003. Protection lasts up to 10 years. Designs must be new and distinctive. Registration is relatively quick and affordable. Product designers and manufacturers should register designs before public disclosure. Design infringement involves making, importing, or selling products embodying registered designs. Tasmanian product design industries benefit from design protection.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Trade Secrets and Confidential Information</h3>
      <p>
        Trade secrets protect confidential business information including formulas, processes, customer lists, and know-how. Unlike registered IP rights, trade secrets rely on maintaining secrecy. Breach of confidence claims prevent unauthorized disclosure or use. Employment contracts and non-disclosure agreements protect confidential information. Tasmanian businesses protect trade secrets through contracts and security measures. Courts grant injunctions preventing disclosure and damages for breaches.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Commercialization</h3>
      <p>
        IP commercialization includes licensing, assignment, and joint ventures. Licensing agreements grant rights to use IP while retaining ownership. Exclusive licenses provide sole licensee rights; non-exclusive licenses permit multiple licensees. Royalty structures compensate IP owners. Due diligence examines IP ownership and validity. R&D tax incentives support Tasmanian innovation. IP lawyers negotiate and draft commercialization agreements maximizing value while protecting rights.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian IP Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>IP Australia:</strong> 1300 65 10 10</li>
          <li><strong>Copyright Agency:</strong> 1800 066 844</li>
          <li><strong>Australian Copyright Council:</strong> (02) 8815 9777</li>
          <li><strong>Law Society of Tasmania (IP Referrals):</strong> (03) 6234 4133</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">IP Enforcement</h3>
      <p>
        IP infringement is enforced through Federal Court proceedings. Remedies include injunctions, damages, accounts of profits, and delivery up of infringing goods. Australian Border Force can seize counterfeit imports. Anton Piller orders (search orders) preserve evidence. Cease and desist letters often resolve matters without litigation. Tasmanian IP owners should actively monitor and enforce rights. Lawyers advise on infringement, conduct negotiations, and litigate when necessary.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian IP Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ipaustralia.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">IP Australia</a></li>
          <li><a href="https://www.copyright.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Copyright Council</a></li>
          <li><a href="https://ipta.org.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Intellectual Property Society of Australia and New Zealand</a></li>
          <li><a href="https://www.business.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Business Tasmania</a></li>
        </ul>
      </div>
    </>
  ),

  'tax-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Tax Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Tax law in Tasmania encompasses federal taxation administered by the Australian Taxation Office and state taxes administered by the State Revenue Office Tasmania. Tasmanian tax lawyers advise individuals and businesses on tax planning, compliance, disputes, and restructuring to minimize tax liabilities and resolve ATO disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Income Tax</h3>
      <p>
        Income tax applies to individuals, companies, trusts, and superannuation funds under federal tax law. Tasmanian taxpayers face the same income tax rates as other Australians. Tax planning includes structuring income, maximizing deductions, timing transactions, and utilizing concessions. Small business CGT concessions provide significant relief for business asset sales. Negative gearing remains important for Tasmanian property investors. Tax lawyers advise on complex transactions, restructures, and ATO audits.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Goods and Services Tax (GST)</h4>
      <p>
        GST at 10% applies to most supplies of goods and services. Businesses with turnover over $75,000 ($150,000 for non-profits) must register. Input tax credits allow GST-registered businesses to claim back GST on purchases. GST-free supplies include basic food, health, and education. Complex GST issues arise in property transactions, financial supplies, and margin schemes. Tax advisers ensure GST compliance and optimal structuring.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">State Taxes - Stamp Duty and Land Tax</h3>
      <p>
        Tasmania imposes stamp duty (transfer duty) on property transfers, business asset sales, motor vehicle transfers, and insurance. Rates vary by transaction type. Property stamp duty uses progressive rates with first home buyer concessions. Land tax applies annually to Tasmanian land holdings above thresholds with aggregation rules. Principal place of residence exemption excludes main homes. Primary production land has special provisions. State Revenue Office Tasmania administers these taxes with objection and appeal rights.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Payroll Tax</h3>
      <p>
        Tasmanian employers with Australian wages exceeding the threshold ($1.25 million for 2023-24) pay payroll tax at 4.0% (regional employers) or 6.1% (southern Tasmania). Grouping provisions aggregate related businesses' wages. Contractors may be deemed employees for payroll tax. SRO Tasmania audits ensure compliance. Voluntary disclosures provide penalty relief. Tax lawyers advise on payroll tax obligations, grouping, and disputes.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Disputes and Audits</h3>
      <p>
        ATO audits examine tax returns for compliance. Taxpayers have rights including representation and reasonable time to respond. Objections challenge ATO decisions with 60-day time limits (four years for small businesses). The Administrative Review Tribunal reviews objection decisions. Federal Court hears appeals on questions of law. Tasmanian taxpayers frequently dispute Part IVA general anti-avoidance provisions and trust distributions. Tax lawyers represent clients in audits, objections, and litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Tax Planning and Restructuring</h3>
      <p>
        Tax planning minimizes tax within legal boundaries. Common strategies include income splitting through family trusts, superannuation contributions, negative gearing, and asset protection structures. Business restructures utilize rollover provisions avoiding immediate tax. Tasmanian agricultural businesses have specific tax planning opportunities including farm management deposits. Voluntary disclosures to ATO reduce penalties for past non-compliance. Tax lawyers design compliant structures achieving tax efficiency.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Tax Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Australian Taxation Office:</strong> 13 28 61 (individuals), 13 28 66 (businesses)</li>
          <li><strong>State Revenue Office Tasmania:</strong> 1300 135 513</li>
          <li><strong>Tax Practitioners Board:</strong> (03) 9200 8800</li>
          <li><strong>Inspector-General of Taxation:</strong> 1800 199 010</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Superannuation</h3>
      <p>
        Superannuation enjoys concessional tax treatment to encourage retirement savings. Contributions are taxed at 15% (30% for high earners). Earnings taxed at 15% in accumulation phase, tax-free in pension phase. Superannuation death benefits have tax implications depending on beneficiary and payment type. Self-managed superannuation funds (SMSFs) require careful administration and compliance. Tasmanian SMSF trustees face auditor and ATO scrutiny. Tax advisers optimize superannuation strategies.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Tax Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.ato.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Australian Taxation Office</a></li>
          <li><a href="https://www.sro.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">State Revenue Office Tasmania</a></li>
          <li><a href="https://www.tpb.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tax Practitioners Board</a></li>
          <li><a href="https://www.igt.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Inspector-General of Taxation</a></li>
        </ul>
      </div>
    </>
  ),

  'environmental-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Environmental Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Environmental law in Tasmania regulates environmental protection, land use planning, and natural resource management. The Environmental Management and Pollution Control Act 1994 provides Tasmania's environmental framework with the EPA Tasmania as principal regulator. Tasmanian environmental lawyers advise on compliance, planning, contaminated land, forestry, and environmental litigation.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Environment Protection</h3>
      <p>
        Tasmania's Environmental Management and Pollution Control Act 1994 requires environmental duty holders to avoid environmental harm. The EPA Tasmania assesses activities requiring environmental assessments and permits. Level 1 and Level 2 activities require environmental permits. Pollution must be controlled and reported. EPA can issue environmental protection notices, improvement notices, and prosecutions. Environmental lawyers advise on permits, compliance, and respond to EPA action.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Planning and Development</h3>
      <p>
        Tasmania's Land Use Planning and Approvals Act 1993 regulates land use and development. Local planning schemes (including the Tasmanian Planning Scheme) control development through zones and codes. Development approval required for most development. Local councils assess most applications. The Tasmanian Planning Commission assesses major projects. The Resource Management and Planning Appeal Tribunal hears planning appeals. Environmental impact assessments may be required. Planning lawyers obtain approvals, defend objections, and appeal decisions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Contaminated Land</h4>
      <p>
        Contaminated land creates liability for current and former owners, occupiers, and polluters. The EPA Tasmania maintains the contaminated sites register. Site contamination assessments and remediation required for known contamination. Due diligence investigations identify contamination risks. Historical industrial sites and agricultural chemical use create contamination issues. Environmental lawyers advise purchasers, vendors, and responsible parties on contaminated land issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Aboriginal Heritage</h3>
      <p>
        Tasmania's Aboriginal heritage is protected under the Aboriginal Heritage Act 1975. Aboriginal heritage requires permits before works. Aboriginal Heritage Tasmania administers heritage protection. Surveys and assessments identify Aboriginal heritage. Traditional owner consultation is important. Unauthorized damage to Aboriginal heritage is an offence. Developers engage with Aboriginal groups and obtain heritage permits.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Forestry and Natural Resources</h3>
      <p>
        Forestry in Tasmania is regulated under the Forest Management Act 2013 and Forest Practices Act 1985. Forest practices plans required for forestry operations. Sustainable Timber Tasmania manages state forests. Private forests require forest practices plans. Environmental considerations include water quality, biodiversity, and soil conservation. Mining requires mineral exploration licenses and mining leases under the Mineral Resources Development Act 1995. Environmental lawyers advise on forestry and mining approvals.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Climate Change and Renewable Energy</h3>
      <p>
        Tasmania has ambitious renewable energy targets with high renewable energy penetration from hydro. The Climate Change (State Action) Act 2008 establishes emissions reduction targets. Wind and solar development continues. Environmental approvals consider environmental impacts. National Greenhouse and Energy Reporting requires emissions reporting. Environmental lawyers advise on renewable energy projects and regulatory compliance.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Environmental Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Environment Protection Authority Tasmania:</strong> 1300 135 513</li>
          <li><strong>Department of Natural Resources and Environment Tasmania:</strong> 1300 368 550</li>
          <li><strong>Tasmanian Planning Commission:</strong> (03) 6165 6828</li>
          <li><strong>Aboriginal Heritage Tasmania:</strong> (03) 6165 3026</li>
          <li><strong>Mineral Resources Tasmania:</strong> (03) 6165 4800</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Water and Biodiversity</h3>
      <p>
        Tasmanian water resources are managed under the Water Management Act 1999. Water licenses required for taking water. Environmental water provisions protect environmental flows. Tasmania's biodiversity is globally significant with high endemism. The Nature Conservation Act 2002 protects threatened species and reserves. Native vegetation clearing requires assessment. Developers must consider biodiversity impacts and offset requirements. Tasmania's World Heritage Areas have special protection.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Environmental Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://epa.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Environment Protection Authority Tasmania</a></li>
          <li><a href="https://nre.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Department of Natural Resources and Environment Tasmania</a></li>
          <li><a href="https://www.planningreform.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tasmanian Planning Reform</a></li>
          <li><a href="https://www.heritage.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Aboriginal Heritage Tasmania</a></li>
        </ul>
      </div>
    </>
  ),

  'administrative-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrative Law in Tasmania</h2>

      <p className="lead text-xl text-slate-700 mb-6">
        Administrative law in Tasmania governs the exercise of government power and review of government decisions. The Tasmanian Civil and Administrative Tribunal (TasCAT), Ombudsman Tasmania, and courts review administrative action. Administrative lawyers challenge unlawful decisions, ensure procedural fairness, and hold government accountable to the rule of law.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">TasCAT Review</h3>
      <p>
        TasCAT reviews state government decisions across diverse areas including anti-discrimination, guardianship, and other administrative matters. TasCAT provides accessible, low-cost review with less formality than courts. The enabling Act for each decision specifies review rights and grounds. TasCAT conducts hearings de novo or on review basis depending on jurisdiction. Lawyers represent parties in TasCAT proceedings, ensuring procedural rights and presenting persuasive cases.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Judicial Review</h3>
      <p>
        Judicial review challenges government decisions on legal grounds including jurisdictional error, procedural unfairness, taking irrelevant considerations into account, failing to consider relevant matters, and unreasonableness. The Supreme Court's judicial review jurisdiction covers Tasmanian government decisions. Federal Court reviews Commonwealth decisions. Judicial review doesn't substitute decision-maker's discretion but ensures lawful exercise. Remedies include quashing decisions, mandamus compelling action, and declarations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Procedural Fairness</h4>
      <p>
        Procedural fairness (natural justice) requires fair hearing and unbiased decision-makers. The hearing rule requires notice, opportunity to be heard, and consideration of submissions. The bias rule requires actual or apprehended freedom from bias. Tasmanian decision-makers must comply unless legislation clearly excludes fairness. Lawyers challenge decisions lacking procedural fairness and advise government on compliance.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Ombudsman Tasmania</h3>
      <p>
        Ombudsman Tasmania investigates complaints about Tasmanian government agencies, local councils, and certain public bodies under the Ombudsman Act 1978. The Ombudsman can investigate administrative action, conduct own-motion investigations, and make recommendations. Ombudsman investigations are free and accessible. Findings aren't binding but carry significant weight. Public interest disclosures (whistleblowing) about government wrongdoing are protected. The Ombudsman's annual reports highlight systemic issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Freedom of Information</h3>
      <p>
        Tasmania's Right to Information Act 2009 provides rights to access government documents. Tasmanian government agencies and local councils are subject to RTI. RTI requests are made in writing. Agencies must respond within 20 working days. Exemptions protect cabinet documents, personal privacy, law enforcement, and commercial confidentiality. Ombudsman Tasmania reviews RTI decisions. The Supreme Court provides further review. RTI promotes government transparency and accountability.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Privacy and Data Protection</h3>
      <p>
        Tasmania's Personal Information Protection Act 2004 regulates Tasmanian public sector information handling. Personal Information Protection Principles govern collection, use, disclosure, and security of personal information. The Ombudsman enforces privacy principles and investigates complaints. Data breaches must be managed appropriately. Privacy lawyers advise government and individuals on privacy rights and obligations.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tasmanian Administrative Law Contacts:</h4>
        <ul className="space-y-2">
          <li><strong>Tasmanian Civil and Administrative Tribunal:</strong> (03) 6165 6968</li>
          <li><strong>Ombudsman Tasmania:</strong> 1800 001 170</li>
          <li><strong>Supreme Court of Tasmania:</strong> (03) 6165 7333</li>
          <li><strong>Equal Opportunity Tasmania:</strong> 1300 305 062</li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Government and Public Law</h3>
      <p>
        Tasmanian constitutional law governs Parliament, Executive, and Judiciary relationships. The Constitution Act 1934 establishes Tasmania's constitutional framework. Parliamentary sovereignty, separation of powers, and rule of law are fundamental principles. Statutory interpretation principles guide understanding legislation. Tasmanian public lawyers advise government on lawful exercise of power, legislative drafting, and constitutional issues.
      </p>

      <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Anti-Discrimination</h3>
      <p>
        Tasmania's Anti-Discrimination Act 1998 prohibits discrimination based on protected attributes including age, race, sex, sexual orientation, gender identity, disability, marital status, family responsibilities, pregnancy, and industrial activity. Equal Opportunity Tasmania investigates complaints and attempts conciliation. Unresolved matters proceed to TasCAT. Public authorities must eliminate discrimination and promote equal opportunity. Administrative lawyers argue discrimination matters in TasCAT proceedings.
      </p>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tasmanian Administrative Law Resources:</h4>
        <ul className="space-y-2">
          <li><a href="https://www.justice.tas.gov.au/tascattribunal" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Tasmanian Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.ombudsman.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Ombudsman Tasmania</a></li>
          <li><a href="https://equalopportunity.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Equal Opportunity Tasmania</a></li>
          <li><a href="https://www.supremecourt.tas.gov.au/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Supreme Court of Tasmania</a></li>
        </ul>
      </div>
    </>
  ),
}


const ACT_CONTENT: Record<string, React.ReactElement> = {
  'family-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Family Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Family law in the Australian Capital Territory operates under federal legislation, primarily the Family Law Act 1975 (Cth), which governs matters including divorce, parenting arrangements, and property settlements. ACT residents also benefit from the ACT's progressive local legislation, including the ACT's leading recognition of diverse family structures and same-sex relationships. The ACT has been at the forefront of family law reform in Australia, being the first jurisdiction to recognize civil unions and having unique local laws that complement federal family law provisions.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Understanding Family Law in the ACT</h3>
      <p className="text-slate-700 mb-4">
        The Australian Capital Territory's family law landscape reflects both federal jurisdiction and local innovations. While major family law matters are heard in the Federal Circuit and Family Court of Australia, the ACT also has specific local provisions through the ACT Magistrates Court for certain domestic violence and protection order matters.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Divorce and Separation in the ACT</h4>
      <p className="text-slate-700 mb-4">
        ACT residents seeking divorce must apply to the Federal Circuit and Family Court of Australia. The standard requirement of 12 months separation applies, though couples may be separated under the same roof. The ACT has comprehensive family dispute resolution services, with a strong emphasis on mediation and collaborative approaches before court proceedings. The territory's central location means access to federal court services and specialized family law practitioners is readily available.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Parenting Arrangements and Child Support</h4>
      <p className="text-slate-700 mb-4">
        Parenting matters in the ACT are determined according to the best interests of the child, considering factors such as the benefit of having meaningful relationships with both parents and protection from harm. The ACT has excellent family dispute resolution services, including the Family Advocacy and Support Services (FASS) program. Child support is administered federally through Services Australia, with ACT-specific cost of living factors considered in calculations. The territory's compact geography can facilitate shared parenting arrangements with relatively minimal travel requirements.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Property Division and Financial Settlements</h4>
      <p className="text-slate-700 mb-4">
        Property settlements in the ACT consider contributions and future needs of parties, with the territory's relatively high property values and public service employment patterns being relevant factors. The ACT's de facto relationship laws are progressive, with the Domestic Relationships Act 1994 (ACT) providing additional protections. Superannuation splitting is commonly addressed, particularly relevant given the high proportion of Commonwealth public servants in the ACT. Legal practitioners must consider both federal family law and ACT-specific legislation when advising on property matters.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Domestic Violence and Protection Orders</h4>
      <p className="text-slate-700 mb-4">
        The ACT has robust domestic violence legislation through the Family Violence Act 2016 (ACT). Protection orders can be obtained through the ACT Magistrates Court, with the ACT having one of Australia's most comprehensive family violence frameworks. The Domestic Violence Crisis Service ACT provides 24/7 support, and the justice system offers integrated responses including family safety hubs and coordinated service delivery.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Family Law Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Legal Aid ACT:</strong> (02) 6243 3411</li>
          <li><strong>Domestic Violence Crisis Service ACT:</strong> (02) 6280 0900</li>
          <li><strong>Family Advocacy and Support Services (FASS):</strong> (02) 6205 2222</li>
          <li><strong>ACT Magistrates Court:</strong> (02) 6207 1320</li>
          <li><strong>Federal Circuit and Family Court (Canberra Registry):</strong> (02) 6243 9777</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Government Links:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.legalaidact.org.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Legal Aid ACT</a></li>
          <li><a href="https://www.courts.act.gov.au/magistrates" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Magistrates Court</a></li>
          <li><a href="https://www.dvcs.org.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Domestic Violence Crisis Service ACT</a></li>
          <li><a href="https://www.communityservices.act.gov.au/family-safety" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Family Safety Hub</a></li>
        </ul>
      </div>
    </>
  ),

  'criminal-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Criminal Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Criminal law in the Australian Capital Territory is governed primarily by the Crimes Act 1900 (ACT) and the Criminal Code 2002 (ACT), which together form the territory's comprehensive criminal justice framework. The ACT has a unique criminal justice system that reflects its role as the nation's capital, with both ACT and federal offences being prosecuted in its courts. The territory has been progressive in criminal law reform, including being the first Australian jurisdiction to decriminalize small amounts of cannabis and implementing restorative justice programs.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Understanding Criminal Law in the ACT</h3>
      <p className="text-slate-700 mb-4">
        The ACT's criminal law system operates through the ACT Magistrates Court for summary matters and committals, and the ACT Supreme Court for serious indictable offences. The ACT Director of Public Prosecutions (DPP) prosecutes serious criminal matters, while ACT Policing (an Australian Federal Police operation) investigates offences. The territory's relatively small population means criminal law practitioners often encounter a wide variety of matters.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Common Criminal Offences in the ACT</h4>
      <p className="text-slate-700 mb-4">
        Common criminal offences in the ACT include assault, theft, drug offences, drink driving, and property damage. The ACT has specific offences relating to public order, with particular attention to offences in Commonwealth precincts. The Criminal Code 2002 (ACT) modernized the territory's criminal law, introducing clearer definitions of mental elements and defences. Traffic offences are prosecuted under the Road Transport (Alcohol and Drugs) Act 1977 (ACT) and related legislation, with the ACT having strict drink and drug driving laws.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Drug Offences and Cannabis Laws</h4>
      <p className="text-slate-700 mb-4">
        The ACT made history in 2020 by becoming the first Australian jurisdiction to legalize cannabis possession and cultivation for personal use, allowing adults to possess up to 50 grams and grow up to two plants per person (four per household). However, cultivation and use must occur on private property, and it remains illegal to sell cannabis or use it in public. Other drug offences, including supply and trafficking of prohibited substances, are prosecuted under the Criminal Code 2002 (ACT) and can result in significant penalties including lengthy prison sentences.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Assault and Violent Offences</h4>
      <p className="text-slate-700 mb-4">
        Assault offences in the ACT range from common assault to aggravated assault and causing grievous bodily harm. The Crimes Act 1900 (ACT) sets out these offences and their penalties. The ACT has specific provisions for family violence related assaults, with enhanced penalties and protection mechanisms. The territory's Sentence Administration Board considers victim impact and community safety when determining sentences for violent offences.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Court Procedures and Sentencing</h4>
      <p className="text-slate-700 mb-4">
        Criminal proceedings in the ACT follow established procedures with strong emphasis on procedural fairness. The ACT has innovative programs including the Galambany Court (an Aboriginal and Torres Strait Islander sentencing court), drug and alcohol courts, and restorative justice options. Sentencing options include imprisonment, intensive correction orders, good behavior orders, community service, and fines. The ACT has abolished suspended sentences but offers various non-custodial alternatives aimed at rehabilitation and reducing recidivism.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Your Rights When Charged</h4>
      <p className="text-slate-700 mb-4">
        If charged with a criminal offence in the ACT, you have the right to remain silent, the right to contact a lawyer, and the right to have a support person present during police interviews. Legal Aid ACT provides duty lawyer services at the ACT Magistrates Court and can assist with representation for those who qualify financially. The ACT Human Rights Act 2004 provides additional protections for accused persons, including the presumption of innocence and the right to a fair trial.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Criminal Law Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Legal Aid ACT:</strong> (02) 6243 3411</li>
          <li><strong>ACT Law Society Referral Service:</strong> (02) 6274 0300</li>
          <li><strong>ACT Magistrates Court:</strong> (02) 6207 1320</li>
          <li><strong>ACT Supreme Court:</strong> (02) 6205 0000</li>
          <li><strong>ACT Policing:</strong> 131 444 (non-emergency)</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Justice Links:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.legalaidact.org.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Legal Aid ACT</a></li>
          <li><a href="https://www.courts.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Courts and Tribunal</a></li>
          <li><a href="https://www.policenews.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Policing</a></li>
          <li><a href="https://www.victimsupport.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Victim Support ACT</a></li>
        </ul>
      </div>
    </>
  ),

  'property-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Property law in the Australian Capital Territory operates under a unique leasehold system where all land is held on lease from the Crown, reflecting the territory's status as Australia's planned capital. The ACT's property framework is governed by legislation including the Civil Law (Property) Act 2006 (ACT), the Planning and Development Act 2007 (ACT), and the Unit Titles Act 2001 (ACT). This distinctive system affects residential, commercial, and rural property transactions, with all land leases granted for 99 years (residential and commercial) or varying terms for rural leases.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Understanding ACT's Leasehold System</h3>
      <p className="text-slate-700 mb-4">
        Unlike other Australian jurisdictions where land is typically owned as freehold, the ACT operates on a leasehold system established when Canberra was created. Property buyers purchase the lease rather than owning land outright, though in practical terms, a 99-year lease functions similarly to freehold ownership. This system gives the ACT Government significant control over land use and development, with specific lease purposes attached to each property that dictate permissible uses.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Residential Property Transactions</h4>
      <p className="text-slate-700 mb-4">
        Residential property transactions in the ACT require contracts to comply with the Civil Law (Sale of Residential Property) Act 2003 (ACT), which mandates specific disclosure requirements and cooling-off periods. Buyers receive a 5-business-day cooling-off period (with a 0.25% penalty if exercised) unless purchasing at auction. The ACT has abolished stamp duty on residential property transfers, instead implementing an annual rates system based on Average Unimproved Value (AUV). Conveyancing in the ACT is typically handled by solicitors or licensed conveyancers, with electronic settlement through PEXA being standard practice.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Unit Titles and Apartment Living</h4>
      <p className="text-slate-700 mb-4">
        Unit titled properties (apartments, townhouses, and other strata schemes) are governed by the Unit Titles Act 2001 (ACT) and the Unit Titles Management Act 2011 (ACT). These laws regulate owners corporations, establish procedures for decision-making, and set out dispute resolution mechanisms. The ACT Civil and Administrative Tribunal (ACAT) has jurisdiction over unit title disputes, including disagreements about levies, by-laws, and executive committee decisions. The high density of unit titled properties in Canberra means these laws are frequently engaged, with particular issues arising around building defects and owners corporation governance.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Commercial and Rural Leases</h4>
      <p className="text-slate-700 mb-4">
        Commercial leases in the ACT are granted for specific purposes and must comply with the lease purpose clause. Variations to lease purposes require government approval and may incur fees. The Leases (Commercial and Retail) Act 2001 (ACT) provides protections for retail tenants, including disclosure requirements and dispute resolution processes. Rural leases operate differently, with varying lease terms and specific provisions for agricultural use. The ACT's limited rural land means rural lease issues often involve complex planning and environmental considerations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Planning and Development Controls</h4>
      <p className="text-slate-700 mb-4">
        The Planning and Development Act 2007 (ACT) and the Territory Plan govern what can be built and how land can be used in the ACT. Development applications are assessed by the planning authority, with ACAT providing merits review of planning decisions. The ACT's planning system reflects the territory's origins as a planned city, with detailed controls over building design, heritage, and environmental impacts. Third-party appeal rights allow affected parties to challenge development approvals, making planning law a significant consideration in property development.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">First Home Buyers and Concessions</h4>
      <p className="text-slate-700 mb-4">
        The ACT offers various concessions for first home buyers, including exemptions from certain fees and charges. The Home Buyer Concession Scheme provides duty concessions (noting the ACT's transition away from stamp duty), while the Land Rent Scheme allows eligible buyers to rent the land component and purchase only the dwelling. These schemes reflect the ACT's high property prices relative to income levels and aim to improve housing affordability for first-time buyers entering the market.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Property Law Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>ACT Revenue Office:</strong> (02) 6207 0028</li>
          <li><strong>Access Canberra (Planning):</strong> 13 22 81</li>
          <li><strong>ACT Civil and Administrative Tribunal (ACAT):</strong> (02) 6207 1740</li>
          <li><strong>ACT Law Society Referral Service:</strong> (02) 6274 0300</li>
          <li><strong>Land Titles Office:</strong> 13 22 81</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Property Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.revenue.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Revenue Office</a></li>
          <li><a href="https://www.planning.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Planning and Land Authority</a></li>
          <li><a href="https://www.acat.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.accesscanberra.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Access Canberra</a></li>
        </ul>
      </div>
    </>
  ),

  'wills-estates': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Wills and Estates Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Wills and estates law in the Australian Capital Territory is governed by the Wills Act 2010 (ACT), the Administration and Probate Act 1929 (ACT), and the Family Provision Act 1969 (ACT). The ACT's legislation reflects modern approaches to estate planning, including recognition of diverse family structures and updated rules for will-making and estate administration. The territory's relatively affluent population and high concentration of public servants create unique estate planning considerations, particularly regarding superannuation and government pensions.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Making a Valid Will in the ACT</h3>
      <p className="text-slate-700 mb-4">
        To make a valid will in the ACT, the testator must be at least 18 years old (or married/in a domestic partnership), have testamentary capacity, and act without duress or undue influence. The will must be in writing, signed by the testator, and witnessed by two independent witnesses who are not beneficiaries. The Wills Act 2010 (ACT) provides for the ACT Supreme Court to validate informal wills in certain circumstances if satisfied the document represents the testamentary intentions of the deceased, offering flexibility while maintaining appropriate safeguards.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Estate Planning Considerations</h4>
      <p className="text-slate-700 mb-4">
        Effective estate planning in the ACT involves more than just making a will. It includes consideration of superannuation death benefits (which don't automatically form part of your estate), life insurance, enduring powers of attorney, and advance care directives under the Powers of Attorney Act 2006 (ACT). The ACT's high property values mean careful planning is essential to minimize tax and ensure assets pass to intended beneficiaries. Binding death benefit nominations for superannuation are particularly important for ACT residents, many of whom have substantial superannuation balances from Commonwealth employment.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Probate and Estate Administration</h4>
      <p className="text-slate-700 mb-4">
        Probate is the process of proving a will's validity and obtaining authority to administer an estate. In the ACT, executors apply for probate (or letters of administration if there's no will) through the ACT Supreme Court. The process involves gathering estate assets, paying debts and funeral expenses, lodging tax returns, and distributing the estate according to the will or intestacy rules. The Administration and Probate Act 1929 (ACT) sets out the executor's duties and powers, with executors owing fiduciary duties to beneficiaries and potentially being personally liable for misadministration.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Contesting a Will and Family Provision</h4>
      <p className="text-slate-700 mb-4">
        Eligible persons who believe they have not been adequately provided for can make a family provision claim under the Family Provision Act 1969 (ACT). Eligible applicants include spouses, domestic partners, children (including adult children), and in limited circumstances, other dependents. Claims must generally be filed within six months of probate being granted. The court considers factors including the applicant's financial circumstances, their relationship with the deceased, the size of the estate, and competing claims. The ACT Supreme Court has broad discretion to order provision from the estate where adequate provision has not been made.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Enduring Powers of Attorney and Health Directions</h4>
      <p className="text-slate-700 mb-4">
        The Powers of Attorney Act 2006 (ACT) allows ACT residents to appoint attorneys to make financial and personal decisions if they lose capacity. Enduring powers of attorney must be made in the prescribed form and witnessed by an eligible witness (solicitor or prescribed witness). The ACT also recognizes enduring powers of attorney made in other jurisdictions. Advance care directives, governed by the Medical Treatment (Health Directions) Act 2006 (ACT), allow individuals to specify their medical treatment preferences and appoint health attorneys, providing important guidance for end-of-life care decisions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Intestacy Rules</h4>
      <p className="text-slate-700 mb-4">
        When someone dies without a valid will, their estate is distributed according to the Administration and Probate Act 1929 (ACT) intestacy provisions. The spouse or domestic partner receives the entire estate if there are no children, or a statutory legacy (currently $200,000 indexed) plus half the remainder if there are children, with the children sharing the balance. If there's no spouse or children, the estate passes to parents, then siblings, then more distant relatives. Without any relatives, the estate passes to the ACT Government. These rules may not reflect the deceased's wishes, highlighting the importance of making a will.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Wills and Estates Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>ACT Supreme Court (Probate):</strong> (02) 6205 0000</li>
          <li><strong>Public Trustee and Guardian ACT:</strong> (02) 6207 9800</li>
          <li><strong>ACT Law Society Referral Service:</strong> (02) 6274 0300</li>
          <li><strong>Legal Aid ACT:</strong> (02) 6243 3411</li>
          <li><strong>Office of the Public Advocate:</strong> (02) 6207 0707</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Estate Planning Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.ptg.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Public Trustee and Guardian ACT</a></li>
          <li><a href="https://www.courts.act.gov.au/supreme" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Supreme Court</a></li>
          <li><a href="https://www.publicadvocate.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Office of the Public Advocate</a></li>
          <li><a href="https://www.legalaidact.org.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Legal Aid ACT</a></li>
        </ul>
      </div>
    </>
  ),

  'employment-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Employment Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Employment law in the Australian Capital Territory is governed primarily by federal legislation including the Fair Work Act 2009 (Cth), which applies to most private sector employees, while territory-specific legislation applies to ACT public servants. The ACT has a unique employment landscape with the highest concentration of public sector workers in Australia, comprising approximately 40% of the workforce. This creates distinctive employment law considerations involving the Public Sector Management Act 1994 (ACT), Commonwealth public service legislation, and the interaction between federal and territory employment frameworks.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Understanding Employment Rights in the ACT</h3>
      <p className="text-slate-700 mb-4">
        ACT employees are covered by either the federal Fair Work system (most private sector workers) or the ACT public service framework. The Fair Work Act establishes the National Employment Standards (NES), which provide minimum entitlements including maximum weekly hours, annual leave, personal/carer's leave, and notice of termination. ACT public servants operate under different conditions set by enterprise agreements and the Public Sector Management Standards, often providing more generous entitlements than the private sector minimum standards.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">ACT Public Service Employment</h4>
      <p className="text-slate-700 mb-4">
        ACT public servants are employed under the Public Sector Management Act 1994 (ACT) and are not covered by the Fair Work Act. The ACT Public Service has its own merit-based recruitment processes, performance management systems, and disciplinary procedures. Employment conditions are set through enterprise agreements negotiated with unions, typically providing generous leave entitlements, flexible working arrangements, and comprehensive professional development opportunities. Disputes may be dealt with through internal review mechanisms, the ACT Civil and Administrative Tribunal, or in limited cases, the ACT Supreme Court.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Commonwealth Public Service Employment</h4>
      <p className="text-slate-700 mb-4">
        Many ACT residents work for Commonwealth government agencies under the Public Service Act 1999 (Cth). These employees operate under a separate framework from both Fair Work and ACT public service systems, with employment regulated by the Australian Public Service Commission. Commonwealth employees have specific rights and obligations including the APS Code of Conduct, security clearance requirements, and restrictions on outside employment. Disputes may be handled through agency procedures, the Merit Protection Commissioner, or the Fair Work Commission for certain matters.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Unfair Dismissal and Workplace Disputes</h4>
      <p className="text-slate-700 mb-4">
        Private sector employees in the ACT can access unfair dismissal protections through the Fair Work Commission if they meet eligibility requirements (minimum employment period, not earning above the high-income threshold). Claims must be lodged within 21 days of dismissal. ACT public servants have separate unfair dismissal protections under the Public Sector Management Standards, with reviews conducted through internal processes and ACAT. The high concentration of professional workers in the ACT means workplace disputes often involve complex issues around performance management, misconduct allegations, and discrimination claims.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Workplace Health and Safety</h4>
      <p className="text-slate-700 mb-4">
        Workplace health and safety in the ACT is regulated by the Work Health and Safety Act 2011 (ACT), which implements the model WHS laws. WorkSafe ACT administers the legislation, conducts workplace inspections, and investigates serious incidents. Employers have duties to ensure worker health and safety, including providing safe systems of work, appropriate training, and adequate supervision. The ACT's predominantly office-based workforce means psychological health and safety is a significant focus, with increasing attention to workplace bullying, harassment, and mental health issues.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Workers Compensation</h4>
      <p className="text-slate-700 mb-4">
        Workers compensation in the ACT is governed by the Workers Compensation Act 1951 (ACT), administered by the ACT Insurance Authority. The scheme provides compensation for workplace injuries, including medical expenses, weekly payments, and lump sum payments for permanent impairment. Commonwealth employees are covered by the Safety, Rehabilitation and Compensation Act 1988 (Cth) (Comcare scheme), which operates separately from the ACT scheme. Disputes regarding compensation claims can be resolved through conciliation or determined by the ACT Magistrates Court.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Employment Law Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Fair Work Ombudsman:</strong> 13 13 94</li>
          <li><strong>WorkSafe ACT:</strong> (02) 6207 3000</li>
          <li><strong>ACT Human Rights Commission:</strong> (02) 6205 2222</li>
          <li><strong>Fair Work Commission (Canberra):</strong> 1300 799 675</li>
          <li><strong>ACT Civil and Administrative Tribunal:</strong> (02) 6207 1740</li>
          <li><strong>Legal Aid ACT (Employment Law):</strong> (02) 6243 3411</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Employment Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.fairwork.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Fair Work Ombudsman</a></li>
          <li><a href="https://www.worksafe.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WorkSafe ACT</a></li>
          <li><a href="https://hrc.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Human Rights Commission</a></li>
          <li><a href="https://www.cmtedd.act.gov.au/employment-framework" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Public Service Employment</a></li>
        </ul>
      </div>
    </>
  ),

  'personal-injury': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Personal Injury Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Personal injury law in the Australian Capital Territory provides compensation pathways for individuals injured due to another's negligence or in workplace accidents. The ACT's personal injury framework includes the Civil Law (Wrongs) Act 2002 (ACT) for common law damages, the Workers Compensation Act 1951 (ACT) for workplace injuries, and the Motor Accident Injuries Act 2019 (ACT) for motor vehicle accidents. The territory implemented a hybrid motor accident scheme in 2020, combining no-fault benefits with common law rights, reflecting a modern approach to personal injury compensation.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Types of Personal Injury Claims in the ACT</h3>
      <p className="text-slate-700 mb-4">
        Personal injury claims in the ACT arise from various circumstances including motor vehicle accidents, workplace injuries, public liability incidents (slip and falls, dog attacks), medical negligence, and criminal injuries. Each category has specific legislation and procedures. The ACT's compact urban environment means public liability claims frequently involve incidents at shopping centers, government buildings, and public spaces, while the high proportion of public sector workers creates unique workplace injury considerations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Motor Accident Injury Claims</h4>
      <p className="text-slate-700 mb-4">
        The Motor Accident Injuries Act 2019 (ACT) established a new scheme for motor accident injuries occurring from February 1, 2020. The scheme provides defined benefits (medical treatment, income replacement, care and support) regardless of fault, with access to common law damages for significant injuries meeting statutory thresholds (whole person impairment of 10% or more, or specific catastrophic injuries). Claims are lodged with the Motor Accident Injuries Commission, with insurers required to make decisions within specified timeframes. Disputes may be resolved through internal review, ACAT, or the ACT Supreme Court for common law claims.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Workers Compensation Claims</h4>
      <p className="text-slate-700 mb-4">
        Workplace injuries in the ACT are compensated under the Workers Compensation Act 1951 (ACT), which provides weekly payments, medical expenses, and lump sum compensation for permanent impairment. Injured workers must notify their employer promptly and lodge a claim with the insurer. The ACT's workers compensation scheme is administered by the ACT Insurance Authority, with most employers holding insurance through approved insurers. Commonwealth employees are covered by the separate Comcare scheme under Safety, Rehabilitation and Compensation Act 1988 (Cth), which offers different benefits and procedures.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Public Liability Claims</h4>
      <p className="text-slate-700 mb-4">
        Public liability claims arise when injuries occur due to negligence of property owners, occupiers, or service providers. Common examples include slip and fall accidents, defective premises, and inadequate security. The Civil Law (Wrongs) Act 2002 (ACT) sets out the requirements for establishing negligence, with claimants needing to prove duty of care, breach, causation, and damages. The ACT has limitation periods requiring claims to be commenced within three years of injury discovery, though exceptions exist for minors and persons under disability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Medical Negligence Claims</h4>
      <p className="text-slate-700 mb-4">
        Medical negligence claims in the ACT require proving the healthcare provider breached their duty of care and caused injury. The Civil Law (Wrongs) Act 2002 (ACT) requires expert evidence that the treatment fell below reasonable standards expected of practitioners in that field. Claims against ACT public hospitals involve the ACT Government as defendant, while private hospital claims involve the hospital and/or treating practitioners. The complexity of medical evidence means these claims typically require early expert assessment and can take considerable time to resolve.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Victims of Crime Compensation</h4>
      <p className="text-slate-700 mb-4">
        Victims of violent crimes in the ACT can apply for financial assistance under the Victims of Crime (Financial Assistance) Act 2016 (ACT). The scheme provides compensation for injuries, counseling expenses, lost earnings, and other losses resulting from criminal acts. Applications are made to the Victims of Crime Commissioner, with decisions reviewable by ACAT. The scheme recognizes both physical and psychological injuries, with special provisions for child abuse victims. Time limits apply, generally requiring applications within two years, though extensions may be granted in appropriate circumstances.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Personal Injury Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Motor Accident Injuries Commission:</strong> (02) 6207 7275</li>
          <li><strong>ACT Insurance Authority:</strong> (02) 6205 0270</li>
          <li><strong>Victims of Crime Commissioner:</strong> (02) 6205 2222</li>
          <li><strong>Legal Aid ACT:</strong> (02) 6243 3411</li>
          <li><strong>ACT Law Society Referral Service:</strong> (02) 6274 0300</li>
          <li><strong>WorkSafe ACT:</strong> (02) 6207 3000</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Personal Injury Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.maic.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Motor Accident Injuries Commission</a></li>
          <li><a href="https://www.treasury.act.gov.au/insurance" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Insurance Authority</a></li>
          <li><a href="https://www.victimsupport.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Victim Support ACT</a></li>
          <li><a href="https://www.worksafe.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">WorkSafe ACT</a></li>
        </ul>
      </div>
    </>
  ),

  'business-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Business and Commercial Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Business and commercial law in the Australian Capital Territory operates under both federal legislation governing corporations and competition, and ACT-specific laws regulating trading, licensing, and commercial relationships. The ACT's business environment is shaped by its role as the national capital, with significant government procurement opportunities, a highly educated workforce, and strong technology and professional services sectors. Key legislation includes the Corporations Act 2001 (Cth), the Australian Consumer Law, and territory-specific business licensing and regulation administered by Access Canberra.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Starting and Structuring a Business in the ACT</h3>
      <p className="text-slate-700 mb-4">
        Businesses in the ACT can operate as sole traders, partnerships, companies, or trusts, each with different legal and tax implications. Company registration occurs federally through ASIC, while business names are registered through ASIC's Business Registration Service. ACT businesses may require various licenses depending on their activities, administered by Access Canberra, including liquor licenses, builders licenses, and trade licenses. The ACT's Business License and Approvals Register provides a central point for understanding licensing requirements.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Commercial Leasing and Property</h4>
      <p className="text-slate-700 mb-4">
        Commercial leasing in the ACT is governed by the Leases (Commercial and Retail) Act 2001 (ACT), which provides protections for retail tenants including mandatory disclosure, minimum lease terms, and dispute resolution procedures. The ACT's leasehold land system means commercial tenants lease from landlords who themselves hold Crown leases, creating a two-tier leasing arrangement. The Act requires landlords to provide disclosure statements before lease execution, specifying all costs and outlining key lease terms. Disputes can be resolved through mediation or ACAT.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Government Procurement and Contracts</h4>
      <p className="text-slate-700 mb-4">
        The ACT Government is a major procurer of goods and services, operating under the Government Procurement Act 2001 (ACT) and associated regulations. The territory has procurement thresholds requiring different processes for varying contract values, with emphasis on value for money, ethical behavior, and supporting local business where appropriate. The ACT Government maintains a procurement register and requires compliance with the ACT's social procurement framework, which considers employment, training, and sustainability outcomes. Commonwealth procurement opportunities are also significant, operating under the Commonwealth Procurement Rules.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Consumer Protection and Fair Trading</h4>
      <p className="text-slate-700 mb-4">
        Consumer protection in the ACT is primarily governed by the Australian Consumer Law (ACL), which forms part of the Competition and Consumer Act 2010 (Cth) and is applied through the Fair Trading (Australian Consumer Law) Act 1992 (ACT). Access Canberra administers consumer protection, investigating unfair trading practices, misleading conduct, and breaches of consumer guarantees. The ACT also has specific regulations for industries including motor vehicle traders, second-hand dealers, and real estate agents. Consumers can seek resolution through Access Canberra's dispute resolution service or ACAT for certain matters.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Business Disputes and Litigation</h4>
      <p className="text-slate-700 mb-4">
        Commercial disputes in the ACT may be resolved through negotiation, mediation, arbitration, or litigation. ACAT has jurisdiction for certain commercial and civil disputes up to specified amounts, providing a more accessible forum than the courts. The ACT Magistrates Court handles claims up to $250,000, while the ACT Supreme Court has unlimited jurisdiction for larger commercial matters. The ACT has adopted the National Legal Profession Uniform Law, ensuring consistent regulation of legal practitioners and standardized costs disclosure requirements for commercial legal services.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Insolvency and Business Restructuring</h4>
      <p className="text-slate-700 mb-4">
        Corporate insolvency is regulated federally under the Corporations Act 2001 (Cth), with recent reforms introducing temporary restructuring and simplified liquidation processes for small businesses. Directors facing financial difficulty should seek early advice, as continuing to trade while insolvent can result in personal liability. The ACT Supreme Court has jurisdiction for bankruptcy and insolvency matters, with registered liquidators and trustees appointed to administer insolvent estates. Safe harbor provisions protect directors who appoint restructuring advisors and develop turnaround plans, encouraging early intervention.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Business Law Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Access Canberra (Business Registration):</strong> 13 22 81</li>
          <li><strong>ASIC (Companies and Business Names):</strong> 1300 300 630</li>
          <li><strong>ACT Civil and Administrative Tribunal:</strong> (02) 6207 1740</li>
          <li><strong>ACT Law Society Referral Service:</strong> (02) 6274 0300</li>
          <li><strong>Canberra Business Chamber:</strong> (02) 6283 5200</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Business Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.accesscanberra.act.gov.au/business" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Access Canberra Business</a></li>
          <li><a href="https://www.asic.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ASIC</a></li>
          <li><a href="https://www.procurement.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Government Procurement</a></li>
          <li><a href="https://www.canberrabusiness.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Canberra Business Chamber</a></li>
        </ul>
      </div>
    </>
  ),

  'immigration-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Immigration Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Immigration law in the Australian Capital Territory operates under federal legislation, primarily the Migration Act 1958 (Cth) and Migration Regulations 1994 (Cth), administered by the Department of Home Affairs. As Australia's capital city, Canberra has unique immigration considerations including specialized visa categories for government employees, diplomatic missions, and international organizations. The ACT also operates its own skilled migration program, the ACT Nomination Program, which provides a pathway to permanent residence for skilled workers who meet territory-specific criteria.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Understanding Australian Immigration Law</h3>
      <p className="text-slate-700 mb-4">
        Australian immigration law is complex and constantly evolving, with numerous visa categories serving different purposes including skilled migration, family reunion, business investment, student visas, and humanitarian protection. The Migration Act 1958 (Cth) provides the legislative framework, while the Migration Regulations set out detailed visa requirements and conditions. Decisions made by the Department of Home Affairs can be reviewed by the Administrative Review Tribunal (ART), and in limited circumstances, judicial review is available through the Federal Court system.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">ACT Skilled Migration Program</h4>
      <p className="text-slate-700 mb-4">
        The ACT operates a state nomination program for skilled migrants under subclass 190 (Skilled Nominated) and subclass 491 (Skilled Work Regional) visas. The ACT Nomination Program requires applicants to demonstrate genuine commitment to living and working in the ACT, with requirements including minimum periods of residence, employment, or business activity in the territory. The ACT maintains a Critical Skills List identifying occupations in demand, with regular updates reflecting the territory's economic needs. Canberra Matrix points are awarded based on factors including ACT employment, qualifications, and English language ability.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Employer Sponsored Visas</h4>
      <p className="text-slate-700 mb-4">
        ACT employers can sponsor skilled workers through temporary and permanent visa programs including Temporary Skill Shortage (subclass 482) and Employer Nomination Scheme (subclass 186) visas. Employers must be approved as standard business sponsors and demonstrate genuine need for skilled workers, with labor market testing often required. The ACT's strong technology, professional services, and education sectors create demand for skilled workers, while Commonwealth government agencies have specific arrangements for sponsoring international employees.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Student Visas and Education</h4>
      <p className="text-slate-700 mb-4">
        The ACT hosts several universities and educational institutions, with international students holding subclass 500 student visas. Student visa holders must maintain enrollment in CRICOS-registered courses, maintain adequate health insurance, and comply with visa conditions including work limitations (48 hours per fortnight during semester). The Australian National University and University of Canberra are major providers to international students, with the ACT's safe environment and high quality of life being attractive factors. Graduates may be eligible for post-study work visas (subclass 485), providing pathways to permanent residence.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Family and Partner Visas</h4>
      <p className="text-slate-700 mb-4">
        Family reunion visas allow Australian citizens and permanent residents to sponsor family members including partners, children, parents, and in some cases, other relatives. Partner visas (subclass 820/801 and 309/100) require evidence of genuine and continuing relationships, with applicants undergoing health and character assessments. The ACT's multicultural community includes many family visa holders, with support services available through migrant resource centers and community organizations. Processing times vary significantly, with provisional visas typically granted before permanent visas after waiting periods.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Visa Refusals and Review Rights</h4>
      <p className="text-slate-700 mb-4">
        When visa applications are refused or visas are cancelled, applicants generally have review rights to the Administrative Review Tribunal (ART). Applications must be lodged within specified timeframes, usually 21-28 days for onshore decisions. The ART conducts merits review, reconsidering the decision based on applicable law and policy. For protection visa refusals, specific review processes apply. Judicial review in the Federal Circuit and Family Court or Federal Court may be available for jurisdictional error, though courts cannot review merits of decisions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Citizenship and Settlement</h4>
      <p className="text-slate-700 mb-4">
        Permanent residents who meet residence requirements (generally four years including one year as permanent resident) may apply for Australian citizenship. Citizenship applications require demonstrating basic English, knowledge of Australia, and understanding of citizenship responsibilities and privileges. The ACT provides settlement services for new migrants, including English language programs, employment assistance, and community orientation. The territory's diverse population and strong public services infrastructure support successful settlement outcomes for migrants choosing to make Canberra their home.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Immigration Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Department of Home Affairs:</strong> 131 881</li>
          <li><strong>ACT Migration Services:</strong> 13 22 81</li>
          <li><strong>Administrative Review Tribunal:</strong> 1800 228 333</li>
          <li><strong>Migration Agents Registration Authority (MARA):</strong> (07) 3005 8600</li>
          <li><strong>Refugee Advice and Casework Service (RACS):</strong> (02) 6247 2960</li>
          <li><strong>Legal Aid ACT (Immigration):</strong> (02) 6243 3411</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Immigration Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://immi.homeaffairs.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Department of Home Affairs</a></li>
          <li><a href="https://www.act.gov.au/migration" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Skilled Migration</a></li>
          <li><a href="https://www.aat.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Administrative Review Tribunal</a></li>
          <li><a href="https://www.mara.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">MARA</a></li>
        </ul>
      </div>
    </>
  ),

  'litigation': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Litigation and Dispute Resolution in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Litigation and dispute resolution in the Australian Capital Territory encompasses civil proceedings in the ACT Magistrates Court, ACT Supreme Court, and the ACT Civil and Administrative Tribunal (ACAT), as well as alternative dispute resolution mechanisms including mediation and arbitration. The territory's court system reflects its unique constitutional position, with ACT courts exercising both territory and limited federal jurisdiction. The ACT's legal profession operates under the Legal Profession Uniform Law, ensuring consistent standards for litigation practice and costs disclosure.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">The ACT Court System</h3>
      <p className="text-slate-700 mb-4">
        The ACT court hierarchy consists of the ACT Magistrates Court (handling civil claims up to $250,000, criminal summary matters, and committal proceedings), the ACT Supreme Court (unlimited civil jurisdiction, serious criminal trials, and appellate functions), and the ACT Court of Appeal (hearing appeals from the Supreme Court). The Federal Circuit and Family Court of Australia also sits in Canberra, hearing family law and general federal law matters. The ACT Civil and Administrative Tribunal (ACAT) provides accessible review of administrative decisions and resolves certain civil disputes.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Civil Litigation Process</h4>
      <p className="text-slate-700 mb-4">
        Civil litigation in the ACT begins with filing a claim (statement of claim in the Supreme Court, application in ACAT). The defendant must file a response within specified timeframes, with the court then managing the matter through case management conferences, directions hearings, and pre-trial procedures. The ACT courts encourage early resolution through mediation and settlement conferences. Court rules require parties to consider alternative dispute resolution before trial, with costs consequences for unreasonable refusal to participate. Most matters settle before trial, with only a small percentage proceeding to final hearing.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">ACAT Proceedings</h4>
      <p className="text-slate-700 mb-4">
        The ACT Civil and Administrative Tribunal (ACAT) was established to provide accessible, efficient dispute resolution for a wide range of matters including tenancy disputes, discrimination complaints, professional discipline, planning and land use, guardianship, and civil disputes up to $25,000. ACAT proceedings are less formal than court litigation, with simplified procedures and lower costs. The tribunal has jurisdiction to review administrative decisions of ACT government agencies, providing merits review where the agency decision is reconsidered on facts and law. Appeals from ACAT generally proceed to the ACT Supreme Court on questions of law.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternative Dispute Resolution</h4>
      <p className="text-slate-700 mb-4">
        Alternative dispute resolution (ADR) includes mediation, conciliation, arbitration, and expert determination. The ACT courts and ACAT actively promote ADR, with court-annexed mediation programs available. The Civil Disputes (Court Procedures) Act 2001 (ACT) requires consideration of ADR before litigation. Mediation is particularly common in commercial, property, and family disputes, offering confidential, without-prejudice negotiations facilitated by accredited mediators. Arbitration provides binding determination by a privately appointed arbitrator, commonly used in commercial and construction disputes where parties seek expert determination and finality.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Costs and Litigation Funding</h4>
      <p className="text-slate-700 mb-4">
        Legal costs in ACT litigation are significant, with the general rule being that unsuccessful parties pay the successful party's costs. Costs are assessed either by agreement between parties or by court assessment according to the Legal Profession (Solicitors) Costs Scale. Litigants should consider costs risks before commencing proceedings, including potential adverse costs orders. Litigation funding arrangements (third-party funding) are available for some claims, where funders finance litigation in return for a share of any recovery. Conditional costs agreements (no win, no fee) are permitted in ACT personal injury matters, subject to legislative caps and disclosure requirements.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Enforcement of Judgments</h4>
      <p className="text-slate-700 mb-4">
        Once judgment is obtained, enforcement mechanisms include garnishee orders (redirecting money owed to the judgment debtor), writs of execution (seizing and selling property), charging orders over land, and examination of judgment debtors about their financial circumstances. The ACT Magistrates Court has streamlined enforcement processes for smaller debts. Bankruptcy proceedings may be commenced against individuals who fail to comply with judgments exceeding $10,000, while companies may face winding up applications for unpaid debts over $4,000. Cross-border enforcement of ACT judgments in other jurisdictions is facilitated by reciprocal arrangements.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Litigation Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>ACT Magistrates Court:</strong> (02) 6207 1320</li>
          <li><strong>ACT Supreme Court:</strong> (02) 6205 0000</li>
          <li><strong>ACT Civil and Administrative Tribunal:</strong> (02) 6207 1740</li>
          <li><strong>ACT Law Society Referral Service:</strong> (02) 6274 0300</li>
          <li><strong>Legal Aid ACT:</strong> (02) 6243 3411</li>
          <li><strong>ADR Services (Mediators):</strong> Contact Law Society</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Litigation Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.courts.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Courts and Tribunal</a></li>
          <li><a href="https://www.acat.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.actlawsociety.asn.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Law Society</a></li>
          <li><a href="https://www.legalaidact.org.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Legal Aid ACT</a></li>
        </ul>
      </div>
    </>
  ),

  'bankruptcy-insolvency': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Bankruptcy and Insolvency Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Bankruptcy and insolvency law in the Australian Capital Territory is governed by federal legislation, primarily the Bankruptcy Act 1966 (Cth) for individuals and the Corporations Act 2001 (Cth) for companies. These laws provide frameworks for addressing financial distress, offering both voluntary and involuntary insolvency procedures. The ACT's relatively affluent population and high concentration of public sector employees create unique insolvency dynamics, with recent reforms introducing debt agreement schemes and personal insolvency agreements as alternatives to bankruptcy.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Understanding Personal Bankruptcy</h3>
      <p className="text-slate-700 mb-4">
        Bankruptcy is a legal process where an insolvent person's financial affairs are administered by a trustee who realizes assets and distributes proceeds to creditors. Individuals may voluntarily declare bankruptcy by filing a debtor's petition, or creditors owed more than $10,000 can initiate bankruptcy through creditor's petitions in the Federal Court or Federal Circuit and Family Court. Bankruptcy typically lasts three years and one day, after which undischarged debts are released (with some exceptions). During bankruptcy, restrictions apply including travel limitations, restrictions on obtaining credit over $7,538 without disclosure, and potential impacts on employment, particularly in financial services and certain government roles.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Alternatives to Bankruptcy</h4>
      <p className="text-slate-700 mb-4">
        The Bankruptcy Act provides alternatives including Part IX debt agreements and Part X personal insolvency agreements. Debt agreements are available for individuals with debts under $135,911, income under $90,607, and assets under $272,779 (indexed annually). They allow debtors to propose payment arrangements to creditors, avoiding formal bankruptcy if creditors accept. Personal insolvency agreements are more flexible, available regardless of debt levels, and negotiated with creditors under administration of a controlling trustee. Both alternatives avoid the full consequences of bankruptcy while providing relief from creditor pressure and a path to financial recovery.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Corporate Insolvency and Liquidation</h4>
      <p className="text-slate-700 mb-4">
        Companies facing insolvency may enter voluntary administration, liquidation, or utilize small business restructuring provisions introduced in 2021. Voluntary administration provides a moratorium on creditor actions while administrators investigate the company's affairs and propose a deed of company arrangement or recommend liquidation. Liquidation involves appointing a liquidator to realize assets and distribute proceeds to creditors according to statutory priorities. Directors of insolvent companies must act responsibly, as continuing to trade while insolvent can result in personal liability. The ACT Supreme Court has jurisdiction for corporate insolvency matters, with ASIC regulating registered liquidators and administrators.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Director Duties and Insolvent Trading</h4>
      <p className="text-slate-700 mb-4">
        Company directors must prevent insolvent trading under the Corporations Act, with potential personal liability for debts incurred while the company is insolvent if the director knew or should have known of the insolvency. Directors facing financial difficulty should seek professional advice early, as safe harbor provisions protect directors who appoint restructuring practitioners and develop plans for company turnaround. The temporary safe harbor during COVID-19 has ended, but permanent safe harbor provisions remain for directors taking appropriate courses of action. Directors may also face criminal penalties and disqualification for breach of duties in insolvency situations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Creditor Rights and Debt Recovery</h4>
      <p className="text-slate-700 mb-4">
        Creditors have various options for debt recovery including demand letters, court proceedings, and statutory demands. A statutory demand is a formal demand for payment of a debt exceeding $4,000, giving the debtor 21 days to pay or face presumed insolvency. If the debtor fails to comply, creditors may initiate winding up proceedings. Secured creditors have additional rights over secured property, while unsecured creditors must prove debts in insolvency administrations and typically receive cents in the dollar. Creditors should act promptly as delays may affect recovery prospects, particularly once insolvency administrations commence.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Financial Counseling and Support</h4>
      <p className="text-slate-700 mb-4">
        Free financial counseling services are available in the ACT through organizations including Care Financial Counselling and Legal Aid ACT. Financial counselors help individuals understand options, negotiate with creditors, and develop repayment plans. Early intervention is crucial, as options narrow once legal proceedings commence. The National Debt Helpline (1800 007 007) provides free financial counseling, while the Australian Financial Security Authority (AFSA) administers the bankruptcy system and provides information about personal insolvency options. Legal advice is recommended before entering bankruptcy or alternative arrangements.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Bankruptcy Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Australian Financial Security Authority (AFSA):</strong> 1300 364 785</li>
          <li><strong>National Debt Helpline:</strong> 1800 007 007</li>
          <li><strong>Care Financial Counselling ACT:</strong> (02) 6257 1788</li>
          <li><strong>Legal Aid ACT:</strong> (02) 6243 3411</li>
          <li><strong>ASIC (Corporate Insolvency):</strong> 1300 300 630</li>
          <li><strong>ACT Supreme Court (Bankruptcy Registry):</strong> (02) 6205 0000</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Bankruptcy and Insolvency Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.afsa.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Australian Financial Security Authority</a></li>
          <li><a href="https://www.ndh.org.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">National Debt Helpline</a></li>
          <li><a href="https://www.carefcs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Care Financial Counselling</a></li>
          <li><a href="https://www.asic.gov.au/regulatory-resources/insolvency/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ASIC Insolvency Resources</a></li>
        </ul>
      </div>
    </>
  ),

  'intellectual-property': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Intellectual Property Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-xl text-slate-700 mb-6">
        Intellectual property law in the Australian Capital Territory operates under federal legislation protecting patents, trade marks, designs, copyright, and confidential information. The ACT's strong technology, research, and innovation sectors—centered around institutions like the Australian National University, CSIRO, and numerous tech startups—create significant IP considerations. Key legislation includes the Patents Act 1990 (Cth), Trade Marks Act 1995 (Cth), Designs Act 2003 (Cth), and Copyright Act 1968 (Cth), administered by IP Australia and enforced through the Federal Court of Australia.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Understanding Intellectual Property Rights</h3>
      <p className="text-slate-700 mb-4">
        Intellectual property encompasses creations of the mind, including inventions (patents), brands (trade marks), designs, artistic and literary works (copyright), and confidential business information (trade secrets). Different IP rights provide different protections and durations. Patents protect inventions for up to 20 years, trade marks can be renewed indefinitely, registered designs last up to 10 years, and copyright generally lasts for the life of the creator plus 70 years. Understanding which IP rights apply and how to protect them is crucial for ACT businesses, particularly in technology, creative industries, and research sectors.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Patents and Innovation</h4>
      <p className="text-slate-700 mb-4">
        Patents protect new inventions that are novel, involve an inventive step, and are useful. The ACT's research institutions generate significant patentable innovations, with technology transfer offices managing commercialization. Patent applications are filed with IP Australia, undergoing examination before grant. The process typically takes 2-4 years and requires detailed specification of the invention. Provisional applications provide 12-month priority periods for further development before filing complete applications. Patents grant exclusive rights to exploit the invention commercially, though patent holders must actively enforce rights against infringers. International protection requires separate applications in each jurisdiction or through Patent Cooperation Treaty procedures.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Trade Marks and Branding</h4>
      <p className="text-slate-700 mb-4">
        Trade marks distinguish goods and services of one trader from another, including words, logos, colors, shapes, and sounds. Registration is not mandatory but provides significant advantages including exclusive use rights and easier enforcement. Applications are filed with IP Australia, specifying goods/services in relevant classes. Opposition proceedings allow third parties to challenge applications. Once registered, trade marks require renewal every 10 years and must be used to maintain protection. The ACT's service-based economy means service marks are particularly important, with professional firms, technology companies, and hospitality businesses actively protecting their brands.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Copyright and Creative Works</h4>
      <p className="text-slate-700 mb-4">
        Copyright automatically protects original literary, dramatic, musical, and artistic works, plus films, sound recordings, and broadcasts. No registration is required in Australia, with protection arising upon creation in material form. Copyright owners have exclusive rights to reproduce, publish, perform, and adapt works. The ACT's creative industries, educational institutions, and software developers extensively rely on copyright protection. Fair dealing exceptions allow limited use for research, criticism, and education. Moral rights protect creators' attribution and integrity interests, particularly relevant for artists and authors. Copyright duration varies: generally life plus 70 years for authored works, 70 years for films and sound recordings.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">IP in Employment and Contracting</h4>
      <p className="text-slate-700 mb-4">
        IP ownership in employment contexts requires careful consideration. Generally, employers own IP created by employees in the course of employment, while contractors retain ownership unless contracts specify otherwise. The ACT's high proportion of public sector employment creates unique issues, with Commonwealth and ACT government ownership provisions applying to public servant inventions. Technology companies and research institutions should have clear IP assignment clauses in employment contracts and collaboration agreements. Confidential information and restraint of trade provisions also protect business interests, though restraints must be reasonable in scope and duration to be enforceable.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">IP Enforcement and Disputes</h4>
      <p className="text-slate-700 mb-4">
        IP enforcement occurs through the Federal Court of Australia and Federal Circuit and Family Court, with proceedings including infringement actions, declarations of non-infringement, and revocation proceedings. Remedies include injunctions, damages, account of profits, and delivery up of infringing goods. Alternative dispute resolution including mediation is encouraged before litigation. IP Australia provides opposition and re-examination procedures for challenging registered rights. Border protection measures allow IP owners to lodge notices with Australian Border Force to prevent importation of counterfeit goods. Criminal penalties apply to serious copyright and trade mark infringement, particularly counterfeiting operations.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important IP Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>IP Australia:</strong> 1300 65 1010</li>
          <li><strong>Federal Court of Australia (Canberra):</strong> (02) 6267 0555</li>
          <li><strong>ACT Law Society Referral Service:</strong> (02) 6274 0300</li>
          <li><strong>ANU Technology Transfer:</strong> (02) 6125 3939</li>
          <li><strong>Australian Copyright Council:</strong> (02) 8815 9777</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful IP Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.ipaustralia.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IP Australia</a></li>
          <li><a href="https://www.copyright.org.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Australian Copyright Council</a></li>
          <li><a href="https://www.fedcourt.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Federal Court of Australia</a></li>
          <li><a href="https://www.business.gov.au/planning/new-businesses/protect-your-brand-idea-or-creation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Business.gov.au IP Guide</a></li>
        </ul>
      </div>
    </>
  ),

  'tax-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Tax Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Tax law in the Australian Capital Territory operates under federal taxation legislation administered by the Australian Taxation Office (ATO), combined with ACT-specific taxes and duties administered by the ACT Revenue Office. Federal taxes include income tax, goods and services tax (GST), fringe benefits tax (FBT), and capital gains tax (CGT). The ACT administers its own taxation including payroll tax, land tax (rates), and duties on various transactions. The territory has been progressively eliminating conveyance duty (stamp duty) on property transfers, instead implementing a more comprehensive rates system based on land values.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Federal Income Tax</h3>
      <p className="text-slate-700 mb-4">
        Income tax is levied on individuals, companies, trusts, and superannuation funds under the Income Tax Assessment Acts 1936 and 1997 (Cth). Individual tax rates are progressive, ranging from 0% to 45% (plus Medicare levy of 2%). The ACT's relatively high-income population means many residents pay tax at higher marginal rates. Deductions are available for work-related expenses, investment expenses, and charitable donations. The ATO administers pay-as-you-go (PAYG) withholding for employees and installment systems for business and investment income. Annual tax returns must be lodged by October 31 (or later if using a registered tax agent).
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Goods and Services Tax (GST)</h4>
      <p className="text-slate-700 mb-4">
        GST is a broad-based consumption tax of 10% on most goods and services, administered under A New Tax System (Goods and Services Tax) Act 1999 (Cth). Businesses with turnover exceeding $75,000 ($150,000 for non-profit organizations) must register for GST. Registered businesses charge GST on taxable supplies and claim input tax credits for GST paid on business purchases. Certain supplies are GST-free (basic food, health services, education) or input-taxed (residential rent, financial services). Business Activity Statements (BAS) report GST quarterly or monthly, with annual GST returns for some taxpayers. The ACT's service-based economy means GST compliance is important for professional services firms.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Capital Gains Tax and Property</h4>
      <p className="text-slate-700 mb-4">
        Capital gains tax applies to profits from selling assets including property, shares, and business assets, forming part of income tax rather than a separate tax. The main residence exemption excludes gains on selling a principal place of residence from CGT. The ACT's strong property market makes CGT particularly relevant, with investors in residential and commercial property subject to CGT on disposal. A 50% CGT discount applies to individuals and trusts for assets held over 12 months. Small business CGT concessions provide significant relief for eligible business owners selling business assets, including the 15-year exemption and retirement exemption.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">ACT Rates and Land Tax</h4>
      <p className="text-slate-700 mb-6">
        The ACT's rating system differs from other jurisdictions, with rates (land tax) payable on all properties based on Average Unimproved Value (AUV). Since 2012, the ACT has been gradually eliminating stamp duty on conveyances, replacing lost revenue with increased rates. This reform means annual rates are higher than some other jurisdictions but property transfer costs are lower. Investment properties and commercial properties attract higher rates than owner-occupied residential properties. Pensioners and low-income households may access rates deferrals or rebates. The ACT Revenue Office administers rates, with objection rights available for valuation disputes.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Payroll Tax and Business Taxes</h4>
      <p className="text-slate-700 mb-4">
        Payroll tax is imposed on employers with Australian wages exceeding $2 million annually, at a rate of 6.85%. The ACT participates in national harmonization of payroll tax, with grouping provisions preventing avoidance through multiple entities. Contractors and labour hire arrangements are scrutinized, with payments potentially constituting taxable wages depending on the relationship. The ACT offers payroll tax concessions for regional employers and certain industries. Foreign surcharges apply to foreign persons acquiring ACT land, with a 0.75% foreign ownership surcharge on rates and higher duty rates on acquisitions.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Tax Disputes and Objections</h4>
      <p className="text-slate-700 mb-4">
        Taxpayers who disagree with ATO assessments may lodge objections within specified timeframes (generally 2-4 years depending on the assessment type). If objections are unsuccessful, taxpayers can seek review by the Administrative Review Tribunal or appeal directly to the Federal Court. The ATO's independent review and dispute resolution processes offer alternatives to formal litigation. For ACT taxes, objections are made to the ACT Revenue Office, with review rights to ACAT. Tax disputes can be complex and costly, making early professional advice essential. The ATO's Taxpayer Charter sets out taxpayer rights and ATO obligations during disputes.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important Tax Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>Australian Taxation Office:</strong> 13 28 61 (individuals), 13 28 66 (business)</li>
          <li><strong>ACT Revenue Office:</strong> (02) 6207 0028</li>
          <li><strong>Tax Practitioners Board:</strong> 1300 362 829</li>
          <li><strong>Administrative Review Tribunal:</strong> 1800 228 333</li>
          <li><strong>ACT Law Society (Tax Lawyers):</strong> (02) 6274 0300</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful Tax Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.ato.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Australian Taxation Office</a></li>
          <li><a href="https://www.revenue.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Revenue Office</a></li>
          <li><a href="https://www.tpb.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Tax Practitioners Board</a></li>
          <li><a href="https://www.aat.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Administrative Review Tribunal</a></li>
        </ul>
      </div>
    </>
  ),

  'environmental-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Environmental Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Environmental law in the Australian Capital Territory operates under both federal and territory legislation protecting natural resources, managing pollution, and regulating development impacts. The ACT has comprehensive environmental protection through the Environment Protection Act 1997 (ACT), Planning and Development Act 2007 (ACT), and Nature Conservation Act 2014 (ACT), combined with federal laws including the Environment Protection and Biodiversity Conservation Act 1999 (Cth). The territory's compact geography, significant nature reserves, and planned city design create unique environmental considerations, with strong community engagement in environmental protection and climate change initiatives.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">ACT Environmental Protection Framework</h3>
      <p className="text-slate-700 mb-4">
        The Environment Protection Act 1997 (ACT) provides the principal framework for environmental protection in the territory, establishing the Environment Protection Authority (EPA) and regulating pollution, environmental authorizations, and environmental offenses. The Act implements the precautionary principle and ecologically sustainable development principles. Environmental authorizations are required for activities with potential environmental impacts, including industrial premises, waste facilities, and major developments. The EPA monitors compliance, investigates pollution incidents, and can issue directions and penalties for breaches.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Development and Environmental Impact Assessment</h4>
      <p className="text-slate-700 mb-4">
        Major developments in the ACT require environmental impact assessment under the Planning and Development Act 2007 (ACT). Environmental impact statements (EIS) must be prepared for proposals with significant environmental impacts, including assessment of effects on biodiversity, water quality, heritage, and climate. Public consultation is mandatory, with submissions considered before approval. The ACT's planning system integrates environmental considerations throughout the development assessment process, with the Territory Plan containing specific environmental protection overlays for sensitive areas including nature reserves, water catchments, and heritage precincts.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Nature Conservation and Biodiversity</h4>
      <p className="text-slate-700 mb-4">
        The Nature Conservation Act 2014 (ACT) protects threatened species, ecological communities, and key threatening processes. The ACT has significant biodiversity values including endangered box-gum woodland and threatened species such as the Grassland Earless Dragon. The Act establishes conservation planning requirements, regulates clearing of native vegetation, and protects wildlife. Development and land management activities must consider impacts on biodiversity, with offset requirements for unavoidable impacts. The ACT Conservator of Flora and Fauna administers the legislation, with significant penalties for unauthorized clearing and wildlife harm.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Water Quality and Catchment Protection</h4>
      <p className="text-slate-700 mb-4">
        The ACT's water resources are protected under the Water Resources Act 2007 (ACT) and environmental protection legislation. The territory's water supply catchments in Namadgi National Park have strict protection, with activities that may affect water quality requiring authorization. The ACT implements water sensitive urban design principles, managing stormwater quality through development controls. Lake Burley Griffin and other urban water bodies are protected through environmental flow provisions and pollution controls. The ACT is part of the Murray-Darling Basin system, with obligations under the Water Act 2007 (Cth) for sustainable water management.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Climate Change and Energy</h4>
      <p className="text-slate-700 mb-4">
        The ACT has ambitious climate change targets under the Climate Change and Greenhouse Gas Reduction Act 2010 (ACT), aiming for net zero emissions by 2045. The territory achieved 100% renewable electricity by 2020 through feed-in tariffs and reverse auctions for large-scale renewable energy. Energy efficiency requirements apply to new buildings, with minimum energy performance standards and mandatory disclosure for residential sales and leases. The ACT participates in the National Greenhouse and Energy Reporting scheme, with large emitters required to report emissions. Climate change considerations are integrated into planning decisions and government procurement.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Contaminated Land and Waste Management</h4>
      <p className="text-slate-700 mb-4">
        Contaminated sites in the ACT are regulated under the Environment Protection Act 1997 (ACT), with the Contaminated Sites Register identifying known contaminated land. Landowners and polluters have remediation obligations, with EPA oversight of investigation and cleanup. Waste management is regulated through the Waste Management and Resource Recovery Act 2016 (ACT), which implements waste hierarchy principles prioritizing avoidance, reuse, and recycling. The ACT has banned certain single-use plastics and implements extended producer responsibility schemes. Waste tracking and reporting requirements apply to commercial waste producers and transporters.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Environmental Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>ACT Environment Protection Authority:</strong> (02) 6207 2626</li>
          <li><strong>Conservator of Flora and Fauna:</strong> (02) 6207 2164</li>
          <li><strong>Access Canberra (Environment):</strong> 13 22 81</li>
          <li><strong>ACT Parks and Conservation Service:</strong> 13 22 81</li>
          <li><strong>Environment, Planning and Sustainable Development Directorate:</strong> (02) 6207 1923</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Environmental Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.environment.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Environment</a></li>
          <li><a href="https://www.environment.act.gov.au/epa" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT EPA</a></li>
          <li><a href="https://www.planning.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Planning and Land Authority</a></li>
          <li><a href="https://www.environment.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Department of Climate Change, Energy, Environment and Water</a></li>
        </ul>
      </div>
    </>
  ),

  'administrative-law': (
    <>
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Administrative Law in the Australian Capital Territory</h2>
      <p className="lead text-xl text-slate-700 mb-6">
        Administrative law in the Australian Capital Territory governs the exercise of power by government agencies and officials, providing accountability mechanisms and review rights for affected individuals. The ACT has a sophisticated administrative law framework including the ACT Civil and Administrative Tribunal (ACAT), judicial review in the ACT Supreme Court, and the ACT Ombudsman. The territory's high concentration of public administration—both ACT and Commonwealth—creates extensive administrative law practice encompassing government decisions affecting employment, licensing, planning, social services, and regulatory compliance.
      </p>

      <h3 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">Understanding Administrative Law</h3>
      <p className="text-slate-700 mb-4">
        Administrative law ensures government decision-makers act lawfully, fairly, and reasonably. It provides mechanisms for reviewing government decisions including merits review (reconsidering the correct decision based on facts and law) and judicial review (examining whether decisions comply with legal requirements). The ACT Human Rights Act 2004 adds another dimension, requiring public authorities to act compatibly with human rights and allowing rights-based challenges to government action. Administrative law principles include procedural fairness, reasonableness, acting within jurisdiction, and considering relevant matters while ignoring irrelevant considerations.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">ACT Civil and Administrative Tribunal (ACAT)</h4>
      <p className="text-slate-700 mb-4">
        ACAT provides accessible merits review of ACT government decisions across diverse areas including discrimination, occupational licensing, planning and development, revenue (rates and tax), residential tenancies, services entitlements, guardianship, and civil disputes. The tribunal reconsiders decisions afresh, determining the correct or preferable decision based on evidence and applicable law. ACAT proceedings are less formal than courts, with simplified procedures and fee waivers available for financial hardship. Applications must generally be lodged within 28 days of receiving decision notices. ACAT has power to affirm, vary, or set aside decisions, or remit matters back to decision-makers for reconsideration.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Judicial Review in the ACT Supreme Court</h4>
      <p className="text-slate-700 mb-4">
        The ACT Supreme Court conducts judicial review of ACT government decisions under the Administrative Decisions (Judicial Review) Act 1989 (ACT). Judicial review examines the legal validity of decisions rather than their merits, addressing grounds including jurisdictional error, breach of natural justice, error of law, irrelevant considerations, and unreasonableness. Applications must generally be made within 28 days, though extensions may be granted. The court can make declarations, quash decisions, mandate action, or issue injunctions. Costs risks are significant, making judicial review appropriate primarily where legal errors are clear and merits review is unavailable.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Freedom of Information</h4>
      <p className="text-slate-700 mb-4">
        The Freedom of Information Act 2016 (ACT) provides rights to access government documents, reflecting principles of open and accountable government. ACT government agencies must respond to FOI requests within 20 working days, providing access unless exemptions apply (cabinet documents, personal privacy, law enforcement, commercial confidentiality). Applicants can seek internal review and ACAT review of refusal decisions. The ACT Ombudsman oversees FOI compliance and can investigate complaints. The ACT has been progressive in proactive disclosure, publishing significant government information online without requiring formal requests.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">ACT Ombudsman</h4>
      <p className="text-slate-700 mb-4">
        The ACT Ombudsman investigates complaints about ACT government administrative actions, promoting fair and accountable administration. The Ombudsman can investigate complaints about government agencies, scrutinize administrative practices, and make recommendations for improvement. Complaints can concern unreasonable decisions, delays, incorrect information, or inadequate procedures. The Ombudsman's services are free and accessible, providing an important avenue for individuals who believe they have been treated unfairly. While recommendations are not binding, government agencies generally implement them. The Ombudsman also conducts own-motion investigations into systemic administrative issues.
      </p>

      <h4 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Human Rights Act Implications</h4>
      <p className="text-slate-700 mb-6">
        The ACT Human Rights Act 2004 significantly impacts administrative decision-making, requiring public authorities to act compatibly with human rights and giving proper consideration to relevant rights in decision-making. Protected rights include equality, privacy, freedom of expression, and fair trial rights. Individuals can raise human rights issues in ACAT proceedings, judicial review, and other legal proceedings. The Supreme Court can declare laws incompatible with human rights (though cannot invalidate them), prompting parliamentary consideration. The Human Rights Commission can receive complaints about human rights breaches, conducting conciliation and referring unresolved matters to ACAT.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Important ACT Administrative Law Contacts:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><strong>ACT Civil and Administrative Tribunal:</strong> (02) 6207 1740</li>
          <li><strong>ACT Ombudsman:</strong> (02) 6276 3773</li>
          <li><strong>ACT Human Rights Commission:</strong> (02) 6205 2222</li>
          <li><strong>ACT Supreme Court:</strong> (02) 6205 0000</li>
          <li><strong>Legal Aid ACT:</strong> (02) 6243 3411</li>
        </ul>
      </div>

      <div className="bg-slate-100 border-l-4 border-slate-600 p-6 my-6">
        <h4 className="font-bold text-slate-900 mb-3">Useful ACT Administrative Law Resources:</h4>
        <ul className="space-y-2 text-slate-700">
          <li><a href="https://www.acat.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Civil and Administrative Tribunal</a></li>
          <li><a href="https://www.ombudsman.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Ombudsman</a></li>
          <li><a href="https://hrc.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Human Rights Commission</a></li>
          <li><a href="https://www.courts.act.gov.au/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ACT Courts</a></li>
        </ul>
      </div>
    </>
  ),
};
