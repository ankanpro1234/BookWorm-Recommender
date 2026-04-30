import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Book, searchBooks } from '../services/bookService';
import { Search as SearchIcon, Star } from 'lucide-react';

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<Book[]>([]);

  useEffect(() => {
    if (q) {
      setResults(searchBooks(q));
    } else {
      setResults([]);
    }
  }, [q]);

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center gap-3 pb-6 border-b">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <SearchIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Search Results</h1>
          <p className="text-gray-500 text-sm">Showing results for "{q}"</p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <SearchIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No books found</h2>
          <p className="text-gray-500">We couldn't find any books matching your search. Try different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map(book => (
            <div key={book.id} className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all flex flex-col group">
              <Link to={`/book/${book.id}`} className="relative block aspect-[2/3] overflow-hidden bg-gray-100">
                <img src={book.coverUrl} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" alt={book.title} loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <div className="text-xs font-medium text-blue-600 mb-1">{book.category}</div>
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
      )}
    </div>
  );
}
