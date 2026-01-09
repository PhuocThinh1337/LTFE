import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { DEALERS, PROVINCES, Dealer } from '../../data/dealers';
import './DealerLocatorPage.css';

const DealerLocatorPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get unique districts for selected province
  const districts = useMemo(() => {
    if (!selectedProvince) return [];
    const uniqueDistricts = DEALERS
        .filter(dealer => dealer.province === selectedProvince)
        .map(dealer => dealer.district)
        .reduce((unique: string[], district) => {
            if (!unique.includes(district)) {
            unique.push(district);
            }
            return unique;
    }, []);
    return uniqueDistricts.sort();
  }, [selectedProvince]);

  // Filter dealers based on search criteria
  const filteredDealers = useMemo(() => {
    return DEALERS.filter(dealer => {
      const matchesSearch = 
        dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.services.some(service => 
          service.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesProvince = !selectedProvince || dealer.province === selectedProvince;
      const matchesDistrict = !selectedDistrict || dealer.district === selectedDistrict;
      
      return matchesSearch && matchesProvince && matchesDistrict;
    });
  }, [searchTerm, selectedProvince, selectedDistrict]);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Không thể lấy vị trí hiện tại của bạn. Vui lòng cho phép truy cập vị trí.');
        }
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ định vị vị trí.');
    }
  };

  // Calculate distance between two points (in km)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Sort dealers by distance if user location is available
  const sortedDealers = useMemo(() => {
    if (!userLocation) return filteredDealers;
    
    return [...filteredDealers].sort((a, b) => {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude);
      return distA - distB;
    });
  }, [filteredDealers, userLocation]);

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict(''); // Reset district when province changes
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setUserLocation(null);
  };

  return (
    <div className="np-page-wrapper">
      <Header />
      
      <main className="np-main-content">
        <div className="np-container">
          <div className="np-dealer-locator-page">
            <div className="np-page-header">
              <h1>Tìm Đại Lý Nippon Paint</h1>
              <p>Tìm đại lý gần nhất để được tư vấn và hỗ trợ tốt nhất</p>
            </div>

            {/* Search and Filter Section */}
            <div className="np-dealer-filters">
              <div className="np-filter-row">
                <div className="np-search-input">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, địa chỉ, dịch vụ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select 
                  value={selectedProvince} 
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="np-province-select"
                >
                  <option value="">Tất cả tỉnh/thành phố</option>
                  {PROVINCES.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>

                <select 
                  value={selectedDistrict} 
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="np-district-select"
                  disabled={!selectedProvince}
                >
                  <option value="">Tất cả quận/huyện</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>

                <button 
                  onClick={getCurrentLocation}
                  className="np-location-btn"
                  title="Tìm đại lý gần nhất"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  Gần nhất
                </button>

                <button onClick={clearFilters} className="np-clear-filters-btn">
                  Xóa bộ lọc
                </button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="np-results-summary">
              <p>
                Tìm thấy <strong>{sortedDealers.length}</strong> đại lý
                {userLocation && " (sắp xếp theo khoảng cách)"}
                {selectedProvince && ` tại ${selectedProvince}`}
                {selectedDistrict && `, ${selectedDistrict}`}
              </p>
            </div>

            {/* Dealers List */}
            <div className="np-dealers-grid">
              {sortedDealers.map((dealer) => (
                <div key={dealer.id} className={`np-dealer-card ${dealer.isPremium ? 'premium' : ''}`}>
                  {dealer.isPremium && (
                    <div className="np-premium-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      Đại lý chính thức
                    </div>
                  )}
                  
                  <div className="np-dealer-header">
                    <h3 className="np-dealer-name">{dealer.name}</h3>
                    <div className="np-dealer-location">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{dealer.district}, {dealer.province}</span>
                    </div>
                  </div>

                  <div className="np-dealer-body">
                    <div className="np-dealer-address">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <span>{dealer.address}</span>
                    </div>

                    <div className="np-dealer-contact">
                      <div className="np-contact-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        <a href={`tel:${dealer.phone}`}>{dealer.phone}</a>
                      </div>
                      {dealer.email && (
                        <div className="np-contact-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          <a href={`mailto:${dealer.email}`}>{dealer.email}</a>
                        </div>
                      )}
                    </div>

                    <div className="np-dealer-hours">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>Giờ mở cửa: {dealer.operatingHours}</span>
                    </div>

                    {userLocation && (
                      <div className="np-dealer-distance">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        <span>
                          Khoảng cách: {calculateDistance(
                            userLocation.lat, 
                            userLocation.lng, 
                            dealer.latitude, 
                            dealer.longitude
                          ).toFixed(1)} km
                        </span>
                      </div>
                    )}

                    <div className="np-dealer-services">
                      <h4>Dịch vụ:</h4>
                      <div className="np-services-list">
                        {dealer.services.map((service, index) => (
                          <span key={index} className="np-service-tag">{service}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="np-dealer-actions">
                    <a href={`tel:${dealer.phone}`} className="np-call-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      Gọi ngay
                    </a>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="np-directions-btn"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Chỉ đường
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {sortedDealers.length === 0 && (
              <div className="np-no-dealers">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <path d="M12 7v6M12 16h.01"/>
                </svg>
                <p>Không tìm thấy đại lý nào phù hợp với tiêu chí tìm kiếm.</p>
                <p className="np-no-dealers-subtitle">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc.</p>
                <button onClick={clearFilters} className="np-reset-search-btn">
                  Xóa bộ lọc và thử lại
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DealerLocatorPage;