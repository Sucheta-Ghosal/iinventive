import User from '../models/User.js';
import Innovator from '../models/Innovator.js';
import Startup from '../models/Startup.js';
import Project from '../models/Project.js';

export const registerParticipant = async (req, res) => {
  try {
    const {
      role, username, password, email, phone, 
      title, type, affiliation, description, picture 
    } = req.body;

    let user = await User.findOne({ username });
    
    if (!user) {
      if (!password || !email) {
        return res.status(400).json({ message: 'Password and email are entirely required for brand new identities.' });
      }
      
      const emailExists = await User.findOne({ 'contact.email': email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email address is already explicitly registered to another User.' });
      }

      user = await User.create({
        username,
        password,
        contact: { email, phone },
        role
      });

      if (role === 'Innovator') {
        await Innovator.create({ user: user._id, projects: [] });
      } else if (role === 'Startup') {
        await Startup.create({ user: user._id, projects: [] });
      } else {
         return res.status(400).json({ message: 'Invalid generic role provided for this generic participant.' });
      }
    } else {
      if (user.role !== role) {
        return res.status(400).json({ message: `Provided username strictly belongs to the explicit role [${user.role}], incompatible with [${role}].` });
      }
    }

    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slugExists = await Project.findOne({ slug });
    if (slugExists) {
        slug = slug + '-' + Math.floor(Math.random() * 1000);
    }

    const project = await Project.create({
      title, slug, type, affiliation, description, picture: picture ? [picture] : [], userId: user._id
    });

    if (role === 'Innovator') {
      await Innovator.updateOne({ user: user._id }, { $push: { projects: project._id } });
    } else if (role === 'Startup') {
      await Startup.updateOne({ user: user._id }, { $push: { projects: project._id } });
    }

    res.status(201).json({ message: 'Innovation Registered Successfully safely bridging constraints!', project });
  } catch (error) {
    res.status(500).json({ message: 'Server Fatal Error', error: error.message });
  }
};
