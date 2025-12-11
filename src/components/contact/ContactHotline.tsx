import React from 'react';

function ContactHotline(): React.JSX.Element {
  return (
    <div className="np-contact-hotline" data-aos="fade-up">
      <div className="np-hotline-content">
        <div className="np-hotline-left">
          <h3>Thông tin khác</h3>
          <p className="np-hotline-intro">
            Bạn muốn trở thành đại lý chính thức của sơn Nippon hay cần tư vấn về sản phẩm, màu sắc?
            Liên hệ ngay với chúng tôi để được hỗ trợ kịp thời nhé!
          </p>
          
          <div className="np-hotline-actions">
            <button className="np-btn-hotline">
              <span>LIÊN HỆ ĐẠI LÝ</span>
              <span className="np-btn-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <button className="np-btn-hotline">
              <span>TÌM SẢN PHẨM</span>
              <span className="np-btn-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
          </div>

          <div className="np-hotline-info">
            <p className="np-hotline-label">Hotline miễn phí cước gọi:</p>
            <a href="tel:18006111" className="np-hotline-number">
              1800 6111
            </a>
          </div>
        </div>

        <div className="np-hotline-right">
          <div className="np-hotline-image">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=500&fit=crop&crop=face" 
              alt="Customer service representative"
              onError={(e) => {
                // Fallback nếu ảnh không load được
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactHotline;

