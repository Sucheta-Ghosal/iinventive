import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true,
    unique: true
  },
  browser: {
    type: String
  },
  device: {
    type: String
  },
  pagesVisited: [{
    type: String
  }],
  visitTime: {
    type: Date,
    default: Date.now
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
