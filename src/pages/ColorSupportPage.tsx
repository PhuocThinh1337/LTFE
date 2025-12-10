import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

function ColorSupportPage(): React.JSX.Element {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    colorCode: '',
    address: '',
    file: null as File | null
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Xử lý thay đổi ô nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, file: file }));
      setPreviewUrl(URL.createObjectURL(file)); // Tạo link xem trước ảnh
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cảm ơn bạn! Thông tin đăng ký phối màu đã được gửi.");
    // Tại đây bạn sẽ gọi API gửi dữ liệu đi
  };

  return (
      <div className="np-app">
        <Header />

        <main className="np-main">
          {/* Breadcrumb */}
          <div className="np-breadcrumb">
            <div className="np-container">
              <Link to="/" className="np-breadcrumb-link">Trang chủ</Link>
              <span className="np-breadcrumb-separator">/</span>
              <span className="np-breadcrumb-current">Dịch vụ phối màu</span>
            </div>
          </div>

          <div className="np-container cs-wrapper">
            {/* Tiêu đề & Mô tả */}
            <div className="cs-header text-center">
              <h1 className="cs-title">DỊCH VỤ PHỐI MÀU MIỄN PHÍ</h1>
              <p className="cs-desc">
                Hoàn thành đăng ký bên dưới và gửi kèm ảnh chụp toàn cảnh ngôi nhà/ công trình
                của bạn để nhận bản phối màu miễn phí từ chuyên gia Nippon Paint nhé.
              </p>
            </div>

            {/* Form đăng ký */}
            <div className="cs-form-container">
              <form className="cs-form" onSubmit={handleSubmit}>

                <div className="cs-form-grid">
                  {/* Cột Trái: Thông tin cá nhân */}
                  <div className="cs-form-col">
                    <div className="cs-input-group">
                      <label>Họ và tên <span className="text-red">*</span></label>
                      <input
                          type="text"
                          name="fullName"
                          placeholder="Nhập họ tên của bạn"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                      />
                    </div>

                    <div className="cs-input-group">
                      <label>Số điện thoại <span className="text-red">*</span></label>
                      <input
                          type="tel"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                      />
                    </div>

                    <div className="cs-input-group">
                      <label>Email</label>
                      <input
                          type="email"
                          name="email"
                          placeholder="Nhập địa chỉ email"
                          value={formData.email}
                          onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Cột Phải: Thông tin công trình */}
                  <div className="cs-form-col">
                    <div className="cs-input-group">
                      <label>Mã màu mong muốn</label>
                      <input
                          type="text"
                          name="colorCode"
                          placeholder="Ví dụ: NP YO 1152D"
                          value={formData.colorCode}
                          onChange={handleChange}
                      />
                    </div>

                    <div className="cs-input-group">
                      <label>Địa chỉ công trình</label>
                      <input
                          type="text"
                          name="address"
                          placeholder="Nhập địa chỉ công trình cần phối màu"
                          value={formData.address}
                          onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Khu vực Upload ảnh (Full width) */}
                <div className="cs-upload-section">
                  <label>Tải lên ảnh công trình <span className="text-red">*</span></label>
                  <div className="cs-upload-box">
                    <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                    />
                    <label htmlFor="file-upload" className="cs-upload-label">
                      {previewUrl ? (
                          <div className="cs-preview-area">
                            <img src={previewUrl} alt="Preview" />
                            <span className="cs-reupload-btn">Chọn ảnh khác</span>
                          </div>
                      ) : (
                          <div className="cs-placeholder-area">
                            <span className="cs-upload-icon">☁️</span>
                            <span>Nhấn vào đây để tải ảnh lên</span>
                            <small>(Hỗ trợ JPG, PNG - Tối đa 5MB)</small>
                          </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Nút Gửi */}
                <div className="cs-action">
                  <button type="submit" className="cs-btn-submit">
                    GỬI ĐĂNG KÝ
                  </button>
                </div>

              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
}

export default ColorSupportPage;