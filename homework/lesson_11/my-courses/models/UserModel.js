import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  methods: {
    getSignedJWT() {
      return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
    },
    async matchPassword(password) {
      return await bcrypt.compare(String(password), this.password);
    },
    getResetPasswordToken() {
      const resetToken = crypto.randomBytes(20).toString('hex');
      // Set expire - 10 min
      this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
      // Hash token and set to the field
      this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      return resetToken;
    },
  },
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Sign JWT
// UserSchema.methods.getSignedJWT = function() {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// Match user password
// UserSchema.methods.matchPassword = async function(password) {
//   return await bcrypt.compare(password, this.password);
// };

// Generate and hash password token
// UserSchema.method('getResetPasswordToken', function() {
//   const resetToken = crypto.randomBytes(20).toString('hex');
//   // Set expire - 10 min
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//   // Hash token and set to the field
//   this.resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');
//   return resetToken;
// });

export const UserModel = mongoose.model('User', UserSchema);

