import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: [
      'Health Care', 
      'Materials Science', 
      'Earth Sciences', 
      'Artificial Intelligence', 
      'Semiconductor Technology & Chip Design'
    ],
    required: true
  },
  picture: [{
    type: String
  }],
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  affiliation: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
