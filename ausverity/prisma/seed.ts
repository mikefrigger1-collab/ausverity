import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const australianLegalSpecialisations = [
  // Family Law
  { name: 'Family Law', category: 'Family Law', parentId: null },
  { name: 'Divorce & Separation', category: 'Family Law', parentId: null },
  { name: 'Child Custody & Parenting', category: 'Family Law', parentId: null },
  { name: 'Property Settlement', category: 'Family Law', parentId: null },
  { name: 'Spousal Maintenance', category: 'Family Law', parentId: null },
  { name: 'De Facto Relationships', category: 'Family Law', parentId: null },
  { name: 'Adoption', category: 'Family Law', parentId: null },
  { name: 'Domestic Violence & AVO', category: 'Family Law', parentId: null },

  // Criminal Law
  { name: 'Criminal Law', category: 'Criminal Law', parentId: null },
  { name: 'Drink Driving & Traffic Offences', category: 'Criminal Law', parentId: null },
  { name: 'Assault & Violence', category: 'Criminal Law', parentId: null },
  { name: 'Drug Offences', category: 'Criminal Law', parentId: null },
  { name: 'Fraud & White Collar Crime', category: 'Criminal Law', parentId: null },
  { name: 'Sexual Offences', category: 'Criminal Law', parentId: null },
  { name: 'Theft & Property Crimes', category: 'Criminal Law', parentId: null },
  { name: 'Appeals', category: 'Criminal Law', parentId: null },

  // Property & Conveyancing
  { name: 'Property Law', category: 'Property Law', parentId: null },
  { name: 'Conveyancing', category: 'Property Law', parentId: null },
  { name: 'Residential Property', category: 'Property Law', parentId: null },
  { name: 'Commercial Property', category: 'Property Law', parentId: null },
  { name: 'Property Development', category: 'Property Law', parentId: null },
  { name: 'Leasing & Tenancy', category: 'Property Law', parentId: null },
  { name: 'Strata & Body Corporate', category: 'Property Law', parentId: null },
  { name: 'Property Disputes', category: 'Property Law', parentId: null },

  // Wills & Estates
  { name: 'Wills & Estates', category: 'Wills & Estates', parentId: null },
  { name: 'Will Drafting', category: 'Wills & Estates', parentId: null },
  { name: 'Estate Planning', category: 'Wills & Estates', parentId: null },
  { name: 'Probate & Administration', category: 'Wills & Estates', parentId: null },
  { name: 'Contested Wills', category: 'Wills & Estates', parentId: null },
  { name: 'Powers of Attorney', category: 'Wills & Estates', parentId: null },
  { name: 'Guardianship', category: 'Wills & Estates', parentId: null },
  { name: 'Trust Law', category: 'Wills & Estates', parentId: null },

  // Employment Law
  { name: 'Employment Law', category: 'Employment Law', parentId: null },
  { name: 'Unfair Dismissal', category: 'Employment Law', parentId: null },
  { name: 'Workplace Discrimination', category: 'Employment Law', parentId: null },
  { name: 'Workplace Bullying', category: 'Employment Law', parentId: null },
  { name: 'Employment Contracts', category: 'Employment Law', parentId: null },
  { name: 'Workers Compensation', category: 'Employment Law', parentId: null },
  { name: 'Redundancy', category: 'Employment Law', parentId: null },
  { name: 'Workplace Safety', category: 'Employment Law', parentId: null },

  // Personal Injury & Compensation
  { name: 'Personal Injury Law', category: 'Personal Injury', parentId: null },
  { name: 'Motor Vehicle Accidents', category: 'Personal Injury', parentId: null },
  { name: 'Medical Negligence', category: 'Personal Injury', parentId: null },
  { name: 'Public Liability Claims', category: 'Personal Injury', parentId: null },
  { name: 'Work Injury Compensation', category: 'Personal Injury', parentId: null },
  { name: 'Total & Permanent Disability (TPD)', category: 'Personal Injury', parentId: null },
  { name: 'Dust Diseases', category: 'Personal Injury', parentId: null },

  // Business & Commercial Law
  { name: 'Business Law', category: 'Business Law', parentId: null },
  { name: 'Commercial Law', category: 'Business Law', parentId: null },
  { name: 'Company Law', category: 'Business Law', parentId: null },
  { name: 'Contract Law', category: 'Business Law', parentId: null },
  { name: 'Business Formation & Structure', category: 'Business Law', parentId: null },
  { name: 'Mergers & Acquisitions', category: 'Business Law', parentId: null },
  { name: 'Commercial Disputes', category: 'Business Law', parentId: null },
  { name: 'Business Sales & Purchases', category: 'Business Law', parentId: null },
  { name: 'Franchising', category: 'Business Law', parentId: null },
  { name: 'Partnership Agreements', category: 'Business Law', parentId: null },

  // Immigration & Visa
  { name: 'Immigration Law', category: 'Immigration Law', parentId: null },
  { name: 'Visa Applications', category: 'Immigration Law', parentId: null },
  { name: 'Skilled Migration', category: 'Immigration Law', parentId: null },
  { name: 'Family Migration', category: 'Immigration Law', parentId: null },
  { name: 'Business Migration', category: 'Immigration Law', parentId: null },
  { name: 'Citizenship', category: 'Immigration Law', parentId: null },
  { name: 'Visa Refusals & Appeals', category: 'Immigration Law', parentId: null },
  { name: 'Deportation & Removal', category: 'Immigration Law', parentId: null },

  // Litigation & Dispute Resolution
  { name: 'Civil Litigation', category: 'Litigation', parentId: null },
  { name: 'Commercial Litigation', category: 'Litigation', parentId: null },
  { name: 'Mediation & Alternative Dispute Resolution', category: 'Litigation', parentId: null },
  { name: 'Debt Recovery', category: 'Litigation', parentId: null },
  { name: 'Building & Construction Disputes', category: 'Litigation', parentId: null },
  { name: 'Defamation', category: 'Litigation', parentId: null },

  // Bankruptcy & Insolvency
  { name: 'Bankruptcy', category: 'Bankruptcy & Insolvency', parentId: null },
  { name: 'Insolvency', category: 'Bankruptcy & Insolvency', parentId: null },
  { name: 'Liquidation', category: 'Bankruptcy & Insolvency', parentId: null },
  { name: 'Voluntary Administration', category: 'Bankruptcy & Insolvency', parentId: null },
  { name: 'Debt Agreements', category: 'Bankruptcy & Insolvency', parentId: null },

  // Intellectual Property
  { name: 'Intellectual Property Law', category: 'Intellectual Property', parentId: null },
  { name: 'Trademark Law', category: 'Intellectual Property', parentId: null },
  { name: 'Copyright Law', category: 'Intellectual Property', parentId: null },
  { name: 'Patent Law', category: 'Intellectual Property', parentId: null },
  { name: 'Trade Secrets', category: 'Intellectual Property', parentId: null },

  // Tax Law
  { name: 'Tax Law', category: 'Tax Law', parentId: null },
  { name: 'Income Tax', category: 'Tax Law', parentId: null },
  { name: 'GST', category: 'Tax Law', parentId: null },
  { name: 'Tax Disputes', category: 'Tax Law', parentId: null },
  { name: 'Tax Planning', category: 'Tax Law', parentId: null },

  // Environment & Planning
  { name: 'Environmental Law', category: 'Environmental Law', parentId: null },
  { name: 'Planning & Development', category: 'Environmental Law', parentId: null },
  { name: 'Native Title', category: 'Environmental Law', parentId: null },
  { name: 'Mining & Resources', category: 'Environmental Law', parentId: null },

  // Administrative & Government
  { name: 'Administrative Law', category: 'Administrative Law', parentId: null },
  { name: 'Government Law', category: 'Administrative Law', parentId: null },
  { name: 'Constitutional Law', category: 'Administrative Law', parentId: null },
  { name: 'Freedom of Information', category: 'Administrative Law', parentId: null },

  // Other Specialisations
  { name: 'Aviation Law', category: 'Other', parentId: null },
  { name: 'Banking & Finance Law', category: 'Other', parentId: null },
  { name: 'Competition & Consumer Law', category: 'Other', parentId: null },
  { name: 'Entertainment & Media Law', category: 'Other', parentId: null },
  { name: 'Health & Medical Law', category: 'Other', parentId: null },
  { name: 'Insurance Law', category: 'Other', parentId: null },
  { name: 'Privacy Law', category: 'Other', parentId: null },
  { name: 'Sports Law', category: 'Other', parentId: null },
  { name: 'Superannuation Law', category: 'Other', parentId: null },
  { name: 'Technology & IT Law', category: 'Other', parentId: null },
  { name: 'Telecommunications Law', category: 'Other', parentId: null },
]

async function main() {
  console.log('🌱 Seeding database with Australian legal specialisations...')

  // Check if specialisations already exist
  const existingCount = await prisma.specialisation.count()

  if (existingCount > 0) {
    console.log(`⚠️  Database already has ${existingCount} specialisations. Skipping seed.`)
    console.log('   To re-seed, first delete existing specialisations from the database.')
    return
  }

  // Create all specialisations
  for (const spec of australianLegalSpecialisations) {
    await prisma.specialisation.create({
      data: spec
    })
  }

  const finalCount = await prisma.specialisation.count()
  console.log(`✅ Successfully seeded ${finalCount} legal specialisations!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })