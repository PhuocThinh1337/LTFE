import React, { useState, FormEvent } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function AuthForgotPasswordPage(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }
    // eslint-disable-next-line no-console
    console.log('Forgot password submit', email);
    setSuccess('Nếu email hợp lệ, liên kết đặt lại mật khẩu đã được gửi (giả lập).');
  };

  return (
    <div className="np-app">
      <Header />
      <main className="np-main np-auth-main">
        <div className="np-container">
          <div className="np-auth-card" data-aos="fade-up">
            <div className="np-auth-header">
              <h1>Quên mật khẩu</h1>
              <p>Nhập email để nhận hướng dẫn đặt lại mật khẩu</p>
            </div>
            <form className="np-auth-form" onSubmit={handleSubmit} noValidate>
              <div className={`np-auth-field ${error ? 'has-error' : ''}`}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="your@email.com"
                />
                {error && <span className="np-auth-error">{error}</span>}
                {success && <span className="np-auth-success">{success}</span>}
              </div>

              <button type="submit" className="np-auth-btn primary">
                Gửi yêu cầu
              </button>

              <div className="np-auth-footer">
                <a className="np-auth-link" href="/login">
                  Quay lại đăng nhập
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

export default AuthForgotPasswordPage;

