import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function AuthResetPasswordPage(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Đặt lại mật khẩu - Nippon Paint';
    if (!token) {
      setError('Liên kết không hợp lệ hoặc thiếu token.');
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setSuccess('');
    setError('');
    
    if (!token) {
      setError('Token không hợp lệ');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await api.resetPassword(token, password);
      setSuccess(result.message);
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
                  <h3>Đổi mật khẩu thành công!</h3>
                  <p>Đang chuyển hướng đến trang đăng nhập...</p>
                </div>
              ) : (
                <>
                  <div className="np-auth-card-header">
                    <div className="np-auth-icon-wrapper">
                      <div className="np-auth-icon-circle-new forgot">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                           <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                    </div>
                    <h1>Đặt lại mật khẩu</h1>
                    <p>Nhập mật khẩu mới cho tài khoản của bạn</p>
                  </div>
                <form className="np-auth-form" onSubmit={handleSubmit} noValidate>
                  <div className={`np-auth-field ${error && (password.length < 6 || password !== confirmPassword) ? 'has-error' : ''}`}>
                    <label htmlFor="password">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                         <path fillRule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1-.5-.5v-2a3 3 0 0 0-6 0v2a.5.5 0 0 1-.5.5h-2zm5-1.5a2 2 0 0 0-2 2v1.5h4v-1.5a2 2 0 0 0-2-2z"/>
                      </svg>
                      Mật khẩu mới
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Ít nhất 6 ký tự"
                      disabled={!token}
                    />
                  </div>

                  <div className={`np-auth-field ${error && password !== confirmPassword ? 'has-error' : ''}`}>
                    <label htmlFor="confirmPassword">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                         <path fillRule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1-.5-.5v-2a3 3 0 0 0-6 0v2a.5.5 0 0 1-.5.5h-2zm5-1.5a2 2 0 0 0-2 2v1.5h4v-1.5a2 2 0 0 0-2-2z"/>
                      </svg>
                      Xác nhận mật khẩu
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Nhập lại mật khẩu mới"
                      disabled={!token}
                    />
                    {error && <span className="np-auth-error">{error}</span>}
                  </div>

                  <button type="submit" className="np-auth-btn primary" disabled={isLoading || !token}>
                    <span>{isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}</span>
                  </button>

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

export default AuthResetPasswordPage;
