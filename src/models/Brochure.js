import mongoose from 'mongoose';

const BrochureSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a brochure title'],
  },
  image: {
    type: String,
  },
  description: {
      type: String
  }
}, { strict: false });

export default mongoose.models.Brochure || mongoose.model('Brochure', BrochureSchema);
