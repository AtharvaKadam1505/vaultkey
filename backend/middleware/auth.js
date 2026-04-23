const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node')

/**
 * Clerk middleware that:
 * 1. Verifies the Bearer JWT from the Authorization header
 * 2. Attaches auth.userId to req if valid
 * 3. Returns 401 if missing or invalid
 */
const requireAuth = ClerkExpressRequireAuth()

/**
 * Wrapper that provides a clean 401 JSON error (instead of HTML)
 */
function authMiddleware(req, res, next) {
  requireAuth(req, res, (err) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in.' })
    }
    next()
  })
}

module.exports = authMiddleware
