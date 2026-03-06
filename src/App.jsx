import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CollectionPage from './components/CollectionPage';
import ProductPage from './components/ProductPage';
import ContactPage from './components/ContactPage';

import PageTransition from './components/PageTransition';

import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import CheckoutPage from './components/CheckoutPage';

import AdminLayout from './components/Admin/AdminLayout';
import AdminLogin from './components/Admin/AdminLogin';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminProducts from './components/Admin/AdminProducts';
import AdminTransactions from './components/Admin/AdminTransactions';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          {/* Global Background Video */}
          <div className="video-background-container">
            <video
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              className="bg-video"
              poster="https://cdn.shopify.com/s/files/1/0809/1690/6265/files/poster_image.jpg"
            >
              <source src="https://cdn.shopify.com/videos/c/o/v/d85ceeac35394732ac03189047656d3c.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="bg-overlay"></div>
          </div>

          <CartDrawer />

          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections/all" element={<CollectionPage />} />
              <Route path="/products/:handle" element={<ProductPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route index element={<AdminDashboard />} />
                </Route>
              </Route>
            </Routes>
          </PageTransition>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
