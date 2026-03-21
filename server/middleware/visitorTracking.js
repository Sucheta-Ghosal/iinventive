import Visitor from '../models/Visitor.js';
import useragent from 'useragent';
import crypto from 'crypto';

export const trackVisitor = async (req, res, next) => {
  // Avoid tracking static files if they were served here (though they aren't)
  // or only track specific paths. For now, track all API calls and the root.
  
  try {
    // 1. Determine User Status and Metadata
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // 2. Get or create Visitor ID from cookie (optional backup)
    let visitorId = req.cookies.visitorId || `v-${ip.replace(/[^a-zA-Z0-9]/g, '')}`;
    if (!req.cookies.visitorId) {
      res.cookie('visitorId', visitorId, { 
        maxAge: 365 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: 'lax'
      });
    }

    const agent = useragent.parse(req.headers['user-agent']);
    const browser = `${agent.family} ${agent.major}.${agent.minor}`;
    const device = agent.device.family === 'Other' ? 'Desktop' : agent.device.family;
    const path = req.originalUrl || req.path;

    // 3. Extract User Identity if available from multiple potential locations
    const userId = 
      req.body.userId || 
      req.query.userId || 
      req.params.userId || 
      req.params.vcUserId || 
      req.params.participantUserId ||
      req.headers['x-user-id'];
    
    const isLoggedIn = !!userId;

    // 4. Update or Create Visitor Record
    let visitor = await Visitor.findOne({ ip });

    if (visitor) {
      // Update existing visitor
      visitor.ip = ip;
      visitor.browser = browser;
      visitor.device = device;
      
      // Update pagesVisited if this is a "new" page in this request cycle
      if (!visitor.pagesVisited.includes(path)) {
        visitor.pagesVisited.push(path);
      }

      if (isLoggedIn) {
        visitor.isLoggedIn = true;
        visitor.userId = userId;
      }
      
      await visitor.save();
    } else {
      // Create new visitor record
      await Visitor.create({
        visitorId,
        ip,
        browser,
        device,
        pagesVisited: [path],
        visitTime: new Date(),
        isLoggedIn,
        userId: userId || null
      });
    }

  } catch (err) {
    // We don't want tracking errors to crash the app
    console.error('Visitor Tracking Error:', err.message);
  }

  next();
};
