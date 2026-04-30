import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Search, User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { searchBooks, Book } from '../../services/bookService';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.length > 2) {
      setSearchResults(searchBooks(val));
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-600">
          <BookOpen className="w-6 h-6" />
          <span>BookWorm</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm outline-none"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setIsSearching(true)}
            />
          </div>
          
          {searchTerm.length > 2 && isSearching && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border overflow-hidden z-50 p-2 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center px-3 py-2 border-b mb-2">
                <span className="text-xs font-semibold text-gray-500">Search Results</span>
                <button onClick={clearSearch} className="text-xs text-blue-600 hover:underline">Close</button>
              </div>
              {searchResults.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">No books found.</div>
              ) : (
                searchResults.slice(0, 5).map(book => (
                  <Link 
                    key={book.id} 
                    to={`/book/${book.id}`}
                    onClick={clearSearch}
                    className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <img src={book.coverUrl} className="w-10 h-14 object-cover rounded shadow-sm" alt={book.title} />
                    <div>
                      <div className="text-sm font-medium line-clamp-1">{book.title}</div>
                      <div className="text-xs text-gray-500">{book.author}</div>
                    </div>
                  </Link>
                ))
              )}
              {searchResults.length > 5 && (
                <Link to={`/search?q=${encodeURIComponent(searchTerm)}`} onClick={clearSearch} className="block text-center text-sm text-blue-600 hover:bg-blue-50 py-2 mt-2 rounded">
                  View all results
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <Link to="/categories" className="hover:text-blue-600 transition-colors hidden sm:block">Categories</Link>
          
          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <Link to="/profile" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline-block truncate max-w-[120px]">{user.displayName || 'Profile'}</span>
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} className="text-gray-400 hover:text-red-500 p-2">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 shadow-sm transition-colors text-sm font-semibold">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
