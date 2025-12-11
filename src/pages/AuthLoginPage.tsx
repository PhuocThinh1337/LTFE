import React, { useState, FormEvent } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface AuthState {
  email: string;
  password: string;
  remember: boolean;
}

function AuthLoginPage(): React.JSX.Element {
  const [formData, setFormData] = useState<AuthState>({
    email: '',
    password: '',
    remember: false
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
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Placeholder submit
      // eslint-disable-next-line no-console
      console.log('Login submit', formData);
      alert('Đăng nhập thành công (giả lập)');
    }
  };

  return (
    <div className="np-app">
      <Header />
      <main className="np-main np-auth-main">
        <div className="np-container">
          <div className="np-auth-card" data-aos="fade-up">
            <div className="np-auth-header">
              <h1>Đăng nhập</h1>
              <p>Truy cập tài khoản Nippon Paint của bạn</p>
            </div>
            <form className="np-auth-form" onSubmit={handleSubmit} noValidate>
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

              <div className="np-auth-row">
                <label className="np-auth-remember">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  Ghi nhớ đăng nhập
                </label>
                <a className="np-auth-link" href="/forgot-password">
                  Quên mật khẩu?
                </a>
              </div>

              <button type="submit" className="np-auth-btn primary">
                Đăng nhập
              </button>

              <div className="np-auth-footer">
                <span>Chưa có tài khoản?</span>
                <a className="np-auth-link" href="/register">
                  Đăng ký
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

export default AuthLoginPage;

