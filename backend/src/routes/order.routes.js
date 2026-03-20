const router = require('express').Router()
const { getAll, getOne, create, updateStatus } = require('../controllers/order.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.use(authMiddleware)

router.get('/', getAll)
router.get('/:id', getOne)
router.post('/', create)
router.patch('/:id/status', roleMiddleware('ADMIN'), updateStatus)

module.exports = router