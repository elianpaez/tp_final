import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import TuLogo from '../assets/logo.png'; 

function Navbar() {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  const { currentUser, logout } = useAuth();

  const ADMINS = ["vitecoffee@gmail.com"]; 
  const esAdmin = currentUser && ADMINS.includes(currentUser.email);

  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0); 
  
  const handleScroll = () => {
    setLastScrollY(window.scrollY); 
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      navigate((location) => {
          setIsMobileMenuOpen(false);
          return location;
      });
      return () => { window.removeEventListener('scroll', handleScroll); };
    }
  }, [lastScrollY]); 

  const APP_NAME = "Vite Coffee"; 
  const LOGO_SRC = TuLogo; 

  const handleLogout = async () => {
    try {
      await logout(); 
      setIsMobileMenuOpen(false);
      navigate('/login'); 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión.');
    }
  };

  const handleLinkClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth <= 768;


  const styles = {
    header: {
      backgroundColor: window.scrollY > 50 ? 'rgba(56, 34, 15, 0.95)' : 'transparent',
      boxShadow: window.scrollY > 50 ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none',
      padding: '0px 20px', 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'fixed', 
      top: 0,
      width: '100%',
      zIndex: 10,
      transition: 'background-color 0.3s, box-shadow 0.3s', 
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      zIndex: 15, 
    },
    logoImage: {
        height: '80px', 
        filter: 'brightness(2.0) invert(100%)', 
        objectFit: 'contain'
    },
    mobileMenuButton: {
        fontSize: '2rem',
        background: 'none',
        border: 'none',
        color: '#FFFFFF', 
        cursor: 'pointer',
        zIndex: 15,
    },
    mobileDrawer: {
        position: 'fixed',
        top: 0, 
        right: 0,
        width: isMobile ? '70%' : '300px', 
        height: '100%',
        backgroundColor: '#252525',
        boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.5)',
        transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 12, 
        padding: '80px 20px 20px 20px', 
        display: 'block', 
    },
    mobileNavLink: {
        display: 'block',
        padding: '15px 0',
        color: '#E0E0E0',
        textDecoration: 'none',
        borderBottom: '1px solid #444',
        fontSize: '1.1rem',
        transition: 'color 0.2s',
    },
    mobileCloseButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      fontSize: '2rem',
      background: 'none',
      border: 'none',
      color: '#D4A373',
      cursor: 'pointer',
    },
    cartIcon: {
        color: '#FFFFFF',
        fontSize: '1.5rem',
        marginRight: '10px',
    },
    loginButton: {
      backgroundColor: '#A0522D',
      padding: '8px 15px',
      borderRadius: '50px',
      color: 'white',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };


  return (
    <>
      <header style={styles.header}>
        <div style={styles.logo}>
          <Link to="/" style={{display: 'flex', alignItems: 'center'}}>
            <img src={LOGO_SRC} alt="Logo" style={styles.logoImage} /> 
          </Link>
        </div>
        
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            
            <Link to="/checkout" style={styles.cartIcon}>
               🛒 ({itemCount})
            </Link>
            <button 
                style={styles.mobileMenuButton}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? '✕' : '☰'}
            </button>
        </div>
      </header>
      <div style={styles.mobileDrawer}>
        
        <button 
            style={styles.mobileCloseButton}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            ✕
        </button>

        <Link to="/menu" style={styles.mobileNavLink} onClick={() => handleLinkClick('/menu')}>Menú</Link>
        {esAdmin && (
          <>
            <Link to="/admin" style={styles.mobileNavLink} onClick={() => handleLinkClick('/admin')}>Panel Admin</Link>
            <Link to="/admin/agregar-producto" style={styles.mobileNavLink} onClick={() => handleLinkClick('/admin/agregar-producto')}>Agregar Producto</Link>
            <Link to="/admin/listar-productos" style={styles.mobileNavLink} onClick={() => handleLinkClick('/admin/listar-productos')}>Listar Productos</Link>
          </>
        )}
        
        {currentUser ? (
          <>
             <Link to="/profile" style={styles.mobileNavLink} onClick={() => handleLinkClick('/profile')}>Mi Perfil</Link>
             <Link to="/orders" style={styles.mobileNavLink} onClick={() => handleLinkClick('/orders')}>Mis Compras</Link>
             <div 
                style={{...styles.mobileNavLink, color: '#FF6347'}} 
                onClick={handleLogout}
             >
                Cerrar Sesión
             </div>
          </>
        ) : (
          <Link to="/login" style={styles.mobileNavLink} onClick={() => handleLinkClick('/login')}>
             Iniciar Sesión
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;

