import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { PRODUCTS } from '../data/products';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [colorCodeCarouselIndex, setColorCodeCarouselIndex] = useState(0);

  const banners = [
    {
      title: 'Nippon Paint ra mắt sơn nội thất Easy Wash',
      subtitle: 'Đơn giản hóa việc chăm chút tổ ấm',
      link: '/san-pham',
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200'
    },
    {
      title: 'MUA SƠN NHẬN THẺ - NHÀ MỚI QUÀ TO',
      subtitle: '09/09/2025 - 31/12/2025',
      link: '/san-pham',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'
    },
    {
      title: 'Xu hướng Màu sắc 2026–27: Cộng Hưởng',
      subtitle: 'Cùng chúng tôi kiến tạo nên những giá trị mới cho tương lai',
      link: '/phoi-mau-tuy-chinh',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200'
    }
  ];

  // Carousel images with matching color swatches
  const colorCodeImages = [
    {
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      title: 'Phòng ngủ hiện đại',
      colors: [
        '#a8c5d0', // Light blue-grey
        '#f0eee7', // Very light cream/off-white
        '#f4ecef', // Pale pink
        '#fff2e8', // Light beige/peach
        '#5994b5', // Medium blue-green/teal
        '#08cfa3', // Bright vibrant green/mint
        '#ffc845', // Mustard yellow/goldenrod (highlighted - center)
        '#a9464d', // Deep red/maroon
        '#d3cdc3', // Light grey-beige
        '#9b92b5', // Muted lavender/light purple
        '#ffdb58', // Bright yellow
        '#ff6b35'  // Vibrant orange
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1556912167-f556f1f39f0b?w=800&q=80',
      title: 'Phòng trẻ em',
      colors: [
        '#b0e0e6', // Powder blue
        '#fffef0', // Ivory/off-white
        '#ffb6c1', // Light pink
        '#ffe4b5', // Moccasin/peach
        '#87ceeb', // Sky blue
        '#98fb98', // Pale green
        '#ffd700', // Gold/yellow (highlighted - center)
        '#ff6347', // Tomato red
        '#d3d3d3', // Light gray
        '#dda0dd', // Plum/lavender
        '#ffa500', // Orange
        '#9acd32'  // Yellow green
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
      title: 'Phòng khách',
      colors: [
        '#c0c0c0', // Silver/gray
        '#fffef0', // Ivory
        '#ffc0cb', // Pink
        '#f5deb3', // Wheat/beige
        '#5f9ea0', // Cadet blue
        '#90ee90', // Light green
        '#ffd700', // Gold (highlighted - center)
        '#8b0000', // Dark red
        '#d3d3d3', // Light gray
        '#9370db', // Medium purple
        '#ff8c00', // Dark orange
        '#6b8e23'  // Olive drab
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      title: 'Không gian làm việc',
      colors: [
        '#7fb3d3', // Light blue
        '#f5f5f5', // White smoke
        '#e6e6fa', // Lavender
        '#faf0e6', // Linen/cream
        '#5f9ea0', // Cadet blue
        '#7cfc00', // Lawn green
        '#32cd32', // Lime green (highlighted - center)
        '#dc143c', // Crimson
        '#d3d3d3', // Light gray
        '#9370db', // Medium purple
        '#ffa500', // Orange
        '#6b8e23'  // Olive drab
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      title: 'Phòng bếp hiện đại',
      colors: [
        '#d4d8e0', // Light blue-gray
        '#f8f8ff', // Ghost white
        '#f0e68c', // Khaki/yellow
        '#ffe4c4', // Bisque/peach
        '#4682b4', // Steel blue
        '#00ced1', // Dark turquoise
        '#ffd700', // Gold (highlighted - center)
        '#cd5c5c', // Indian red
        '#c0c0c0', // Silver
        '#ba55d3', // Medium orchid
        '#ff6347', // Tomato
        '#808000'  // Olive
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      title: 'Phòng khách sang trọng',
      colors: [
        '#b0c4de', // Light steel blue
        '#fffaf0', // Floral white
        '#ffb6c1', // Light pink
        '#f5deb3', // Wheat
        '#6495ed', // Cornflower blue
        '#66cdaa', // Medium aquamarine
        '#ffd700', // Gold (highlighted - center)
        '#b22222', // Fire brick
        '#d3d3d3', // Light gray
        '#9370db', // Medium purple
        '#ff8c00', // Dark orange
        '#556b2f'  // Dark olive green
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      title: 'Phòng ngủ ấm cúng',
      colors: [
        '#d2b48c', // Tan/beige
        '#fffef0', // Ivory
        '#f0e68c', // Khaki
        '#ffe4b5', // Moccasin
        '#8b7d6b', // Dark gray
        '#9acd32', // Yellow green
        '#daa520', // Goldenrod (highlighted - center)
        '#8b4513', // Saddle brown
        '#d3d3d3', // Light gray
        '#dda0dd', // Plum
        '#ff7f50', // Coral
        '#6b8e23'  // Olive drab
      ]
    },
    {
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      title: 'Không gian mở',
      colors: [
        '#e0e0e0', // Light gray
        '#ffffff', // White
        '#f5f5dc', // Beige
        '#faf0e6', // Linen
        '#87ceeb', // Sky blue
        '#90ee90', // Light green
        '#ffff00', // Yellow (highlighted - center)
        '#ff4500', // Orange red
        '#c0c0c0', // Silver
        '#dda0dd', // Plum
        '#ff6347', // Tomato
        '#808080'  // Gray
      ]
    }
  ];

  // Get colors for current carousel image
  const getCurrentColors = () => {
    return colorCodeImages[colorCodeCarouselIndex]?.colors || colorCodeImages[0].colors;
  };

  const currentColorSwatches = getCurrentColors();

  const [activeTrendIndex, setActiveTrendIndex] = useState(0);

  const colorTrends = [
    {
      title: 'Chân Thật',
      description: 'Tìm lại ý nghĩa thành công từ sự cân bằng, sống có chủ đích và vẻ đẹp giản đơn',
      colors: ['#d4a574', '#8b6f47', '#f5e6d3', '#e8e8e8', '#4a5568', '#8b1538', '#a0522d', '#f5deb3', '#e0f2e8'],
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600',
      gallery: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
        'https://images.unsplash.com/photo-1556912167-f556f1f39f0b?w=400'
      ]
    },
    {
      title: 'Viên Mãn',
      description: 'Hướng đến sức khỏe toàn diện và một hành trình sống trọn vẹn hơn mỗi ngày',
      colors: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f', '#451a03'],
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600',
      gallery: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
        'https://images.unsplash.com/photo-1556912167-f556f1f39f0b?w=400'
      ]
    },
    {
      title: 'Kiến tạo',
      description: 'Tinh thần khám phá không giới hạn, nơi sự bất định trở thành chất xúc tác cho đổi mới',
      colors: ['#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9f1239', '#831843'],
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      gallery: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
        'https://images.unsplash.com/photo-1556912167-f556f1f39f0b?w=400'
      ]
    },
    {
      title: 'Gắn kết',
      description: 'Hành trình tái cân bằng "cái tôi" trong thế giới số và khát khao kết nối chân thật',
      colors: ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
      gallery: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
        'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400',
        'https://images.unsplash.com/photo-1556912167-f556f1f39f0b?w=400'
      ]
    }
  ];

  const activeTrend = colorTrends[activeTrendIndex];

  const nextTrend = () => {
    setActiveTrendIndex((prev) => (prev + 1) % colorTrends.length);
  };

  const prevTrend = () => {
    setActiveTrendIndex((prev) => (prev - 1 + colorTrends.length) % colorTrends.length);
  };

  const featuredProducts = PRODUCTS.filter(p => p.isPremium || p.isNew).slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setColorCodeCarouselIndex((prev) => (prev + 1) % colorCodeImages.length);
    }, 5000);
    return () => clearInterval(carouselTimer);
  }, [colorCodeImages.length]);

  useEffect(() => {
    const trendTimer = setInterval(() => {
      setActiveTrendIndex((prev) => (prev + 1) % colorTrends.length);
    }, 6000);
    return () => clearInterval(trendTimer);
  }, [colorTrends.length]);

  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        {/* Hero Banner Section */}
        <section className="np-home-banner">
          <div className="np-banner-slider">
            {banners.map((banner, index) => (
              <div
                key={index}
                className={`np-banner-slide ${index === currentSlide ? 'active' : ''}`}
                style={{ 
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="np-banner-overlay"></div>
                <div className="np-container np-banner-content">
                  <h1 className="np-banner-title">{banner.title}</h1>
                  <p className="np-banner-subtitle">{banner.subtitle}</p>
                  <Link to={banner.link} className="np-banner-btn">
                    XEM CHI TIẾT
                  </Link>
                </div>
              </div>
            ))}
            <div className="np-banner-dots">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className={index === currentSlide ? 'active' : ''}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Color Codes Section */}
        <section className="np-color-codes-section">
          <div className="np-container">
            <div className="np-section-header-center">
              <h2 className="np-section-title-large">MÃ MÀU SƠN</h2>
              <p className="np-section-description-large">
                Thỏa sức lựa chọn màu sắc cho không gian sống từ thư viện với hơn 2338 mã màu sơn của chúng tôi.
              </p>
            </div>
            <div className="np-color-swatches-row">
              {currentColorSwatches.map((color, index) => (
                <Link
                  key={`${colorCodeCarouselIndex}-${index}`}
                  to="/phoi-mau-tuy-chinh"
                  className={`np-color-swatch-circle ${index === 6 ? 'highlighted' : ''} color-transition`}
                  style={{ 
                    backgroundColor: color,
                    animationDelay: `${index * 0.05}s`
                  }}
                  title={`Màu ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Image Carousel */}
            <div className="np-color-codes-carousel-wrapper">
              <div className="np-color-codes-carousel">
                {colorCodeImages.map((item, index) => (
                  <div
                    key={index}
                    className={`np-color-codes-carousel-item ${
                      index === colorCodeCarouselIndex ? 'active' : 
                      index === (colorCodeCarouselIndex + 1) % colorCodeImages.length ? 'next' :
                      index === (colorCodeCarouselIndex - 1 + colorCodeImages.length) % colorCodeImages.length ? 'prev' : ''
                    }`}
                  >
                    <img 
                      src={item.image} 
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80';
                        e.currentTarget.onerror = null;
                      }}
                      loading="lazy"
                    />
                    {index === colorCodeCarouselIndex && (
                      <>
                        <button
                          className="np-carousel-nav np-carousel-prev"
                          onClick={() => setColorCodeCarouselIndex((prev) => (prev - 1 + colorCodeImages.length) % colorCodeImages.length)}
                          aria-label="Previous"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <button
                          className="np-carousel-nav np-carousel-next"
                          onClick={() => setColorCodeCarouselIndex((prev) => (prev + 1) % colorCodeImages.length)}
                          aria-label="Next"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="np-section-cta">
              <Link to="/phoi-mau-tuy-chinh" className="np-btn-color-code-search">
                <span>TÌM MÃ MÀU SƠN</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Color Trends Section */}
        <section className="np-color-trends-section">
          <div className="np-container">
            <div className="np-section-header-center">
              <h2 className="np-section-title-large">XU HƯỚNG MÀU SẮC</h2>
              <p className="np-section-description-large">
                Nơi cập nhật những xu hướng màu sắc và phong cách phối màu mới nhất từ các chuyên gia thiết kế hàng đầu Châu Á
              </p>
            </div>
            
            <div className="np-trend-featured">
              <div className="np-trend-image-wrapper">
                <img 
                  src={activeTrend.image} 
                  alt={activeTrend.title}
                  className="np-trend-main-image"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600';
                    e.currentTarget.onerror = null;
                  }}
                  loading="lazy"
                />
              </div>
              <div className="np-trend-content">
                <h3 className="np-trend-heading">{activeTrend.title}</h3>
                <div className="np-trend-palette">
                  {activeTrend.colors.map((color, i) => (
                    <div 
                      key={i} 
                      className="np-trend-palette-swatch"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="np-trend-text">{activeTrend.description}</p>
                <Link to="/phoi-mau-tuy-chinh" className="np-trend-cta-btn">
                  <span>XEM CHI TIẾT</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="np-trend-carousel-nav">
                  <button className="np-carousel-arrow" onClick={prevTrend} aria-label="Previous">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <div className="np-carousel-thumbnails">
                    {colorTrends.map((trend, index) => (
                      <button
                        key={index}
                        className={`np-carousel-thumb ${index === activeTrendIndex ? 'active' : ''}`}
                        onClick={() => setActiveTrendIndex(index)}
                        aria-label={`Go to ${trend.title}`}
                      >
                        <img 
                          src={trend.image} 
                          alt={trend.title}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200';
                            e.currentTarget.onerror = null;
                          }}
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                  <button className="np-carousel-arrow" onClick={nextTrend} aria-label="Next">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="np-trend-gallery">
              {activeTrend.gallery && activeTrend.gallery.map((img, index) => (
                <div key={index} className="np-trend-gallery-item">
                  <img 
                    src={img} 
                    alt={`Gallery ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400';
                      e.currentTarget.onerror = null;
                    }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="np-home-products-section">
          <div className="np-container">
            <div className="np-section-header-center">
              <h2 className="np-section-title-large">SẢN PHẨM</h2>
              <p className="np-section-description-large">
                Kiến tạo giá trị bền vững thông qua sản phẩm Nippon
              </p>
            </div>
            <div className="np-product-categories">
              <Link to="/son-noi-that" className="np-product-category-link">Sơn kiến trúc</Link>
              <Link to="/son-dan-dung" className="np-product-category-link">Sơn dân dụng</Link>
              <Link to="/son-va-chat-phu-cong-nghiep" className="np-product-category-link">Sơn và chất phủ công nghiệp</Link>
            </div>
            <div className="np-featured-products-grid">
              {featuredProducts.map((product) => (
                <Link key={product.id} to={`/san-pham`} className="np-featured-product-card">
                  <div className="np-product-image-wrapper">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="np-product-image"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400';
                        e.currentTarget.onerror = null;
                      }}
                      loading="lazy"
                    />
                    {product.isNew && <span className="np-product-badge">Mới</span>}
                    {product.isPremium && <span className="np-product-badge premium">Premium</span>}
                  </div>
                  <h3 className="np-product-name">{product.name}</h3>
                  <p className="np-product-description">{product.description}</p>
                  <div className="np-product-link">Xem ngay →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="np-support-section">
          <div className="np-container">
            <div className="np-support-layout">
              <div className="np-support-content">
                <h2 className="np-support-heading">HỖ TRỢ</h2>
                <p className="np-support-subheading">
                  Hỗ trợ tận tâm, dịch vụ tận tình
                </p>
                <div className="np-support-buttons">
                  <Link to="/tinh-toan-luong-son" className="np-support-button">
                    <span>TÍNH TOÁN LƯỢNG SƠN</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </Link>
                  <Link to="/lien-he" className="np-support-button">
                    <span>MẸO SƠN NHÀ</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </Link>
                  <Link to="/phoi-mau-tuy-chinh" className="np-support-button">
                    <span>HỖ TRỢ PHỐI MÀU</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="np-support-image">
                <img 
                  src="https://nipponpaint.com.vn/sites/default/files/styles/webp/public/2025-06/nippon-support_0.png.webp?itok=RKBSP-2W" 
                  alt="Hỗ trợ Nippon Paint"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80';
                    e.currentTarget.onerror = null;
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
