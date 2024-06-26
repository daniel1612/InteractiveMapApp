import axios from 'axios';
import { FIREBASE_API_KEY } from '@env';

// API key for Firebase
const API_KEY = FIREBASE_API_KEY;

/**
 * Authenticates a user with Firebase
 * @param mode - The authentication mode ('signUp' or 'signInWithPassword')
 * @param email - The user's email
 * @param password - The user's password
 * @returns A promise that resolves to an object containing the token and userId
 * @throws An error if the authentication fails
 */
async function authenticate(mode: string, email: string, password: string): Promise<{ token: string, userId: string }> {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  try {
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    return {
      token: response.data.idToken,
      userId: response.data.localId,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // Handle specific error responses from Firebase
      switch (error.response?.status) {
        case 400:
          throw new Error('Invalid email or password.');
        case 403:
          throw new Error('Access forbidden. Please try again.');
        default:
          throw new Error('An unknown error occurred. Please try again.');
      }
    } else {
      throw new Error('An error occurred. Please check your network connection and try again.');
    }
  }
}

/**
 * Creates a new user with the provided email and password
 * @param email - The user's email
 * @param password - The user's password
 * @returns A promise that resolves to an object containing the token and userId
 */
export function createUser(email: string, password: string): Promise<{ token: string, userId: string }> {
  return authenticate('signUp', email, password);
}

/**
 * Log in a user with the provided email and password
 * @param email - The user's email
 * @param password - The user's password
 * @returns A promise that resolves to an object containing the token and userId
 */
export function login(email: string, password: string): Promise<{ token: string, userId: string }> {
  return authenticate('signInWithPassword', email, password);
}

/**
 * Updates the user's password
 * @param token - The user's authentication token
 * @param newPassword - The new password
 * @returns A promise that resolves to the response data
 * @throws An error if the password update fails
 */
export const updatePassword = async (token: string, newPassword: string) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`;

  try {
    const response = await axios.post(url, {
      idToken: token,
      password: newPassword,
      returnSecureToken: true,
    });

    return response.data;
  } catch (error) {
    throw new Error('Failed to update password');
  }
};
