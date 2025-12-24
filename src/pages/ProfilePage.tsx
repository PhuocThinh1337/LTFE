import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Breadcrumb from '../components/common/Breadcrumb';
import Avatar from '../components/common/Avatar';

function ProfilePage(): React.JSX.Element {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    document.title = 'Thông tin tài khoản - Nippon Paint';
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (profileData.phone && !/^[0-9\s\-+()]+$/.test(profileData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validateProfile()) {
      return;
    }

    setSaving(true);
    try {
      await api.updateProfile({
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        phone: profileData.phone.trim() || undefined
      });

      setSuccessMessage('Cập nhật thông tin thành công!');
      
      // Refresh user context to update UI
      await refreshUser();
    } catch (error: any) {
      setErrorMessage(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validatePassword()) {
      return;
    }

    setSaving(true);
    try {
      await api.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setSuccessMessage('Đổi mật khẩu thành công!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      setErrorMessage(error.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    // Read file as data URL for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);

    // Upload avatar (convert to base64 và lưu vào localStorage)
    try {
      setSaving(true);
      setErrorMessage(null);
      
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await api.updateAvatar(base64);
      setSuccessMessage('Cập nhật avatar thành công!');
      await refreshUser();
    } catch (error: any) {
      setErrorMessage(error.message || 'Có lỗi xảy ra khi cập nhật avatar');
      setAvatarPreview(user?.avatar || null); // Revert preview
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !user) {
    return <></>;
  }

  return (
    <div className="np-app">
      <Header />
      <main className="np-profile-page">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', link: '/' },
            { label: 'Thông tin tài khoản' }
          ]}
        />

        <div className="np-container">
          <div className="np-profile-header">
            <div className="np-profile-avatar">
              <div className="np-profile-avatar-wrapper" onClick={handleAvatarClick}>
                <Avatar 
                  name={user.name} 
                  avatar={avatarPreview || user.avatar} 
                  size="large"
                  className="np-profile-avatar-circle"
                />
                <div className="np-profile-avatar-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span>Đổi ảnh</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="np-profile-info">
              <h1 className="np-profile-name">{user.name}</h1>
              <p className="np-profile-email">{user.email}</p>
            </div>
          </div>

          <div className="np-profile-tabs">
            <button
              className={`np-profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Thông tin cá nhân
            </button>
            <button
              className={`np-profile-tab ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Đổi mật khẩu
            </button>
          </div>

          {successMessage && (
            <div className="np-profile-alert np-profile-alert-success">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="np-profile-alert np-profile-alert-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errorMessage}
            </div>
          )}

          <div className="np-profile-content">
            {activeTab === 'profile' && (
              <form className="np-profile-form" onSubmit={handleProfileSubmit}>
                <div className="np-form-group">
                  <label htmlFor="name" className="np-form-label">
                    Họ và tên <span className="np-required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`np-form-input ${errors.name ? 'error' : ''}`}
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.name && <span className="np-form-error">{errors.name}</span>}
                </div>

                <div className="np-form-group">
                  <label htmlFor="email" className="np-form-label">
                    Email <span className="np-required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`np-form-input ${errors.email ? 'error' : ''}`}
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="Nhập email"
                  />
                  {errors.email && <span className="np-form-error">{errors.email}</span>}
                </div>

                <div className="np-form-group">
                  <label htmlFor="phone" className="np-form-label">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`np-form-input ${errors.phone ? 'error' : ''}`}
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    placeholder="Nhập số điện thoại"
                  />
                  {errors.phone && <span className="np-form-error">{errors.phone}</span>}
                </div>

                <div className="np-form-actions">
                  <button
                    type="submit"
                    className="np-btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form className="np-profile-form" onSubmit={handlePasswordSubmit}>
                <div className="np-form-group">
                  <label htmlFor="currentPassword" className="np-form-label">
                    Mật khẩu hiện tại <span className="np-required">*</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    className={`np-form-input ${errors.currentPassword ? 'error' : ''}`}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  {errors.currentPassword && (
                    <span className="np-form-error">{errors.currentPassword}</span>
                  )}
                </div>

                <div className="np-form-group">
                  <label htmlFor="newPassword" className="np-form-label">
                    Mật khẩu mới <span className="np-required">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    className={`np-form-input ${errors.newPassword ? 'error' : ''}`}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  />
                  {errors.newPassword && (
                    <span className="np-form-error">{errors.newPassword}</span>
                  )}
                </div>

                <div className="np-form-group">
                  <label htmlFor="confirmPassword" className="np-form-label">
                    Xác nhận mật khẩu <span className="np-required">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`np-form-input ${errors.confirmPassword ? 'error' : ''}`}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  {errors.confirmPassword && (
                    <span className="np-form-error">{errors.confirmPassword}</span>
                  )}
                </div>

                <div className="np-form-actions">
                  <button
                    type="submit"
                    className="np-btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Đang đổi...' : 'Đổi mật khẩu'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ProfilePage;

