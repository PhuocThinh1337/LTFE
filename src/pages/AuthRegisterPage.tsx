import React, { useState, FormEvent } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface RegisterState {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

function AuthRegisterPage(): React.JSX.Element {
  const [formData, setFormData] = useState<RegisterState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải từ 6 ký tự';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
    }
    if (!formData.agree) {
      newErrors.agree = 'Bạn cần đồng ý với điều khoản';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Placeholder submit
      // eslint-disable-next-line no-console
      console.log('Register submit', formData);
      alert('Đăng ký thành công (giả lập)');
    }
  };

  return (
    <div className="np-app">
      <Header />
      <main className="np-main np-auth-main">
        <div className="np-container">
          <div className="np-auth-card" data-aos="fade-up">
            <div className="np-auth-header">
              <h1>Tạo tài khoản</h1>
              <p>Đăng ký để nhận ưu đãi và hỗ trợ từ Nippon Paint</p>
            </div>
            <form className="np-auth-form" onSubmit={handleSubmit} noValidate>
              <div className={`np-auth-field ${errors.fullName ? 'has-error' : ''}`}>
                <label htmlFor="fullName">Họ và tên</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                />
                {errors.fullName && <span className="np-auth-error">{errors.fullName}</span>}
              </div>

              <div className={`np-auth-field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="np-auth-error">{errors.email}</span>}
              </div>

              <div className={`np-auth-field ${errors.password ? 'has-error' : ''}`}>
                <label htmlFor="password">Mật khẩu</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                />
                {errors.password && <span className="np-auth-error">{errors.password}</span>}
              </div>

              <div className={`np-auth-field ${errors.confirmPassword ? 'has-error' : ''}`}>
                <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                />
                {errors.confirmPassword && (
                  <span className="np-auth-error">{errors.confirmPassword}</span>
                )}
              </div>

              <div className="np-auth-row np-auth-remember">
                <label>
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                  />
                  Tôi đồng ý với Điều khoản &amp; Chính sách bảo mật
                </label>
                {errors.agree && <span className="np-auth-error inline">{errors.agree}</span>}
              </div>

              <button type="submit" className="np-auth-btn primary">
                Đăng ký
              </button>

              <div className="np-auth-footer">
                <span>Đã có tài khoản?</span>
                <a className="np-auth-link" href="/login">
                  Đăng nhập
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AuthRegisterPage;

