import User from '../models/User.js';
import VC from '../models/VC.js';

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
