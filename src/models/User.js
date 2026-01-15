import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    default: 'user',
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
