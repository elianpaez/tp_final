import React from 'react';
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

import Admin from "./pages/Admin.jsx";
import AddProduct from "./pages/AddProduct.jsx";

import ListarProductos from "./pages/ListarProductos";
import EditarProducto from "./pages/EditarProducto";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          
          <Navbar />
          
          <div style={{ height: '100px', transparent: 'true' }}>
          </div>

          <div style={{ flex: 1, }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<h1>404 - Página No Encontrada</h1>} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/agregar-producto" element={<AddProduct />} />
              <Route path="/admin/listar-productos" element={<ListarProductos />} />
              <Route path="/admin/editar-producto/:id" element={<EditarProducto />} />
            </Routes>
          </div>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;