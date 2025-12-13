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
    // --- SƠN NỘI THẤT ---
    {
        id: 1,
        name: "Nippon Paint VirusGuard",
        category: "Sơn Nội Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/virus-guard-lon-5l.png?itok=8Cg7S-1J",
        description: "Sơn sạch vi khuẩn - Bảo vệ sức khỏe gia đình",
        features: ["Kháng virus & vi khuẩn", "Chùi rửa vượt trội", "Thân thiện môi trường"],
        isNew: true,
        isPremium: true,
        price: 1250000
    },
    {
        id: 2,
        name: "Nippon Paint Spot-less Plus",
        category: "Sơn Nội Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/spot-less-plus-lon-5l.png?itok=gR4oN1D4",
        description: "Chống bám bẩn - Vượt trội với công nghệ Ion Bạc",
        features: ["Chống bám bẩn", "Kháng khuẩn", "Mùi nhẹ"],
        isPremium: true,
        price: 890000
    },
    {
        id: 3,
        name: "Nippon Paint Odour-less Bóng Sang Trọng",
        category: "Sơn Nội Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/odour-less-spot-less-lon-5l.png?itok=zF8bW2E7", // Reused similar image
        description: "Sơn nội thất siêu bóng, sang trọng và đẳng cấp",
        features: ["Siêu bóng", "Kháng khuẩn", "Mùi rất nhẹ"],
        isPremium: true,
        price: 1150000
    },
    {
        id: 4,
        name: "Nippon Paint Matex",
        category: "Sơn Nội Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2019-03/matex-new-lon-5l.png?itok=yE6aV1D6",
        description: "Sơn kinh tế - Màng sơn mịn màng",
        features: ["Độ che phủ cao", "Dễ thi công", "Kinh tế"],
        price: 350000
    },
    {
        id: 5,
        name: "Nippon Paint Odour-less Chùi Rửa Vượt Trội",
        category: "Sơn Nội Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2019-03/odour-less-chui-rua-vuot-troi-lon-5l.png?itok=zF8bW2E7",
        description: "Sơn nội thất cao cấp - Dễ dàng lau chùi vết bẩn",
        features: ["Chùi rửa dễ dàng", "Mùi rất nhẹ", "Bền màu"],
        price: 720000
    },
    {
        id: 6,
        name: "Sơn Nippon Odour-less All-in-1",
        category: "Sơn Nội Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/odour-less-all-in-1-lon-5l.png?itok=xA9cZ3F8", // Guessing
        description: "Sơn nội thất đa năng, bảo vệ toàn diện",
        features: ["Đa năng", "Che phủ vết nứt", "Thân thiện môi trường"],
        price: 850000
    },

    // --- SƠN NGOẠI THẤT ---
    {
        id: 11,
        name: "Nippon Paint WeatherGard Plus+",
        category: "Sơn Ngoại Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/weathergard-plus-lon-5l.png?itok=vX9eN1D5",
        description: "Bảo vệ tối ưu - Bền màu với thời gian",
        features: ["Chống thấm nước", "Chống bám bụi", "Giảm nhiệt"],
        isPremium: true,
        price: 1450000
    },
    {
        id: 12,
        name: "Sơn Nippon WeatherGard Siêu Bóng",
        category: "Sơn Ngoại Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/weathergard-sieu-bong-lon-5l.png?itok=vX9eN1D5", // Guessing
        description: "Sơn ngoại thất siêu bóng cao cấp",
        features: ["Siêu bóng", "Phản xạ nhiệt", "Chống rêu mốc"],
        isPremium: true,
        price: 1550000
    },
    {
        id: 13,
        name: "Sơn Nippon Super Matex",
        category: "Sơn Ngoại Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2019-03/super-matex-lon-5l.png?itok=xA9cZ3F8",
        description: "Sơn ngoài trời kinh tế - Bảo vệ ngôi nhà bạn",
        features: ["Chống rêu mốc", "Độ che phủ tốt", "Tiết kiệm"],
        price: 480000
    },
    {
        id: 14,
        name: "Sơn Chống Thấm WP 200",
        category: "Sơn Ngoại Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/wp-200-lon-5l.png?itok=xA9cZ3F8", // Guessing
        description: "Chất chống thấm cao cấp bảo vệ tường nhà",
        features: ["Chống thấm tuyệt đối", "Độ đàn hồi cao", "Che phủ vết nứt"],
        price: 1950000
    },
    {
        id: 15,
        name: "Sơn Lót Ngoại Thất WeatherGard Sealer",
        category: "Sơn Ngoại Thất",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/super-matex-sealer-lon-5l.png?itok=xA9cZ3F8",
        description: "Sơn lót kháng kiềm ngoại thất cao cấp",
        features: ["Kháng kiềm", "Tăng độ bám dính", "Bền màu"],
        price: 750000
    },

    // --- SƠN DÂN DỤNG ---
    {
        id: 21,
        name: "TILAC SƠN SẮT MẠ KẼM",
        category: "Sơn dân dụng",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/tilac-grey-lon-3l.png?itok=yE6aV1D6", // Placeholder
        description: "Giải pháp chuyên dụng cho bề mặt kẽm",
        features: ["Bám dính tốt", "Không cần sơn lót", "Bền thời tiết"],
        isNew: true,
        price: 320000
    },
    {
        id: 22,
        name: "Nippon Paint Tilac",
        category: "Sơn dân dụng",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/tilac-grey-lon-3l.png?itok=yE6aV1D6",
        description: "Sơn dầu cho gỗ và kim loại",
        features: ["Bóng đẹp", "Chống rỉ", "Mau khô"],
        price: 150000
    },
    {
        id: 23,
        name: "Sơn Nippon Pylox Lazer",
        category: "Sơn dân dụng",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2019-03/pylox-lazer.png", // Guessing
        description: "Sơn xịt mau khô, đa dụng",
        features: ["Tiện lợi", "Mau khô", "Màu sắc đa dạng"],
        price: 55000
    },
    {
        id: 24,
        name: "Sơn Nippon Road Line",
        category: "Sơn dân dụng",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/road-line-white-lon-5l.png?itok=gR4oN1D4",
        description: "Sơn vạch đường - Dễ thi công",
        features: ["Phản quang", "Bền màu", "Chịu mài mòn"],
        price: 950000
    },
    {
        id: 25,
        name: "Sơn Nippon Bilac",
        category: "Sơn dân dụng",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/bilac-aluminum-lon-3l.png?itok=xA9cZ3F8",
        description: "Sơn lót chống rỉ cho kim loại",
        features: ["Chống ăn mòn", "Kho nhanh", "Dễ sử dụng"],
        price: 120000
    },

    // --- SƠN CÔNG NGHIỆP ---
    {
        id: 31,
        name: "Sơn Chống Cháy Taikalitt S-100",
        category: "Sơn và chất phủ công nghiệp",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/pu-top-coat-lon-5l.png?itok=zF8bW2E7", // Placeholder
        description: "Sơn chống cháy nội thất chất lượng cao",
        features: ["Chống cháy", "An toàn", "Bảo vệ kết cấu"],
        isPremium: true,
        price: 5500000
    },
    {
        id: 32,
        name: "Nippon EP4 Clear Sealer",
        category: "Sơn và chất phủ công nghiệp",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/ea4-finish-lon-5l.png?itok=5y2sQ4b_",
        description: "Sơn lót Epoxy trong suốt",
        features: ["Thẩm thấu tốt", "Độ cứng cao", "Kháng hóa chất"],
        price: 2800000
    },
    {
        id: 33,
        name: "Sơn Nippon EA4",
        category: "Sơn và chất phủ công nghiệp",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/ea4-finish-lon-5l.png?itok=5y2sQ4b_",
        description: "Sơn dầu gốc Epoxies - Độ bóng cao",
        features: ["Chịu hóa chất", "Độ bám dính tốt", "Chịu mài mòn"],
        price: 3200000
    },
    {
        id: 34,
        name: "Sơn Nippon PU",
        category: "Sơn và chất phủ công nghiệp",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/pu-top-coat-lon-5l.png?itok=zF8bW2E7",
        description: "Sơn phủ Polyurethane hai thành phần",
        features: ["Bền thời tiết", "Độ bóng rất cao", "Bền màu"],
        price: 2800000
    },
    {
        id: 35,
        name: "Sơn Nippon Heat Resisting Aluminium",
        category: "Sơn và chất phủ công nghiệp",
        image: "https://nipponpaint.com.vn/sites/default/files/styles/np_product_teaser_480_480/public/2021-06/ea4-finish-lon-5l.png?itok=5y2sQ4b_", // Placeholder
        description: "Sơn chịu nhiệt màu nhôm",
        features: ["Chịu nhiệt độ cao", "Phản xạ nhiệt", "Bền bỉ"],
        price: 4100000
    }
];
