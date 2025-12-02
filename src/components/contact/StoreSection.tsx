import React from 'react';

function StoreSection(): React.JSX.Element {
  return (
    <section className="np-store-section" id="store">
      <div className="np-container np-store-grid">
        <div className="np-store-text">
          <h2>Tìm đại lý gần bạn</h2>
          <p>
            Hệ thống đại lý phủ khắp toàn quốc giúp bạn dễ dàng mua sơn Nippon chính hãng, yên tâm
            về chất lượng và dịch vụ.
          </p>
          <button className="np-btn-outline">Xem hệ thống đại lý</button>
        </div>
        <div className="np-store-map-placeholder">
          <span>Bản đồ / Hình ảnh đại lý (minh hoạ)</span>
        </div>
      </div>
    </section>
  );
}

export default StoreSection;

