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
    },


    // 16. Voucher Valentine
    {
        id: 16,
        code: 'VALENTINE25',
        description: 'Giảm 25k cho ngày lễ tình nhân',
        type: 'total',
        discountType: 'fixed',
        value: 25000,
        minOrderValue: 200000,
        startDate: '2025-02-01',
        endDate: '2025-02-28',
        usageLimit: 300,
        usedCount: 45,
        isActive: true
    },

    // 17. Voucher giảm cho Sơn ngoại thất cao cấp
    {
        id: 17,
        code: 'EXTERIOR35',
        description: 'Giảm 35% khi mua Sơn ngoại thất cao cấp',
        type: 'category',
        targetCategory: 'Sơn ngoại thất',
        discountType: 'percentage',
        value: 35,
        maxDiscount: 1000000,
        minOrderValue: 800000,
        startDate: '2025-01-15',
        endDate: '2025-03-15',
        usageLimit: 150,
        usedCount: 28,
        isActive: true
    },

    // 18. Voucher mùa xuân
    {
        id: 18,
        code: 'SPRING20',
        description: 'Giảm 20% mừng xuân mới',
        type: 'total',
        discountType: 'percentage',
        value: 20,
        maxDiscount: 150000,
        minOrderValue: 300000,
        startDate: '2025-01-29',
        endDate: '2025-02-15',
        usageLimit: 500,
        usedCount: 89,
        isActive: true
    },

    // 19. Voucher miễn phí vận chuyển
    {
        id: 19,
        code: 'FREESHIP100',
        description: 'Miễn phí vận chuyển cho đơn hàng từ 2 triệu',
        type: 'shipping',
        discountType: 'fixed',
        value: 50000,
        minOrderValue: 2000000,
        startDate: '2025-01-10',
        endDate: '2025-12-31',
        usageLimit: 200,
        usedCount: 67,
        isActive: true
    },

    // 20. Voucher giảm cho Sơn gỗ
    {
        id: 20,
        code: 'WOOD15',
        description: 'Giảm 15% khi mua Sơn gỗ',
        type: 'category',
        targetCategory: 'Sơn gỗ',
        discountType: 'percentage',
        value: 15,
        maxDiscount: 200000,
        minOrderValue: 150000,
        startDate: '2025-02-01',
        endDate: '2025-12-31',
        usageLimit: 180,
        usedCount: 34,
        isActive: true
    },

    // 21. Voucher sinh nhật công ty
    {
        id: 21,
        code: 'BIRTHDAY40',
        description: 'Giảm 40k mừng sinh nhật Nippon Paint',
        type: 'total',
        discountType: 'fixed',
        value: 40000,
        minOrderValue: 500000,
        startDate: '2025-03-15',
        endDate: '2025-03-20',
        usageLimit: 1000,
        usedCount: 234,
        isActive: true
    },

    // 22. Voucher giảm cho Sơn chống nước
    {
        id: 22,
        code: 'WATERPROOF22',
        description: 'Giảm 22% khi mua Sơn chống nước',
        type: 'category',
        targetCategory: 'Sơn chống thấm',
        discountType: 'percentage',
        value: 22,
        maxDiscount: 300000,
        minOrderValue: 250000,
        startDate: '2025-01-20',
        endDate: '2025-06-20',
        usageLimit: 250,
        usedCount: 56,
        isActive: true
    },

    // 23. Voucher cuối tuần
    {
        id: 23,
        code: 'WEEKEND30',
        description: 'Giảm 30k cho đơn hàng cuối tuần',
        type: 'total',
        discountType: 'fixed',
        value: 30000,
        startDate: '2025-01-15',
        endDate: '2025-12-31',
        usageLimit: 400,
        usedCount: 123,
        isActive: true
    },

    // 24. Voucher giảm cho Sơn nội thất cao cấp
    {
        id: 24,
        code: 'INTERIOR28',
        description: 'Giảm 28% khi mua Sơn nội thất cao cấp',
        type: 'category',
        targetCategory: 'Sơn nội thất',
        discountType: 'percentage',
        value: 28,
        maxDiscount: 500000,
        minOrderValue: 400000,
        startDate: '2025-02-01',
        endDate: '2025-04-30',
        usageLimit: 200,
        usedCount: 41,
        isActive: true
    },

    // 25. Voucher mùa hè 2025
    {
        id: 25,
        code: 'SUMMER45',
        description: 'Giảm 45k cho mùa hè năng động',
        type: 'total',
        discountType: 'fixed',
        value: 45000,
        minOrderValue: 600000,
        startDate: '2025-05-01',
        endDate: '2025-08-31',
        usageLimit: 350,
        usedCount: 78,
        isActive: true
    },

    // 26. Voucher giảm cho Sơn công nghiệp hạng nặng
    {
        id: 26,
        code: 'INDUSTRIAL18',
        description: 'Giảm 18% khi mua Sơn công nghiệp hạng nặng',
        type: 'category',
        targetCategory: 'Sơn công nghiệp',
        discountType: 'percentage',
        value: 18,
        maxDiscount: 800000,
        minOrderValue: 1000000,
        startDate: '2025-01-25',
        endDate: '2025-12-31',
        usageLimit: 120,
        usedCount: 19,
        isActive: true
    },

    // 27. Voucher khách hàng mới
    {
        id: 27,
        code: 'NEWUSER15',
        description: 'Giảm 15% cho khách hàng mới',
        type: 'total',
        discountType: 'percentage',
        value: 15,
        maxDiscount: 100000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimit: 800,
        usedCount: 156,
        isActive: true
    },

    // 28. Voucher giảm cho Sơn chống cháy
    {
        id: 28,
        code: 'FIREPROOF25',
        description: 'Giảm 25% khi mua Sơn chống cháy',
        type: 'category',
        targetCategory: 'Sơn chống cháy',
        discountType: 'percentage',
        value: 25,
        maxDiscount: 600000,
        minOrderValue: 500000,
        startDate: '2025-03-01',
        endDate: '2025-12-31',
        usageLimit: 100,
        usedCount: 12,
        isActive: true
    },

    // 29. Voucher quốc tế phụ nữ
    {
        id: 29,
        code: 'WOMENDAY35',
        description: 'Giảm 35k nhân ngày Quốc tế Phụ nữ',
        type: 'total',
        discountType: 'fixed',
        value: 35000,
        minOrderValue: 400000,
        startDate: '2025-03-08',
        endDate: '2025-03-10',
        usageLimit: 600,
        usedCount: 178,
        isActive: true
    },

    // 30. Voucher giảm cho Sơn trang trí
    {
        id: 30,
        code: 'DECORATIVE20',
        description: 'Giảm 20% khi mua Sơn trang trí nghệ thuật',
        type: 'category',
        targetCategory: 'Sơn trang trí',
        discountType: 'percentage',
        value: 20,
        maxDiscount: 250000,
        minOrderValue: 200000,
        startDate: '2025-02-15',
        endDate: '2025-05-15',
        usageLimit: 180,
        usedCount: 43,
        isActive: true
    },

    // 31. Voucher mùa thu
    {
        id: 31,
        code: 'AUTUMN40',
        description: 'Giảm 40k cho mùa thu lãng mạn',
        type: 'total',
        discountType: 'fixed',
        value: 40000,
        minOrderValue: 500000,
        startDate: '2025-09-01',
        endDate: '2025-11-30',
        usageLimit: 450,
        usedCount: 67,
        isActive: true
    },

    // 32. Voucher giảm cho Sơn epoxy
    {
        id: 32,
        code: 'EPOXY30',
        description: 'Giảm 30% khi mua Sơn epoxy công nghiệp',
        type: 'category',
        targetCategory: 'Sơn epoxy',
        discountType: 'percentage',
        value: 30,
        maxDiscount: 900000,
        minOrderValue: 800000,
        startDate: '2025-04-01',
        endDate: '2025-12-31',
        usageLimit: 80,
        usedCount: 15,
        isActive: true
    },

    // 33. Voucher khách hàng thân thiết
    {
        id: 33,
        code: 'LOYALTY25',
        description: 'Giảm 25% cho khách hàng thân thiết',
        type: 'total',
        discountType: 'percentage',
        value: 25,
        maxDiscount: 200000,
        minOrderValue: 300000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimit: 300,
        usedCount: 89,
        isActive: true
    },

    // 34. Voucher giảm cho Sơn polyurethane
    {
        id: 34,
        code: 'POLYURETHANE22',
        description: 'Giảm 22% khi mua Sơn polyurethane',
        type: 'category',
        targetCategory: 'Sơn polyurethane',
        discountType: 'percentage',
        value: 22,
        maxDiscount: 400000,
        minOrderValue: 350000,
        startDate: '2025-03-15',
        endDate: '2025-08-15',
        usageLimit: 150,
        usedCount: 32,
        isActive: true
    },

    // 35. Voucher noel
    {
        id: 35,
        code: 'NOEL60',
        description: 'Giảm 60k mừng Giáng sinh',
        type: 'total',
        discountType: 'fixed',
        value: 60000,
        minOrderValue: 800000,
        startDate: '2025-12-20',
        endDate: '2025-12-25',
        usageLimit: 800,
        usedCount: 245,
        isActive: true
    },

    // 36. Voucher giảm cho Sơn acrylic
    {
        id: 36,
        code: 'ACRYLIC18',
        description: 'Giảm 18% khi mua Sơn acrylic',
        type: 'category',
        targetCategory: 'Sơn acrylic',
        discountType: 'percentage',
        value: 18,
        maxDiscount: 150000,
        minOrderValue: 150000,
        startDate: '2025-02-20',
        endDate: '2025-07-20',
        usageLimit: 220,
        usedCount: 54,
        isActive: true
    },

    // 37. Voucher năm mới
    {
        id: 37,
        code: 'NEWYEAR55',
        description: 'Giảm 55k đón năm mới',
        type: 'total',
        discountType: 'fixed',
        value: 55000,
        minOrderValue: 700000,
        startDate: '2024-12-30',
        endDate: '2025-01-05',
        usageLimit: 1000,
        usedCount: 456,
        isActive: true
    },

    // 38. Voucher giảm cho Sơn chống rỉ sét
    {
        id: 38,
        code: 'ANTIRUST28',
        description: 'Giảm 28% khi mua Sơn chống rỉ sét',
        type: 'category',
        targetCategory: 'Sơn chống rỉ',
        discountType: 'percentage',
        value: 28,
        maxDiscount: 350000,
        minOrderValue: 300000,
        startDate: '2025-04-01',
        endDate: '2025-09-30',
        usageLimit: 160,
        usedCount: 38,
        isActive: true
    },

    // 39. Voucher lễ hội
    {
        id: 39,
        code: 'FESTIVAL35',
        description: 'Giảm 35k cho các dịp lễ hội',
        type: 'total',
        discountType: 'fixed',
        value: 35000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimit: 600,
        usedCount: 167,
        isActive: true
    },

    // 40. Voucher giảm cho Sơn nhiệt
    {
        id: 40,
        code: 'HEATRESIST32',
        description: 'Giảm 32% khi mua Sơn chịu nhiệt',
        type: 'category',
        targetCategory: 'Sơn chịu nhiệt',
        discountType: 'percentage',
        value: 32,
        maxDiscount: 500000,
        minOrderValue: 400000,
        startDate: '2025-05-01',
        endDate: '2025-10-31',
        usageLimit: 100,
        usedCount: 21,
        isActive: true
    },

    // 41. Voucher khách hàng doanh nghiệp
    {
        id: 41,
        code: 'BUSINESS30',
        description: 'Giảm 30% cho khách hàng doanh nghiệp',
        type: 'total',
        discountType: 'percentage',
        value: 30,
        maxDiscount: 500000,
        minOrderValue: 2000000,
        startDate: '2025-01-15',
        endDate: '2025-12-31',
        usageLimit: 200,
        usedCount: 45,
        isActive: true
    },

    // 42. Voucher giảm cho Sơn chống tĩnh điện
    {
        id: 42,
        code: 'ANTISTATIC20',
        description: 'Giảm 20% khi mua Sơn chống tĩnh điện',
        type: 'category',
        targetCategory: 'Sơn chống tĩnh điện',
        discountType: 'percentage',
        value: 20,
        maxDiscount: 300000,
        minOrderValue: 250000,
        startDate: '2025-03-20',
        endDate: '2025-08-20',
        usageLimit: 120,
        usedCount: 28,
        isActive: true
    },

    // 43. Voucher mùa đông
    {
        id: 43,
        code: 'WINTER45',
        description: 'Giảm 45k cho mùa đông ấm áp',
        type: 'total',
        discountType: 'fixed',
        value: 45000,
        minOrderValue: 600000,
        startDate: '2025-11-01',
        endDate: '2026-02-28',
        usageLimit: 400,
        usedCount: 89,
        isActive: true
    },

    // 44. Voucher giảm cho Sơn fluorocarbon
    {
        id: 44,
        code: 'FLUOROCARBON40',
        description: 'Giảm 40% khi mua Sơn fluorocarbon cao cấp',
        type: 'category',
        targetCategory: 'Sơn fluorocarbon',
        discountType: 'percentage',
        value: 40,
        maxDiscount: 1200000,
        minOrderValue: 1000000,
        startDate: '2025-06-01',
        endDate: '2025-12-31',
        usageLimit: 50,
        usedCount: 8,
        isActive: true
    },

    // 45. Voucher khách hàng thân thiết vàng
    {
        id: 45,
        code: 'GOLDMEMBER35',
        description: 'Giảm 35% cho thành viên vàng',
        type: 'total',
        discountType: 'percentage',
        value: 35,
        maxDiscount: 300000,
        minOrderValue: 500000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimit: 250,
        usedCount: 67,
        isActive: true
    },

    // 46. Voucher giảm cho Sơn chống khuẩn
    {
        id: 46,
        code: 'ANTIBACTERIAL25',
        description: 'Giảm 25% khi mua Sơn chống khuẩn',
        type: 'category',
        targetCategory: 'Sơn chống khuẩn',
        discountType: 'percentage',
        value: 25,
        maxDiscount: 200000,
        minOrderValue: 180000,
        startDate: '2025-04-15',
        endDate: '2025-09-15',
        usageLimit: 180,
        usedCount: 43,
        isActive: true
    },

    // 47. Voucher lễ 30/4
    {
        id: 47,
        code: 'LIBERATION50',
        description: 'Giảm 50k mừng ngày giải phóng',
        type: 'total',
        discountType: 'fixed',
        value: 50000,
        minOrderValue: 700000,
        startDate: '2025-04-30',
        endDate: '2025-05-02',
        usageLimit: 700,
        usedCount: 189,
        isActive: true
    },

    // 48. Voucher giảm cho Sơn tự san phẳng
    {
        id: 48,
        code: 'SELFLEVELING22',
        description: 'Giảm 22% khi mua Sơn tự san phẳng',
        type: 'category',
        targetCategory: 'Sơn tự san',
        discountType: 'percentage',
        value: 22,
        maxDiscount: 400000,
        minOrderValue: 300000,
        startDate: '2025-05-01',
        endDate: '2025-10-01',
        usageLimit: 140,
        usedCount: 31,
        isActive: true
    },

    // 49. Voucher khách hàng thân thiết bạc
    {
        id: 49,
        code: 'SILVERMEMBER20',
        description: 'Giảm 20% cho thành viên bạc',
        type: 'total',
        discountType: 'percentage',
        value: 20,
        maxDiscount: 150000,
        minOrderValue: 250000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimit: 400,
        usedCount: 112,
        isActive: true
    },

    // 50. Voucher giảm cho Sơn chống cháy đặc biệt
    {
        id: 50,
        code: 'FIREPROOF35',
        description: 'Giảm 35% khi mua Sơn chống cháy hạng A',
        type: 'category',
        targetCategory: 'Sơn chống cháy',
        discountType: 'percentage',
        value: 35,
        maxDiscount: 800000,
        minOrderValue: 600000,
        startDate: '2025-07-01',
        endDate: '2025-12-31',
        usageLimit: 80,
        usedCount: 16,
        isActive: true
    },

    // 51. Voucher lễ 1/5
    {
        id: 51,
        code: 'LABORDAY40',
        description: 'Giảm 40k mừng ngày Quốc tế Lao động',
        type: 'total',
        discountType: 'fixed',
        value: 40000,
        minOrderValue: 500000,
        startDate: '2025-05-01',
        endDate: '2025-05-05',
        usageLimit: 600,
        usedCount: 156,
        isActive: true
    },

    // 52. Voucher giảm cho Sơn chống thấm nâng cao
    {
        id: 52,
        code: 'WATERPROOFADV28',
        description: 'Giảm 28% khi mua Sơn chống thấm nâng cao',
        type: 'category',
        targetCategory: 'Sơn chống thấm',
        discountType: 'percentage',
        value: 28,
        maxDiscount: 450000,
        minOrderValue: 350000,
        startDate: '2025-06-01',
        endDate: '2025-11-30',
        usageLimit: 160,
        usedCount: 37,
        isActive: true
    },

    // 53. Voucher khách hàng thân thiết kim cương
    {
        id: 53,
        code: 'DIAMONDMEMBER45',
        description: 'Giảm 45% cho thành viên kim cương',
        type: 'total',
        discountType: 'percentage',
        value: 45,
        maxDiscount: 1000000,
        minOrderValue: 1500000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimit: 100,
        usedCount: 23,
        isActive: true
    },

    // 54. Voucher giảm cho Sơn cách nhiệt
    {
        id: 54,
        code: 'THERMALINSUL30',
        description: 'Giảm 30% khi mua Sơn cách nhiệt',
        type: 'category',
        targetCategory: 'Sơn cách nhiệt',
        discountType: 'percentage',
        value: 30,
        maxDiscount: 600000,
        minOrderValue: 500000,
        startDate: '2025-08-01',
        endDate: '2025-12-31',
        usageLimit: 90,
        usedCount: 18,
        isActive: true
    },

    // 55. Voucher lễ trung thu
    {
        id: 55,
        code: 'MIDAUTUMN55',
        description: 'Giảm 55k mừng trung thu',
        type: 'total',
        discountType: 'fixed',
        value: 55000,
        minOrderValue: 750000,
        startDate: '2025-09-15',
        endDate: '2025-09-20',
        usageLimit: 500,
        usedCount: 134,
        isActive: true
    },

    // 56. Voucher giảm cho Sơn phản quang
    {
        id: 56,
        code: 'REFLECTIVE25',
        description: 'Giảm 25% khi mua Sơn phản quang',
        type: 'category',
        targetCategory: 'Sơn phản quang',
        discountType: 'percentage',
        value: 25,
        maxDiscount: 350000,
        minOrderValue: 300000,
        startDate: '2025-07-15',
        endDate: '2025-12-15',
        usageLimit: 130,
        usedCount: 29,
        isActive: true
    },

    // 57. Voucher khách hàng thân thiết platinum
    {
        id: 57,
        code: 'PLATINUMMEMBER40',
        description: 'Giảm 40% cho thành viên platinum',
        type: 'total',
        discountType: 'percentage',
        value: 40,
        maxDiscount: 800000,
        minOrderValue: 1200000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimit: 150,
        usedCount: 41,
        isActive: true
    },

    // 58. Voucher giảm cho Sơn chống oxy hóa
    {
        id: 58,
        code: 'ANTIOXIDANT20',
        description: 'Giảm 20% khi mua Sơn chống oxy hóa',
        type: 'category',
        targetCategory: 'Sơn chống oxy hóa',
        discountType: 'percentage',
        value: 20,
        maxDiscount: 250000,
        minOrderValue: 200000,
        startDate: '2025-08-20',
        endDate: '2025-12-20',
        usageLimit: 140,
        usedCount: 33,
        isActive: true
    },

    // 59. Voucher lễ quốc khánh
    {
        id: 59,
        code: 'NATIONALDAY60',
        description: 'Giảm 60k mừng quốc khánh',
        type: 'total',
        discountType: 'fixed',
        value: 60000,
        minOrderValue: 900000,
        startDate: '2025-09-02',
        endDate: '2025-09-05',
        usageLimit: 800,
        usedCount: 234,
        isActive: true
    },

    // 60. Voucher giảm cho Sơn siêu bóng
    {
        id: 60,
        code: 'HIGHGLOSS35',
        description: 'Giảm 35% khi mua Sơn siêu bóng',
        type: 'category',
        targetCategory: 'Sơn siêu bóng',
        discountType: 'percentage',
        value: 35,
        maxDiscount: 550000,
        minOrderValue: 400000,
        startDate: '2025-09-01',
        endDate: '2025-12-31',
        usageLimit: 110,
        usedCount: 24,
        isActive: true
    },

    // 61. Voucher mùa đông ấm áp
    {
        id: 61,
        code: 'WARMWINTER50',
        description: 'Giảm 50k cho mùa đông ấm áp',
        type: 'total',
        discountType: 'fixed',
        value: 50000,
        minOrderValue: 650000,
        startDate: '2025-12-01',
        endDate: '2026-02-28',
        usageLimit: 450,
        usedCount: 98,
        isActive: true
    },

    // 62. Voucher giảm cho Sơn mờ
    {
        id: 62,
        code: 'MATTEFINISH22',
        description: 'Giảm 22% khi mua Sơn hoàn thiện mờ',
        type: 'category',
        targetCategory: 'Sơn mờ',
        discountType: 'percentage',
        value: 22,
        maxDiscount: 180000,
        minOrderValue: 150000,
        startDate: '2025-10-01',
        endDate: '2025-12-31',
        usageLimit: 170,
        usedCount: 42,
        isActive: true
    },

    // 63. Voucher năm mới 2026
    {
        id: 63,
        code: 'NEWYEAR2026',
        description: 'Giảm 10% mừng năm mới 2026',
        type: 'total',
        discountType: 'percentage',
        value: 10,
        maxDiscount: 100000,
        startDate: '2025-12-25',
        endDate: '2026-01-10',
        usageLimit: 1000,
        usedCount: 345,
        isActive: true
    },

    // 64. Voucher giảm cho Sơn bóng nửa
    {
        id: 64,
        code: 'SEMIGLOSS28',
        description: 'Giảm 28% khi mua Sơn bóng nửa',
        type: 'category',
        targetCategory: 'Sơn bóng nửa',
        discountType: 'percentage',
        value: 28,
        maxDiscount: 320000,
        minOrderValue: 250000,
        startDate: '2025-11-01',
        endDate: '2026-01-31',
        usageLimit: 130,
        usedCount: 31,
        isActive: true
    },

    // 65. Voucher tết nguyên đán 2026
    {
        id: 65,
        code: 'TET2026',
        description: 'Giảm 150k mừng tết nguyên đán 2026',
        type: 'total',
        discountType: 'fixed',
        value: 150000,
        minOrderValue: 2000000,
        startDate: '2026-01-20',
        endDate: '2026-02-10',
        usageLimit: 300,
        usedCount: 0,
        isActive: true
    }
];

