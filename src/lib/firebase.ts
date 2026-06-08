import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  collection, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  getDocs,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// Operational Types for Firestore Error Reporting
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
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Global Custom Error Handler complying with ABAC Zero-Trust Specification
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Detailed Info:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation Directive
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

// Broad Generic Synchronizers
export function handleSubscribeCollection<T>(
  collectionName: string, 
  onUpdate: (data: T[]) => void,
  sortField?: string,
  sortDir: 'asc' | 'desc' = 'asc'
) {
  const ref = collection(db, collectionName);
  const q = sortField ? query(ref, orderBy(sortField, sortDir)) : ref;

  return onSnapshot(q, (snapshot) => {
    const items: T[] = [];
    snapshot.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() } as T);
    });
    onUpdate(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  });
}

export function handleSubscribeDoc<T>(
  collectionName: string, 
  docId: string, 
  onUpdate: (data: T | null) => void
) {
  const ref = doc(db, collectionName, docId);
  return onSnapshot(ref, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      onUpdate(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `${collectionName}/${docId}`);
  });
}

export async function handleSetDoc(collectionName: string, docId: string, data: any) {
  const ref = doc(db, collectionName, docId);
  try {
    const cleanedData = { ...data };
    // Keep the id field so that Firestore security rules (which mandate data.id is string) validate successfully
    await setDoc(ref, cleanedData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
  }
}

export async function handleUpdateDoc(collectionName: string, docId: string, data: any) {
  const ref = doc(db, collectionName, docId);
  try {
    await updateDoc(ref, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${collectionName}/${docId}`);
  }
}

export async function handleDeleteDoc(collectionName: string, docId: string) {
  const ref = doc(db, collectionName, docId);
  try {
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
  }
}
