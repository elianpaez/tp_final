import React from 'react';
import { Link } from 'react-router-dom';

export function Home() {
    const styles = {
        main: {
            padding: '0',
            textAlign: 'center',
            backgroundColor: '#121212',
            color: '#E0E0E0',
        },
        hero: {
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'url(https://i.pinimg.com/736x/94/69/1f/94691f308486d9f0dff0c5a485f24301.jpg) center/cover no-repeat',
            position: 'relative',
            padding: '40px 20px',
        },
        overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
        },
        content: {
            zIndex: 1,
            position: 'relative',
        },
        title: {
            fontSize: '4rem',
            margin: '0',
            color: '#FFFFFF',
            fontWeight: '900',
            letterSpacing: '2px',
            textShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
        },
        subtitle: {
            fontSize: '1.5rem',
            margin: '20px 0 40px',
            color: '#D4A373',
            fontWeight: '300',
        },
        button: {
            padding: '15px 35px',
            fontSize: '1.2rem',
            backgroundColor: '#A0522D',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
        }
    };

    return (
        <main style={styles.main}>
            <div style={styles.hero}>
                <div style={styles.overlay}></div>
                <div style={styles.content}>
                    <h1 style={styles.title}>La Excelencia del Café</h1>
                    <p style={styles.subtitle}>Descubre nuestro menú de especialidad y pastelería artesanal.</p>
                    <Link to="/menu" style={styles.button}>
                        Ver Menú Completo
                    </Link>
                </div>
            </div>

            <section style={{ padding: '80px 20px', backgroundColor: '#181818' }}>
                <h2 style={{ color: '#D4A373', fontSize: '2rem', marginBottom: '40px' }}>Nuestras Especialidades</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                    <div style={{ width: '250px', padding: '20px', backgroundColor: '#252525', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)' }}>
                        <h3 style={{ color: '#FFFFFF' }}>Café Latte</h3>
                        <p style={{ color: '#A0A0A0' }}>El equilibrio perfecto entre espresso y leche vaporizada.</p>
                    </div>
                    <div style={{ width: '250px', padding: '20px', backgroundColor: '#252525', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)' }}>
                        <h3 style={{ color: '#FFFFFF' }}>Croissant</h3>
                        <p style={{ color: '#A0A0A0' }}>Hecho en casa, crujiente y con mantequilla.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}