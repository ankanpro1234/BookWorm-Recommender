import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} BookWorm Recommender. All rights reserved.</p>
        <p className="mt-2">Discover your next favorite book based on what you love.</p>
      </div>
    </footer>
  );
}
