import mongoose from 'mongoose';
import User from './User.js';

const vcSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
    validate: {
      validator: async function(v) {
        const user = await User.findById(v);
        return user && user.role === 'VC';
      },
      message: 'Referenced User must have the VC role'
    }
  },
  about: {
    type: String,
    required: true,
    maxlength: 5000
  },
  picture: {
    type: String
  }
}, {
  timestamps: true
});

const VC = mongoose.model('VC', vcSchema);
export default VC;
