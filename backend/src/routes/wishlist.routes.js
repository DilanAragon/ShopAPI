const router = require('express').Router()
const { getMyWishlist, toggleWishlist } = require('../controllers/wishlist.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', authMiddleware, getMyWishlist)
router.post('/:productId', authMiddleware, toggleWishlist)

module.exports = router
