import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const BACKGROUND_IMAGE_URL = 'https://i.pinimg.com/1200x/db/bd/e2/dbbde2a973b340c87ec0e9d445e1c3c2.jpg';

const products = [
    { id: 1, name: 'Espresso Doble', price: 3.50, desc: 'Shot intenso de nuestro blend de la casa. Rico y aromático.', imageUrl: 'https://i.pinimg.com/1200x/0a/d8/08/0ad808795de3888dfa76d6fe37ca9426.jpg', options: { Tamaño: ['Pequeño', 'Grande'], Leche: ['Entera', 'Desnatada', 'Avena'] } },
    { id: 2, name: 'Latte', price: 4.90, desc: 'Con leche fresca y sirope de caramelo artesanal. Dulce y cremoso.', imageUrl: 'https://i.pinimg.com/1200x/aa/05/f7/aa05f7fa32d780474d0286ef16891ebb.jpg', options: { Sabor: ['Vainilla', 'Caramelo', 'Avellana'], Modo: ['Frio', 'Caliente'] } },
    { id: 3, name: 'Muffin', price: 2.75, desc: 'Muffin con sabor a eleccion. Suave y esponjoso.', imageUrl: 'https://i.pinimg.com/736x/8d/84/17/8d841742802e3d38206671345c8a69ab.jpg', options: { Sabor: ['Chocolate', 'Vainilla', 'Marmolado'] } },
    { id: 4, name: 'Chocotorta', price: 5.50, desc: 'Chocolinas, con dulce de leche y cacoa en polvo. El postre perfecto.', imageUrl: 'https://i.pinimg.com/1200x/66/b8/89/66b889e20f5668788a290fa33a9bc46a.jpg', options: {} },
    { id: 5, name: 'Granizado de cafe', price: 6.00, desc: 'Especial para dias calurosos, fresco y con un tono intenso de cafe.', imageUrl: 'https://i.pinimg.com/1200x/74/50/82/745082a9f986bb7264045b5c48d117be.jpg', options: { Azucar: ['Con azucar', 'Sin azucar', 'Edulcorante'], Leche: ['Entera', 'Desnatada', 'Avena'] } },
    { id: 6, name: 'Sándwich de Pollo', price: 6.95, desc: 'Pan artesanal, pollo, lechuga, tomates y aderezo a eleccion.', imageUrl: 'https://i.pinimg.com/1200x/c7/76/12/c77612b53e9c7d86c254e4b2b64c3289.jpg', options: { Aderezo: ['Mayonesa', 'Mostaza', 'Ketchup'] } },
    { id: 7, name: 'Frappe', price: 5.50, desc: 'café con hielo cubierto de espuma elaborado a partir de nuestro mejor café.', imageUrl: 'https://i.pinimg.com/1200x/fb/82/32/fb8232610deb929841c2a0afc9972a36.jpg', options: { Azucar: ['Con azucar', 'Sin azucar', 'Edulcorante'], Leche: ['Entera', 'Desnatada', 'Avena'] } },
    { id: 8, name: 'Cappuccino', price: 3.90, desc: 'Shot de cafe con leche cremada, especial para relajar.', imageUrl: 'https://i.pinimg.com/1200x/8e/5a/32/8e5a32b95bfe2bd29ad623aac466c2e5.jpg', options: { Azucar: ['Con azucar', 'Sin azucar', 'Edulcorante'], Leche: ['Entera', 'Desnatada', 'Avena'] } },
    { id: 9, name: 'Medialuna', price: 2.00, desc: 'Medialuna tradicional, ideal para acompañar tu café de la mañana.', imageUrl: 'https://i.pinimg.com/1200x/8b/40/7c/8b407c37dbafc51dba37b07275fa0752.jpg', options: { Preparado: ['grasa', 'manteca'] } },
    { id: 10, name: 'crossaint de jamon y queso', price: 3.50, desc: 'Croissant relleno de jamón y queso, perfecto para un desayuno completo.', imageUrl: 'https://i.pinimg.com/736x/c8/bb/44/c8bb4495a22b659140586209f632cd73.jpg', options: {} },
    { id: 11, name: 'crossaint de dulce de leche', price: 3.75, desc: 'Croissant relleno de dulce de leche, una delicia dulce y cremosa.', imageUrl: 'https://i.pinimg.com/736x/45/ad/c8/45adc820424a506e36d75066d36b40dc.jpg', options: {} },
];

const Card = ({ product, onSelectProduct }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const styles = {
        card: {
            backgroundColor: 'rgba(37, 37, 37, 0.95)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.5)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            position: 'relative', 
            zIndex: 2,
        },
        cardHover: {
            transform: 'translateY(-8px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7)',
        },
        image: {
            width: '100%',
            height: '200px',
            objectFit: 'cover', 
            borderBottom: '4px solid #6F4E37',
        },
        info: {
            padding: '20px',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        name: {
            fontSize: '1.6rem',
            color: '#FFFFFF',
            marginBottom: '5px',
            fontWeight: '700',
        },
        desc: {
            color: '#A0A0A0',
            fontSize: '0.95rem',
            marginBottom: '15px',
            flexGrow: 1,
        },
        footer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '15px',
            borderTop: '1px solid #333',
            paddingTop: '15px',
        },
        price: {
            fontSize: '1.6rem',
            color: '#98FB98', 
            fontWeight: 'bold',
        },
        viewButton: {
            padding: '8px 15px',
            backgroundColor: '#A0522D', 
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
        }
    };


    return (
        <div 
            style={{...styles.card, ...(isHovered ? styles.cardHover : {})}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelectProduct(product)}
        >
            <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={styles.image} 
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200/4A3326/FFFFFF?text=Producto" }} 
            />
            <div style={styles.info}>
                <div>
                    <h3 style={styles.name}>{product.name}</h3>
                    <p style={styles.desc}>{product.desc}</p>
                </div>
                <div style={styles.footer}>
                    <span style={styles.price}>${product.price.toFixed(2)}</span>
                    <div 
                        style={styles.viewButton}
                        onClick={(e) => { e.stopPropagation(); onSelectProduct(product); }}
                    >
                        Ver Detalles
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductModal = ({ product, onClose, addItemToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState(() => {
        const initialOptions = {};
        Object.keys(product.options).forEach(key => {
            if (product.options[key].length > 0) {
                initialOptions[key] = product.options[key][0];
            }
        });
        return initialOptions;
    });

    const isModalMobile = window.innerWidth <= 600; 

    const finalPrice = product.price * quantity;

    const handleOptionChange = (optionKey, value) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionKey]: value,
        }));
    };

    const handleAddToCart = () => {
        addItemToCart({ 
            ...product, 
            quantity: quantity, 
            selectedOptions: selectedOptions,
        });
        alert(`${quantity}x ${product.name} añadido al carrito!`);
        onClose();
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
        },
        modal: {
            backgroundColor: '#1E1E1E',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '800px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
            display: 'flex',
            flexDirection: isModalMobile ? 'column' : 'row', 
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
        },
        imageContainer: {
            flex: isModalMobile ? 'none' : 1,
            minWidth: isModalMobile ? '100%' : '300px',
            maxHeight: isModalMobile ? '250px' : 'none',
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover', 
        },
        detailsContainer: {
            flex: 1.5,
            padding: '30px',
            color: '#E0E0E0',
            overflowY: 'auto',
        },
        closeButton: {
            position: 'absolute',
            top: '15px',
            right: '15px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#FF6347',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 110,
        },
        title: {
            fontSize: '2.5rem',
            color: '#FFFFFF',
            marginBottom: '10px',
            borderBottom: '2px solid #6F4E37',
            paddingBottom: '10px',
        },
        description: {
            color: '#A0A0A0',
            marginBottom: '20px',
        },
        price: {
            fontSize: '2rem',
            color: '#98FB98',
            fontWeight: 'bold',
            marginBottom: '20px',
        },
        quantityControls: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '30px',
            paddingTop: '15px',
            borderTop: '1px solid #333',
        },
        quantityButton: {
            width: '40px',
            height: '40px',
            fontSize: '1.5rem',
            backgroundColor: '#4A3326',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        },
        quantityInput: {
            fontSize: '1.5rem',
            width: '50px',
            textAlign: 'center',
            backgroundColor: '#252525',
            color: '#FFFFFF',
            border: '1px solid #6F4E37',
            borderRadius: '5px',
        },
        addButton: {
            width: '100%',
            padding: '18px 20px',
            fontSize: '1.3rem',
            backgroundColor: '#A0522D',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s',
        },
        optionGroup: {
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: '#252525',
            borderRadius: '8px',
            border: '1px solid #333',
        },
        optionButton: (isSelected) => ({
            padding: '8px 12px',
            marginRight: '10px',
            marginTop: '8px',
            backgroundColor: isSelected ? '#6F4E37' : '#4A3326',
            color: isSelected ? '#FFFFFF' : '#E0E0E0',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        })
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
                
                <div style={styles.imageContainer}>
                    <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        style={styles.image} 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x800/4A3326/FFFFFF?text=PRODUCTO" }} 
                    />
                </div>

                <div style={styles.detailsContainer}>
                    <h2 style={styles.title}>{product.name}</h2>
                    <p style={styles.description}>{product.desc}</p>
                    
                    {Object.keys(product.options).length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h4 style={{ color: '#D4A373', marginBottom: '10px' }}>Personalizar:</h4>
                            {Object.entries(product.options).map(([optionKey, values]) => (
                                <div key={optionKey} style={styles.optionGroup}>
                                    <h5 style={{ color: '#E0E0E0', marginBottom: '5px', fontSize: '1rem' }}>{optionKey}:</h5>
                                    {values.map(value => (
                                        <button
                                            key={value}
                                            onClick={() => handleOptionChange(optionKey, value)}
                                            style={styles.optionButton(selectedOptions[optionKey] === value)}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <h3 style={styles.price}>Total: ${finalPrice.toFixed(2)}</h3>

                    <div style={styles.quantityControls}>
                        <button 
                            style={styles.quantityButton} 
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        >
                            -
                        </button>
                        <input 
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            style={styles.quantityInput}
                        />
                        <button 
                            style={styles.quantityButton} 
                            onClick={() => setQuantity(q => q + 1)}
                        >
                            +
                        </button>
                    </div>

                    <button style={styles.addButton} onClick={handleAddToCart}>
                        Añadir {quantity} Artículo(s) al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
};

export function Menu() {
  const { addItemToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const styles = {
    main: {
        padding: '0', 
        
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
        position: 'relative',
        color: '#E0E0E0',
        minHeight: 'calc(100vh - 60px)',
        width: '100%', 
    },
    contentInner: {
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto', 
    },
    overlay: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(18, 18, 18, 0.85)', 
        zIndex: 1,
    },
    contentWrapper: {
        position: 'relative',
        zIndex: 2,
    },
    title: {
        fontSize: '3rem',
        color: '#D4A373',
        marginBottom: '40px',
        textAlign: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
    },
  };

  return (
    <main style={styles.main}>
        <div style={styles.overlay}></div>
        <div style={styles.contentWrapper}>
            <div style={styles.contentInner}>
                <h2 style={styles.title}>Menú de Especialidad</h2>
                
                <div style={styles.grid}>
                    {products.map(product => (
                        <Card 
                            key={product.id} 
                            product={product} 
                            onSelectProduct={setSelectedProduct} 
                        />
                    ))}
                </div>
            </div>
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    addItemToCart={addItemToCart}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    </main>
  );
}