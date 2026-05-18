const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    email: {
      type:     String,
      required: true,
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    passwordHash: {
      type:     String,
      required: true,
    },
    name: {
      type:     String,
      required: true,
      trim:     true,
    },
    role: {
      type:    String,
      enum:    ['cashier', 'manager'],
      default: 'cashier',
    },
  },
  { timestamps: true },
);

// email index is created automatically by unique: true
UserSchema.index({ role: 1 });

module.exports = model('User', UserSchema);
