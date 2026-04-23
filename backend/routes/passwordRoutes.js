const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const {
  getPasswords,
  createPassword,
  updatePassword,
  deletePassword,
} = require('../controllers/passwordController')

// All routes require authentication
router.use(authMiddleware)

router.get('/', getPasswords)
router.post('/', createPassword)
router.put('/:id', updatePassword)
router.delete('/:id', deletePassword)

module.exports = router
