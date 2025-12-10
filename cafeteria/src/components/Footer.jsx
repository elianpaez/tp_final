import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const styles = {
        footer: {
            backgroundColor: '#38220f', 
            color: '#A0A0A0',
            padding: '40px 30px 20px',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.4)',
            marginTop: 'auto', 
        },
        contentWrapper: {
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '30px',
            borderBottom: '1px solid #4A3326',
            paddingBottom: '20px',
            marginBottom: '20px',
        },
        section: {
            minWidth: '150px',
        },
        title: {
            fontSize: '1.2rem',
            color: '#D4A373', // Tono dorado para los títulos
            marginBottom: '15px',
            borderBottom: '1px solid #6F4E37',
            paddingBottom: '5px',
        },
        link: {
            display: 'block',
            color: '#A0A0A0',
            textDecoration: 'none',
            marginBottom: '8px',
            transition: 'color 0.2s',
        },
        linkHover: {
            color: '#FFFFFF',
        },
        copyright: {
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#6F4E37',
        },
        logoLink: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#D4A373',
            marginBottom: '15px',
            display: 'block',
        }
    };

    const currentYear = new Date().getFullYear();

    // Simulación de Logo (para mantener el logo del navbar)
    const APP_NAME = "Vitte Coffee"; 
    const LOGO_URL = "http://localhost:5173/src/assets/logo.png?t=1764945516372"; 


    return (
        <footer style={styles.footer}>
            <div style={styles.contentWrapper}>
                
                
                <div style={styles.section}>
                    <Link to="/" style={styles.logoLink}>
                        <img src={LOGO_URL} alt="Logo" style={{height: '35px', marginRight: '10px', verticalAlign: 'middle', filter: 'brightness(2.0) invert(100%)'}} 
                            onError={(e) => { e.target.onerror = null; e.target.src = "http://localhost:5173/src/assets/logo.png?t=1764945516372" }} />
                        {APP_NAME}
                    </Link>
                    <p>Dirección: Calle Falsa 123, Ciudad.</p>
                    <p>Teléfono: (+54) 11 4554-5445</p>
                    <p>Email: vitecoffee@gmail.com</p>
                </div>
                
                
                <div style={styles.section}>
                    <h4 style={styles.title}>Navegación</h4>
                    <Link to="/menu" style={styles.link} onMouseEnter={(e) => e.target.style.color = styles.linkHover.color} onMouseLeave={(e) => e.target.style.color = styles.link.color}>Menú</Link>
                    <Link to="/checkout" style={styles.link} onMouseEnter={(e) => e.target.style.color = styles.linkHover.color} onMouseLeave={(e) => e.target.style.color = styles.link.color}>Carrito</Link>
                    <Link to="/login" style={styles.link} onMouseEnter={(e) => e.target.style.color = styles.linkHover.color} onMouseLeave={(e) => e.target.style.color = styles.link.color}>Iniciar Sesión</Link>
                </div>

                
                <div style={styles.section}>
                    <h4 style={styles.title}>Mi Cuenta</h4>
                    <Link to="/profile" style={styles.link} onMouseEnter={(e) => e.target.style.color = styles.linkHover.color} onMouseLeave={(e) => e.target.style.color = styles.link.color}>Mi Perfil</Link>
                    <Link to="/orders" style={styles.link} onMouseEnter={(e) => e.target.style.color = styles.linkHover.color} onMouseLeave={(e) => e.target.style.color = styles.link.color}>Mis Compras</Link>
                    <Link to="/legal" style={styles.link} onMouseEnter={(e) => e.target.style.color = styles.linkHover.color} onMouseLeave={(e) => e.target.style.color = styles.link.color}>Política de Privacidad</Link>
                </div>

                
                <div style={styles.section}>
                    <h4 style={styles.title}>Síguenos</h4>
                    <Link to="https://www.instagram.com/vitte_coffee/" style={styles.link} onMouseEnter={(e) => e.target.style.color = styles.linkHover.color} onMouseLeave={(e) => e.target.style.color = styles.link.color}>Instagram</Link>
                    <p>Facebook</p>
                    <p>Twitter</p>
                </div>
            </div>

            <div style={styles.copyright}>
                &copy; {currentYear} {APP_NAME}. Todos los derechos reservados.
            </div>
        </footer>
    );
}

export default Footer;