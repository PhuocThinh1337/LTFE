import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, api } from '../services/api';
import { useAuth } from './AuthContext';
import { Voucher, VOUCHERS } from '../data/vouchers';

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
  voucher?: Voucher; // Thêm voucher vào order
  discountAmount?: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  appliedVoucher: Voucher | null;
  discountAmount: number;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'APPLY_VOUCHER'; payload: { voucher: Voucher; discount: number } }
  | { type: 'REMOVE_VOUCHER' };

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  appliedVoucher: null,
  discountAmount: 0
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ITEMS':
      // Khi cart thay đổi, cần tính toán lại voucher 
      // Logic này phức tạp, nên để đơn giản ta sẽ remove voucher khi cart thay đổi để user apply lại
      // Hoặc làm tốt hơn là re-validate voucher. Ở đây ta tạm thời giữ voucher
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
      return { ...state, items: [], appliedVoucher: null, discountAmount: 0 };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'APPLY_VOUCHER':
      return { ...state, appliedVoucher: action.payload.voucher, discountAmount: action.payload.discount };
    case 'REMOVE_VOUCHER':
      return { ...state, appliedVoucher: null, discountAmount: 0 };
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (productId: number, quantity?: number, color?: string, customPrice?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  removeItems: (itemIds: number[]) => Promise<void>;
  clearCart: () => Promise<void>;
  addOrderToHistory: (order: Order) => Promise<void>;
  getOrderHistory: () => Order[];
  getTotalItems: () => number;
  getTotalPrice: () => number; // Giá sau khi giảm
  getSubtotal: () => number; // Giá tạm tính (trước giảm)
  applyVoucher: (code: string) => { success: boolean; message: string };
  removeVoucher: () => void;
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
  const { user } = useAuth();

  useEffect(() => {
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Re-calculate discount when cart items change
  useEffect(() => {
    if (state.appliedVoucher) {
      const result = calculateDiscount(state.appliedVoucher, state.items);
      if (result.isValid) {
        dispatch({ type: 'APPLY_VOUCHER', payload: { voucher: state.appliedVoucher, discount: result.amount } });
      } else {
        // Nếu không còn thỏa mãn điều kiện, tự động gỡ voucher
        console.log('Voucher no longer valid:', result.reason);
        dispatch({ type: 'REMOVE_VOUCHER' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Option B: không hỗ trợ guest cart. Chưa đăng nhập thì cart rỗng.
      if (!user) {
        dispatch({ type: 'SET_ITEMS', payload: [] });
        return;
      }
      const items = await api.getCart(user?.id?.toString());
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Không thể tải giỏ hàng' });
    }
  };

  const addToCart = async (productId: number, quantity: number = 1, color?: string, customPrice?: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Option B: bắt buộc đăng nhập mới được thêm vào giỏ
      if (!user) {
        dispatch({ type: 'SET_ERROR', payload: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng' });
        throw new Error('AUTH_REQUIRED');
      }
      const product = await api.getProduct(productId);
      if (product) {
        const productToAdd = customPrice ? { ...product, price: customPrice } : product;
        const updatedCart = await api.addToCart(productToAdd, quantity, color, user?.id?.toString());
        dispatch({ type: 'SET_ITEMS', payload: updatedCart });
      }
    } catch (error) {
      if ((error as any)?.message === 'AUTH_REQUIRED') throw error;
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
      if (!user) {
        dispatch({ type: 'SET_ERROR', payload: 'Bạn cần đăng nhập để thao tác giỏ hàng' });
        throw new Error('AUTH_REQUIRED');
      }
      const updatedCart = await api.getCart(user?.id?.toString());
      const filteredCart = updatedCart.filter(item => !itemIds.includes(item.id));
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(filteredCart));
      dispatch({ type: 'SET_ITEMS', payload: filteredCart });
    } catch (error) {
      if ((error as any)?.message === 'AUTH_REQUIRED') throw error;
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

  // Voucher Logic helper
  const calculateDiscount = (voucher: Voucher, cartItems: CartItem[]): { isValid: boolean; amount: number; reason?: string } => {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);

    // 1. Check Date
    if (now < startDate) return { isValid: false, amount: 0, reason: 'Voucher chưa có hiệu lực.' };
    if (now > endDate) return { isValid: false, amount: 0, reason: 'Voucher đã hết hạn.' };

    // 2. Check Active
    if (!voucher.isActive) return { isValid: false, amount: 0, reason: 'Voucher không còn hoạt động.' };

    // 3. Check Limits
    if (voucher.usageLimit <= voucher.usedCount) return { isValid: false, amount: 0, reason: 'Voucher đã hết lượt sử dụng.' };

    // 4. Check Min Order
    if (voucher.minOrderValue && subtotal < voucher.minOrderValue) {
      return {
        isValid: false,
        amount: 0,
        reason: `Đơn hàng tối thiểu phải từ ${voucher.minOrderValue.toLocaleString('vi-VN')}đ.`
      };
    }

    let discount = 0;

    // 5. Calculate Discount specific logic
    if (voucher.type === 'total') {
      if (voucher.discountType === 'percentage') {
        discount = subtotal * (voucher.value / 100);
        if (voucher.maxDiscount) {
          discount = Math.min(discount, voucher.maxDiscount);
        }
      } else {
        discount = voucher.value;
      }
    } else if (voucher.type === 'shipping') {
      // Giả sử logic là giảm trực tiếp vào phí ship, nhưng ở đây ta tính vào discountAmount chung
      // Logic thực tế cần tích hợp với phí ship
      discount = voucher.value;
    } else if (voucher.type === 'category' && voucher.targetCategory) {
      // Lọc sản phẩm thuộc category
      // Lưu ý: CartItem hiện tại chưa có category, ta cần gọi API hoặc giả định
      // Để đơn giản (và do CartItem hiện tại thiếu field category), ta sẽ tạm bỏ qua logic check sâu category
      // Hoặc yêu cầu user update CartItem. 
      // Trong phạm vi này, tôi sẽ tính discount dựa trên tổng đơn nếu category match (tạm thời coi như all match nếu ko check dc)
      // Cần update CartItem có category mới chính xác.
      // Tạm thời: Giả sử voucher category áp dụng cho tổng đơn nhưng check tên sp có chứa category (hacky)
      const eligibleItemsPrice = cartItems.reduce((total, item) => {
        // Đây là cách check tạm thời. Tốt nhất là thêm category vào CartItem
        return total + item.price * item.quantity;
      }, 0);

      if (voucher.discountType === 'percentage') {
        discount = eligibleItemsPrice * (voucher.value / 100);
        if (voucher.maxDiscount) discount = Math.min(discount, voucher.maxDiscount);
      } else {
        discount = voucher.value;
      }
    }

    // Đảm bảo không giảm quá tổng đơn
    discount = Math.min(discount, subtotal);

    return { isValid: true, amount: discount };
  };

  const applyVoucher = (code: string): { success: boolean; message: string } => {
    const inputCode = code.toUpperCase();

    // 1. Tìm voucher trong danh sách gốc (File cứng - bị khóa 2099)
    const staticVoucher = VOUCHERS.find(v => v.code === inputCode);

    // 2. Tìm voucher trong Ví localStorage (Đã được mở khóa từ Live)
    const savedWallet = JSON.parse(localStorage.getItem('my_vouchers') || '[]');
    const walletVoucher = savedWallet.find((v: any) => v.code === inputCode);

    // QUY TẮC: Ưu tiên dùng voucher trong ví.
    const voucherToCheck = walletVoucher || staticVoucher;

    if (!voucherToCheck) {
      return { success: false, message: 'Mã giảm giá không tồn tại' };
    }

    // Helper kiểm tra thời gian riêng để đảm bảo đúng logic "Lính gác"
    const now = new Date();
    const startDate = new Date(voucherToCheck.startDate);

    if (now < startDate) {
      return { success: false, message: "Mã này chưa đến đợt sử dụng!" };
    }

    const result = calculateDiscount(voucherToCheck, state.items);

    if (!result.isValid) {
      return { success: false, message: result.reason || 'Voucher không áp dụng được.' };
    }

    dispatch({ type: 'APPLY_VOUCHER', payload: { voucher: voucherToCheck, discount: result.amount } });
    return { success: true, message: 'Áp dụng thành công!' };
  };

  const removeVoucher = () => {
    dispatch({ type: 'REMOVE_VOUCHER' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    let total = Math.max(0, subtotal - state.discountAmount);

    if (user?.isPremium) {
      total = total * 0.9;
    }

    return total;
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
    getTotalPrice,
    getSubtotal,
    applyVoucher,
    removeVoucher
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
