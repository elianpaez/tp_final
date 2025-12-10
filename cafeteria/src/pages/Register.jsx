import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await registerWithEmail(formData.email, formData.password);
      
      alert('Registro exitoso. ¡Bienvenido!');
      navigate('/');
    } catch (firebaseError) {
      if (firebaseError.code === 'auth/email-already-in-use') {
          setError('El correo electrónico ya está en uso.');
      } else if (firebaseError.code === 'auth/weak-password') {
          setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
          setError('Error al registrar. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <main style={{ padding: '20px' }}>
      <h2>Registro de Usuario</h2>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
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
          Registrarse
        </button>
      </form>
      <p style={{ marginTop: '15px' }}>
        ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
      </p>
    </main>
  );
}