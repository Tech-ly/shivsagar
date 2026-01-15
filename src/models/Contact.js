import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
