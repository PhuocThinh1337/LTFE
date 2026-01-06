import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { VOUCHERS, Voucher } from '../../data/vouchers';
import './VoucherPage.css';


const MyVouchersPage: React.FC = () => {
  const [savedVouchers, setSavedVouchers] = useState<number[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedVouchers');
    if (saved) {
      setSavedVouchers(JSON.parse(saved));
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.value}%`;
    } else {
      return `${voucher.value.toLocaleString('vi-VN')} ₫`;
    }
  };

  const getVoucherTypeText = (type: string) => {
    switch (type) {
      case 'shipping': return 'Miễn phí vận chuyển';
      case 'total': return 'Giảm tổng đơn hàng';
      case 'category': return 'Giảm theo danh mục';
      default: return type;
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRemoveVoucher = (voucherId: number) => {
    const newSavedVouchers = savedVouchers.filter(id => id !== voucherId);
    setSavedVouchers(newSavedVouchers);
    localStorage.setItem('savedVouchers', JSON.stringify(newSavedVouchers));
  };

  const myVouchers = VOUCHERS.filter(voucher => savedVouchers.includes(voucher.id));

  return (
    <div className="np-page-wrapper">
      <Header />
      
      <main className="np-main-content">
        <div className="np-container">
          <div className="np-voucher-page">
            <div className="np-page-header">
              <h1>Voucher của tôi</h1>
              <p>Các voucher bạn đã lưu để sử dụng khi thanh toán</p>
            </div>

            <div className="np-vouchers-grid">
              {myVouchers.map((voucher) => (
                <div key={voucher.id} className="np-voucher-card">
                  <div className="np-voucher-header">
                    <div className="np-voucher-code">{voucher.code}</div>
                    <div className="np-voucher-type">{getVoucherTypeText(voucher.type)}</div>
                  </div>
                  
                  <div className="np-voucher-body">
                    <h3 className="np-voucher-description">{voucher.description}</h3>
                    
                    <div className="np-voucher-discount">
                      <span className="np-discount-value">{formatDiscount(voucher)}</span>
                      {voucher.discountType === 'percentage' && voucher.maxDiscount && (
                        <span className="np-max-discount">
                          (Giảm tối đa {voucher.maxDiscount.toLocaleString('vi-VN')} ₫)
                        </span>
                      )}
                    </div>

                    {voucher.minOrderValue && (
                      <div className="np-voucher-condition">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        Đơn tối thiểu: {voucher.minOrderValue.toLocaleString('vi-VN')} ₫
                      </div>
                    )}

                    {voucher.targetCategory && (
                      <div className="np-voucher-condition">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        Áp dụng cho: {voucher.targetCategory}
                      </div>
                    )}
                  </div>

                  <div className="np-voucher-footer">
                    <div className="np-voucher-dates">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                    </div>
                    <div className="np-voucher-usage">
                      Còn lại: {voucher.usageLimit - voucher.usedCount}/{voucher.usageLimit} lượt
                    </div>
                  </div>

                  <div className="np-voucher-actions">
                    <button 
                      className={`np-copy-voucher-btn ${copiedCode === voucher.code ? 'copied' : ''}`}
                      onClick={() => handleCopyCode(voucher.code)}
                    >
                      {copiedCode === voucher.code ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Đã sao chép!
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                          Sao chép mã
                        </>
                      )}
                    </button>
                    <button 
                      className="np-remove-voucher-btn"
                      onClick={() => handleRemoveVoucher(voucher.id)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {myVouchers.length === 0 && (
              <div className="np-no-vouchers">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <path d="M12 7v6M12 16h.01"/>
                </svg>
                <p>Bạn chưa lưu voucher nào.</p>
                <p className="np-no-vouchers-subtitle">
                  Hãy truy cập <a href="/ma-giam-gia">trang mã giảm giá</a> để lưu voucher!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyVouchersPage;