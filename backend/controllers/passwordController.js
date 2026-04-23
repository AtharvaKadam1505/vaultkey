const Password = require('../models/Password')
const { encrypt, decrypt } = require('../utils/encryption')

/**
 * GET /api/passwords
 * Returns all credentials for the authenticated user (newest first)
 */
async function getPasswords(req, res) {
  try {
    const userId = req.auth.userId

    const entries = await Password.find({ userId })
      .sort({ createdAt: -1 })
      .lean()

    // Decrypt each password before sending
    const decrypted = entries.map(entry => ({
      _id: entry._id,
      websiteName: entry.websiteName,
      url: entry.url,
      username: entry.username,
      password: decrypt(entry.encryptedPassword),
      notes: entry.notes,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    }))

    res.json(decrypted)
  } catch (error) {
    console.error('getPasswords error:', error)
    res.status(500).json({ error: 'Failed to fetch credentials' })
  }
}

/**
 * POST /api/passwords
 * Create a new credential
 */
async function createPassword(req, res) {
  try {
    const userId = req.auth.userId
    const { websiteName, url, username, password, notes } = req.body

    // Validation
    if (!websiteName?.trim()) return res.status(400).json({ error: 'Website name is required' })
    if (!username?.trim()) return res.status(400).json({ error: 'Username is required' })
    if (!password) return res.status(400).json({ error: 'Password is required' })

    const entry = await Password.create({
      userId,
      websiteName: websiteName.trim(),
      url: url?.trim() || '',
      username: username.trim(),
      encryptedPassword: encrypt(password),
      notes: notes?.trim() || '',
    })

    res.status(201).json({
      _id: entry._id,
      websiteName: entry.websiteName,
      url: entry.url,
      username: entry.username,
      password,           // return plain text in response (it's over HTTPS)
      notes: entry.notes,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    })
  } catch (error) {
    console.error('createPassword error:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: Object.values(error.errors)[0].message })
    }
    res.status(500).json({ error: 'Failed to save credential' })
  }
}

/**
 * PUT /api/passwords/:id
 * Update an existing credential
 */
async function updatePassword(req, res) {
  try {
    const userId = req.auth.userId
    const { id } = req.params
    const { websiteName, url, username, password, notes } = req.body

    // Find and verify ownership
    const entry = await Password.findOne({ _id: id, userId })
    if (!entry) {
      return res.status(404).json({ error: 'Credential not found' })
    }

    // Update fields
    if (websiteName?.trim()) entry.websiteName = websiteName.trim()
    if (url !== undefined) entry.url = url.trim()
    if (username?.trim()) entry.username = username.trim()
    if (password) entry.encryptedPassword = encrypt(password)
    if (notes !== undefined) entry.notes = notes.trim()

    await entry.save()

    res.json({
      _id: entry._id,
      websiteName: entry.websiteName,
      url: entry.url,
      username: entry.username,
      password: password || decrypt(entry.encryptedPassword),
      notes: entry.notes,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    })
  } catch (error) {
    console.error('updatePassword error:', error)
    res.status(500).json({ error: 'Failed to update credential' })
  }
}

/**
 * DELETE /api/passwords/:id
 * Delete a credential
 */
async function deletePassword(req, res) {
  try {
    const userId = req.auth.userId
    const { id } = req.params

    const entry = await Password.findOneAndDelete({ _id: id, userId })
    if (!entry) {
      return res.status(404).json({ error: 'Credential not found' })
    }

    res.json({ message: 'Credential deleted successfully' })
  } catch (error) {
    console.error('deletePassword error:', error)
    res.status(500).json({ error: 'Failed to delete credential' })
  }
}

module.exports = { getPasswords, createPassword, updatePassword, deletePassword }
