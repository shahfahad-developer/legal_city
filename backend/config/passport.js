const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const db = require('../db');
const { generateToken } = require('../utils/token');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      passReqToCallback: true, // Enable request object access
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Desired role from frontend; default to 'user'
        const desiredRole = req.query.role || req.session.oauthRole || 'user';
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) {
          return done(null, false, { message: 'No email returned from Google' });
        }

        // Look up by email in both tables to enforce one-role-per-email
        let userUser = await db('users').where({ email }).first();
        let userLawyer = await db('lawyers').where({ email }).first();

        let roleToUse = desiredRole;
        let userRecord = null;
        let tableName = desiredRole === 'lawyer' ? 'lawyers' : 'users';

        // If exists in both (data inconsistency), prefer existing user account
        if (userUser && userLawyer) {
          console.warn('Email exists in both users and lawyers tables for', email);
          roleToUse = 'user';
          tableName = 'users';
          userRecord = userUser;
        } else if (desiredRole === 'user') {
          if (userLawyer && !userUser) {
            // Force login as existing lawyer to prevent cross-role login
            roleToUse = 'lawyer';
            tableName = 'lawyers';
            userRecord = userLawyer;
          } else if (userUser) {
            roleToUse = 'user';
            tableName = 'users';
            userRecord = userUser;
          }
        } else if (desiredRole === 'lawyer') {
          if (userUser && !userLawyer) {
            // Force login as existing user to prevent cross-role login
            roleToUse = 'user';
            tableName = 'users';
            userRecord = userUser;
          } else if (userLawyer) {
            roleToUse = 'lawyer';
            tableName = 'lawyers';
            userRecord = userLawyer;
          }
        }

        // If account exists with password, block OAuth login for safety
        if (userRecord && userRecord.password && userRecord.password !== '') {
          return done(null, false, { message: 'Account already exists with this email. Please login with your password.' });
        }

        // Create new record if none exists in either table
        if (!userRecord) {
          const insertData = {
            name: profile.displayName,
            email,
            email_verified: 1,
            google_id: profile.id,
            password: '', // OAuth users don't need password
            avatar: (profile.photos && profile.photos[0] && profile.photos[0].value) || null,
            profile_completed: 0, // Require setup
          };

          if (roleToUse === 'lawyer') {
            insertData.is_verified = 0; // Pending until submit later or completion
            insertData.lawyer_verified = 0; // Admin review required
          } else {
            insertData.role = 'user';
            insertData.is_verified = 0; // Pending until submit later or completion
          }

          const [id] = await db(tableName).insert(insertData);
          userRecord = await db(tableName).where({ id }).first();
        } else {
          // Ensure google_id is set and email marked verified
          if (!userRecord.google_id) {
            await db(tableName).where({ id: userRecord.id }).update({
              google_id: profile.id,
              email_verified: 1,
            });
            userRecord = await db(tableName).where({ id: userRecord.id }).first();
          }
        }

        const token = generateToken(userRecord, roleToUse);
        console.log(`Google OAuth - Role used: ${roleToUse}, email: ${email}`);
        done(null, { user: userRecord, token, role: roleToUse });
      } catch (error) {
        console.error('Google OAuth error:', error);
        done(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const role = (req.query && req.query.role) || 'user'; // default to user
        const tableName = role === 'lawyer' ? 'lawyers' : 'users';

        // Check if user/lawyer already exists
        let user = await db(tableName).where({ email }).first();

        if (user && user.password && user.password !== '') {
          // Account exists with password, don't allow OAuth login
          return done(null, false, { message: 'Account already exists with this email. Please login with your password.' });
        }

        if (!user) {
          const insertData = {
            name: profile.displayName,
            email,
            role: 'user', // Default to user for Facebook
            email_verified: 1,
            facebook_id: profile.id,
            password: '', // OAuth users don't need password
            profile_completed: 0, // Mark as incomplete
            is_verified: 0, // Pending until submit later or completion
          };

          const [id] = await db('users').insert(insertData);
          user = await db('users').where({ id }).first();
        } else {
          // Update facebook_id if not set
          if (!user.facebook_id) {
            await db('users').where({ id: user.id }).update({
              facebook_id: profile.id,
              email_verified: 1,
            });
            user = await db('users').where({ id: user.id }).first();
          }
        }

        const token = generateToken(user, 'user');
        done(null, { user, token });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
