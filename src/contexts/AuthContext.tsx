import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, api, CartItem } from '../services/api';


// Hàm helper để merge guest cart vào user cart
const mergeGuestCartToUser = async (userId: string): Promise<void> => {
  try {
    // Lấy guest cart
    const guestCartStr = localStorage.getItem('guest_cart');
    if (!guestCartStr) return;
    
    const guestCart: CartItem[] = JSON.parse(guestCartStr);
    if (guestCart.length === 0) return;
    
    // Lấy user cart hiện tại
    const userCart: CartItem[] = await api.getCart(userId);
    
    // Merge logic: combine items with same productId and color
    const mergedCart = [...userCart];
    
    guestCart.forEach(guestItem => {
      const existingItem = mergedCart.find(item => 
        item.productId === guestItem.productId && item.color === guestItem.color
      );
      
      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, cộng dồn số lượng
        existingItem.quantity += guestItem.quantity;
      } else {
        // Nếu chưa có, thêm vào cart
        mergedCart.push(guestItem);
      }
    });
    
    // Lưu cart đã merge cho user
    localStorage.setItem(`cart_${userId}`, JSON.stringify(mergedCart));
    
    // Xóa guest cart sau khi merge
    localStorage.removeItem('guest_cart');
    
  } catch (error) {
    console.error('Error merging guest cart to user:', error);
  }
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleData: { email: string; name: string; picture?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    loadUser();
  }, []);

  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Tự động ẩn sau 5 giây
  };

  const loadUser = async () => {
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser } = await api.login(email, password);
      

      // Merge guest cart vào user cart nếu có
      await mergeGuestCartToUser(loggedInUser.id.toString());
      
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (googleData: { email: string; name: string; picture?: string }) => {
    try {
      const { user: loggedInUser } = await api.loginWithGoogle(googleData);
      
      // Merge guest cart vào user cart nếu có
      await mergeGuestCartToUser(loggedInUser.id.toString());
      
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      // KHÔNG xóa cart khi logout, giữ lại cho lần đăng nhập sau
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    refreshUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

