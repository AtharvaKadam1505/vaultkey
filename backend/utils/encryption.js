const crypto = require('crypto')

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // bytes for AES-256
const IV_LENGTH = 16  // bytes
const TAG_LENGTH = 16 // bytes for GCM auth tag

/**
 * Derive a 32-byte key from the ENCRYPTION_SECRET env var.
 * Using scrypt for key stretching.
 */
function getKey() {
  const secret = process.env.ENCRYPTION_SECRET
  if (!secret) throw new Error('ENCRYPTION_SECRET is not set')
  // Use a fixed salt (not secret, just for stretching)
  return crypto.scryptSync(secret, 'vaultkey-salt-v1', KEY_LENGTH)
}

/**
 * Encrypt a plaintext string → returns a hex-encoded string
 * Format: iv(32 hex) + tag(32 hex) + ciphertext(hex)
 */
function encrypt(plaintext) {
  if (!plaintext) return ''
  const key = getKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const tag = cipher.getAuthTag()
  return iv.toString('hex') + tag.toString('hex') + encrypted
}

/**
 * Decrypt a hex-encoded string → returns plaintext
 */
function decrypt(encryptedHex) {
  if (!encryptedHex) return ''
  const key = getKey()

  const iv = Buffer.from(encryptedHex.slice(0, IV_LENGTH * 2), 'hex')
  const tag = Buffer.from(encryptedHex.slice(IV_LENGTH * 2, (IV_LENGTH + TAG_LENGTH) * 2), 'hex')
  const ciphertext = encryptedHex.slice((IV_LENGTH + TAG_LENGTH) * 2)

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

module.exports = { encrypt, decrypt }
