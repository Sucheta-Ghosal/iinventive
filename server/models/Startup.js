import mongoose from 'mongoose';
import User from './User.js';

const startupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
    validate: {
      validator: async function(v) {
        const user = await User.findById(v);
        return user && user.role === 'Startup';
      },
      message: 'Referenced User must have the Startup role'
    }
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  requestedVCs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VC'
  }]
}, {
  timestamps: true
});

const Startup = mongoose.model('Startup', startupSchema);
export default Startup;
