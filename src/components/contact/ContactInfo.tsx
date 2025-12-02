import React from 'react';

function ContactInfo(): React.JSX.Element {
  return (
    <div className="np-contact-info">
      <h2>Thông tin liên hệ</h2>
      <p className="np-contact-description">
        Vui lòng liên hệ chúng tôi qua hotline hoặc gửi yêu cầu trực tuyến.
      </p>

      <div className="np-info-card">
        <h3>Trụ sở chính</h3>
        <p>
          Nippon Paint Việt Nam
          <br />
          (Thông tin địa chỉ minh hoạ)
        </p>
      </div>

      <div className="np-info-list">
        <div className="np-info-item">
          <span className="np-info-label">Hotline</span>
          <span className="np-info-value">1800 6111 (miễn phí)</span>
        </div>
        <div className="np-info-item">
          <span className="np-info-label">Email</span>
          <span className="np-info-value">support@nipponpaint.com.vn</span>
        </div>
        <div className="np-info-item">
          <span className="np-info-label">Giờ làm việc</span>
          <span className="np-info-value">Thứ 2 - Thứ 6, 8:00 - 17:30</span>
        </div>
      </div>

      <div className="np-social">
        <span>Theo dõi chúng tôi:</span>
        <div className="np-social-links">
          <button>Facebook</button>
          <button>YouTube</button>
          <button>Instagram</button>
          <button>TikTok</button>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;

