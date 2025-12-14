// Mock API service for development
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'; // hoặc sử dụng local JSON server

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  colors?: string[];
  inStock: boolean;
}

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

// Mock data
const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Sơn Nippon Spot-less Plus',
        description: 'Dòng sơn phủ nội thất cao cấp sử dụng công nghệ chống bám bẩn và công nghệ Ion bạc',
        price: 450000,
        category: 'noi-that',
        image: '/images/products/spot-less-plus.jpg',
        colors: ['Trắng ngọc trai', 'Trắng tinh khôi', 'Xanh dương nhạt'],
        inStock: true
      },
      {
        id: 2,
        name: 'Sơn Nippon WeatherGard Plus+',
        description: 'Dòng sơn nước ngoại thất cao cấp với độ bền ấn tượng, khả năng chống bám bụi và chống thấm nước',
        price: 520000,
        category: 'ngoai-that',
        image: '/images/products/weathergard-plus.jpg',
        colors: ['Trắng', 'Xanh dương navy', 'Xám titanium'],
        inStock: true
      },
      {
        id: 3,
        name: 'Sơn Nippon Trắng Trần Toàn Diện',
        description: 'EASY WASH là sơn nội thất cao cấp với tính năng dễ lau chùi vượt trội',
        price: 380000,
        category: 'noi-that',
        image: '/images/products/easy-wash.jpg',
        colors: ['Trắng', 'Trắng ngọc trai'],
        inStock: true
      },
      {
        id: 4,
        name: 'Sơn Nippon Super Strong',
        description: 'Sơn siêu bền cho bề mặt kim loại và gỗ với khả năng chống va đập cao',
        price: 680000,
        category: 'chuyen-dung',
        image: '/images/products/super-strong.jpg',
        colors: ['Đen', 'Trắng', 'Xanh dương', 'Đỏ'],
        inStock: true
      },
      {
        id: 5,
        name: 'Sơn Nippon Anti-Mold',
        description: 'Sơn chống mốc mốc chuyên dụng cho khu vực ẩm ướt như nhà tắm, bếp',
        price: 420000,
        category: 'noi-that',
        image: '/images/products/anti-mold.jpg',
        colors: ['Trắng', 'Xanh dương nhạt', 'Xanh lá nhạt'],
        inStock: true
      },
      {
        id: 6,
        name: 'Sơn Nippon Floor Guard',
        description: 'Sơn bảo vệ sàn chuyên dụng với độ bền cao và dễ vệ sinh',
        price: 750000,
        category: 'san',
        image: '/images/products/floor-guard.jpg',
        colors: ['Trong suốt', 'Trắng sữa', 'Xám nhạt'],
        inStock: true
      },
      {
        id: 7,
        name: 'Sơn Nippon Metallic',
        description: 'Sơn kim loại cao cấp tạo hiệu ứng ánh kim với nhiều màu sắc lựa chọn',
        price: 890000,
        category: 'ngoai-that',
        image: '/images/products/metallic.jpg',
        colors: ['Bạc', 'Vàng', 'Đồng', 'Hồng'],
        inStock: true
      },
      {
        id: 8,
        name: 'Sơn Nippon Wood Stain',
        description: 'Sơn phủ gỗ tự nhiên giữ nguyên vân gỗ với khả năng chống thấm nước',
        price: 560000,
        category: 'go',
        image: '/images/products/wood-stain.jpg',
        colors: ['Nâu sáng', 'Nâu tối', 'Vàng gỗ', 'Đỏ gỗ'],
        inStock: true
      },
      {
        id: 9,
        name: 'Sơn Nippon Fire Guard',
        description: 'Sơn chống cháy chuyên dụng đạt chuẩn mực an toàn cao nhất',
        price: 1200000,
        category: 'chuyen-dung',
        image: '/images/products/fire-guard.jpg',
        colors: ['Trắng', 'Xám', 'Đỏ'],
        inStock: true
      },
      {
        id: 10,
        name: 'Sơn Nippon Eco Green',
        description: 'Sơn thân thiện môi trường, ít VOC, an toàn cho sức khỏe gia đình',
        price: 490000,
        category: 'noi-that',
        image: '/images/products/eco-green.jpg',
        colors: ['Trắng', 'Xanh lá', 'Xanh dương', 'Vàng nhạt'],
        inStock: true
      }
];

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
  // Products
  getProducts: async (): Promise<Product[]> => {
    await delay(500); // Simulate network delay
    return mockProducts;
  },

  getProduct: async (id: number): Promise<Product | null> => {
    await delay(300);
    return mockProducts.find(p => p.id === id) || null;
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    await delay(400);
    return mockProducts.filter(p => p.category === category);
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

