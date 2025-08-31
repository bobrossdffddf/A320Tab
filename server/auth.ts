import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import type { Request } from 'express';
import { storage } from './storage';

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET) {
  throw new Error('Discord OAuth credentials not configured');
}

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-app.replit.app/auth/discord/callback'
    : 'http://localhost:5000/auth/discord/callback',
  scope: ['identify'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = await storage.getUserByDiscordId(profile.id);

    if (!user) {
      // Create new user
      user = await storage.createUser({
        discordId: profile.id,
        username: profile.username,
        avatar: profile.avatar,
        role: 'pilot', // Default role
      });
    } else {
      // Update user info
      user = await storage.updateUser(user.id, {
        username: profile.username,
        avatar: profile.avatar,
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUserById(id);
    done(null, user ? user : false);
  } catch (error) {
    done(error, false);
  }
});

export function requireAuth(req: Request, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}

export function requireRole(role: string) {
  return (req: Request, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = req.user as any;
    if (user.role !== role && user.role !== 'atc') { // ATC can access everything
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
}

export default passport;