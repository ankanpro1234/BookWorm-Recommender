import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import BookDetail from './pages/BookDetail';
import Categories from './pages/Categories';
import Search from './pages/Search';
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/profile', element: <Profile /> },
      { path: '/book/:id', element: <BookDetail /> },
      { path: '/categories', element: <Categories /> },
      { path: '/search', element: <Search /> },
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
