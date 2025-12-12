import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Checkout } from './pages/Checkout';

import { Profile } from './pages/Profile';
import { Orders } from './pages/Orders';

import { CartProvider } from './context/CartContext'; 
import { AuthProvider } from './context/AuthContext'; 

import { uploadProductsOnce } from "./utils/uploadProducts";

import AdminDashboard from "./Dashboard.jsx";

import PaymentSuccess from './pages/PaymentSuccess.jsx';

function App() {

    useEffect(() => {
        uploadProductsOnce();
    }, []);

    return (
        <div className="App">
            <AuthProvider>
                <CartProvider>
                    
                    <Navbar />

                    <div style={{ height: '100px' }}></div>

                    <div style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/menu" element={<Menu />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/payment-success" element={<PaymentSuccess />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
                        </Routes>
                    </div>

                    <Footer />
                </CartProvider>
            </AuthProvider>
        </div>
    );
}

export default App;
