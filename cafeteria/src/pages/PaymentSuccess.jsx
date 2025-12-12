// cafeteria/src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const [message, setMessage] = useState("Procesando la confirmación de tu pedido...");
    const [isSuccess, setIsSuccess] = useState(false);

    const status = searchParams.get('collection_status'); 
    const paymentId = searchParams.get('payment_id');
    const externalReference = searchParams.get('external_reference'); 

    const styles = {
        container: {
            padding: '40px 20px',
            maxWidth: '600px',
            margin: '80px auto',
            backgroundColor: 'rgba(30, 30, 30, 0.9)',
            color: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
            textAlign: 'center',
        },
        title: (success) => ({
            fontSize: '2.5rem',
            color: success ? '#4CAF50' : '#FF4136', 
            marginBottom: '15px',
        }),
        button: {
            backgroundColor: '#E4A11B', 
            color: '#1E1E1E',
            padding: '12px 25px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '30px',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
        }
    };

    useEffect(() => {
        if (status === 'approved') {
            setMessage(`¡Tu pago fue aprobado! El ID de transacción es: ${paymentId}.`);
            setIsSuccess(true);
            clearCart(); 

        } else if (status === 'pending' || status === 'in_process') {
            setMessage("Tu pago está pendiente de aprobación. Recibirás una confirmación por correo.");
            setIsSuccess(false);
        } else if (status === 'rejected' || status === 'cancelled') {
            setMessage("Hubo un problema con tu pago. Por favor, intenta de nuevo.");
            setIsSuccess(false);
        } else {
            setMessage("Gracias por tu pedido. Si el pago fue reciente, espera la confirmación por correo.");
            setIsSuccess(true); 
        }
    }, [status, paymentId, clearCart]);

    return (
        <div style={styles.container}>
            <h2 style={styles.title(isSuccess)}>
                {isSuccess ? '✅ Pago Exitoso' : '⚠️ Estado del Pago'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#ccc' }}>{message}</p>
            
            {status !== 'approved' && <p style={{ color: '#aaa', marginTop: '20px' }}>Tu carrito se mantuvo intacto. Puedes regresar al checkout para intentarlo de nuevo.</p>}

            <a href="/" style={styles.button}>
                Volver a la Tienda
            </a>
        </div>
    );
}