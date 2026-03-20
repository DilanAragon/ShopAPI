require('dotenv').config()
const app = require('./app')
const prisma = require('./lib/prisma')

const PORT = process.env.PORT || 4000

async function main() {
  try {
    await prisma.$connect()
    console.log('✅ Conectado a MySQL con Prisma')

    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`)
      console.log(`   POST  /api/auth/register`)
      console.log(`   POST  /api/auth/login`)
      console.log(`   GET   /api/auth/me`)
      console.log(`   GET   /api/products`)
      console.log(`   POST  /api/products  (ADMIN)`)
      console.log(`   PUT   /api/products/:id  (ADMIN)`)
      console.log(`   DELETE /api/products/:id  (ADMIN)`)
      console.log(`   GET   /api/orders`)
      console.log(`   POST  /api/orders`)
      console.log(`   PATCH /api/orders/:id/status  (ADMIN)`)
    })
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error)
    process.exit(1)
  }
}

main()