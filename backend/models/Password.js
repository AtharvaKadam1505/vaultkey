const mongoose = require('mongoose')

const passwordSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,   // Fast lookups by user
    },
    websiteName: {
      type: String,
      required: [true, 'Website name is required'],
      trim: true,
      maxlength: [100, 'Website name too long'],
    },
    url: {
      type: String,
      trim: true,
      maxlength: [500, 'URL too long'],
      default: '',
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      maxlength: [200, 'Username too long'],
    },
    // Stored as AES-256-GCM encrypted hex string
    encryptedPassword: {
      type: String,
      required: [true, 'Password is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes too long'],
      default: '',
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
)

// Never accidentally expose encryptedPassword
passwordSchema.methods.toSafeJSON = function (decryptedPassword) {
  return {
    _id: this._id,
    websiteName: this.websiteName,
    url: this.url,
    username: this.username,
    password: decryptedPassword,
    notes: this.notes,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

module.exports = mongoose.model('Password', passwordSchema)
