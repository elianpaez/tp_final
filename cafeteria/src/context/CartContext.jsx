import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (product) => {
    setCartItems(prevItems => {
      
      const itemKey = `${product.id}-${JSON.stringify(product.selectedOptions || {})}`;

      const existingItem = prevItems.find(item => item.itemKey === itemKey);

      if (existingItem) {
        return prevItems.map(item =>
          item.itemKey === itemKey
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        
        return [...prevItems, { ...product, itemKey, quantity: product.quantity }];
      }
    });
  };
  
  const increaseQuantity = (itemKey) => {
    setCartItems(prevItems =>
        prevItems.map(item => 
            item.itemKey === itemKey
                ? { ...item, quantity: item.quantity + 1 }
                : item
        )
    );
  };

  const decreaseQuantity = (itemKey) => {
    setCartItems(prevItems =>
        prevItems.map(item => 
            item.itemKey === itemKey
                ? { ...item, quantity: Math.max(1, item.quantity - 1) } 
                : item
        )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  

  const value = {
    cartItems,
    addItemToCart,
    getCartItemCount,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}