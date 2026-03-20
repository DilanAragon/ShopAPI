const router = require('express').Router()
const { getAll, getOne, create, update, remove } = require('../controllers/product.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', authMiddleware, roleMiddleware('ADMIN'), create)
router.put('/:id', authMiddleware, roleMiddleware('ADMIN'), update)
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), remove)

module.exports = router