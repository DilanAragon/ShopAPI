const prisma = require('../lib/prisma')

// GET /api/orders
const getAll = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'ADMIN'

    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: req.user.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(orders)
  } catch (error) {
    next(error)
  }
}

// GET /api/orders/:id
const getOne = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: true } },
      },
    })

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' })
    }

    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta orden' })
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
}

// POST /api/orders
// Body: { items: [{ productId, quantity }] }
const create = async (req, res, next) => {
  try {
    const { items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'La orden debe tener al menos un producto' })
    }

    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    })

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'Uno o más productos no están disponibles' })
    }

    let total = 0
    const orderItems = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`,
        })
      }

      total += Number(product.price) * item.quantity
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          total,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
        },
      })

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
}

// PATCH /api/orders/:id/status  [ADMIN]
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Estado inválido. Opciones: ${validStatuses.join(', ')}`,
      })
    }

    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status },
    })

    res.json(order)
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getOne, create, updateStatus }