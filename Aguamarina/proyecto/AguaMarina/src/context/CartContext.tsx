import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from '@/types/Clients/cartItem';

interface CartContextType {
  cartItems: CartItem[];
  cantBadge: number;
  cantDays: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  deleteCart: () => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  updateCartItemQuantity: (id: number, quantity: number) => void; // Añadido
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cantBadge, setCantBadge] = useState(0);
  const [cantDays, setcantDays] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cart = JSON.parse(storedCart);
      setCartItems(cart);
      setCantBadge(cart.length);
    }
  }, []);

  const updateLocalStorage = (items: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
    setCantBadge(items.length);
  };

  const addToCart = (newItem: CartItem) => {
    const updatedCart = [...cartItems];
    const existingItem = updatedCart.find(item => item.id === newItem.id);

    if (existingItem) {
      existingItem.quantity += newItem.quantity;
    } else {
      updatedCart.push(newItem);
    }

    updateLocalStorage(updatedCart);
  };

  const deleteCart = () => {
    updateLocalStorage([]);
  }

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    updateLocalStorage(updatedCart);
  };

  const increaseQuantity = (id: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateLocalStorage(updatedCart);
  };

  const decreaseQuantity = (id: number) => {
    const updatedCart = cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateLocalStorage(updatedCart);
  };

  // Función para actualizar la cantidad de un artículo específico
  const updateCartItemQuantity = (id: number, increment: number) => {
  const updatedCart = cartItems.map(item =>
    item.id === id ? { ...item, quantity: item.quantity + increment } : item
  );
  updateLocalStorage(updatedCart);
};

  return (
    <CartContext.Provider value={{
      cartItems,
      cantBadge,
      cantDays,
      addToCart,
      removeFromCart,
      deleteCart,
      increaseQuantity,
      decreaseQuantity,
      updateCartItemQuantity, // Proporcionamos la nueva función
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el contexto del carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe ser usado dentro de un CartProvider");
  return context;
};
