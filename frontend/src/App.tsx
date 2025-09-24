import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import StoreProvider from './store/StoreProvider';
import Layout from './components/Layout';
import { RootState, AppDispatch } from './store';
import { fetchFavorites } from './store/slices/favoritesSlice';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import OrderConfirmation from './pages/OrderConfirmation';
import Favorites from './pages/Favorites';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <StoreProvider>
            <AuthProvider>
                <CartProvider>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/products/:id" element={<ProductDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />

                            <Route path="/checkout" element={
                                <ProtectedRoute>
                                    <Checkout />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            <Route path="/orders" element={
                                <ProtectedRoute>
                                    <Orders />
                                </ProtectedRoute>
                            } />
                            <Route path="/orders/:id" element={
                                <ProtectedRoute>
                                    <OrderDetail />
                                </ProtectedRoute>
                            } />
                            <Route path="/order-confirmation" element={
                                <ProtectedRoute>
                                    <OrderConfirmation />
                                </ProtectedRoute>
                            } />
                            <Route path="/favorites" element={
                                <ProtectedRoute>
                                    <Favorites />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </Layout>
                </CartProvider>
            </AuthProvider>
        </StoreProvider>
    );
}

export default App;
