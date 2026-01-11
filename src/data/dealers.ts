export interface Dealer {
    id: number;
    name: string;
    address: string;
    phone: string;
    email?: string;
    province: string;
    district: string;
    latitude: number;
    longitude: number;
    image?: string;
    services: string[];
    operatingHours: string;
    isPremium?: boolean;
  }
  
  export const DEALERS: Dealer[] = [
    // === HÀ NỘI ===
    {
      id: 1,
      name: "Nippon Paint - Đại Lý Trung Tâm Hà Nội",
      address: "123 Đường Trần Duy Hưng, Trung Hòa, Cầu Giấy",
      phone: "0243.123.4567",
      email: "hanoi@nipponpaint.vn",
      province: "Hà Nội",
      district: "Cầu Giấy",
      latitude: 21.0278,
      longitude: 105.8342,
      services: ["Tư vấn màu sắc", "Tính toán lượng sơn", "Giao hàng tận nơi", "Bảo hành sản phẩm"],
      operatingHours: "08:00 - 18:00",
      isPremium: true
    },
    {
      id: 2,
      name: "Nippon Paint - Đại Lý Đông Anh",
      address: "456 Đường Quốc Lộ 3, Đông Anh",
      phone: "0243.234.5678",
      province: "Hà Nội",
      district: "Đông Anh",
      latitude: 21.1396,
      longitude: 105.8392,
      services: ["Tư vấn kỹ thuật", "Giao hàng tận nơi", "Hỗ trợ thi công"],
      operatingHours: "07:30 - 17:30"
    },
    {
      id: 3,
      name: "Nippon Paint - Đại Lý Hoàng Mai",
      address: "789 Đường Tam Trinh, Hoàng Mai",
      phone: "0243.345.6789",
      province: "Hà Nội",
      district: "Hoàng Mai",
      latitude: 20.9800,
      longitude: 105.8558,
      services: ["Tư vấn màu sắc", "Tính toán lượng sơn", "Giao hàng tận nơi"],
      operatingHours: "08:00 - 18:00"
    },
    {
      id: 4,
      name: "Nippon Paint - Đại Lý Hai Bà Trưng",
      address: "321 Đường Bạch Mai, Hai Bà Trưng",
      phone: "0243.456.7890",
      province: "Hà Nội",
      district: "Hai Bà Trưng",
      latitude: 21.0031,
      longitude: 105.8594,
      services: ["Tư vấn kỹ thuật", "Bảo hành sản phẩm", "Hỗ trợ thi công"],
      operatingHours: "08:00 - 17:00"
    },
  
    // === HỒ CHÍ MINH ===
    {
      id: 5,
      name: "Nippon Paint - Đại Lý Quận 1",
      address: "159 Đường Nguyễn Huệ, Quận 1",
      phone: "0283.812.3456",
      email: "quan1@nipponpaint.vn",
      province: "Hồ Chí Minh",
      district: "Quận 1",
      latitude: 10.7744,
      longitude: 106.7019,
      services: ["Tư vấn màu sắc", "Tính toán lượng sơn", "Giao hàng tận nơi", "Bảo hành sản phẩm", "Hỗ trợ thiết kế"],
      operatingHours: "08:00 - 19:00",
      isPremium: true
    },
    {
      id: 6,
      name: "Nippon Paint - Đại Lý Quận 7",
      address: "567 Đường Nguyễn Lương Bằng, Quận 7",
      phone: "0283.923.4567",
      province: "Hồ Chí Minh",
      district: "Quận 7",
      latitude: 10.7361,
      longitude: 106.7221,
      services: ["Tư vấn kỹ thuật", "Giao hàng tận nơi", "Hỗ trợ thi công"],
      operatingHours: "07:30 - 18:00"
    },
    {
      id: 7,
      name: "Nippon Paint - Đại Lý Bình Thạnh",
      address: "890 Đường Xô Viết Nghệ Tĩnh, Bình Thạnh",
      phone: "0283.034.5678",
      province: "Hồ Chí Minh",
      district: "Bình Thạnh",
      latitude: 10.8106,
      longitude: 106.7141,
      services: ["Tư vấn màu sắc", "Tính toán lượng sơn", "Giao hàng tận nơi"],
      operatingHours: "08:00 - 18:00"
    },
    {
      id: 8,
      name: "Nippon Paint - Đại Lý Tân Bình",
      address: "234 Đường Cộng Hòa, Tân Bình",
      phone: "0283.145.6789",
      province: "Hồ Chí Minh",
      district: "Tân Bình",
      latitude: 10.7969,
      longitude: 106.6544,
      services: ["Tư vấn kỹ thuật", "Bảo hành sản phẩm", "Giao hàng tận nơi"],
      operatingHours: "08:00 - 17:30"
    },
  
    // === ĐÀ NẴNG ===
    {
      id: 9,
      name: "Nippon Paint - Đại Lý Đà Nẵng",
      address: "147 Đường Trần Phú, Hải Châu",
      phone: "0236.123.4567",
      email: "danang@nipponpaint.vn",
      province: "Đà Nẵng",
      district: "Hải Châu",
      latitude: 16.0678,
      longitude: 108.2208,
      services: ["Tư vấn màu sắc", "Tính toán lượng sơn", "Giao hàng tận nơi", "Bảo hành sản phẩm"],
      operatingHours: "08:00 - 18:00",
      isPremium: true
    },
    {
      id: 10,
      name: "Nippon Paint - Đại Lý Sơn Trà",
      address: "258 Đường Nguyễn Tất Thành, Sơn Trà",
      phone: "0236.234.5678",
      province: "Đà Nẵng",
      district: "Sơn Trà",
      latitude: 16.1000,
      longitude: 108.2500,
      services: ["Tư vấn kỹ thuật", "Giao hàng tận nơi", "Hỗ trợ thi công"],
      operatingHours: "07:30 - 17:30"
    },
  
    // === CẦN THƠ ===
    {
      id: 11,
      name: "Nippon Paint - Đại Lý Cần Thơ",
      address: "369 Đường Nguyễn Văn Linh, Ninh Kiều",
      phone: "0292.345.6789",
      province: "Cần Thơ",
      district: "Ninh Kiều",
      latitude: 10.0458,
      longitude: 105.7469,
      services: ["Tư vấn màu sắc", "Tính toán lượng sơn", "Giao hàng tận nơi"],
      operatingHours: "08:00 - 18:00"
    },
  
    // === HẢI PHÒNG ===
    {
      id: 12,
      name: "Nippon Paint - Đại Lý Hải Phòng",
      address: "741 Đường Trần Nguyên Hãn, Lê Chân",
      phone: "0225.456.7890",
      province: "Hải Phòng",
      district: "Lê Chân",
      latitude: 20.8447,
      longitude: 106.6881,
      services: ["Tư vấn kỹ thuật", "Giao hàng tận nơi", "Bảo hành sản phẩm"],
      operatingHours: "08:00 - 17:30"
    },
  
    // === THANH HÓA ===
    {
      id: 13,
      name: "Nippon Paint - Đại Lý Thanh Hóa",
      address: "852 Đường Lê Lai, TP Thanh Hóa",
      phone: "0373.567.8901",
      province: "Thanh Hóa",
      district: "TP Thanh Hóa",
      latitude: 19.8075,
      longitude: 105.7761,
      services: ["Tư vấn màu sắc", "Tính toán lượng sơn", "Giao hàng tận nơi"],
      operatingHours: "08:00 - 17:00"
    },
  
    // === NGHỆ AN ===
    {
      id: 14,
      name: "Nippon Paint - Đại Lý Vinh",
      address: "963 Đường Nguyễn Du, TP Vinh",
      phone: "0383.678.9012",
      province: "Nghệ An",
      district: "TP Vinh",
      latitude: 18.6733,
      longitude: 105.6922,
      services: ["Tư vấn kỹ thuật", "Giao hàng tận nơi", "Hỗ trợ thi công"],
      operatingHours: "08:00 - 17:30"
    },
  
    // === ĐÀ LẠT ===
    {
      id: 15,
      name: "Nippon Paint - Đại Lý Đà Lạt",
      address: "159 Đường Nguyễn Văn Cừ, Đà Lạt",
      phone: "0263.789.0123",
      province: "Lâm Đồng",
      district: "Đà Lạt",
      latitude: 11.9404,
      longitude: 108.4583,
      services: ["Tư vấn màu sắc", "Tính toán lượng sơn", "Giao hàng tận nơi", "Bảo hành sản phẩm"],
      operatingHours: "08:00 - 17:00"
    }
  ];
  
  export const PROVINCES = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", 
    "Thanh Hóa", "Nghệ An", "Lâm Đồng", "Bình Dương", "Đồng Nai",
    "Khánh Hòa", "Thừa Thiên Huế", "Quảng Nam", "Bà Rịa - Vũng Tàu"
  ];