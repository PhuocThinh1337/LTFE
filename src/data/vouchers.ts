export type VoucherType = 'shipping' | 'total' | 'category';
export type DiscountType = 'percentage' | 'fixed';

export interface Voucher {
    id: number;
    code: string;
    description: string;
    type: VoucherType; // shipping, total, category
    targetCategory?: string; // Nếu type là 'category', ví dụ: 'Sơn dân dụng'
    discountType: DiscountType; // percentage (%), fixed (VND)
    value: number; // 10 (10%) hoặc 50000 (50k)
    maxDiscount?: number; // Giảm tối đa bao nhiêu (cho loại %)
    minOrderValue?: number; // Đơn tối thiểu để áp dụng
    startDate: string; // ISO date string YYYY-MM-DD
    endDate: string; // ISO date string YYYY-MM-DD
    usageLimit: number; // Tổng số lượt dùng
    usedCount: number; // Số lượt đã dùng
    isActive: boolean;
}

export const VOUCHERS: Voucher[] = [
    // 2. Voucher giảm tổng đơn hàng (Giảm 10%) - giữ nguyên
    {
        id: 2,
        code: 'WELCOME10',
        description: 'Giảm 10% cho đơn hàng đầu tiên',
        type: 'total',
        discountType: 'percentage',
        value: 10, // 10%
        maxDiscount: 200000, // Giảm tối đa 200k
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        usageLimit: 500,
        usedCount: 45,
        isActive: true
    },

    // 3. Voucher giảm tổng đơn hàng (Giảm tiền mặt 100k) - giữ nguyên
    {
        id: 3,
        code: 'TET2025',
        description: 'Giảm ngay 100k ăn Tết',
        type: 'total',
        discountType: 'fixed',
        value: 100000,
        minOrderValue: 2000000,
        startDate: '2025-01-01',
        endDate: '2026-02-28',
        usageLimit: 100,
        usedCount: 10,
        isActive: true
    },

    // 4. Voucher áp dụng riêng cho loại sơn (Sơn Dân Dụng) - giữ nguyên
    {
        id: 4,
        code: 'DANDUNG20',
        description: 'Giảm 20% khi mua các sản phẩm Sơn dân dụng',
        type: 'category',
        targetCategory: 'Sơn dân dụng',
        discountType: 'percentage',
        value: 20,
        maxDiscount: 500000,
        startDate: '2024-06-01',
        endDate: '2026-12-31',
        usageLimit: 200,
        usedCount: 88,
        isActive: true
    },

    // 5. Voucher hết hạn (để test lỗi) - giữ nguyên
    {
        id: 5,
        code: 'EXPIRED',
        description: 'Voucher đã hết hạn',
        type: 'total',
        discountType: 'percentage',
        value: 50,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        usageLimit: 100,
        usedCount: 10,
        isActive: false
    },

    // 6. Voucher hết lượt dùng (để test lỗi) - giữ nguyên
    {
        id: 6,
        code: 'SOLDOUT',
        description: 'Voucher đã hết lượt sử dụng',
        type: 'total',
        discountType: 'fixed',
        value: 20000,
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        usageLimit: 10,
        usedCount: 10, // Đã dùng hết
        isActive: true
    },

    // === VOUCHER MỚI THÊM VÀO ===

    // 7. Voucher giảm cho Sơn công nghiệp
    {
        id: 7,
        code: 'CONGNGHIEP15',
        description: 'Giảm 15% khi mua Sơn công nghiệp',
        type: 'category',
        targetCategory: 'Sơn công nghiệp',
        discountType: 'percentage',
        value: 15,
        maxDiscount: 300000,
        minOrderValue: 500000,
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        usageLimit: 300,
        usedCount: 25,
        isActive: true
    },

    // 8. Voucher giảm cho Sơn ngoại thất
    {
        id: 8,
        code: 'NGOAITRAT25',
        description: 'Giảm 25% khi mua Sơn ngoại thất',
        type: 'category',
        targetCategory: 'Sơn ngoại thất',
        discountType: 'percentage',
        value: 25,
        maxDiscount: 750000,
        minOrderValue: 1000000,
        startDate: '2024-03-01',
        endDate: '2026-12-31',
        usageLimit: 150,
        usedCount: 12,
        isActive: true
    },

    // 9. Voucher giảm tổng đơn hàng 50k
    {
        id: 9,
        code: 'GIAM50K',
        description: 'Giảm ngay 50k cho mọi đơn hàng',
        type: 'total',
        discountType: 'fixed',
        value: 50000,
        minOrderValue: 500000,
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        usageLimit: 800,
        usedCount: 67,
        isActive: true
    },

    // 10. Voucher giảm 5% cho đơn lớn
    {
        id: 10,
        code: 'DONLON5',
        description: 'Giảm 5% cho đơn hàng từ 5 triệu',
        type: 'total',
        discountType: 'percentage',
        value: 5,
        maxDiscount: 250000,
        minOrderValue: 5000000,
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        usageLimit: 200,
        usedCount: 15,
        isActive: true
    },

    // 11. Voucher giảm cho Sơn nội thất
    {
        id: 11,
        code: 'NOITHAT18',
        description: 'Giảm 18% khi mua Sơn nội thất',
        type: 'category',
        targetCategory: 'Sơn nội thất',
        discountType: 'percentage',
        value: 18,
        maxDiscount: 400000,
        minOrderValue: 300000,
        startDate: '2024-02-01',
        endDate: '2026-12-31',
        usageLimit: 250,
        usedCount: 33,
        isActive: true
    },

    // 12. Voucher mùa hè
    {
        id: 12,
        code: 'MUAHE30',
        description: 'Giảm 30k cho mùa hè sôi động',
        type: 'total',
        discountType: 'fixed',
        value: 30000,
        startDate: '2025-05-01',
        endDate: '2025-08-31',
        usageLimit: 500,
        usedCount: 89,
        isActive: true
    },

    // 13. Voucher cho khách hàng VIP
    {
        id: 13,
        code: 'VIP2025',
        description: 'Giảm 25% dành cho khách hàng VIP',
        type: 'total',
        discountType: 'percentage',
        value: 25,
        maxDiscount: 500000,
        minOrderValue: 1000000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimit: 100,
        usedCount: 8,
        isActive: true
    },

    // 14. Voucher giảm cho Sơn chống thấm
    {
        id: 14,
        code: 'CHONGTHAM12',
        description: 'Giảm 12% khi mua Sơn chống thấm',
        type: 'category',
        targetCategory: 'Sơn chống thấm',
        discountType: 'percentage',
        value: 12,
        maxDiscount: 200000,
        minOrderValue: 200000,
        startDate: '2024-04-01',
        endDate: '2026-12-31',
        usageLimit: 180,
        usedCount: 45,
        isActive: true
    },

    // 15. Voucher flash sale
    {
        id: 15,
        code: 'FLASH50',
        description: 'Flash sale giảm 50k trong 24h',
        type: 'total',
        discountType: 'fixed',
        value: 50000,
        minOrderValue: 300000,
        startDate: '2025-01-06',
        endDate: '2025-01-07',
        usageLimit: 100,
        usedCount: 23,
        isActive: true
    }
];
