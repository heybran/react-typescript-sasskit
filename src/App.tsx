import './App.css'
import React from 'react';
import Home from './components/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GitHubAuth } from './components/GithubAuth';

export interface Product {
  sku: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string[];
  isInShoppingBag: boolean;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/auth/github/callback',
    element: <GitHubAuth />
  }
])

export default function App() {
 return (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
 )
}