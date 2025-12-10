import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await loginWithEmail(formData.email, formData.password);
      alert('Inicio de sesión exitoso. ¡Bienvenido!');
      navigate('/');
    } catch (firebaseError) {
      setError('Credenciales inválidas. Revisa tu email y contraseña.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      setError('Fallo al iniciar sesión con Google.');
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {}
      <button 
        onClick={handleGoogleLogin} 
        style={{ backgroundColor: '#DB4437', color: 'white', border: 'none', padding: '10px 20px', marginBottom: '20px', cursor: 'pointer' }}
      >
        Login con Google 🚀
      </button>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ marginBottom: '5px', display: 'block' }}>Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ marginBottom: '5px', display: 'block' }}>Contraseña:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#6F4E37', color: 'white', border: 'none', cursor: 'pointer' }}>
          Iniciar Sesión
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </main>
  );
}