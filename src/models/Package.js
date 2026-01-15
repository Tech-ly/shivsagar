import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a package name'],
  },
  state: {
    type: String,
  },
  category: {
    type: String,
  },
  duration: {
    type: String,
  },
  price: {
    type: Number,
  },
  features: {
    type: [String],
  },
  image: {
    type: String,
  },
}, { strict: false }); // Allow other fields if any

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);
