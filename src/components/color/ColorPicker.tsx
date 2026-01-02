import React, { useState, useRef, useEffect } from 'react';
import './ColorPicker.css';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

function ColorPicker({ value, onChange, label }: ColorPickerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Preset colors - Nippon Paint color palette
  const presetColors = [
    '#FFFFFF', '#F5F5F5', '#E8E8E8', '#D3D3D3', '#A9A9A9', '#808080',
    '#FF0000', '#FF4500', '#FF8C00', '#FFD700', '#FFFF00', '#ADFF2F',
    '#00FF00', '#00CED1', '#00BFFF', '#0000FF', '#8A2BE2', '#FF1493',
    '#8B4513', '#654321', '#000000', '#1C1C1C', '#2F2F2F', '#4B4B4B',
    '#FFE4B5', '#F0E68C', '#E6E6FA', '#DDA0DD', '#FFB6C1', '#FFA07A',
    '#98FB98', '#AFEEEE', '#B0E0E6', '#C0C0C0', '#D3D3D3', '#F0F8FF'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handlePresetClick = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className="color-picker-wrapper" ref={pickerRef}>
      {label && <label className="color-picker-label">{label}</label>}
      <div className="color-picker-container">
        <button
          type="button"
          className="color-picker-button"
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: value }}
        >
          <span className="color-picker-value">{value}</span>
        </button>
        
        {isOpen && (
          <div className="color-picker-dropdown">
            <div className="color-picker-presets">
              <div className="color-picker-preset-title">Màu có sẵn</div>
              <div className="color-picker-preset-grid">
                {presetColors.map((color, index) => (
                  <button
                    key={index}
                    type="button"
                    className="color-picker-preset-item"
                    style={{ backgroundColor: color }}
                    onClick={() => handlePresetClick(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
            
            <div className="color-picker-custom">
              <div className="color-picker-custom-title">Tùy chỉnh màu</div>
              <div className="color-picker-input-wrapper">
                <input
                  type="color"
                  value={value}
                  onChange={handleColorChange}
                  className="color-picker-input"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      onChange(e.target.value);
                    }
                  }}
                  className="color-picker-hex"
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColorPicker;

