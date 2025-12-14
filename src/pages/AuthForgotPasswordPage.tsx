import React, { useState, FormEvent, useEffect } from 'react';
import { api } from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function AuthForgotPasswordPage(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Quên mật khẩu - Nippon Paint';
  }, []);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
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
    
    setIsLoading(true);
    try {
      const result = await api.forgotPassword(email);
      setSuccess(result.message);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="np-auth-page">
        <div className="np-container">
          <div className="np-auth-wrapper-new">
            <div className="np-auth-card-new">
              {success ? (
                <div className="np-auth-success-card">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="24" fill="#059669" opacity="0.1"/>
                    <path d="M20 24L22 26L28 20" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="24" cy="24" r="18" stroke="#059669" strokeWidth="2"/>
                  </svg>
                  <h3>Email đã được gửi!</h3>
                  <p>{success}</p>
                  <a href="/login" className="np-auth-btn secondary">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"/>
                    </svg>
                    <span>Quay lại đăng nhập</span>
                  </a>
                </div>
              ) : (
                <>
                  <div className="np-auth-card-header">
                    <div className="np-auth-icon-wrapper">
                      <div className="np-auth-icon-circle-new forgot">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
                        </svg>
                      </div>
                    </div>
                    <h1>Quên mật khẩu?</h1>
                    <p>Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
                  </div>
                  <form className="np-auth-form" onSubmit={handleSubmit} noValidate>
                  <div className={`np-auth-field ${error ? 'has-error' : ''}`}>
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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="example@email.com"
                      autoComplete="email"
                    />
                    {error && <span className="np-auth-error">{error}</span>}
                  </div>

                  <button type="submit" className="np-auth-btn primary" disabled={isLoading}>
                    <span>{isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}</span>
                    {!isLoading && (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    )}
                  </button>

                  <div className="np-auth-divider">
                    <span>hoặc</span>
                  </div>

                  <div className="np-auth-footer">
                    <a className="np-auth-link" href="/login">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                      </svg>
                      Quay lại đăng nhập
                    </a>
                  </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AuthForgotPasswordPage;

