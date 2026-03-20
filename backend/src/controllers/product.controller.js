const prisma = require('../lib/prisma')

// GET /api/products
const getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where = {
      active: true,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    }

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/products/:id
const getOne = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    })

    if (!product || !product.active) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json(product)
  } catch (error) {
    next(error)
  }
}

// POST /api/products  [ADMIN]
const create = async (req, res, next) => {
  try {
    const { name, description, price, stock, image } = req.body

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Nombre y precio son requeridos' })
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock) || 0,
        image,
      },
    })

    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

// PUT /api/products/:id  [ADMIN]
const update = async (req, res, next) => {
  try {
    const { name, description, price, stock, image, active } = req.body

    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(image !== undefined && { image }),
        ...(active !== undefined && { active }),
      },
    })

    res.json(product)
  } catch (error) {
    next(error)
  }
}

// DELETE /api/products/:id  [ADMIN] — soft delete
const remove = async (req, res, next) => {
  try {
    await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { active: false },
    })

    res.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getOne, create, update, remove }