import booksData from '../data/books.json';
import { db, auth } from './firebaseService';
import { collection, doc, query, where, getDocs, setDoc, updateDoc, deleteDoc, serverTimestamp, orderBy } from 'firebase/firestore';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  coverUrl: string;
  price: number;
  averageRating: number;
  reviewCount: number;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
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
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Memory-based book data
export const getAllBooks = (): Book[] => {
  return booksData as Book[];
}

export const getBookById = (id: string): Book | undefined => {
  return (booksData as Book[]).find(b => b.id === id);
}

export const getBooksByCategory = (category: string): Book[] => {
  return (booksData as Book[]).filter(b => b.category === category);
}

export const searchBooks = (searchTerm: string): Book[] => {
  if (!searchTerm) return [];
  const lowerTerm = searchTerm.toLowerCase();
  return (booksData as Book[]).filter(b => 
    b.title.toLowerCase().includes(lowerTerm) || 
    b.author.toLowerCase().includes(lowerTerm)
  ).slice(0, 50); // limit to 50 results
}

export const getRecommendedBooks = async (userId: string | undefined): Promise<Book[]> => {
  let all = [...(booksData as Book[])];
  
  // Mix based on high rating
  all.sort((a, b) => b.averageRating - a.averageRating);
  
  if (!userId) {
    return all.slice(0, 12); // generic recommendations
  }

  // Get user preferences
  try {
    const userRef = doc(db, 'users', userId);
    // Usually we would fetch user preferences here to filter
    const historyPath = `users/${userId}/history`;
    const histSnap = await getDocs(collection(db, `users/${userId}/history`));
    const readBookIds = histSnap.docs.map(d => d.data().bookId);
    
    // Example: If user read books, recommend matching categories
    if (readBookIds.length > 0) {
      const readBooks = readBookIds.map(id => getBookById(id)).filter(Boolean) as Book[];
      const favoriteCategories = readBooks.map(b => b.category);
      const uniqueCats = Array.from(new Set(favoriteCategories));
      
      const personalized = all.filter(b => uniqueCats.includes(b.category) && !readBookIds.includes(b.id));
      if (personalized.length > 0) {
        return personalized.slice(0, 12);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/history`);
  }

  return all.slice(0, 12);
}

export const getReviewsForBook = async (bookId: string) => {
  const path = 'reviews';
  try {
    const q = query(collection(db, path), where('bookId', '==', bookId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export const addReview = async (reviewId: string, bookId: string, userId: string, rating: number, comment: string) => {
  const path = `reviews/${reviewId}`;
  try {
    await setDoc(doc(db, 'reviews', reviewId), {
      userId,
      bookId,
      rating,
      comment,
      createdAt: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export const logReadHistory = async (userId: string, bookId: string) => {
  const path = `users/${userId}/history`;
  try {
    const historyId = `${bookId}`;
    await setDoc(doc(db, path, historyId), {
      bookId,
      readAt: Date.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// purchaseBook has been removed

