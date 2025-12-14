// Import từ data/products.ts
import { Product, PRODUCTS } from '../data/products';

// Mock API service for development
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // hoặc sử dụng local JSON server

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  image: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface UserWithPassword extends User {
  password: string;
  createdAt?: string;
}

interface UsersData {
  users: UserWithPassword[];
  resetTokens: Array<{
    email: string;
    token: string;
    expiresAt: string;
  }>;
}

// Mock data - sử dụng data từ data/products.ts thay vì mockProducts
// const mockProducts: Product[] = [...]; // Loại bỏ mockProducts

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Load users from JSON file and initialize localStorage
const initializeUsers = async (): Promise<UserWithPassword[]> => {
  try {
    // Check if users are already loaded in localStorage
    const storedUsers = localStorage.getItem('fake_users_db');
    if (storedUsers) {
      const data: UsersData = JSON.parse(storedUsers);
      return data.users;
    }

    // Load from JSON file
    const response = await fetch('/data/users.json');
    const data: UsersData = await response.json();
    
    // Store in localStorage for persistence
    localStorage.setItem('fake_users_db', JSON.stringify(data));
    
    return data.users;
  } catch (error) {
    console.error('Error loading users:', error);
    // Return default users if JSON file fails to load
    return [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@nipponpaint.vn',
        password: 'admin123',
        phone: '0123 456 789',
        createdAt: new Date().toISOString()
      }
    ];
  }
};

// Get users from localStorage
const getUsers = (): UserWithPassword[] => {
  const stored = localStorage.getItem('fake_users_db');
  if (stored) {
    const data: UsersData = JSON.parse(stored);
    return data.users;
  }
  return [];
};

// Save users to localStorage
const saveUsers = (users: UserWithPassword[]): void => {
  const stored = localStorage.getItem('fake_users_db');
  const data: UsersData = stored ? JSON.parse(stored) : { users: [], resetTokens: [] };
  data.users = users;
  localStorage.setItem('fake_users_db', JSON.stringify(data));
};

// Get reset tokens from localStorage
const getResetTokens = (): Array<{ email: string; token: string; expiresAt: string }> => {
  const stored = localStorage.getItem('fake_users_db');
  if (stored) {
    const data: UsersData = JSON.parse(stored);
    return data.resetTokens || [];
  }
  return [];
};

// Save reset tokens to localStorage
const saveResetTokens = (tokens: Array<{ email: string; token: string; expiresAt: string }>): void => {
  const stored = localStorage.getItem('fake_users_db');
  const data: UsersData = stored ? JSON.parse(stored) : { users: [], resetTokens: [] };
  data.resetTokens = tokens;
  localStorage.setItem('fake_users_db', JSON.stringify(data));
};

// Initialize users on module load
initializeUsers();

// API functions
export const api = {
  // Products - sử dụng PRODUCTS từ data/products.ts
  getProducts: async (): Promise<Product[]> => {
    await delay(500); // Simulate network delay
    return PRODUCTS;
  },

  getProduct: async (id: number): Promise<Product | null> => {
    await delay(300);
    return PRODUCTS.find(p => p.id === id) || null;
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    await delay(400);
    return PRODUCTS.filter(p => p.category === category);
  },

  // Cart
  getCart: async (): Promise<CartItem[]> => {
    await delay(300);
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: async (product: Product, quantity: number = 1, color?: string): Promise<CartItem[]> => {
    await delay(400);
    const cart = await api.getCart();
    
    const existingItem = cart.find(item => 
      item.productId === product.id && item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: Date.now(), // Simple ID generation
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        color,
        image: product.image
      };
      cart.push(newItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  updateCartItem: async (itemId: number, quantity: number): Promise<CartItem[]> => {
    await delay(300);
    const cart = await api.getCart();
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        return api.removeFromCart(itemId);
      }
      item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  },

  removeFromCart: async (itemId: number): Promise<CartItem[]> => {
    await delay(300);
    const cart = await api.getCart();
    const filteredCart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    return filteredCart;
  },

  clearCart: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem('cart');
  },

  // User - Login
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(800); // Simulate auth delay
    
    const users = getUsers();
    const userWithPassword = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (!userWithPassword) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }
    
    // Remove password from user object before returning
    const { password: _, ...user } = userWithPassword;
    const token = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { user, token };
  },

  // User - Register
  register: async (userData: { name: string; email: string; password: string; phone?: string }): Promise<User> => {
    await delay(1000);
    
    const users = getUsers();
    
    // Check if email already exists
    const existingUser = users.find(
      u => u.email.toLowerCase() === userData.email.toLowerCase()
    );
    
    if (existingUser) {
      throw new Error('Email này đã được sử dụng. Vui lòng sử dụng email khác.');
    }
    
    // Create new user
    const newUser: UserWithPassword = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    saveUsers(users);
    
    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = newUser;
    
    return userWithoutPassword;
  },

  // User - Forgot Password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    await delay(1000);
    
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Don't reveal if email exists for security
      // Still return success message
      return {
        message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn.'
      };
    }
    
    // Generate reset token
    const resetToken = 'reset-token-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    // Save reset token
    const tokens = getResetTokens();
    // Remove old tokens for this email
    const filteredTokens = tokens.filter(t => t.email.toLowerCase() !== email.toLowerCase());
    filteredTokens.push({ email: user.email, token: resetToken, expiresAt });
    saveResetTokens(filteredTokens);
    
    // In a real app, you would send an email here
    console.log(`Reset password link for ${email}: /reset-password?token=${resetToken}`);
    
    return {
      message: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.'
    };
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(200);
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      return JSON.parse(user);
    }
    
    return null;
  },

  logout: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
};

