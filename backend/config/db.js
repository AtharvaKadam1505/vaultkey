const mongoose = require('mongoose')

let isConnected = false

async function connectDB(retries = 5, delay = 3000) {
  if (isConnected) return

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables')
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4 — fixes many DNS issues
      })
      isConnected = true
      console.log(`✅ MongoDB connected: ${conn.connection.host}`)
      return
    } catch (error) {
      console.error(`❌ MongoDB connection failed (attempt ${attempt}/${retries}):`, error.message)
      if (attempt < retries) {
        console.log(`   Retrying in ${delay / 1000}s...`)
        await new Promise(res => setTimeout(res, delay))
      } else {
        console.error('   All connection attempts failed. Check your MONGODB_URI and network.')
        // Don't exit — let the server stay up so you can fix env vars without restarting
      }
    }
  }

}

module.exports = connectDB