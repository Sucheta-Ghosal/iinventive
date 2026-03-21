import Project from '../models/Project.js';
import Innovator from '../models/Innovator.js';
import Startup from '../models/Startup.js';

// @desc    Fetch all projects by category
// @route   GET /api/projects/category/:category
// @access  Public
export const getProjectsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const projects = await Project.find({ type: category });
    
    if (projects) {
      res.json(projects);
    } else {
      res.status(404).json({ message: 'No projects found for this category' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch single project by slug
// @route   GET /api/projects/profile/:slug
// @access  Public
export const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    
    if (project) {
      // Create a shallow copy to add the owner ID for backward compatibility
      const projectData = project.toObject();
      if (!projectData.userId) {
        const innovator = await Innovator.findOne({ projects: project._id });
        if (innovator) {
          projectData.userId = innovator.user;
        } else {
          const startup = await Startup.findOne({ projects: project._id });
          if (startup) projectData.userId = startup.user;
        }
      }
      res.json(projectData);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get active categories that have projects
// @route   GET /api/projects/active-categories
// @access  Public
export const getActiveCategories = async (req, res) => {
  try {
    const activeCategories = await Project.distinct('type');
    res.json(activeCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving categories dynamically', error: error.message });
  }
};
