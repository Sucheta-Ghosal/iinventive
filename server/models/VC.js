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
  },
  interestedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  meetupRequests: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const VC = mongoose.model('VC', vcSchema);
export default VC;
