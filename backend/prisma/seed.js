const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Sembrando datos...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shopapi.com' },
    update: {},
    create: {
      email: 'admin@shopapi.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  const customerPassword = await bcrypt.hash('customer123', 10)
  const customer = await prisma.user.upsert({
    where: { email: 'cliente@shopapi.com' },
    update: {},
    create: {
      email: 'cliente@shopapi.com',
      password: customerPassword,
      name: 'Cliente Demo',
      role: 'CUSTOMER',
    },
  })

  const products = [
    { name: 'Camiseta Básica', description: 'Camiseta de algodón 100%', price: 25000, stock: 50 },
    { name: 'Jeans Slim', description: 'Jeans de corte slim fit', price: 89000, stock: 30 },
    { name: 'Zapatillas Running', description: 'Zapatillas para correr', price: 150000, stock: 20 },
    { name: 'Chaqueta Impermeable', description: 'Chaqueta resistente al agua', price: 200000, stock: 15 },
    { name: 'Gorra Snapback', description: 'Gorra ajustable', price: 35000, stock: 40 },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log(`Admin: ${admin.email}`)
  console.log(`Cliente: ${customer.email}`)
  console.log(`Productos creados: ${products.length}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })