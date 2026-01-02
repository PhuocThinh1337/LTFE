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
    // 1. Voucher giảm phí vận chuyển (Freeship)
    {
        id: 1,
        code: 'FREESHIP',
        description: 'Miễn phí vận chuyển cho đơn từ 1 triệu',
        type: 'shipping',
        discountType: 'fixed',
        value: 50000, // Coi như phí ship tối đa được giảm là 50k
        minOrderValue: 1000000,
        startDate: '2024-01-01',
        endDate: '2026-12-31',
        usageLimit: 1000,
        usedCount: 150,
        isActive: true
    },

    // 2. Voucher giảm tổng đơn hàng (Giảm 10%)
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

    // 3. Voucher giảm tổng đơn hàng (Giảm tiền mặt 100k)
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

    // 4. Voucher áp dụng riêng cho loại sơn (Sơn Dân Dụng)
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

    // 5. Voucher hết hạn (để test lỗi)
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

    // 6. Voucher hết lượt dùng (để test lỗi)
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
    }
];
