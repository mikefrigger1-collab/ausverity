export interface PracticeAreaCategory {
  name: string
  slug: string
  category: string
  description: string
  subcategories: string[]
}

export const PRACTICE_AREA_CATEGORIES: PracticeAreaCategory[] = [
  {
    name: 'Family Law',
    slug: 'family-law',
    category: 'Family Law',
    description: 'Legal matters relating to family relationships, divorce, children, and domestic arrangements',
    subcategories: [
      'Family Law',
      'Divorce & Separation',
      'Child Custody & Parenting',
      'Property Settlement',
      'Spousal Maintenance',
      'De Facto Relationships',
      'Adoption',
      'Domestic Violence & AVO'
    ]
  },
  {
    name: 'Criminal Law',
    slug: 'criminal-law',
    category: 'Criminal Law',
    description: 'Legal representation for criminal charges and offences',
    subcategories: [
      'Criminal Law',
      'Drink Driving & Traffic Offences',
      'Assault & Violence',
      'Drug Offences',
      'Fraud & White Collar Crime',
      'Sexual Offences',
      'Theft & Property Crimes',
      'Appeals'
    ]
  },
  {
    name: 'Property Law',
    slug: 'property-law',
    category: 'Property Law',
    description: 'Property transactions, conveyancing, and property-related disputes',
    subcategories: [
      'Property Law',
      'Conveyancing',
      'Residential Property',
      'Commercial Property',
      'Property Development',
      'Leasing & Tenancy',
      'Strata & Body Corporate',
      'Property Disputes'
    ]
  },
  {
    name: 'Wills & Estates',
    slug: 'wills-estates',
    category: 'Wills & Estates',
    description: 'Estate planning, wills, probate, and succession matters',
    subcategories: [
      'Wills & Estates',
      'Will Drafting',
      'Estate Planning',
      'Probate & Administration',
      'Contested Wills',
      'Powers of Attorney',
      'Guardianship',
      'Trust Law'
    ]
  },
  {
    name: 'Employment Law',
    slug: 'employment-law',
    category: 'Employment Law',
    description: 'Workplace disputes, employment contracts, and employee rights',
    subcategories: [
      'Employment Law',
      'Unfair Dismissal',
      'Workplace Discrimination',
      'Workplace Bullying',
      'Employment Contracts',
      'Workers Compensation',
      'Redundancy',
      'Workplace Safety'
    ]
  },
  {
    name: 'Personal Injury',
    slug: 'personal-injury',
    category: 'Personal Injury',
    description: 'Compensation claims for injuries and accidents',
    subcategories: [
      'Personal Injury Law',
      'Motor Vehicle Accidents',
      'Medical Negligence',
      'Public Liability Claims',
      'Work Injury Compensation',
      'Total & Permanent Disability (TPD)',
      'Dust Diseases'
    ]
  },
  {
    name: 'Business Law',
    slug: 'business-law',
    category: 'Business Law',
    description: 'Commercial and corporate legal services for businesses',
    subcategories: [
      'Business Law',
      'Commercial Law',
      'Company Law',
      'Contract Law',
      'Business Formation & Structure',
      'Mergers & Acquisitions',
      'Commercial Disputes',
      'Business Sales & Purchases',
      'Franchising',
      'Partnership Agreements'
    ]
  },
  {
    name: 'Immigration Law',
    slug: 'immigration-law',
    category: 'Immigration Law',
    description: 'Visa applications, citizenship, and immigration matters',
    subcategories: [
      'Immigration Law',
      'Visa Applications',
      'Skilled Migration',
      'Family Migration',
      'Business Migration',
      'Citizenship',
      'Visa Refusals & Appeals',
      'Deportation & Removal'
    ]
  },
  {
    name: 'Litigation',
    slug: 'litigation',
    category: 'Litigation',
    description: 'Court proceedings and dispute resolution',
    subcategories: [
      'Civil Litigation',
      'Commercial Litigation',
      'Mediation & Alternative Dispute Resolution',
      'Debt Recovery',
      'Building & Construction Disputes',
      'Defamation'
    ]
  },
  {
    name: 'Bankruptcy & Insolvency',
    slug: 'bankruptcy-insolvency',
    category: 'Bankruptcy & Insolvency',
    description: 'Bankruptcy, insolvency, and debt relief matters',
    subcategories: [
      'Bankruptcy',
      'Insolvency',
      'Liquidation',
      'Voluntary Administration',
      'Debt Agreements'
    ]
  },
  {
    name: 'Intellectual Property',
    slug: 'intellectual-property',
    category: 'Intellectual Property',
    description: 'Protection and enforcement of intellectual property rights',
    subcategories: [
      'Intellectual Property Law',
      'Trademark Law',
      'Copyright Law',
      'Patent Law',
      'Trade Secrets'
    ]
  },
  {
    name: 'Tax Law',
    slug: 'tax-law',
    category: 'Tax Law',
    description: 'Tax planning, disputes, and compliance',
    subcategories: [
      'Tax Law',
      'Income Tax',
      'GST',
      'Tax Disputes',
      'Tax Planning'
    ]
  },
  {
    name: 'Environmental Law',
    slug: 'environmental-law',
    category: 'Environmental Law',
    description: 'Environmental regulation, planning, and resource management',
    subcategories: [
      'Environmental Law',
      'Planning & Development',
      'Native Title',
      'Mining & Resources'
    ]
  },
  {
    name: 'Administrative Law',
    slug: 'administrative-law',
    category: 'Administrative Law',
    description: 'Government decisions, tribunals, and administrative matters',
    subcategories: [
      'Administrative Law',
      'Government Law',
      'Constitutional Law',
      'Freedom of Information'
    ]
  }
]

export function getPracticeAreaBySlug(slug: string): PracticeAreaCategory | undefined {
  return PRACTICE_AREA_CATEGORIES.find(pa => pa.slug === slug)
}

export function isValidPracticeAreaSlug(slug: string): boolean {
  return PRACTICE_AREA_CATEGORIES.some(pa => pa.slug === slug)
}
