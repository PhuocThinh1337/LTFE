import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, api } from '../services/api';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ERROR'; payload: string };

const initialState: CartState = {
  items: [
    {
      id: 1,
      productId: 1,
      name: 'Sơn Nippon Spot-less Plus',
      price: 450000,
      quantity: 2,
      color: 'Trắng ngọc trai',
      image: '/images/products/spot-less-plus.jpg'
    },
    {
      id: 2,
      productId: 4,
      name: 'Sơn Nippon Super Strong',
      price: 680000,
      quantity: 1,
      color: 'Đen',
      image: '/images/products/super-strong.jpg'
    },
    {
      id: 3,
      productId: 7,
      name: 'Sơn Nippon Metallic',
      price: 890000,
      quantity: 1,
      color: 'Bạc',
      image: '/images/products/metallic.jpg'
    }
  ],
  loading: false,
  error: null
};
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false, error: null };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (productId: number, quantity?: number, color?: string) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const items = await api.getCart();
      
      // If no items in localStorage, use initial demo items and save them
      if (items.length === 0) {
        localStorage.setItem('cart', JSON.stringify(initialState.items));
        dispatch({ type: 'SET_ITEMS', payload: initialState.items });
      } else {
        dispatch({ type: 'SET_ITEMS', payload: items });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      // Fallback to initial items if API fails
      dispatch({ type: 'SET_ITEMS', payload: initialState.items });
    }
  };

  const addToCart = async (productId: number, quantity: number = 1, color?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // First get product details
      const product = await api.getProduct(productId);
      if (product) {
        const updatedCart = await api.addToCart(product, quantity, color);
        dispatch({ type: 'SET_ITEMS', payload: updatedCart });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể thêm sản phẩm vào giỏ hàng' });
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const updatedCart = await api.updateCartItem(itemId, quantity);
      dispatch({ type: 'SET_ITEMS', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể cập nhật số lượng' });
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const updatedCart = await api.removeFromCart(itemId);
      dispatch({ type: 'SET_ITEMS', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể xóa sản phẩm' });
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể xóa giỏ hàng' });
    }
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value: CartContextType = {
    state,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
