
import React, { useEffect, useRef } from 'react';
import './GoogleOAuthModal.css';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { email: string; name: string; picture?: string }) => void;
  onError?: (error: string) => void;
}

function GoogleOAuthModal({ isOpen, onClose, onSuccess, onError }: GoogleOAuthModalProps): React.JSX.Element | null {
  const buttonRef = useRef<HTMLDivElement>(null);

  const handleGoogleSuccess = (userInfo: { email: string; name: string; picture?: string }) => {
    onSuccess(userInfo);
    onClose();
  };

  const handleGoogleError = (error: string) => {
    if (onError) {
      onError(error);
    }
  };

  const { isLoaded, isInitialized, renderButton, hasClientId } = useGoogleAuth(
    handleGoogleSuccess,
    handleGoogleError
  );

  useEffect(() => {
    if (isOpen && isInitialized && buttonRef.current && hasClientId) {
      // Clear previous button
      if (buttonRef.current.firstChild) {
        buttonRef.current.innerHTML = '';
      }
      renderButton(buttonRef.current);
    }
  }, [isOpen, isInitialized, renderButton, hasClientId]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Fallback nếu không có Client ID
  if (!hasClientId) {
    return (
      <div className="google-oauth-modal-overlay" onClick={handleBackdropClick}>
        <div className="google-oauth-modal">
          <div className="google-oauth-modal-header">
            <div className="google-oauth-logo">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <h2>Google Sign-In</h2>
            <p style={{ color: '#ea4335', fontSize: '14px', marginTop: '8px' }}>
              ⚠️ Chưa cấu hình Google Client ID
            </p>
            <p style={{ fontSize: '13px', color: '#5f6368', marginTop: '12px' }}>
              Vui lòng thêm REACT_APP_GOOGLE_CLIENT_ID vào file .env và restart server
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px' }}>
              Xem console (F12) để kiểm tra: 🔍 Google Client ID check
            </p>
          </div>
          <div className="google-oauth-modal-footer">
            <button
              className="google-oauth-btn google-oauth-btn-secondary"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="google-oauth-modal-overlay" onClick={handleBackdropClick}>
      <div className="google-oauth-modal">
        <div className="google-oauth-modal-header">
          <div className="google-oauth-logo">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <h2>Đăng nhập với Google</h2>
          <p>Chọn tài khoản Google của bạn để tiếp tục</p>
        </div>

        <div className="google-oauth-button-container">
          {!isLoaded && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#5f6368' }}>
              Đang tải Google Sign-In...
            </div>
          )}
          {isLoaded && !isInitialized && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#5f6368' }}>
              Đang khởi tạo...
            </div>
          )}
          {isLoaded && isInitialized && (
            <div ref={buttonRef} className="google-oauth-button-wrapper"></div>
          )}
        </div>

        <div className="google-oauth-modal-footer">
          <button
            className="google-oauth-btn google-oauth-btn-secondary"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoogleOAuthModal;

