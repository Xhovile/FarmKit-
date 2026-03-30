import { auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  
  const errorString = JSON.stringify(errInfo);
  console.error('Firestore Error: ', errorString);
  
  // Re-throw as a JSON string so ErrorBoundary can parse it
  throw new Error(errorString);
}

export function getCleanErrorMessage(code: string, lang: string = 'en'): string {
  const messages: Record<string, Record<string, string>> = {
    'en': {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/requires-recent-login': 'Please log in again to perform this action.',
      'name-required': 'Please enter your full name.',
      'password-too-short': 'Password must be at least 6 characters.',
      'passwords-dont-match': 'Passwords do not match.',
      'default': 'An error occurred. Please try again.'
    },
    'ny': {
      'auth/user-not-found': 'Sitipeza akaunti ndi imelo iyi.',
      'auth/wrong-password': 'Mawu achinsinsi olakwika.',
      'auth/email-already-in-use': 'Imeloyi idalembetsedwa kale.',
      'auth/invalid-email': 'Chonde lembani imelo yolondola.',
      'auth/weak-password': 'Mawu achinsinsi akhale osachepera 6.',
      'auth/network-request-failed': 'Vuto la netiweki. Chonde onani intaneti yanu.',
      'auth/too-many-requests': 'Mwayesa kambiri. Chonde yesani pambuyo pake.',
      'auth/user-disabled': 'Akauntiyi idatsekedwa.',
      'auth/requires-recent-login': 'Chonde lowaninso kuti mupange izi.',
      'name-required': 'Chonde lembani dzina lanu lonse.',
      'password-too-short': 'Mawu achinsinsi akhale osachepera 6.',
      'passwords-dont-match': 'Mawu achinsinsi sakufanana.',
      'default': 'Cholakwika zachitika. Chonde yesaninso.'
    }
  };

  const langMessages = messages[lang] || messages['en'];
  return langMessages[code] || langMessages['default'];
}
