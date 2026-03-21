const prisma = require('../lib/prisma')

// GET /api/wishlists
const getMyWishlist = async (req, res, next) => {
    try {
        const list = await prisma.wishlist.findMany({
            where: { userId: req.user.userId },
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        })

        // Extraer solo los productos vinculados a esa wishlist
        res.json(list.map(w => w.product))
    } catch (error) {
        next(error)
    }
}

// POST /api/wishlists/:productId
const toggleWishlist = async (req, res, next) => {
    try {
        const productId = Number(req.params.productId)
        const userId = req.user.userId

        const existing = await prisma.wishlist.findUnique({
            where: { userId_productId: { userId, productId } }
        })

        if (existing) {
            await prisma.wishlist.delete({ where: { id: existing.id } })
            return res.json({ message: 'Eliminado de la lista de deseos', added: false })
        }

        await prisma.wishlist.create({
            data: { userId, productId }
        })
        res.json({ message: 'Añadido a la lista de deseos', added: true })
    } catch (error) {
        next(error)
    }
}

module.exports = { getMyWishlist, toggleWishlist }
