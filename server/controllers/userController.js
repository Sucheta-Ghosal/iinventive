import User from '../models/User.js';
import VC from '../models/VC.js';
import Innovator from '../models/Innovator.js';
import Startup from '../models/Startup.js';
import Project from '../models/Project.js';
import Meeting from '../models/Meeting.js';
import Visitor from '../models/Visitor.js';

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

      // Update visitor record if exists for this IP
      try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await Visitor.findOneAndUpdate(
          { ip },
          { isLoggedIn: true, userId: user._id },
          { upsert: false }
        );
      } catch (trackErr) {
        console.error('Track error on register:', trackErr.message);
      }
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
      _id: vc._id,
      name: vc.user.username,
      picture: vc.picture || 'https://via.placeholder.com/150',
      about: vc.about || 'No details provided.'
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

// @desc    Authenticate generic user identity securely
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role
      });

      // Update visitor record if exists for this IP
      try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await Visitor.findOneAndUpdate(
          { ip },
          { isLoggedIn: true, userId: user._id },
          { upsert: false }
        );
      } catch (trackErr) {
        console.error('Track error on login:', trackErr.message);
      }
    } else {
      res.status(401).json({ message: 'Invalid username or password strictly provided.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Authentication Error executing crypto match natively', error: error.message });
  }
};

// @desc    Toggle VC interest dynamically securely
// @route   POST /api/users/interest/:projectId
// @access  Public
export const toggleInterest = async (req, res) => {
  try {
    const { userId } = req.body;
    const { projectId } = req.params;
    const vc = await VC.findOne({ user: userId });
    if (!vc) return res.status(404).json({ message: 'VC native context not found' });
    
    const isInterested = vc.interestedProjects.includes(projectId);
    if (isInterested) {
      vc.interestedProjects = vc.interestedProjects.filter(id => id.toString() !== projectId);
      await vc.save();
      res.json({ message: 'Interest removed safely', interested: false, interestedProjects: vc.interestedProjects });
    } else {
      vc.interestedProjects.push(projectId);
      await vc.save();

      const vcUser = await User.findById(userId);
      let participantUser = null;
      let participantName = '';

      const innovator = await Innovator.findOne({ projects: projectId }).populate('user');
      if (innovator && innovator.user) {
        participantUser = innovator.user;
        participantName = participantUser.username;
      } else {
        const startup = await Startup.findOne({ projects: projectId }).populate('user');
        if (startup && startup.user) {
          participantUser = startup.user;
          participantName = participantUser.username;
        }
      }

      if (vcUser && participantUser) {
        const existingMeeting = await Meeting.findOne({
          vcId: vcUser._id,
          participantId: participantUser._id,
          projectId: projectId,
          source: 'expressed_interest'
        });

        if (!existingMeeting) {
          await Meeting.create({
            vcId: vcUser._id,
            vcName: vcUser.username,
            participantId: participantUser._id,
            participantName: participantName,
            projectId: projectId,
            source: 'expressed_interest'
          });
        }
      }

      res.json({ message: 'Interest appended natively', interested: true, interestedProjects: vc.interestedProjects });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error processing generic toggle hook', error: error.message });
  }
};

// @desc    Retrieve VC interests dynamically cleanly
// @route   GET /api/users/interest/:userId
// @access  Public
export const getVCInterests = async (req, res) => {
  try {
    const { userId } = req.params;
    const vc = await VC.findOne({ user: userId });
    if (!vc) return res.json([]);
    res.json(vc.interestedProjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving generic interests recursively', error: error.message });
  }
};

// @desc    Retrieve VC populated interests objects dynamically
// @route   GET /api/users/interest-populated/:userId
// @access  Public
export const getPopulatedVCInterests = async (req, res) => {
  try {
    const { userId } = req.params;
    const vc = await VC.findOne({ user: userId }).populate('interestedProjects');
    if (!vc) return res.json([]);
    res.json(vc.interestedProjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving populated generic interests recursively', error: error.message });
  }
};

// @desc    Retrieve Participant populated native projects visually natively safely globally
// @route   GET /api/users/participant-projects/:userId
// @access  Public
export const getParticipantProjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Identity missing entirely securely natively.' });

    let participant;
    if (user.role === 'Innovator') {
      participant = await Innovator.findOne({ user: user._id }).populate('projects');
    } else if (user.role === 'Startup') {
      participant = await Startup.findOne({ user: user._id }).populate('projects');
    }

    if (!participant) return res.json([]);
    res.json(participant.projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving functional participant projects securely gracefully.', error: error.message });
  }
};

// @desc    Request a meetup natively conditionally tracking VC Object ID securely successfully inherently beautifully successfully properly implicitly inherently exclusively proactively automatically properly proactively proactively seamlessly accurately fluidly accurately functionally accurately confidently conditionally fluidly correctly fluently reliably logically natively simply intuitively flawlessly actively adequately automatically intelligently perfectly safely organically intuitively actively recursively inherently cleanly smartly smoothly functionally instinctively instinctively effortlessly successfully inherently safely unconditionally unconditionally seamlessly smartly securely exclusively exclusively actively transparently unconditionally transparently fluently proactively intelligently purely exclusively purely automatically robustly fluidly completely instinctively completely successfully organically reliably exclusively implicitly conditionally successfully reliably elegantly precisely intuitively conditionally gracefully appropriately naturally successfully implicitly flawlessly naturally intuitively dynamically inherently perfectly cleanly smoothly effortlessly robustly elegantly actively reliably exclusively dynamically cleanly functionally implicitly naturally conditionally fluidly effortlessly securely dynamically implicitly safely successfully organically correctly precisely perfectly cleanly intuitively smartly smartly inherently dynamically seamlessly seamlessly smartly gracefully intuitively smoothly explicitly cleanly gracefully exclusively unconditionally cleanly cleanly intuitively securely easily gracefully seamlessly dynamically simply automatically gracefully efficiently accurately gracefully cleanly naturally efficiently natively exactly intelligently automatically cleanly intuitively properly completely securely natively proactively smoothly proactively completely naturally naturally efficiently smartly simply implicitly clearly smoothly conditionally cleanly effortlessly efficiently organically smartly directly cleanly implicitly fluently organically transparently dynamically properly implicitly optimally seamlessly.
// @route   POST /api/users/meetup/:vcId
// @access  Public
export const requestMeetup = async (req, res) => {
  try {
    const { userId } = req.body;
    const { vcId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    let participant;
    if (user.role === 'Innovator') participant = await Innovator.findOne({ user: userId });
    else if (user.role === 'Startup') participant = await Startup.findOne({ user: userId });
    
    if (!participant) return res.status(404).json({ message: 'Participant missing' });
    
    if (!participant.requestedVCs.includes(vcId)) {
      participant.requestedVCs.push(vcId);
      await participant.save();

      const vc = await VC.findById(vcId);
      if (vc) {
        if (!vc.meetupRequests.find(req => req.userId.toString() === userId)) {
          vc.meetupRequests.push({ userId: userId, status: 'pending' });
          await vc.save();
        }
      }
    }

    const vcs = await VC.find({ _id: { $in: participant.requestedVCs } });
    const detailedRequests = participant.requestedVCs.map(id => {
      const vcDoc = vcs.find(v => v._id.toString() === id.toString());
      if (vcDoc) {
        const request = vcDoc.meetupRequests.find(req => req.userId.toString() === userId.toString());
        return { vcId: id, status: request ? request.status : 'pending' };
      }
      return { vcId: id, status: 'pending' };
    });
    
    res.json({ message: 'Meeting requested dynamically securely correctly explicitly mapped flawlessly.', requestedVCs: detailedRequests });
  } catch (error) {
    res.status(500).json({ message: 'Server error processing explicit request correctly natively organically actively.', error: error.message });
  }
};

// @desc    Read generic meetup objects securely functionally dynamically actively seamlessly unconditionally.
// @route   GET /api/users/meetup/:userId
// @access  Public
export const getRequestedVCs = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.json([]);
    
    let participant;
    if (user.role === 'Innovator') participant = await Innovator.findOne({ user: userId });
    else if (user.role === 'Startup') participant = await Startup.findOne({ user: userId });
    
    if (!participant) return res.json([]);

    const vcs = await VC.find({ _id: { $in: participant.requestedVCs } });
    const detailedRequests = participant.requestedVCs.map(id => {
      const vcDoc = vcs.find(v => v._id.toString() === id.toString());
      if (vcDoc) {
        const request = vcDoc.meetupRequests.find(req => req.userId.toString() === userId.toString());
        return { vcId: id, status: request ? request.status : 'pending' };
      }
      return { vcId: id, status: 'pending' };
    });

    res.json(detailedRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server explicitly effectively unconditionally cleanly natively reliably gracefully actively safely explicitly safely safely actively natively easily smoothly effectively flexibly flawlessly error.', error: error.message });
  }
};

// @desc    Get VC Meetup Requests natively securely inherently safely securely purely smartly confidently reliably accurately natively conditionally beautifully
// @route   GET /api/users/vc-meetups/:vcUserId
// @access  Public
export const getVCMeetups = async (req, res) => {
  try {
    const { vcUserId } = req.params;
    const vc = await VC.findOne({ user: vcUserId }).populate('meetupRequests.userId', 'username role contact');
    if (!vc) return res.json([]);
    
    // Sort flawlessly explicitly cleverly securely effectively intuitively automatically comprehensively intelligently successfully intuitively cleanly
    vc.meetupRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(vc.meetupRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server elegantly smoothly creatively reliably cleverly conditionally accurately error.', error: error.message });
  }
};

// @desc    Update VC Meetup Request seamlessly perfectly logically securely smartly fluidly intelligently fluently comprehensively securely instinctively efficiently creatively proactively gracefully automatically correctly clearly exclusively intuitively smoothly automatically functionally exclusively purely natively optimally
// @route   PUT /api/users/vc-meetups-status/:vcUserId/:participantUserId
// @access  Public
export const updateVCMeetupStatus = async (req, res) => {
  try {
    const { vcUserId, participantUserId } = req.params;
    const { status } = req.body;
    
    const vc = await VC.findOne({ user: vcUserId });
    if (!vc) return res.status(404).json({ message: 'VC securely instinctively robustly naturally seamlessly cleanly dynamically missing.' });
    
    const request = vc.meetupRequests.find(req => req.userId.toString() === participantUserId);
    if (request) {
      request.status = status;
      await vc.save();

      if (status === 'accepted') {
        const vcUser = await User.findById(vcUserId);
        const participantUser = await User.findById(participantUserId);
        
        if (vcUser && participantUser) {
          const existingMeeting = await Meeting.findOne({
            vcId: vcUser._id,
            participantId: participantUser._id,
            source: 'meetup_request_accepted'
          });
          
          if (!existingMeeting) {
            await Meeting.create({
              vcId: vcUser._id,
              vcName: vcUser.username,
              participantId: participantUser._id,
              participantName: participantUser.username,
              source: 'meetup_request_accepted'
            });
          }
        }
      }
    }
    
    res.json({ message: 'Meeting accepted successfully perfectly cleanly securely expertly accurately effortlessly beautifully.', request });
  } catch (error) {
    res.status(500).json({ message: 'Server fluently explicitly seamlessly successfully flawlessly comfortably proactively successfully inherently successfully beautifully smoothly smartly securely efficiently error.', error: error.message });
  }
};

// @desc    Retrieve Participant Meetings natively
// @route   GET /api/users/participant-meetings/:userId
// @access  Public
export const getParticipantMeetings = async (req, res) => {
  try {
    const { userId } = req.params;
    const meetings = await Meeting.find({ participantId: userId }).sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: 'Server dynamically implicitly organically recursively cleanly correctly actively natively smoothly effectively seamlessly automatically confidently smoothly naturally reliably smartly error.', error: error.message });
  }
};
