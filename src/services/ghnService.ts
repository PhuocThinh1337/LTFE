
export interface GHNProvince {
    ProvinceID: number;
    ProvinceName: string;
}

export interface GHNDistrict {
    DistrictID: number;
    DistrictName: string;
}

export interface GHNWard {
    WardCode: string;
    WardName: string;
}

export interface GHNShippingFeeRequest {
    service_type_id: number;
    to_district_id: number;
    to_ward_code: string;
    weight: number; // gram
    insurance_value?: number;
}

export interface GHNService {
    service_id: number;
    short_name: string;
    service_type_id: number;
}

// Base URL without /v2 because master-data endpoints don't use it
const GHN_API_BASE = process.env.REACT_APP_GHN_API_BASE || '';
const GHN_TOKEN = process.env.REACT_APP_GHN_TOKEN || '';

const headers = {
    'Content-Type': 'application/json',
    'token': GHN_TOKEN // Lowercase 'token' is standard for GHN
};

// Cache for Shop Location IDs
let shopLocation = {
    shopId: null as number | null,
    provinceId: null as number | null,
    districtId: null as number | null,
    wardCode: null as string | null
};

// Hardcoded Shop Address Strings to find IDs for
const SHOP_ADDRESS = {
    province: 'Hồ Chí Minh',
    district: 'Thủ Đức',
    ward: 'Linh Trung'
};

export const ghnService = {
    // Initialize: Find Shop IDs & Info
    initShopLocation: async () => {
        if (shopLocation.shopId && shopLocation.districtId) return;

        try {
            // 0. Get Shop Info to get ShopID (Uses v2)
            try {
                const shopRes = await fetch(`${GHN_API_BASE}/v2/shop/all`, { 
                    method: 'POST', // GHN v2 often uses POST for this or GET with header
                    headers: { ...headers }
                });
                const shopData = await shopRes.json();
                if (shopData.code === 200 && shopData.data && shopData.data.shops?.length > 0) {
                    const myShop = shopData.data.shops[0]; 
                    shopLocation.shopId = myShop._id;
                    console.log('Found ShopID:', shopLocation.shopId);
                } else {
                    console.warn('Could not fetch ShopID via API. Response:', shopData);
                    // Fallback to manual ID if known, or rely on Token only
                }
            } catch (e) {
                console.error('Error fetching ShopID:', e);
            }

            // 1. Get Provinces & Find HCM (No v2)
            const pRes = await fetch(`${GHN_API_BASE}/master-data/province`, { headers });
            const pData = await pRes.json();
            
            if (pData.code !== 200) {
                console.error('GHN Init Error (Provinces):', pData.message);
                return;
            }

            const hcm = pData.data?.find((p: any) => p.ProvinceName.includes(SHOP_ADDRESS.province));
            
            if (hcm) {
                shopLocation.provinceId = hcm.ProvinceID;
                
                // 2. Get Districts & Find Thu Duc (No v2)
                const dRes = await fetch(`${GHN_API_BASE}/master-data/district`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ province_id: hcm.ProvinceID })
                });
                const dData = await dRes.json();
                
                const thuDuc = dData.data?.find((d: any) => 
                    d.DistrictName.includes('Thủ Đức') || d.DistrictName.toLowerCase().includes('thu duc')
                );

                if (thuDuc) {
                    shopLocation.districtId = thuDuc.DistrictID;

                    // 3. Get Wards & Find Linh Trung (No v2)
                    const wRes = await fetch(`${GHN_API_BASE}/master-data/ward?district_id=${thuDuc.DistrictID}`, { headers });
                    const wData = await wRes.json();
                    const linhTrung = wData.data?.find((w: any) => w.WardName.includes(SHOP_ADDRESS.ward));

                    if (linhTrung) {
                        shopLocation.wardCode = linhTrung.WardCode;
                    }
                }
            }
            console.log('GHN Shop Location Init:', shopLocation);
        } catch (error) {
            console.error('Failed to init GHN shop location:', error);
        }
    },

    // 1. Get Provinces (No v2)
    getProvinces: async (): Promise<GHNProvince[]> => {
        try {
            const response = await fetch(`${GHN_API_BASE}/master-data/province`, { headers });
            const data = await response.json();
            if (data.code === 200) {
                return data.data;
            }
            console.error('GHN Get Provinces Failed:', data);
            return [];
        } catch (error) {
            console.error('Error fetching provinces:', error);
            return [];
        }
    },

    // 2. Get Districts (No v2)
    getDistricts: async (provinceId: number): Promise<GHNDistrict[]> => {
        try {
            const response = await fetch(`${GHN_API_BASE}/master-data/district`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ province_id: provinceId })
            });
            const data = await response.json();
            return data.code === 200 ? data.data : [];
        } catch (error) {
            console.error('Error fetching districts:', error);
            return [];
        }
    },

    // 3. Get Wards (No v2)
    getWards: async (districtId: number): Promise<GHNWard[]> => {
        try {
            const response = await fetch(`${GHN_API_BASE}/master-data/ward?district_id=${districtId}`, { headers });
            const data = await response.json();
            return data.code === 200 ? data.data : [];
        } catch (error) {
            console.error('Error fetching wards:', error);
            return [];
        }
    },

    // 5. Calculate Shipping Fee (Uses v2)
    calculateFee: async (params: GHNShippingFeeRequest): Promise<number | null> => {
        // Ensure Shop Location is initialized
        if (!shopLocation.districtId) {
            await ghnService.initShopLocation();
        }

        try {
            const body = {
                service_type_id: params.service_type_id || 2, // 2: Standard, 53320: Standard Config
                from_district_id: shopLocation.districtId, 
                to_district_id: params.to_district_id,
                to_ward_code: params.to_ward_code,
                height: 20,
                length: 20,
                width: 20,
                weight: params.weight,
                insurance_value: params.insurance_value || 0,
                coupon: null
            };

            const feeHeaders: any = { ...headers };
            if (shopLocation.shopId) {
                feeHeaders['ShopId'] = String(shopLocation.shopId);
            }

            const response = await fetch(`${GHN_API_BASE}/v2/shipping-order/fee`, {
                method: 'POST',
                headers: feeHeaders,
                body: JSON.stringify(body)
            });
            
            const data = await response.json();
            if (data.code === 200) {
                return data.data.total;
            } else {
                console.error('GHN Fee Error:', data.message);
                return null;
            }
        } catch (error) {
            console.error('Error calculating fee:', error);
            return null;
        }
    }
};
