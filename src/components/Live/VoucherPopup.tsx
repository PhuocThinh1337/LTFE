import React from 'react';
import { Voucher } from '../../data/vouchers';

interface VoucherPopupProps {
    activeVoucher: Voucher;
    onClose: () => void;
    role: 'host' | 'audience' | null;
}

const VoucherPopup: React.FC<VoucherPopupProps> = ({ activeVoucher, onClose, role }) => {
    return (
        <div className="flash-voucher-overlay">
            <div className="voucher-content">
                <div className="voucher-title">⚡ FLASH SALE ⚡</div>
                <div className="voucher-code">{activeVoucher.code}</div>
                <div className="voucher-desc">{activeVoucher.description}</div>

                {role === 'audience' ? (
                    <button onClick={() => {
                        navigator.clipboard.writeText(activeVoucher.code);

                        // Lưu voucher đã mở khóa vào ví
                        const existingWallet = localStorage.getItem('my_vouchers');
                        const wallet = existingWallet ? JSON.parse(existingWallet) : [];
                        const exists = wallet.find((v: any) => v.code === activeVoucher.code);

                        if (!exists) {
                            wallet.push(activeVoucher);
                            localStorage.setItem('my_vouchers', JSON.stringify(wallet));
                        }

                        alert("Đã copy mã! Hãy dán ở bước thanh toán.");
                    }}>
                        Sao chép mã ngay
                    </button>
                ) : (
                    <p>Đang hiển thị cho khách...</p>
                )}

                <button className="close-btn" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default VoucherPopup;
