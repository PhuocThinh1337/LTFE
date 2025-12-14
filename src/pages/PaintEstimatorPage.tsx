import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link để chuyển trang nếu cần
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function PaintEstimatorPage(): React.JSX.Element {
  // Biến state để kiểm tra đang ở Bước 1 hay Bước 2
  const [step, setStep] = useState<number>(1);

  // Lưu dữ liệu nhập vào
  const [ceilingArea, setCeilingArea] = useState<any>('');
  const [wallArea, setWallArea] = useState<any>('');

  // Hàm xử lý khi bấm XEM KẾT QUẢ
  const handleCalculate = () => {
    if (!ceilingArea && !wallArea) {
      alert("Vui lòng nhập diện tích!");
      return;
    }
    setStep(2); // Chuyển sang bước 2
    window.scrollTo(0, 0); // Cuộn lên đầu trang cho đẹp
  };

  // Hàm xử lý ĐẶT LẠI (Reset)
  const handleReset = () => {
    setStep(1);
    setCeilingArea('');
    setWallArea('');
  };

  // Hàm tính toán hiển thị (Chia cho 10)
  const calculatePaint = (area: any) => {
    const num = parseFloat(area) || 0;
    const coat1 = (num / 10).toFixed(2); // 1 lớp
    const coat2 = (num / 5).toFixed(2);  // 2 lớp (hoặc num/10 * 2)
    return { area: num, coat1, coat2 };
  };

  const ceilingResult = calculatePaint(ceilingArea);
  const wallResult = calculatePaint(wallArea);

  return (
    <div className="np-app">
      <Header />

      <main className="np-main">
        <div className="pe-container">

          <h1 className="pe-title">
            {step === 1 ? 'TÍNH TOÁN LƯỢNG SƠN' : 'KẾT QUẢ TÍNH TOÁN'}
          </h1>

          {/* THANH TIẾN TRÌNH: Thay đổi màu sắc dựa theo Step */}
          <div className="pe-steps-wrapper">
            {/* Bước 1 */}
            <div className={`pe-step ${step === 1 ? 'active' : 'completed'}`}>
              {step === 1 ? '01' : '✓'}
            </div>

            <div className={`pe-step-line ${step === 2 ? 'active' : ''}`}></div>

            {/* Bước 2 */}
            <div className={`pe-step ${step === 2 ? 'active' : ''}`}>02</div>
          </div>

          {step === 1 ? (
            /* ================= GIAO DIỆN BƯỚC 1: NHẬP LIỆU ================= */
            <>
              <h2 className="pe-subtitle">NHẬP THÔNG TIN CÔNG TRÌNH</h2>
              <div className="pe-grid-layout">
                {/* Thẻ Trần */}
                <div className="pe-card">
                  <div className="pe-card-image">
                    <img src="https://nipponpaint.com.vn/themes/wosh_sub/assets/images/empty-room-interior-with-large-windows-wooden-parquet-floor-white-background-3d-rendering.png" alt="Trần" />
                  </div>
                  <div className="pe-card-content">
                    <label>Tổng diện tích trần</label>
                    <div className="pe-input-group">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={ceilingArea}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || parseFloat(val) >= 0) {
                            setCeilingArea(val);
                          }
                        }}
                      />
                      <span className="pe-unit">m²</span>
                    </div>
                    <p className="pe-note">Thông thường diện tích trần sẽ tương đương diện tích sàn</p>
                  </div>
                </div>

                {/* Thẻ Tường */}
                <div className="pe-card">
                  <div className="pe-card-image">
                    <img src="https://nipponpaint.com.vn/themes/wosh_sub/assets/images/empty-room-interior-with-large-windows-wooden-parquet-floor-white-background-3d-rendering2.png" alt="Tường" />
                  </div>
                  <div className="pe-card-content">
                    <label>Tổng diện tích tường</label>
                    <div className="pe-input-group">
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={wallArea}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || parseFloat(val) >= 0) {
                            setWallArea(val);
                          }
                        }}
                      />
                      <span className="pe-unit">m²</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pe-footer">
                <p className="pe-disclaimer"><strong>LƯU Ý:</strong> Lượng sơn chỉ mang tính chất tham khảo...</p>
                <button className="pe-btn-submit" onClick={handleCalculate}>XEM KẾT QUẢ ➜</button>
              </div>
            </>
          ) : (

            <>
              <div className="pe-grid-layout">
                {/* Kết quả Trần */}
                <div className="pe-card pe-result-card">
                  <div className="pe-card-image">
                    <img src="https://nipponpaint.com.vn/themes/wosh_sub/assets/images/empty-room-interior-with-large-windows-wooden-parquet-floor-white-background-3d-rendering.png" alt="Trần" />
                  </div>
                  <div className="pe-card-content pe-result-content">
                    <h3 className="pe-result-title">Trần cần sơn</h3>

                    <div className="pe-result-row">
                      <span>Diện tích</span>
                      <strong>{ceilingResult.area} m²</strong>
                    </div>

                    <div className="pe-result-row">
                      <span>Lượng sơn phủ (Áp dụng cho 1 lớp)</span>
                      <strong>{ceilingResult.coat1} lít</strong>
                    </div>

                    <div className="pe-result-row highlight">
                      <span>Lượng sơn phủ (Áp dụng cho 2 lớp)</span>
                      <strong className="big-text">{ceilingResult.coat2} lít</strong>
                    </div>
                  </div>
                </div>

                <div className="pe-card pe-result-card">
                  <div className="pe-card-image">
                    <img src="https://nipponpaint.com.vn/themes/wosh_sub/assets/images/empty-room-interior-with-large-windows-wooden-parquet-floor-white-background-3d-rendering2.png" alt="Tường" />
                  </div>
                  <div className="pe-card-content pe-result-content">
                    <h3 className="pe-result-title" style={{ color: '#b71010' }}>Tường cần sơn</h3>

                    <div className="pe-result-row">
                      <span>Diện tích</span>
                      <strong>{wallResult.area} m²</strong>
                    </div>

                    <div className="pe-result-row">
                      <span>Lượng sơn phủ (Áp dụng cho 1 lớp)</span>
                      <strong>{wallResult.coat1} lít</strong>
                    </div>

                    <div className="pe-result-row highlight">
                      <span>Lượng sơn phủ (Áp dụng cho 2 lớp)</span>
                      <strong className="big-text">{wallResult.coat2} lít</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons của Bước 2 */}
              <div className="pe-footer-actions-v2">
                <button className="pe-btn-outline" onClick={handleReset}>ĐẶT LẠI ⟲</button>
                <Link to="/san-pham" className="pe-btn-outline">TÌM SẢN PHẨM 🔍</Link>
                <Link to="/dai-ly" className="pe-btn-outline">LIÊN HỆ ĐẠI LÝ 🏪</Link>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PaintEstimatorPage;