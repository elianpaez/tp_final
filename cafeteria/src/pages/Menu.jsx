import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const BACKGROUND_IMAGE_URL =
  'https://i.pinimg.com/1200x/db/bd/e2/dbbde2a973b340c87ec0e9d445e1c3c2.jpg';

const Card = ({ product, onSelectProduct }) => {
  const [isHovered, setIsHovered] = useState(false);

  
  const price = Number(product.price) || 0;

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
        objectPosition: 'center', 
        borderBottom: '4px solid #6f4e37',
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
      color: '#ffffff',
      marginBottom: '5px',
      fontWeight: '700',
    },
    desc: {
      color: '#a0a0a0',
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
      color: '#98fb98',
      fontWeight: 'bold',
    },
    viewButton: {
      padding: '8px 15px',
      backgroundColor: '#a0522d',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
    },
  };

  return (
    <div
      style={{ ...styles.card, ...(isHovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
    >
      <img
        src={product.imageUrl || 'https://placehold.co/300x200/4A3326/FFFFFF?text=Producto'}
        alt={product.name}
        style={styles.image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            'https://placehold.co/300x200/4A3326/FFFFFF?text=Producto';
        }}
      />
      <div style={styles.info}>
        <div>
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.desc}>{product.desc}</p>
        </div>
        <div style={styles.footer}>
          
          <span style={styles.price}>${price.toFixed(2)}</span>

          <div
            style={styles.viewButton}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
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
    const initial = {};
    if (product.options) {
      Object.keys(product.options).forEach((key) => {
        const values = product.options[key];
        if (values?.length > 0) initial[key] = values[0];
      });
    }
    return initial;
  });

  const isMobile = window.innerWidth <= 600;
  const finalPrice = product.price * quantity;

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
    modal: {
      backgroundColor: "#1e1e1e",
      borderRadius: "12px",
      width: "90%",
      maxWidth: "800px",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      maxHeight: "90vh",
      overflow: "auto",
      position: "relative",
    },
    imageContainer: {
      flex: isMobile ? "none" : 1,
      minWidth: isMobile ? "100%" : "300px",
      maxHeight: isMobile ? "250px" : "none",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    details: {
      flex: 1.5,
      padding: "30px",
      color: "#e0e0e0",
      overflowY: "auto",
    },
    close: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "transparent",
      border: "none",
      color: "#ff6347",
      fontSize: "1.5rem",
      cursor: "pointer",
    },
    title: {
      fontSize: "2.5rem",
      color: "#ffffff",
      marginBottom: "10px",
      borderBottom: "2px solid #6f4e37",
      paddingBottom: "10px",
    },
    price: {
      fontSize: "2rem",
      color: "#98fb98",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    button: {
      width: "100%",
      padding: "18px 20px",
      fontSize: "1.3rem",
      backgroundColor: "#a0522d",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontWeight: "bold",
      marginTop: "20px",
    },
  };

  const addToCart = () => {
    addItemToCart({
      ...product,
      quantity,
      selectedOptions,
    });
    alert(`${quantity}x ${product.name} añadido al carrito!`);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>
          ×
        </button>

        <div style={styles.imageContainer}>
          <img
            src={product.imageUrl}
            style={styles.image}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/800x800/4A3326/FFFFFF?text=PRODUCTO";
            }}
          />
        </div>

        <div style={styles.details}>
          <h2 style={styles.title}>{product.name}</h2>
          <p>{product.desc}</p>

          <h3 style={styles.price}>${finalPrice.toFixed(2)}</h3>

          
          {product.options && (
            <div style={{ marginTop: "20px" }}>
              {Object.entries(product.options).map(([category, values]) => (
                <div key={category} style={{ marginBottom: "20px" }}>
                  <h4
                    style={{
                      marginBottom: "8px",
                      color: "#fff",
                      fontSize: "1.3rem",
                      borderBottom: "1px solid #6f4e37",
                      paddingBottom: "6px",
                    }}
                  >
                    {category}
                  </h4>

                  {values.map((value) => (
                    <label
                      key={value}
                      style={{
                        display: "block",
                        marginBottom: "6px",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                      }}
                    >
                      <input
                        type="radio"
                        name={category}
                        value={value}
                        checked={selectedOptions[category] === value}
                        onChange={() =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [category]: value,
                          }))
                        }
                        style={{ marginRight: "8px" }}
                      />
                      {value}
                    </label>
                  ))}
                </div>
              ))}
            </div>
          )}

          <button style={styles.button} onClick={addToCart}>
            Añadir {quantity} Artículo(s) al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;


export function Menu() {
  const { addItemToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);


  useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'products'),
    (snapshot) => {
  const list = snapshot.docs.map((doc) => {
    const data = doc.data();
     return {
        id: doc.id,
        name: data.name ?? "",
        desc: data.desc ?? "",
        imageUrl: data.imageUrl ?? "",
        price: Number(data.price) || 0,
        options: data.options ?? {}
    };
  });
      setProducts(list);
    },
    (err) => console.error('Error cargando productos:', err)
  );

  return () => unsubscribe();
}, []);

  const styles = {
    main: {
      padding: 0,
      backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: 'calc(100vh - 60px)',
      position: 'relative',
      color: '#e0e0e0',
    },
    overlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(18,18,18,0.85)',
      zIndex: 1,
    },
    wrapper: {
      position: 'relative',
      zIndex: 2,
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      fontSize: '3rem',
      textAlign: 'center',
      color: '#d4a373',
      marginBottom: '40px',
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
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Menú de Especialidad</h2>

        <div style={styles.grid}>
          {products.map((p) => (
            <Card key={p.id} product={p} onSelectProduct={setSelectedProduct} />
          ))}
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
