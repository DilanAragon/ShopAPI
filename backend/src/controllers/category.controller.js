const prisma = require('../lib/prisma')

// GET /api/categories
const getAll = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        })

        res.json(categories)
    } catch (error) {
        next(error)
    }
}

module.exports = { getAll }
