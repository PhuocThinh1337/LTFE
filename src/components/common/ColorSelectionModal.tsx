import React, { useState } from 'react';
import { PAINT_COLORS, PaintColor } from '../../data/paintColors';
import './ColorSelectionModal.css';

interface ColorSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (color: PaintColor) => void;
    productName: string;
}

const ColorSelectionModal: React.FC<ColorSelectionModalProps> = ({ isOpen, onClose, onSelect, productName }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredColors = PAINT_COLORS.filter(color =>
        color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="color-modal-overlay" onClick={onClose}>
            <div className="color-modal-content" onClick={e => e.stopPropagation()}>
                <div className="color-modal-header">
                    <h3>Chọn mã màu sơn cho {productName}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div style={{ padding: '0 20px', marginTop: '15px' }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm màu..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                        }}
                    />
                </div>

                <div className="color-modal-body">
                    <div className="color-grid">
                        {filteredColors.map(color => (
                            <div key={color.id} className="color-item" onClick={() => onSelect(color)}>
                                <div className="color-display" style={{ backgroundColor: color.hex }}></div>
                                <div className="color-info">
                                    <div className="color-name" title={color.name}>{color.name}</div>
                                    <div className="color-code">{color.code}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredColors.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                            Không tìm thấy màu nào phù hợp.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ColorSelectionModal;
