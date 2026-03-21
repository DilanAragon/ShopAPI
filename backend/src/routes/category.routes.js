const router = require('express').Router()
const { getAll } = require('../controllers/category.controller')

router.get('/', getAll)

module.exports = router
