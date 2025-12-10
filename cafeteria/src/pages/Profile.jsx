import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Profile() {
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    
    const [profileData, setProfileData] = useState({
        name: currentUser?.displayName || 'Usuario de Cafetería',
        email: currentUser?.email || 'email@ejemplo.com',
        phone: 'No configurado'
    });

    const handleSave = () => {
        
        setIsEditing(false);
        alert('Perfil actualizado (simulado).');
    };

    if (!currentUser) {
        return <main style={styles.container}><h2 style={styles.title}>Mi Perfil</h2><p>Por favor, inicia sesión para ver tu perfil.</p></main>;
    }

    const styles = {
        container: { padding: '40px', maxWidth: '600px', margin: '40px auto', backgroundColor: '#252525', borderRadius: '12px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)', color: '#D4A373' },
        title: { fontSize: '2.5rem', color: '#FFFFFF', borderBottom: '2px solid #6F4E37', paddingBottom: '10px', marginBottom: '30px' },
        infoItem: { marginBottom: '15px', padding: '10px', backgroundColor: '#1E1E1E', borderRadius: '8px', borderLeft: '3px solid #6F4E37' },
        label: { fontWeight: 'bold', display: 'block', color: '#A0A0A0', marginBottom: '5px' },
        value: { fontSize: '1.1rem', color: '#FFFFFF' },
        input: { padding: '10px', width: '100%', border: '1px solid #444', backgroundColor: '#1E1E1E', color: '#FFFFFF', borderRadius: '4px', marginTop: '5px' },
        button: { padding: '10px 20px', backgroundColor: '#6F4E37', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px', marginRight: '10px' }
    };

    return (
        <main style={styles.container}>
            <h2 style={styles.title}>Mi Perfil</h2>
            
            {isEditing ? (
                <div>
                    <div style={styles.infoItem}>
                        <label style={styles.label}>Nombre:</label>
                        <input style={styles.input} value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                    </div>
                   
                    <button style={styles.button} onClick={handleSave}>Guardar Cambios</button>
                    <button style={{...styles.button, backgroundColor: '#444'}} onClick={() => setIsEditing(false)}>Cancelar</button>
                </div>
            ) : (
                <div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Email:</span>
                        <span style={styles.value}>{profileData.email}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Nombre:</span>
                        <span style={styles.value}>{profileData.name}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Teléfono:</span>
                        <span style={styles.value}>{profileData.phone}</span>
                    </div>
                    <button style={styles.button} onClick={() => setIsEditing(true)}>Editar Perfil</button>
                </div>
            )}
        </main>
    );
}