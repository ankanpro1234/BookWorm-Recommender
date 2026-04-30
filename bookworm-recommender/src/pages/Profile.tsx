import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Book, getBookById } from '../services/bookService';
import { LogOut, BookOpen, Clock, Settings, User } from 'lucide-react';
import { db } from '../services/firebaseService';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const { user, userProfile, logout } = useAuth();
  const [history, setHistory] = useState<(Book & { readAt: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      if (!user) return;
      try {
        const historySnap = await getDocs(query(collection(db, `users/${user.uid}/history`), orderBy('readAt', 'desc')));

        const histItems = historySnap.docs.map(doc => {
          const data = doc.data();
          const book = getBookById(data.bookId);
          return book ? { ...book, readAt: data.readAt } : null;
        }).filter(Boolean) as (Book & { readAt: number })[];

        setHistory(histItems);
      } catch (err) {
        console.error("Error fetching history", err);
      } finally {
        setLoading(false);
      }
    }
    loadUserData();
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border shadow-sm">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-10 h-10" />
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{user.displayName || 'Reader'}</h1>
          <p className="text-gray-500">{user.email}</p>
          <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
            {userProfile?.preferences?.map((pref: string) => (
              <span key={pref} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
                {pref}
              </span>
            ))}
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-100 font-medium">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        {/* Reading History */}
        <section className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b">
            <Clock className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold tracking-tight">Reading History</h2>
          </div>
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl w-full" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>You haven't read any books yet.</p>
              <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">Discover books</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map(item => (
                <Link key={item.id} to={`/book/${item.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 hover:border-gray-200">
                  <img src={item.coverUrl} className="w-16 h-20 object-cover rounded shadow-sm" alt={item.title} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.author}</p>
                    <p className="text-xs text-gray-400 mt-1">Read on {new Date(item.readAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
