import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    email: { 
      type: String, 
      required: true,
      unique: true
    },
    phone: { 
      type: String 
    }
  },
  role: {
    type: String,
    enum: ['VC', 'Innovator', 'Startup'],
    required: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
