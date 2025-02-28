import { adminAuth } from '../config/firebase.admin';

export const verifyToken = async (token: string) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
};

export const getUserById = async (uid: string) => {
  try {
    const user = await adminAuth.getUser(uid);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('User not found');
  }
}; 