// Color Mixing Service - Công thức pha màu sơn

export interface BaseColor {
  id: string;
  name: string;
  hex: string;
  pricePerLiter: number; // Giá mỗi lít màu cơ bản
}

export interface ColorFormula {
  id: string;
  name: string;
  description: string;
  targetColor: string; // Màu đích
  baseColors: {
    colorId: string;
    percentage: number; // Phần trăm trong công thức
  }[];
  difficulty: 'easy' | 'medium' | 'hard'; // Độ khó pha
}

export interface CustomMix {
  formula?: ColorFormula; // Công thức đã chọn (nếu có)
  customMix?: {
    colorId: string;
    percentage: number;
  }[]; // Pha tùy chỉnh
  volume: number; // Dung tích (lít)
  basePrice: number; // Giá sơn nền mỗi lít
}

// Màu cơ bản có sẵn
export const BASE_COLORS: BaseColor[] = [
  { id: 'white', name: 'Trắng', hex: '#FFFFFF', pricePerLiter: 0 },
  { id: 'black', name: 'Đen', hex: '#000000', pricePerLiter: 50000 },
  { id: 'red', name: 'Đỏ', hex: '#E60012', pricePerLiter: 80000 },
  { id: 'blue', name: 'Xanh Dương', hex: '#0046AD', pricePerLiter: 80000 },
  { id: 'yellow', name: 'Vàng', hex: '#FFD700', pricePerLiter: 70000 },
  { id: 'green', name: 'Xanh Lá', hex: '#228B22', pricePerLiter: 75000 },
  { id: 'orange', name: 'Cam', hex: '#FFA500', pricePerLiter: 75000 },
  { id: 'purple', name: 'Tím', hex: '#9370DB', pricePerLiter: 85000 },
  { id: 'brown', name: 'Nâu', hex: '#8B4513', pricePerLiter: 70000 },
  { id: 'pink', name: 'Hồng', hex: '#FF69B4', pricePerLiter: 80000 },
];

// Công thức pha màu phổ biến
export const COLOR_FORMULAS: ColorFormula[] = [
  {
    id: 'light-blue',
    name: 'Xanh Dương Nhạt',
    description: 'Màu xanh dương nhẹ nhàng, phù hợp phòng ngủ',
    targetColor: '#87CEEB',
    baseColors: [
      { colorId: 'white', percentage: 70 },
      { colorId: 'blue', percentage: 30 },
    ],
    difficulty: 'easy',
  },
  {
    id: 'peach',
    name: 'Màu Đào',
    description: 'Màu ấm áp, tạo không khí ấm cúng',
    targetColor: '#FFDAB9',
    baseColors: [
      { colorId: 'white', percentage: 80 },
      { colorId: 'orange', percentage: 15 },
      { colorId: 'red', percentage: 5 },
    ],
    difficulty: 'easy',
  },
  {
    id: 'mint-green',
    name: 'Xanh Bạc Hà',
    description: 'Màu tươi mát, phù hợp phòng tắm',
    targetColor: '#98FB98',
    baseColors: [
      { colorId: 'white', percentage: 75 },
      { colorId: 'green', percentage: 20 },
      { colorId: 'blue', percentage: 5 },
    ],
    difficulty: 'easy',
  },
  {
    id: 'lavender',
    name: 'Tím Oải Hương',
    description: 'Màu dịu nhẹ, thư giãn',
    targetColor: '#E6E6FA',
    baseColors: [
      { colorId: 'white', percentage: 85 },
      { colorId: 'purple', percentage: 12 },
      { colorId: 'blue', percentage: 3 },
    ],
    difficulty: 'medium',
  },
  {
    id: 'beige',
    name: 'Be',
    description: 'Màu trung tính, dễ phối hợp',
    targetColor: '#F5DEB3',
    baseColors: [
      { colorId: 'white', percentage: 90 },
      { colorId: 'yellow', percentage: 7 },
      { colorId: 'brown', percentage: 3 },
    ],
    difficulty: 'easy',
  },
  {
    id: 'coral',
    name: 'San Hô',
    description: 'Màu năng động, trẻ trung',
    targetColor: '#FF7F50',
    baseColors: [
      { colorId: 'white', percentage: 60 },
      { colorId: 'orange', percentage: 30 },
      { colorId: 'red', percentage: 10 },
    ],
    difficulty: 'medium',
  },
  {
    id: 'sage-green',
    name: 'Xanh Xám',
    description: 'Màu hiện đại, sang trọng',
    targetColor: '#9CAF88',
    baseColors: [
      { colorId: 'white', percentage: 70 },
      { colorId: 'green', percentage: 20 },
      { colorId: 'black', percentage: 10 },
    ],
    difficulty: 'hard',
  },
  {
    id: 'cream',
    name: 'Kem',
    description: 'Màu ấm áp, cổ điển',
    targetColor: '#FFFDD0',
    baseColors: [
      { colorId: 'white', percentage: 95 },
      { colorId: 'yellow', percentage: 5 },
    ],
    difficulty: 'easy',
  },
];

// Tính giá dựa trên công thức pha màu
export function calculateMixPrice(mix: CustomMix): number {
  const { formula, customMix, volume, basePrice } = mix;
  
  let totalColorPrice = 0;
  const colorsToUse = formula ? formula.baseColors : (customMix || []);
  
  // Tính giá màu cơ bản cần dùng
  colorsToUse.forEach(({ colorId, percentage }) => {
    const baseColor = BASE_COLORS.find(c => c.id === colorId);
    if (baseColor) {
      const colorVolume = (volume * percentage) / 100;
      totalColorPrice += baseColor.pricePerLiter * colorVolume;
    }
  });
  
  // Giá sơn nền
  const basePaintPrice = basePrice * volume;
  
  // Phí pha màu (tùy độ khó)
  let mixingFee = 0;
  if (formula) {
    switch (formula.difficulty) {
      case 'easy':
        mixingFee = volume * 20000; // 20k/lít
        break;
      case 'medium':
        mixingFee = volume * 30000; // 30k/lít
        break;
      case 'hard':
        mixingFee = volume * 50000; // 50k/lít
        break;
    }
  } else if (customMix) {
    // Pha tùy chỉnh: tính theo số lượng màu
    const colorCount = customMix.length;
    mixingFee = volume * (20000 + colorCount * 10000); // 20k + 10k/mỗi màu thêm
  }
  
  return basePaintPrice + totalColorPrice + mixingFee;
}

// Tính toán màu kết quả từ công thức (đơn giản hóa)
export function calculateResultColor(mix: CustomMix): string {
  const { formula, customMix } = mix;
  const colorsToUse = formula ? formula.baseColors : (customMix || []);
  
  if (colorsToUse.length === 0) return '#FFFFFF';
  
  // Tính toán RGB trung bình có trọng số
  let totalR = 0, totalG = 0, totalB = 0;
  let totalWeight = 0;
  
  colorsToUse.forEach(({ colorId, percentage }) => {
    const baseColor = BASE_COLORS.find(c => c.id === colorId);
    if (baseColor) {
      const hex = baseColor.hex;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      
      totalR += r * percentage;
      totalG += g * percentage;
      totalB += b * percentage;
      totalWeight += percentage;
    }
  });
  
  if (totalWeight === 0) return '#FFFFFF';
  
  const avgR = Math.round(totalR / totalWeight);
  const avgG = Math.round(totalG / totalWeight);
  const avgB = Math.round(totalB / totalWeight);
  
  return `#${avgR.toString(16).padStart(2, '0')}${avgG.toString(16).padStart(2, '0')}${avgB.toString(16).padStart(2, '0')}`;
}

// Lấy thông tin chi tiết công thức
export function getFormulaDetails(formulaId: string): ColorFormula | null {
  return COLOR_FORMULAS.find(f => f.id === formulaId) || null;
}

// Validate công thức pha tùy chỉnh
export function validateCustomMix(customMix: { colorId: string; percentage: number }[]): {
  valid: boolean;
  error?: string;
} {
  if (customMix.length === 0) {
    return { valid: false, error: 'Vui lòng chọn ít nhất một màu' };
  }
  
  const totalPercentage = customMix.reduce((sum, item) => sum + item.percentage, 0);
  
  if (Math.abs(totalPercentage - 100) > 0.1) {
    return { valid: false, error: `Tổng phần trăm phải bằng 100% (hiện tại: ${totalPercentage.toFixed(1)}%)` };
  }
  
  const hasNegative = customMix.some(item => item.percentage < 0);
  if (hasNegative) {
    return { valid: false, error: 'Phần trăm không được âm' };
  }
  
  return { valid: true };
}

