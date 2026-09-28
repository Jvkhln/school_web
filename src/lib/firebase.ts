import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App for Authentication
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider with Google Sheets and Google Drive scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/spreadsheets');
googleProvider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory token cache (DO NOT store in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If user is logged into Firebase Auth but cached token expired or reloaded,
        // we can prompt for sign-in or wait until user clicks Google sign-in.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Direct token request using Google Identity Services (GIS) as fallback when Firebase Auth domain is not whitelisted
export const requestGisToken = async (silent = false): Promise<{ user: User; accessToken: string } | null> => {
  if (typeof window === 'undefined') return null;
  const gsi = (window as any).google?.accounts?.oauth2;
  const clientId = (firebaseConfig as any).oAuthClientId;
  if (!gsi || !clientId) return null;

  return new Promise((resolve, reject) => {
    try {
      const client = gsi.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file email profile openid',
        prompt: silent ? '' : undefined,
        callback: async (resp: any) => {
          if (resp.error) {
            if (silent) {
              resolve(null);
            } else {
              reject(new Error(resp.error_description || resp.error));
            }
            return;
          }
          if (resp.access_token) {
            cachedAccessToken = resp.access_token;
            try {
              const uRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${resp.access_token}` }
              });
              const uJson = await uRes.json();
              const mockUser: any = {
                uid: uJson.sub || 'gis-user',
                email: uJson.email || 'user@google.com',
                displayName: uJson.name || uJson.email || 'Google Хэрэглэгч',
                photoURL: uJson.picture || ''
              };
              resolve({ user: mockUser, accessToken: resp.access_token });
            } catch {
              resolve({
                user: { uid: 'gis-user', email: 'user@google.com', displayName: 'Google Хэрэглэгч' } as any,
                accessToken: resp.access_token
              });
            }
          } else {
            resolve(null);
          }
        },
        error_callback: (err: any) => {
          if (silent) {
            resolve(null);
          } else {
            reject(err);
          }
        }
      });
      client.requestAccessToken();
    } catch (err) {
      if (silent) {
        resolve(null);
      } else {
        reject(err);
      }
    }
  });
};

export const trySilentTokenRefresh = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    return await requestGisToken(true);
  } catch {
    return null;
  }
};

// Sign in with Google Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string; cancelled?: boolean } | null> => {
  if (isSigningIn) {
    // Prevent multiple concurrent popup calls
    return { user: null as any, accessToken: '', cancelled: true };
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google Sheets хандалтын токен авч чадсангүй.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    const isCancelled =
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/popup-closed-by-user' ||
      error?.message?.includes('cancelled-popup-request') ||
      error?.message?.includes('popup-closed-by-user');

    if (isCancelled) {
      // Normal user cancellation - do not treat as an error or log to console.error
      return { user: null as any, accessToken: '', cancelled: true };
    }

    const isUnauthorizedDomain =
      error?.code === 'auth/unauthorized-domain' ||
      error?.message?.includes('unauthorized-domain');

    if (isUnauthorizedDomain) {
      // Try GIS fallback
      try {
        const gisResult = await requestGisToken();
        if (gisResult) {
          return gisResult;
        }
      } catch (gisErr) {
        console.warn('GIS fallback notice:', gisErr);
      }
    }

    console.error('Google Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const invalidateAccessToken = () => {
  cachedAccessToken = null;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
