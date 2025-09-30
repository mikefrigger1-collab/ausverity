import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@ausverity.com'
  const password = 'admin123' // Change this to something secure!
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })

  if (existingAdmin) {
    console.log('❌ Admin user already exists with email:', email)
    return
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)
  
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })
  
  console.log('✅ Admin user created successfully!')
  console.log('📧 Email:', email)
  console.log('🔑 Password:', password)
  console.log('👤 User ID:', admin.id)
  console.log('\n⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })