/**
 * validateEnv.js
 * Call this at the top of server.js to catch missing env vars early.
 * Usage: require('./config/validateEnv')()
 */
function validateEnv() {
  const required = [
    'MONGODB_URI',
    'CLERK_SECRET_KEY',
    'ENCRYPTION_SECRET',
  ]

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`   - ${key}`))
    console.error('\nCopy .env.example to .env and fill in all values.')
    process.exit(1)
  }

  if (process.env.ENCRYPTION_SECRET.length < 16) {
    console.error('❌ ENCRYPTION_SECRET must be at least 16 characters long.')
    process.exit(1)
  }

  console.log('✅ Environment variables validated')
}

module.exports = validateEnv
