import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, api } from '../services/api';
import { useAuth } from './AuthContext';

// Interfaces for Order History
interface Order {
  id: string;
  customerInfo: {
    fullName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    note?: string;
  };
  paymentMethod: {
    type: 'cod' | 'qr';
    name: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  orderDate: string;
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

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
  items: [],
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
  removeItems: (itemIds: number[]) => Promise<void>;
  clearCart: () => Promise<void>;
  addOrderToHistory: (order: Order) => Promise<void>;
  getOrderHistory: () => Order[];
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
  const { user } = useAuth(); // Lấy user từ AuthContext

  useEffect(() => {
    loadCart();
    
    const handleCartUpdate = () => {
      loadCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [user]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const items = await api.getCart(user?.id?.toString());
      
      if (items.length === 0) {
        dispatch({ type: 'SET_ITEMS', payload: [] });
      } else {
        dispatch({ type: 'SET_ITEMS', payload: items });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Không thể tải giỏ hàng' });
    }
  };

  const addToCart = async (productId: number, quantity: number = 1, color?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const product = await api.getProduct(productId);
      if (product) {
        const updatedCart = await api.addToCart(product, quantity, color, user?.id?.toString());
        dispatch({ type: 'SET_ITEMS', payload: updatedCart });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể thêm sản phẩm vào giỏ hàng' });
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const updatedCart = await api.updateCartItem(itemId, quantity, user?.id?.toString());
      dispatch({ type: 'SET_ITEMS', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể cập nhật số lượng' });
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const updatedCart = await api.removeFromCart(itemId, user?.id?.toString());
      dispatch({ type: 'SET_ITEMS', payload: updatedCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể xóa sản phẩm' });
    }
  };

  const removeItems = async (itemIds: number[]) => {
    try {
      const updatedCart = await api.getCart();
      const filteredCart = updatedCart.filter(item => !itemIds.includes(item.id));
      localStorage.setItem('cart', JSON.stringify(filteredCart));
      dispatch({ type: 'SET_ITEMS', payload: filteredCart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Không thể xóa sản phẩm khỏi giỏ hàng' });
    }
  };

  
const addOrderToHistory = async (order: Order) => {
  try {
    const existingHistory = localStorage.getItem('order_history');
    const orderHistory: Order[] = existingHistory ? JSON.parse(existingHistory) : [];
    orderHistory.unshift(order);
    localStorage.setItem('order_history', JSON.stringify(orderHistory));
  } catch (error) {
    throw error;
  }
};
  const getOrderHistory = (): Order[] => {
    try {
      const history = localStorage.getItem('order_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading order history:', error);
      return [];
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart(user?.id?.toString());
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
    removeItems,
    clearCart,
    addOrderToHistory,
    getOrderHistory,
    getTotalItems,
    getTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
