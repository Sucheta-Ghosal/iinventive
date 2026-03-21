import mongoose from 'mongoose';
import User from './User.js';

const innovatorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
    validate: {
      validator: async function(v) {
        const user = await User.findById(v);
        return user && user.role === 'Innovator';
      },
      message: 'Referenced User must have the Innovator role'
    }
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

const Innovator = mongoose.model('Innovator', innovatorSchema);
export default Innovator;
