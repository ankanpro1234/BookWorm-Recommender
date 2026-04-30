import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  const handleLogin = async () => {
    await login();
    navigate('/profile');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-inner">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm">Sign in to your account to get personalized book recommendations and manage your library.</p>
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full relative flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 absolute left-4" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
