import User from '../models/User.js';
import VC from '../models/VC.js';
import Innovator from '../models/Innovator.js';
import Startup from '../models/Startup.js';
import Project from '../models/Project.js';

// @desc    Register a new VC
// @route   POST /api/users/vc
// @access  Public
export const registerVC = async (req, res) => {
  try {
    const { username, password, email, phone, about, picture } = req.body;

    // Check if user already exists based on standard unique keys
    const userExists = await User.findOne({ 
      $or: [{ username }, { 'contact.email': email }] 
    });

    if (userExists) {
      return res.status(400).json({ message: 'User with that username or email already exists' });
    }

    // Create Base Identity Document strictly defaulting the VC enum 
    const user = await User.create({
      username,
      password,
      contact: { email, phone },
      role: 'VC'
    });

    if (user) {
      // Securely instantiate relational nested data dynamically against Identity Object ID
      const vc = await VC.create({
        user: user._id,
        about,
        picture
      });

      res.status(201).json({
        message: 'VC Registered Successfully',
        userId: user._id,
        vcId: vc._id
      });
    } else {
      res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Verification Error', error: error.message });
  }
};

// @desc    Get all registered VCs
// @route   GET /api/users/vcs
// @access  Public
export const getVCs = async (req, res) => {
  try {
    const vcs = await VC.find({}).populate('user', 'username');
    const optimizedVCs = vcs.map(vc => ({
      name: vc.user.username,
      picture: vc.picture || 'https://via.placeholder.com/150'
    }));
    res.json(optimizedVCs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching VCs', error: error.message });
  }
};

// @desc    Check if username exists natively
// @route   GET /api/users/check/:username
// @access  Public
export const checkUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      let affiliation = '';
      if (user.role === 'Innovator') {
        const innovator = await Innovator.findOne({ user: user._id }).populate('projects');
        if (innovator && innovator.projects.length > 0) {
          affiliation = innovator.projects[0].affiliation;
        }
      } else if (user.role === 'Startup') {
        const startup = await Startup.findOne({ user: user._id }).populate('projects');
        if (startup && startup.projects.length > 0) {
          affiliation = startup.projects[0].affiliation;
        }
      }
      res.json({ exists: true, role: user.role, affiliation });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error checking username dynamically', error: error.message });
  }
};
