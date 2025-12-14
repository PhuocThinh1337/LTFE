import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
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
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterState>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Đăng ký - Nippon Paint';
  }, []);

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

  const handleSubmit = async (e: FormEvent): Promise<void> => {
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
      setIsLoading(true);
      try {
        await api.register({
          name: formData.fullName,
          email: formData.email,
          password: formData.password
        });
        // Registration successful
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } catch (error) {
        setErrors({
          submit: error instanceof Error ? error.message : 'Đăng ký thất bại. Vui lòng thử lại.'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      <div className="np-auth-page">
        <div className="np-container">
          <div className="np-auth-wrapper-new">
            <div className="np-auth-card-new">
              <div className="np-auth-card-header">
                <div className="np-auth-icon-wrapper">
                  <div className="np-auth-icon-circle-new register">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                  </div>
                </div>
                <h1>Tạo tài khoản mới</h1>
                <p>Đăng ký để nhận ưu đãi và hỗ trợ từ Nippon Paint</p>
              </div>

              <form className="np-auth-form" onSubmit={handleSubmit} noValidate>
                <div className={`np-auth-field ${errors.fullName ? 'has-error' : ''}`}>
                  <label htmlFor="fullName">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>
                    Họ và tên
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                  />
                  {errors.fullName && <span className="np-auth-error">{errors.fullName}</span>}
                </div>

                <div className={`np-auth-field ${errors.email ? 'has-error' : ''}`}>
                  <label htmlFor="email">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm0 1.5v.793l6 3.5 6-3.5V4.5H2zm12 1.707l-6 3.5-6-3.5V12h12V6.207z"/>
                    </svg>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="np-auth-error">{errors.email}</span>}
                </div>

                <div className={`np-auth-field ${errors.password ? 'has-error' : ''}`}>
                  <label htmlFor="password">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M5 6.5V4.5a3 3 0 1 1 6 0V6.5h.5A1.5 1.5 0 0 1 13 8v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13V8a1.5 1.5 0 0 1 1.5-1.5H5zM6 4.5a2 2 0 1 1 4 0V6.5H6V4.5z"/>
                    </svg>
                    Mật khẩu
                  </label>
                  <div className="np-auth-password-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="np-auth-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 7c1.66 0 3 1.34 3 3 0 .55-.15 1.06-.41 1.5l1.76 1.76C15.28 12.59 16.08 11.37 16.5 10c-.73-2.89-4-7-9-7-1.12 0-2.18.25-3.16.67l1.3 1.3C6.19 7.15 7.04 7 10 7zM2 4.27l2.28 2.28.46.46C3.08 7.59 2.28 8.81 1.86 10c.73 2.89 4 7 9 7 1.12 0 2.18-.25 3.16-.67L15.73 18 17 16.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <span className="np-auth-error">{errors.password}</span>}
                </div>

                <div className={`np-auth-field ${errors.confirmPassword ? 'has-error' : ''}`}>
                  <label htmlFor="confirmPassword">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                    </svg>
                    Nhập lại mật khẩu
                  </label>
                  <div className="np-auth-password-wrapper">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="np-auth-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 7c1.66 0 3 1.34 3 3 0 .55-.15 1.06-.41 1.5l1.76 1.76C15.28 12.59 16.08 11.37 16.5 10c-.73-2.89-4-7-9-7-1.12 0-2.18.25-3.16.67l1.3 1.3C6.19 7.15 7.04 7 10 7zM2 4.27l2.28 2.28.46.46C3.08 7.59 2.28 8.81 1.86 10c.73 2.89 4 7 9 7 1.12 0 2.18-.25 3.16-.67L15.73 18 17 16.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="np-auth-error">{errors.confirmPassword}</span>
                  )}
                </div>

                {errors.submit && (
                  <div className="np-auth-error-message">
                    <span>{errors.submit}</span>
                  </div>
                )}

                <div className={`np-auth-checkbox-field ${errors.agree ? 'has-error' : ''}`}>
                  <label className="np-auth-checkbox">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={formData.agree}
                      onChange={handleChange}
                    />
                    <span className="np-auth-checkbox-label">
                      Tôi đồng ý với <a href="/terms" className="np-auth-link">Điều khoản</a> &amp; <a href="/privacy" className="np-auth-link">Chính sách bảo mật</a>
                    </span>
                  </label>
                  {errors.agree && <span className="np-auth-error">{errors.agree}</span>}
                </div>

                <button type="submit" className="np-auth-btn primary" disabled={isLoading}>
                  <span>{isLoading ? 'Đang đăng ký...' : 'Đăng ký'}</span>
                  {!isLoading && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1z"/>
                    </svg>
                  )}
                </button>

                <div className="np-auth-divider">
                  <span>hoặc</span>
                </div>

                <div className="np-auth-footer">
                  <span>Đã có tài khoản?</span>
                  <a className="np-auth-link" href="/login">
                    Đăng nhập ngay
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AuthRegisterPage;

