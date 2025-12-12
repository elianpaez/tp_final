// cafeteria/src/pages/Checkout.jsx

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    collection, 
    addDoc, 
    Timestamp, 
} from 'firebase/firestore'; 
import { useAuth } from '../context/AuthContext';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'; 

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); 
const APP_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID; 

if (import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY) {
    initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, { locale: 'es-AR' });
}

const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const CartItemDisplay = ({ item, increaseQuantity, decreaseQuantity }) => {
    const styles = {
        itemCard: {
            display: 'flex',
            alignItems: 'center',
            padding: '15px 0',
            borderBottom: '1px solid #333',
            marginBottom: '15px',
        },
        itemImage: {
            width: '80px',
            height: '80px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginRight: '20px',
            border: '2px solid #6F4E37',
        },
        itemDetails: {
            flexGrow: 1,
        },
        itemName: {
            fontSize: '1.2rem',
            color: '#FFFFFF',
            marginBottom: '5px',
        },
        itemOptions: {
            fontSize: '0.85rem',
            color: '#A0A0A0',
        },
        quantityControls: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '5px',
        },
        controlButton: {
            padding: '5px 10px',
            backgroundColor: '#4A3326',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
        itemPrice: {
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#E4A11B', 
            marginLeft: '20px',
            minWidth: '80px',
            textAlign: 'right',
        },
    };

    const optionText = item.selectedOptions 
        ? Object.entries(item.selectedOptions).map(([key, value]) => `${key}: ${value}`).join(' | ') 
        : '';

    return (
        <div style={styles.itemCard}>
            <img 
                src={item.imageUrl} 
                alt={item.name} 
                style={styles.itemImage} 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/4A3326/FFFFFF?text=P" }} 
            />
            <div style={styles.itemDetails}>
                <h3 style={styles.itemName}>{(item.name)}</h3>
                {optionText && <p style={styles.itemOptions}>{optionText}</p>}
                
                <div style={styles.quantityControls}>
                    <button style={styles.controlButton} onClick={() => decreaseQuantity(item.itemKey)}>-</button>
                    <span style={{color: '#FFFFFF'}}>{item.quantity}</span>
                    <button style={styles.controlButton} onClick={() => increaseQuantity(item.itemKey)}>+</button>
                </div>
            </div>
            <span style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    );
};

const generateInvoiceEmailHtml = (order) => {
    const orderDate = new Date(order.createdAt.seconds * 1000).toLocaleString('es-AR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const itemsList = order.items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ccc; font-size: 0.9em;">
                ${item.name} 
                ${Object.values(item.options || {}).length > 0 ? `(${Object.values(item.options).join(', ')})` : ''}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ccc; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ccc; text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ccc; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #6F4E37; padding: 20px; border-radius: 8px; background-color: #ffffff; color: #333;">
            <h2 style="color: #4A3326; border-bottom: 2px solid #D4A373; padding-bottom: 10px;">☕ Confirmación de Pedido y Factura</h2>
            <p>¡Hola! Gracias por tu compra.</p>
            
            <h3 style="color: #4A3326; margin-top: 20px;">Detalles de la Factura</h3>
            <p><strong>Número de Pedido:</strong> <span style="color: #6F4E37;">#${order.id.substring(0, 8)}</span></p>
            <p><strong>Fecha del Pedido:</strong> ${orderDate}</p>
            <p><strong>Total Pagado:</strong> <span style="color: #28A745; font-weight: bold; font-size: 1.2em;">$${order.total.toFixed(2)}</span></p>
            <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>

            <h3 style="color: #4A3326; margin-top: 20px;">Artículos del Pedido</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.95em;">
                <thead>
                    <tr style="background-color: #f0f0f0;">
                        <th style="padding: 10px; text-align: left;">Producto</th>
                        <th style="padding: 10px; text-align: center;">Cant.</th>
                        <th style="padding: 10px; text-align: right;">Precio/u</th>
                        <th style="padding: 10px; text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsList}
                </tbody>
            </table>

            <p style="text-align: center; margin-top: 30px; font-size: 0.8em; color: #888;">
                Esta es una confirmación automática. Puedes ver el historial de tus pedidos en la sección "Mis Compras".
            </p>
        </div>
    `;
};

const MercadoPagoButton = ({ cartItems, name, address, setError, setProcessing }) => {
    const totalAmount = calculateTotal(cartItems);

    const [preferenceId, setPreferenceId] = useState(null);

    const handleCreatePreference = async () => {
        setProcessing(true);
        setError(null);
        setPreferenceId(null); 

        try {
            const response = await fetch('http://localhost:5000/api/create-mercadopago-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                        title: item.name,
                        unit_price: item.price,
                        quantity: item.quantity,
                    })),
                    metadata: {
                        customerName: name,
                        deliveryAddress: address,
                        totalAmount: totalAmount,
                    }
                }),
            });

            const data = await response.json();

            if (data.preferenceId) {
                setPreferenceId(data.preferenceId);
            } else {
                setError(data.error || 'Error al obtener la preferencia de Mercado Pago.');
            }
        } catch (err) {
            console.error('Error al iniciar Mercado Pago:', err);
            setError('No se pudo conectar con el servidor de Mercado Pago.');
        } finally {
            setProcessing(false);
        }
    };
    
    useEffect(() => {
        if (totalAmount > 0 && !preferenceId) {
            handleCreatePreference();
        }
    }, [totalAmount, preferenceId]);


    return (
        <div style={{ marginTop: '20px', minHeight: '50px' }}>
            {preferenceId ? (
                <Wallet initialization={{ preferenceId }} />
            ) : (
                <p style={{ color: '#D4A373', textAlign: 'center' }}>
                    Cargando opciones de pago de Mercado Pago...
                </p>
            )}
        </div>
    );
};


const CheckoutForm = ({ totalAmount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    const { currentUser, db } = useAuth();

    const [name, setName] = useState(currentUser?.displayName || '');
    const [address, setAddress] = useState('');
    const [shippingMethod, setShippingMethod] = useState('Retiro en Local'); 
    const [paymentMethod, setPaymentMethod] = useState('Tarjeta');
    
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const totalAmountFloat = parseFloat(totalAmount);
    const firestoreDb = db; 

    useEffect(() => {
        if (totalAmountFloat <= 0 || !stripe || paymentMethod !== 'Tarjeta') return;
        setError(null);

        fetch('http://localhost:5000/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmountFloat }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
            } else {
                setError(data.error || 'Error al iniciar el pago. Verifique el servidor.');
            }
        })
        .catch(() => setError('No se pudo conectar al servidor de pagos. Asegúrate que el backend esté corriendo en :5000'));
    }, [totalAmountFloat, stripe, paymentMethod]);

    const handleSaveOrder = async (paymentIdentifier) => {
    if (!firestoreDb || !currentUser) {
        setMessage({ type: 'error', text: 'Error de autenticación. Por favor, inicia sesión.' });
        return;
    }

    const orderData = {
        userId: currentUser.uid,
        customerName: name,
        deliveryAddress: address,
        shippingMethod: shippingMethod, 
        paymentMethod: paymentMethod,
        items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            options: item.selectedOptions || {},
        })),
        total: totalAmountFloat,
        createdAt: Timestamp.now(),
        status: (paymentMethod === 'Tarjeta' || paymentMethod === 'MercadoPago') ? 'Completado' : 'Pendiente de Pago', 
        paymentIdentifier: paymentIdentifier,
    };

    try {
        const userId = currentUser.uid;

        const ordersCollectionRef = collection(firestoreDb, `artifacts/${APP_ID}/users/${userId}/orders`);
        const docRef = await addDoc(ordersCollectionRef, orderData);

        const orderWithId = { ...orderData, id: docRef.id, createdAt: orderData.createdAt };
        const html = generateInvoiceEmailHtml(orderWithId);

        await fetch("http://localhost:5000/api/send-invoice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: currentUser.email,
                order: orderWithId,
                html: html
            })
        });

        setMessage({
            type: 'success',
            text: (paymentMethod === 'Tarjeta' || paymentMethod === 'MercadoPago') 
                 ? '¡Pedido realizado con éxito! La factura ha sido enviada.' 
                 : `Pedido Guardado. Total $${totalAmountFloat.toFixed(2)}. Revisa tu email para instrucciones de ${paymentMethod}.`,
            invoice: html
        });

    } catch (error) {
        console.error('Error al completar el pedido:', error);
        setMessage({
            type: 'error',
            text: `Error al procesar el pedido: ${error.message}. Por favor, verifica tu conexión.`,
        });
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);
        setMessage(null);

        if (!currentUser) {
            setError('Debes iniciar sesión para realizar una compra.');
            setProcessing(false);
            return;
        }
        
        if (!name || !address) {
            setError('Por favor, completa tu nombre y dirección.');
            setProcessing(false);
            return;
        }

        if (paymentMethod !== 'Tarjeta' && paymentMethod !== 'MercadoPago') {
            try {
                await handleSaveOrder(paymentMethod); 
                clearCart();
            } catch (err) {
                setError(`Error al guardar el pedido ${paymentMethod}: ${err.message}`);
            }
            setProcessing(false);
            return;
        }
        if (paymentMethod === 'MercadoPago') {
            setError('Haz clic en el botón de Mercado Pago que aparece abajo para proceder con el pago.');
            setProcessing(false);
            return;
        }

        if (!stripe || !elements || !clientSecret) {
            setError('Faltan datos de pago o el formulario Stripe no está listo.');
            setProcessing(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: { name: currentUser?.displayName || name, email: currentUser?.email },
            },
        });

        if (confirmError) {
            setError(`Fallo en el pago: ${confirmError.message}`);
        } else if (paymentIntent.status === 'succeeded') {
            await handleSaveOrder(paymentIntent.id);
            clearCart();
        }
        setProcessing(false);
    };

    const styles = {
        formContainer: { 
            marginTop: '30px', 
            padding: '25px', 
            border: '1px solid #6F4E37', 
            margin: '20px auto',
            borderRadius: '8px',
            backgroundColor: 'rgba(28, 28, 28, 0.85)',
            maxWidth: '100%',
        },
        formTitle: {
            fontSize: '1.2rem',
            marginBottom: '15px',
            color: '#D4A373',
        },
        cardElementWrapper: {
            padding: '15px', 
            backgroundColor: '#1E1E1E',
            border: '1px solid #444', 
            borderRadius: '4px', 
            marginBottom: '15px',
        },
        payButton: { 
            width: '100%', 
            padding: '12px', 
            backgroundColor: paymentMethod === 'Tarjeta' ? '#A0522D' : '#E4A11B', 
            color: paymentMethod === 'Tarjeta' ? 'white' : '#1E1E1E', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.2s',
        },
        errorText: { 
            color: 'red', 
            marginTop: '10px', 
            padding: '10px',
            backgroundColor: '#301010',
            borderRadius: '4px',
            marginBottom: '15px',
        },
        cardStyle: {
            base: {
                color: '#FFFFFF',
                fontWeight: '500',
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                '::placeholder': {
                    color: '#A0A0A0',
                },
            },
            invalid: {
                color: '#FF4136',
                iconColor: '#FF4136',
            },
        },
        inputGroup: {
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '15px',
        },
        label: {
            marginBottom: '5px',
            color: '#D4A373',
            fontWeight: 'bold',
        },
        input: {
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #6F4E37',
            backgroundColor: '#333',
            color: '#E0E0E0',
            fontSize: '1rem',
        },
        select: {
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #6F4E37',
            backgroundColor: '#333',
            color: '#E0E0E0',
            fontSize: '1rem',
            appearance: 'none', 
        },
        messageBox: (type) => ({
            padding: '15px',
            borderRadius: '8px',
            marginTop: '20px',
            textAlign: 'center',
            backgroundColor: type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(255, 99, 71, 0.9)', 
            color: 'white',
            fontWeight: 'bold',
        }),
        mockEmailSection: {
            marginTop: '30px',
            padding: '20px',
            backgroundColor: 'rgba(51, 51, 51, 0.8)', 
            borderRadius: '8px',
            border: '1px dashed #D4A373',
        },
        mockEmailTitle: {
            color: '#D4A373',
            fontSize: '1.5rem',
            marginBottom: '10px',
            textAlign: 'center',
        },
        mockEmailContent: {
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '6px',
            color: '#333',
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #ccc',
        },
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={styles.formContainer}>
                <h3 style={styles.formTitle}>Información de Envío</h3>
                
                <div style={styles.inputGroup}>
                    <label htmlFor="name" style={styles.label}>Nombre Completo</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="address" style={styles.label}>Dirección de Envío / Retiro</label>
                    <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="shipping" style={styles.label}>Método de Entrega</label>
                    <select id="shipping" value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} style={styles.select}>
                        <option value="Retiro en Local">Retiro en Local (Gratis)</option>
                        <option value="Envio a Domicilio">Envío a Domicilio (Costo adicional no calculado)</option>
                    </select>
                </div>

                <h3 style={styles.formTitle}>Información de Pago</h3>
                <div style={styles.inputGroup}>
                    <label htmlFor="payment" style={styles.label}>Método de Pago</label>
                    <select id="payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={styles.select}>
                        <option value="Tarjeta">💳 Tarjeta de Crédito / Débito (Stripe)</option>
                        <option value="MercadoPago">💰 Mercado Pago</option>
                        <option value="Efectivo">💵 Efectivo al Retirar</option>
                        <option value="Transferencia">🏦 Transferencia Bancaria (Ver Email)</option>
                    </select>
                </div>
                
                {paymentMethod === 'Tarjeta' && (
                    <div style={styles.cardElementWrapper}>
                        <CardElement options={{ style: styles.cardStyle }} />
                    </div>
                )}

                {paymentMethod === 'MercadoPago' && (
                    <MercadoPagoButton 
                        cartItems={cartItems} 
                        name={name} 
                        address={address} 
                        setError={setError}
                        setProcessing={setProcessing}
                    />
                )}

                {error && <div style={styles.errorText}>{error}</div>}
                
                {paymentMethod !== 'MercadoPago' ? (
                    <button 
                        type="submit" 
                        disabled={processing || (paymentMethod === 'Tarjeta' && (!stripe || !elements || !clientSecret)) || totalAmountFloat <= 0}
                        style={styles.payButton}
                    >
                        {processing 
                            ? "Procesando..." 
                            : (paymentMethod === 'Tarjeta' 
                                ? `Pagar $${totalAmountFloat.toFixed(2)}`
                                : `Finalizar Pedido ($${totalAmountFloat.toFixed(2)})`
                            )
                        }
                    </button>
                ) : (
                    <p style={{textAlign: 'center', color: '#ccc', fontSize: '0.9em', marginTop: '10px'}}>
                        Usa el botón de Mercado Pago de arriba para proceder.
                    </p>
                )}
            </form>

            {message && message.type === 'success' && message.invoice && (
                <div style={styles.mockEmailSection}>
                    <div style={styles.messageBox('success')}>
                        {message.text}
                    </div>
                    <h3 style={styles.mockEmailTitle}>Simulación de Email de Factura</h3>
                    <div 
                        style={styles.mockEmailContent}
                        dangerouslySetInnerHTML={{ __html: message.invoice }} 
                    />
                    <div style={{color: '#D4A373', textAlign: 'center', marginTop: '15px'}}>
                        ¡Verifica tu historial en <Link to="/orders" style={{color: '#E4A11B', textDecoration: 'underline'}}>Mis Compras</Link>!
                    </div>
                </div>
            )}
            {message && message.type === 'error' && (
                <div style={styles.messageBox('error')}>
                    {message.text}
                </div>
            )}
        </>
    );
};

export function Checkout() {
    const { cartItems, increaseQuantity, decreaseQuantity, clearCart } = useCart();
    const totalAmount = calculateTotal(cartItems);
    const styles = {
        mainContainer: {
            padding: '40px 20px',
            maxWidth: '900px', 
            margin: '40px auto',
            backgroundColor: 'rgba(30, 30, 30, 0.85)', 
            color: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
        },
        pageTitle: {
            fontSize: '2.5rem',
            borderBottom: '2px solid #6F4E37',
            paddingBottom: '10px',
            marginBottom: '30px',
            color: '#E4A11B', 
            textAlign: 'center',
        },
        contentGrid: {
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr',
            gap: '40px',
            '@media (maxWidth: 768px)': {
                gridTemplateColumns: '1fr',
            },
        },
        summarySection: {
            paddingRight: '20px',
            borderRight: '1px solid #333',
        },
        summaryHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontSize: '0.9rem',
            color: '#A0A0A0',
            borderBottom: '1px solid #444',
            paddingBottom: '5px',
        },
        totalSection: {
            marginTop: '30px',
            paddingTop: '15px',
            borderTop: '2px solid #6F4E37',
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
        },
        totalDisplay: {
            fontWeight: 'bold', 
            fontSize: '2rem', 
            color: '#E4A11B',
            marginTop: '10px'
        },
        emptyCartTitle: {
            fontSize: '2rem',
            color: '#FF4136',
        },
        clearCartButton: {
            backgroundColor: '#6F4E37', 
            color: 'white',
            padding: '8px 15px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            marginTop: '15px',
            fontWeight: 'bold',
            fontSize: '0.9em'
        }
    };

    if (totalAmount <= 0) {
        return (
            <main style={{...styles.mainContainer, justifyContent: 'center', alignItems: 'center'}}>
                <h2 style={styles.emptyCartTitle}>🛒 Tu Carrito está Vacío</h2>
                <p style={{color: '#A0A0A0', marginTop: '10px'}}>Añade productos para proceder al pago.</p>
                <Link to="/" style={{color: '#E4A11B', textDecoration: 'underline', marginTop: '20px'}}>
                    Volver a la tienda
                </Link>
            </main>
        );
    }

    return (
        <main style={styles.mainContainer}>
            <h2 style={styles.pageTitle}>🛍️ Finalizar Pedido</h2>
            
            <div style={styles.contentGrid}>
                
                <div style={styles.summarySection}>
                    <h3 style={{color: '#D4A373', marginBottom: '20px'}}>Resumen del Carrito</h3>
                    
                    <div style={styles.summaryHeader}>
                        <span>PRODUCTO</span>
                        <span>TOTAL</span>
                    </div>

                    {cartItems.map((item, index) => (
                        <CartItemDisplay 
                            key={item.itemKey || index} 
                            item={item} 
                            increaseQuantity={increaseQuantity}
                            decreaseQuantity={decreaseQuantity}
                        />
                    ))}

                    <div style={styles.totalSection}>
                         <div style={{color: '#E0E0E0', fontSize: '1.1rem', marginBottom: '10px'}}>
                            Subtotal: ${totalAmount.toFixed(2)}
                        </div>
                        <div style={styles.totalDisplay}>
                            Total: ${totalAmount.toFixed(2)}
                        </div>

                        <button
                            onClick={() => clearCart()}
                            style={styles.clearCartButton}
                        >
                            🗑️ Vaciar Carrito
                        </button>
                    </div>
                </div>

                <div>
                    <h3 style={{color: '#D4A373', marginBottom: '20px', textAlign: 'center'}}>Detalles Finales</h3>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm totalAmount={totalAmount} />
                    </Elements>
                </div>
            </div>
        </main>
    );
}