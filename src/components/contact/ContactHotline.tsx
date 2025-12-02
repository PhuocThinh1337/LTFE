import React from 'react';

function ContactHotline(): React.JSX.Element {
  return (
    <div className="np-contact-hotline" data-aos="fade-up">
      <h3>Thông tin khác</h3>
      <p className="np-hotline-intro">
        Bạn muốn trở thành đại lý chính thức của sơn Nippon hay cần tư vấn về sản phẩm, màu sắc?
        Liên hệ ngay với chúng tôi để được hỗ trợ kịp thời nhé!
      </p>
      
      <div className="np-hotline-actions">
        <button className="np-btn-hotline">Liên hệ đại lý</button>
        <button className="np-btn-hotline">Tìm sản phẩm</button>
      </div>

      <div className="np-hotline-box">
        <p className="np-hotline-label">Hotline miễn phí cước gọi:</p>
        <a href="tel:18006111" className="np-hotline-number">
          1800 6111
        </a>
      </div>
    </div>
  );
}

export default ContactHotline;

