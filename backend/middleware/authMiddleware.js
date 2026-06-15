import admin from 'firebase-admin';
import User from '../models/User.js';

// Initialize Firebase Admin (Assuming you have a serviceAccountKey.json or similar logic elsewhere, for now just placeholder)
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault()
//   });
// }

export const protect = async (req, res, next) => {
  try {
    // For development, we might just pass the firebaseUid directly in the header 'x-auth-uid' to simplify testing without full firebase setup
    let firebaseUid = req.headers['x-auth-uid'];
    
    if (!firebaseUid && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      // const decodedToken = await admin.auth().verifyIdToken(token);
      // firebaseUid = decodedToken.uid;
      
      // Temporary simple token reading for dev
      firebaseUid = token;
    }

    if (!firebaseUid) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(401).json({ message: 'User not found in database' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user ? req.user.role : 'None'} is not authorized to access this route` });
    }
    next();
  };
};
