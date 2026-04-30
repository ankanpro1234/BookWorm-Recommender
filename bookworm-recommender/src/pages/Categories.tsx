import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooksByCategory, getAllBooks } from '../services/bookService';
import { BookOpen, Star } from 'lucide-react';

const CATEGORIES = [
  "Fiction", "Mystery", "Sci-Fi", "Fantasy", "Romance", 
  "Thriller", "Non-Fiction", "Biography", "History", "Self-Help"
];

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const books = getBooksByCategory(activeCategory);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Explore Categories</h1>
        <p className="text-lg text-gray-600">Discover new genres and find your next favorite book from our curated collections.</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center pb-8 border-b border-gray-100">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm
              ${activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-4">
        {books.map(book => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all flex flex-col group">
            <Link to={`/book/${book.id}`} className="relative block aspect-[2/3] overflow-hidden bg-gray-100">
              <img src={book.coverUrl} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt={book.title} loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </Link>
            <div className="p-4 flex flex-col flex-1">
              <Link to={`/book/${book.id}`} className="font-semibold text-gray-900 line-clamp-1 hover:text-blue-600">{book.title}</Link>
              <div className="text-sm text-gray-500 mb-2">{book.author}</div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-amber-500 font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{book.averageRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
