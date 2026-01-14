// Import từ data/products.ts
import { Product, PRODUCTS } from '../data/products';
import emailjs from '@emailjs/browser';

// Mock API service for development
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  avatar?: string;
  isPremium?: boolean;
  role?: 'admin' | 'user';
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


// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Load users from JSON file and initialize localStorage
const initializeUsers = async (): Promise<UserWithPassword[]> => {
  try {
    // Check if users are already loaded in localStorage
    const storedUsers = localStorage.getItem('fake_users_db');
    if (storedUsers) {
      const data: UsersData = JSON.parse(storedUsers);
      // Check if data is stale (missing role field)
      const isStale = data.users.length > 0 && !data.users[0].role;
      if (!isStale) {
        return data.users;
      }
      console.log('Detected stale user data, reloading from JSON...');
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
        createdAt: new Date().toISOString(),
        isPremium: true,
        role: 'admin'
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

// Get reset tokens from localStorage (Separate DB)
const getResetTokens = (): Array<{ email: string; token: string; expiresAt: string }> => {
  const stored = localStorage.getItem('reset_tokens_db');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

// Save reset tokens to localStorage (Separate DB)
const saveResetTokens = (tokens: Array<{ email: string; token: string; expiresAt: string }>): void => {
  localStorage.setItem('reset_tokens_db', JSON.stringify(tokens));
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
  getCart: async (userId?: string): Promise<CartItem[]> => {
    await delay(300);
    const cartKey = userId ? `cart_${userId}` : 'guest_cart';
    const cart = localStorage.getItem(cartKey);
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: async (product: Product, quantity: number = 1, color?: string, userId?: string): Promise<CartItem[]> => {
    await delay(400);
    const cartKey = userId ? `cart_${userId}` : 'guest_cart';
    const cart: CartItem[] = JSON.parse(localStorage.getItem(cartKey) || '[]');

    const existingItem = cart.find((item: CartItem) =>
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

    localStorage.setItem(cartKey, JSON.stringify(cart));
    return cart;
  },

  updateCartItem: async (itemId: number, quantity: number, userId?: string): Promise<CartItem[]> => {
    await delay(300);
    const cartKey = userId ? `cart_${userId}` : 'guest_cart';
    const cart: CartItem[] = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const item = cart.find((item: CartItem) => item.id === itemId);

    if (item) {
      if (quantity <= 0) {
        return api.removeFromCart(itemId, userId);
      }
      item.quantity = quantity;
      localStorage.setItem(cartKey, JSON.stringify(cart));
    }

    return cart;
  },

  removeFromCart: async (itemId: number, userId?: string): Promise<CartItem[]> => {
    await delay(300);
    const cartKey = userId ? `cart_${userId}` : 'guest_cart';
    const cart: CartItem[] = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const filteredCart = cart.filter((item: CartItem) => item.id !== itemId);
    localStorage.setItem(cartKey, JSON.stringify(filteredCart));
    return filteredCart;
  },

  clearCart: async (userId?: string): Promise<void> => {
    await delay(200);
    const cartKey = userId ? `cart_${userId}` : 'guest_cart';
    localStorage.removeItem(cartKey);
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
      return {
        message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn.'
      };
    }

    // Generate reset token
    const resetToken = 'reset-token-' + Date.now() + '-' + Math.random().toString(36).substring(7);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Save reset token
    const tokens = getResetTokens();
    const filteredTokens = tokens.filter(t => t.email.toLowerCase() !== email.toLowerCase());

    // Lưu token vào localStorage
    filteredTokens.push({ email: user.email, token: resetToken, expiresAt });
    saveResetTokens(filteredTokens);

    // In ra console để debug
    console.log('Reset token saved:', { email: user.email, token: resetToken });


    // Send email using EmailJS
    try {
      // Check if EmailJS is configured
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        const resetLink = `${window.location.origin}/reset-password?token=${resetToken}`;

        await emailjs.send(
          serviceId,
          templateId,
          {
            to_name: user.name,
            to_email: user.email,
            email: user.email, // Fallback for default template variable
            reset_link: resetLink,
            reply_to: 'support@nipponpaint.vn'
          },
          publicKey
        );
        console.log('Email sent successfully via EmailJS');
      } else {
        console.warn('EmailJS not configured. Printing link to console.');
        console.log(`Reset password link for ${email}: ${window.location.origin}/reset-password?token=${resetToken}`);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      // Fallback to console log if email fails
      console.log(`Reset password link for ${email}: ${window.location.origin}/reset-password?token=${resetToken}`);
    }

    return {
      message: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.'
    };
  },

  // User - Reset Password
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    await delay(1000);

    console.log('--- START RESET PASSWORD DEBUG ---');
    console.log('Received token:', token);

    const tokens = getResetTokens();
    console.log('Current tokens in DB:', tokens);

    const tokenData = tokens.find(t => t.token === token);
    console.log('Found token data:', tokenData);

    if (!tokenData) {
      console.error('❌ Token not found in DB');
      throw new Error('Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
    }

    const now = new Date();
    const expires = new Date(tokenData.expiresAt);
    console.log('Time check:', { now, expires, isExpired: expires < now });

    if (expires < now) {
      // Clean up expired token
      const newTokens = tokens.filter(t => t.token !== token);
      saveResetTokens(newTokens);
      console.error('❌ Token expired');
      throw new Error('Liên kết đặt lại mật khẩu đã hết hạn.');
    }

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === tokenData.email.toLowerCase());

    if (userIndex === -1) {
      console.error('❌ User not found for email:', tokenData.email);
      throw new Error('Người dùng không tồn tại.');
    }

    // Update password
    users[userIndex].password = newPassword;
    saveUsers(users);

    // Remove used token
    const newTokens = tokens.filter(t => t.token !== token);
    saveResetTokens(newTokens);

    console.log('✅ Password reset successful');
    console.log('--- END RESET PASSWORD DEBUG ---');

    return { message: 'Mật khẩu đã được đặt lại thành công.' };
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(200);
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');

    if (token && user) {
      const parsedUser = JSON.parse(user);

      // Auto-update session if role is missing
      if (!parsedUser.role) {
        const users = getUsers();
        const freshUser = users.find(u => u.id === parsedUser.id);
        if (freshUser && freshUser.role) {
          const updatedUser = { ...parsedUser, role: freshUser.role };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          return updatedUser;
        }
      }

      return parsedUser;
    }

    return null;
  },

  logout: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // User - Update Profile
  updateProfile: async (userData: { name?: string; phone?: string; email?: string }): Promise<User> => {
    await delay(600);

    const token = localStorage.getItem('auth_token');
    const currentUserStr = localStorage.getItem('user');

    if (!token || !currentUserStr) {
      throw new Error('Bạn cần đăng nhập để cập nhật thông tin');
    }

    const currentUser: User = JSON.parse(currentUserStr);
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Check if email is being changed and if it's already taken
    if (userData.email && userData.email.toLowerCase() !== currentUser.email.toLowerCase()) {
      const emailExists = users.some(
        u => u.id !== currentUser.id && u.email.toLowerCase() === userData.email!.toLowerCase()
      );

      if (emailExists) {
        throw new Error('Email này đã được sử dụng. Vui lòng sử dụng email khác.');
      }
    }

    // Update user data
    const updatedUser: UserWithPassword = {
      ...users[userIndex],
      ...userData,
      id: currentUser.id // Keep original ID
    };

    users[userIndex] = updatedUser;
    saveUsers(users);

    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = updatedUser;

    // Update localStorage
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  },

  // User - Change Password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    await delay(600);

    const token = localStorage.getItem('auth_token');
    const currentUserStr = localStorage.getItem('user');

    if (!token || !currentUserStr) {
      throw new Error('Bạn cần đăng nhập để đổi mật khẩu');
    }

    const currentUser: User = JSON.parse(currentUserStr);
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      throw new Error('Mật khẩu hiện tại không đúng');
    }

    // Update password
    users[userIndex].password = newPassword;
    saveUsers(users);

    return { message: 'Đổi mật khẩu thành công' };
  },

  // User - Google Login (OAuth)
  loginWithGoogle: async (googleData: { email: string; name: string; picture?: string }): Promise<{ user: User; token: string }> => {
    await delay(600);

    const users = getUsers();
    let userWithPassword = users.find(
      u => u.email.toLowerCase() === googleData.email.toLowerCase()
    );

    // If user doesn't exist, create a new one from Google OAuth
    if (!userWithPassword) {
      const newUser: UserWithPassword = {
        id: Date.now(),
        name: googleData.name,
        email: googleData.email,
        password: 'google-oauth-' + Date.now(), // OAuth users don't need password
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      saveUsers(users);
      userWithPassword = newUser;
    }

    // Remove password from user object before returning
    const { password: _, ...user } = userWithPassword;
    const token = 'jwt-token-google-' + Date.now();

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  // User - Update Avatar
  updateAvatar: async (avatarUrl: string): Promise<User> => {
    await delay(600);

    const token = localStorage.getItem('auth_token');
    const currentUserStr = localStorage.getItem('user');

    if (!token || !currentUserStr) {
      throw new Error('Bạn cần đăng nhập để cập nhật avatar');
    }

    const currentUser: User = JSON.parse(currentUserStr);
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Update avatar
    users[userIndex].avatar = avatarUrl;
    saveUsers(users);

    // Remove password from returned user
    const { password: _, ...userWithoutPassword } = users[userIndex];

    // Update localStorage
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return userWithoutPassword;
  }
};

