import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book, getBookById, getReviewsForBook, addReview, logReadHistory } from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { Star, Check, BookOpen, User, Calendar } from 'lucide-react';
import { db } from '../services/firebaseService';
import { doc, getDoc } from 'firebase/firestore';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isRead, setIsRead] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      const b = getBookById(id);
      if (b) setBook(b);
      else navigate('/404');
    }
  }, [id, navigate]);

  useEffect(() => {
    async function loadData() {
      if (id) {
        const revs = await getReviewsForBook(id);
        // fetch user profiles for reviews
        const enriched = await Promise.all(revs.map(async (r: any) => {
          try {
            const u = await getDoc(doc(db, 'users', r.userId));
            return { ...r, user: u.exists() ? u.data() : { displayName: 'Anonymous' } };
          } catch(e) { 
            return { ...r, user: { displayName: 'Anonymous'} }; 
          }
        }));
        setReviews(enriched.sort((a,b) => b.createdAt - a.createdAt));
      }
      if (user && id) {
        getDoc(doc(db, `users/${user.uid}/history`, id)).then(s => setIsRead(s.exists()));
      }
    }
    loadData();
  }, [id, user]);

  if (!book) return null;

  const handleMarkRead = async () => {
    if (!user) return navigate('/login');
    await logReadHistory(user.uid, book.id);
    setIsRead(true);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmittingReview(true);
    const reviewId = `${book.id}_${user.uid}_${Date.now()}`;
    await addReview(reviewId, book.id, user.uid, rating, comment);
    setComment('');
    setRating(5);
    // Optimistic UI update
    setReviews([{
      id: reviewId, userId: user.uid, bookId: book.id, rating, comment, createdAt: Date.now(), user: { displayName: user.displayName || 'You' }
    }, ...reviews]);
    setSubmittingReview(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 max-w-[320px] mx-auto shrink-0">
          <img src={book.coverUrl} alt={book.title} className="w-full rounded-2xl shadow-xl lg:hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1 space-y-6">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full tracking-wide">
            {book.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">{book.title}</h1>
          <p className="text-xl text-gray-600">by <span className="font-medium text-gray-900">{book.author}</span></p>
          
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-current" />
              <span className="text-2xl font-bold">{book.averageRating.toFixed(1)}</span>
              <span className="text-gray-500 mt-1">({book.reviewCount} reviews)</span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed text-lg pb-6 border-b border-gray-100">
            {book.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
               onClick={handleMarkRead}
               disabled={isRead}
               className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 
               ${isRead ? 'border-green-200 bg-green-50 text-green-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md border-transparent text-gray-700'}`}
            >
              {isRead ? <Check className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
              {isRead ? 'Read' : 'Mark as Read'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Write a Review</h2>
          {user ? (
            <form onSubmit={submitReview} className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1.5 rounded transition-colors ${rating >= star ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400'}`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                <textarea
                  required
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[120px] resize-none"
                  placeholder="What did you think about this book?"
                />
              </div>
              <button 
                disabled={submittingReview}
                className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          ) : (
            <div className="bg-gray-50 border rounded-2xl p-6 text-center">
              <p className="text-gray-600 mb-4">Please sign in to share your thoughts.</p>
              <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">Sign In</button>
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Community Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 bg-white p-8 rounded-2xl border text-center">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{review.user?.displayName || 'Anonymous'}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
