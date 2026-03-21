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

  const catRopa = await prisma.category.upsert({
    where: { name: 'Ropa' },
    update: {},
    create: { name: 'Ropa' },
  })
  const catCalzado = await prisma.category.upsert({
    where: { name: 'Calzado' },
    update: {},
    create: { name: 'Calzado' },
  })
  const catAccesorios = await prisma.category.upsert({
    where: { name: 'Accesorios' },
    update: {},
    create: { name: 'Accesorios' },
  })

  const products = [
    { name: 'Camiseta Básica', description: 'Camiseta de algodón 100%', price: 25000, stock: 50, categoryId: catRopa.id, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80' },
    { name: 'Jeans Slim', description: 'Jeans de corte slim fit', price: 89000, stock: 30, categoryId: catRopa.id, image: 'https://images.unsplash.com/photo-1542272604-780c4050d122?auto=format&fit=crop&w=800&q=80' },
    { name: 'Zapatillas Running', description: 'Zapatillas para correr', price: 150000, stock: 20, categoryId: catCalzado.id, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80' },
    { name: 'Chaqueta Impermeable', description: 'Chaqueta resistente al agua', price: 200000, stock: 15, categoryId: catRopa.id, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
    { name: 'Gorra Snapback', description: 'Gorra ajustable', price: 35000, stock: 40, categoryId: catAccesorios.id, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80' },
  ]

  const productsCount = await prisma.product.count()
  if (productsCount === 0) {
    for (const product of products) {
      await prisma.product.create({ data: product })
    }
    console.log(`Productos creados: ${products.length}`)
  } else {
    console.log(`Los productos ya existían en la base de datos (${productsCount}).`)
  }

  console.log(`Admin: ${admin.email}`)
  console.log(`Cliente: ${customer.email}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })