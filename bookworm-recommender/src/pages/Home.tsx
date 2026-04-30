import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Book, getRecommendedBooks, getAllBooks } from '../services/bookService';
import { Star, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const BookCard: React.FC<{ book: Book, delay: number }> = ({ book, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all flex flex-col group"
  >
    <Link to={`/book/${book.id}`} className="relative block aspect-[2/3] overflow-hidden bg-gray-100">
      <img 
        src={book.coverUrl} 
        alt={book.title} 
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
    </Link>
    <div className="p-4 flex flex-col flex-1">
      <div className="text-xs font-medium text-blue-600 mb-1">{book.category}</div>
      <Link to={`/book/${book.id}`} className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
        {book.title}
      </Link>
      <div className="text-sm text-gray-500 mb-3">{book.author}</div>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-amber-500 font-medium">
          <Star className="w-4 h-4 fill-current" />
          <span>{book.averageRating.toFixed(1)}</span>
          <span className="text-gray-400 font-normal text-xs ml-1">({book.reviewCount})</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Home() {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [trending, setTrending] = useState<Book[]>([]);

  useEffect(() => {
    async function loadData() {
      const recs = await getRecommendedBooks(user?.uid);
      setRecommended(recs);

      const all = getAllBooks();
      const top = [...all].sort((a, b) => b.averageRating - a.averageRating).slice(0, 10);
      setTrending(top);
    }
    loadData();
  }, [user]);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-3xl p-8 md:p-16 text-white text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Discover Your Next <span className="text-blue-400">Great Read</span>
          </h1>
          <p className="text-lg text-blue-100/90 leading-relaxed max-w-xl mx-auto">
            Personalized book recommendations based on your unique taste. Join our community of readers and explore thousands of books.
          </p>
          {!user && (
            <Link to="/login" className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-sm">
              <BookOpen className="w-5 h-5" />
              Start Reading Today
            </Link>
          )}
        </div>
      </section>

      {/* Recommended Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold tracking-tight">
            {user ? 'Selected For You' : 'Popular Recommendations'}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {recommended.map((book, i) => (
            <BookCard key={book.id} book={book} delay={i * 0.05} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="bg-gray-100 -mx-4 px-4 py-12 md:-mx-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {trending.slice(0, 5).map((book, i) => (
              <BookCard key={book.id} book={book} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
