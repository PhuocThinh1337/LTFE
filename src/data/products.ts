export interface Product {
    id: number;
    name: string;
    category: string;
    image: string;
    description: string;
    features: string[];
    isNew?: boolean;
    isPremium?: boolean;
    price: number;
}

export const PRODUCTS: Product[] = [
    // Sơn nội thất
    {
        id: 1,
        name: "Nippon Paint VirusGuard",
        category: "son-noi-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2020-04/nippon-paint-virus-guard_0.png",
        description: "Sơn sạch vi khuẩn - Bảo vệ sức khỏe gia đình",
        features: ["Chống virus", "Chống vi khuẩn", "Chùi rửa vượt trội", "Thân thiện với môi trường"],
        isNew: true,
        isPremium: true,
        price: 1250000
    },
    {
        id: 2,
        name: "Nippon Paint Spot-less Plus",
        category: "son-noi-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2021-06/spot-less-plus-product-thumb_0.png",
        description: "Chống bám bẩn - Vượt trội với công nghệ Ion Bạc",
        features: ["Chống bám bẩn", "Kháng khuẩn", "Màu sắc bền đẹp"],
        price: 890000
    },
    {
        id: 3,
        name: "Nippon Paint Odour-less Bóng Sang Trọng",
        category: "son-noi-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2021-01/odour-less-spot-less_0.png",
        description: "Sơn nội thất siêu bóng, sang trọng và đẳng cấp",
        features: ["Bóng sang trọng", "Gần như không mùi", "An toàn sức khỏe"],
        isPremium: true,
        price: 1150000
    },
    {
        id: 4,
        name: "Nippon Paint Odour-less Chùi Rửa Vượt Trội",
        category: "son-noi-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2021-01/odour-less-chui-rua-vuot-troi-thumb.png",
        description: "Màng sơn bóng mịn, dễ dàng lau chùi mọi vết bẩn",
        features: ["Chùi rửa vượt trội", "Bền màu", "Chống nấm mốc"],
        price: 750000
    },
    {
        id: 5,
        name: "Nippon Paint Matex Sắc Màu Dịu Mát",
        category: "son-noi-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/matex-sac-mau-diu-mat.png",
        description: "Sơn nước nội thất mang lại cảm giác dịu mát",
        features: ["Màu sắc dịu mát", "Che phủ tốt", "Kinh tế"],
        price: 450000
    },

    // Sơn ngoại thất
    {
        id: 11,
        name: "Nippon Paint WeatherGard Plus+",
        category: "son-ngoai-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2020-09/weathergard-plus-thumb.png",
        description: "Bảo vệ tối ưu - Bền màu với thời gian",
        features: ["Chống thấm nước", "Chống bám bụi", "Giảm nhiệt"],
        isNew: true,
        isPremium: true,
        price: 1450000
    },
    {
        id: 12,
        name: "Sơn Nippon WeatherGard Siêu Bóng",
        category: "son-ngoai-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/weathergard-sieu-bong.png",
        description: "Sơn ngoại thất siêu bóng cao cấp",
        features: ["Độ bóng cao", "Chống rêu mốc", "Bền màu"],
        price: 1550000
    },
    {
        id: 13,
        name: "Sơn Nippon Super Matex",
        category: "son-ngoai-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/super-matex_0.png",
        description: "Sơn ngoài trời kinh tế - Bảo vệ ngôi nhà bạn",
        features: ["Chống rêu mốc", "Độ che phủ cao", "Tiết kiệm"],
        price: 480000
    },
    {
        id: 14,
        name: "Nippon Paint WeatherGard",
        category: "son-ngoai-that",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/weathergard.png",
        description: "Bảo vệ công trình khỏi thời tiết khắc nghiệt",
        features: ["Chống thấm", "Chống kiềm hóa", "Bền màu"],
        price: 1350000
    },

    // Sơn dân dụng
    {
        id: 21,
        name: "Sơn Nippon Tilac",
        category: "son-dan-dung",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/tilac-thumb.png",
        description: "Sơn dầu gốc Alkyd độ bóng cao cho gỗ và kim loại",
        features: ["Độ bóng cao", "Nhanh khô", "Bền với thời tiết"],
        price: 120000
    },
    {
        id: 22,
        name: "Sơn Nippon Bilac",
        category: "son-dan-dung",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/bilac-thumb.png",
        description: "Sơn dầu kinh tế cho bề mặt gỗ và kim loại",
        features: ["Kinh tế", "Dễ sử dụng", "Màng sơn bóng"],
        price: 95000
    },
    {
        id: 23,
        name: "Sơn Lót Chống Rỉ Nippon",
        category: "son-dan-dung",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/son-lot-chong-ri-danh-cho-be-mat-kim-loai.png",
        description: "Bảo vệ bề mặt kim loại khỏi rỉ sét",
        features: ["Chống rỉ sét", "Độ bám dính tốt", "Tạo nền cho sơn phủ"],
        price: 85000
    },

    // Sơn công nghiệp
    {
        id: 31,
        name: "Sơn Chống Cháy Taikalitt S-100",
        category: "son-va-chat-phu-cong-nghiep",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/taikalitt-s-100.png",
        description: "Sơn chống cháy nội thất chất lượng cao",
        features: ["Chống cháy 120 phút", "Bảo vệ kết cấu thép", "Dễ thi công"],
        isPremium: true,
        price: 2500000
    },
    {
        id: 32,
        name: "Nippon EP4 Clear Sealer",
        category: "son-va-chat-phu-cong-nghiep",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/ep4-clear-sealer.png",
        description: "Sơn lót Epoxy trong suốt",
        features: ["Độ bám dính cao", "Thẩm thấu tốt", "Chịu hóa chất"],
        price: 1800000
    },
    {
        id: 33,
        name: "Sơn Nippon EA4",
        category: "son-va-chat-phu-cong-nghiep",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/ea4.png",
        description: "Sơn dầu gốc Epoxies - Độ bóng cao",
        features: ["Độ bóng cao", "Chịu mài mòn", "Chịu hóa chất"],
        price: 2100000
    },
    {
        id: 34,
        name: "Sơn Giao Thông Nippon Road Line",
        category: "son-va-chat-phu-cong-nghiep",
        image: "https://nipponpaint.com.vn/sites/default/files/2019-12/road-line-paint-phan-quang.png",
        description: "Sơn vạch kẻ đường phản quang chất lượng cao",
        features: ["Phản quang tốt", "Nhanh khô", "Chịu mài mòn"],
        price: 650000
    }
];
