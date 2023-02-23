import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import config from '../config';

const { BCRYPT_SALT } = config;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, BCRYPT_SALT);
  this.password = hash;

  return next();
});

const User = mongoose.model('User', userSchema);

export default User;
