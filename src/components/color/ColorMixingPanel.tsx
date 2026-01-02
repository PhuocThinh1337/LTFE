import React, { useState, useEffect } from 'react';
import {
  BASE_COLORS,
  COLOR_FORMULAS,
  calculateMixPrice,
  calculateResultColor,
  validateCustomMix,
  type CustomMix,
} from '../../services/colorMixingService';
import './ColorMixingPanel.css';

interface ColorMixingPanelProps {
  selectedProduct: number | null;
  basePrice: number;
  onMixChange: (mix: CustomMix, resultColor: string, totalPrice: number) => void;
}

function ColorMixingPanel({
  selectedProduct,
  basePrice,
  onMixChange,
}: ColorMixingPanelProps): React.JSX.Element {
  const [mode, setMode] = useState<'formula' | 'custom'>('formula');
  const [selectedFormula, setSelectedFormula] = useState<string>('');
  const [customMix, setCustomMix] = useState<{ colorId: string; percentage: number }[]>([]);
  const [volume, setVolume] = useState(5);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (!selectedProduct || basePrice <= 0) return;

    let mix: CustomMix;
    if (mode === 'formula' && selectedFormula) {
      const formula = COLOR_FORMULAS.find(f => f.id === selectedFormula);
      if (formula) {
        mix = {
          formula,
          volume,
          basePrice,
        };
      } else {
        return;
      }
    } else if (mode === 'custom' && customMix.length > 0) {
      const validation = validateCustomMix(customMix);
      if (!validation.valid) {
        setValidationError(validation.error || '');
        return;
      }
      setValidationError('');
      mix = {
        customMix,
        volume,
        basePrice,
      };
    } else {
      return;
    }

    const resultColor = calculateResultColor(mix);
    const totalPrice = calculateMixPrice(mix);
    onMixChange(mix, resultColor, totalPrice);
  }, [mode, selectedFormula, customMix, volume, basePrice, selectedProduct]);

  const handleAddColorToCustom = () => {
    if (customMix.length >= BASE_COLORS.length) return;
    setCustomMix([...customMix, { colorId: BASE_COLORS[0].id, percentage: 0 }]);
  };

  const handleRemoveColorFromCustom = (index: number) => {
    setCustomMix(customMix.filter((_, i) => i !== index));
  };

  const handleUpdateCustomColor = (index: number, colorId: string) => {
    const newMix = [...customMix];
    newMix[index].colorId = colorId;
    setCustomMix(newMix);
  };

  const handleUpdateCustomPercentage = (index: number, percentage: number) => {
    const newMix = [...customMix];
    newMix[index].percentage = Math.max(0, Math.min(100, percentage));
    setCustomMix(newMix);
  };

  const handleSelectFormula = (formulaId: string) => {
    setSelectedFormula(formulaId);
    setMode('formula');
  };

  const getTotalPercentage = (): number => {
    return customMix.reduce((sum, item) => sum + (item.percentage || 0), 0);
  };

  return (
    <div className="np-color-mixing-panel">
      <div className="np-mixing-header">
        <h2>Pha màu sơn</h2>
        <div className="np-mixing-mode-toggle">
          <button
            className={`np-mode-btn ${mode === 'formula' ? 'active' : ''}`}
            onClick={() => setMode('formula')}
          >
            Công thức có sẵn
          </button>
          <button
            className={`np-mode-btn ${mode === 'custom' ? 'active' : ''}`}
            onClick={() => setMode('custom')}
          >
            Tự pha
          </button>
        </div>
      </div>

      {mode === 'formula' && (
        <div className="np-formula-section">
          <h3>Chọn công thức pha màu</h3>
          <div className="np-formula-grid">
            {COLOR_FORMULAS.map(formula => (
              <div
                key={formula.id}
                className={`np-formula-card ${selectedFormula === formula.id ? 'selected' : ''}`}
                onClick={() => handleSelectFormula(formula.id)}
              >
                <div
                  className="np-formula-color-preview"
                  style={{ backgroundColor: formula.targetColor }}
                />
                <div className="np-formula-info">
                  <h4>{formula.name}</h4>
                  <p>{formula.description}</p>
                  <div className="np-formula-difficulty">
                    <span className={`np-difficulty-badge ${formula.difficulty}`}>
                      {formula.difficulty === 'easy' ? 'Dễ' : formula.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                    </span>
                  </div>
                  <div className="np-formula-colors">
                    {formula.baseColors.map((bc, idx) => {
                      const baseColor = BASE_COLORS.find(c => c.id === bc.colorId);
                      return (
                        <div key={idx} className="np-formula-color-item">
                          <div
                            className="np-formula-color-dot"
                            style={{ backgroundColor: baseColor?.hex || '#fff' }}
                          />
                          <span>{baseColor?.name}: {bc.percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'custom' && (
        <div className="np-custom-mix-section">
          <h3>Pha màu tùy chỉnh</h3>
          <div className="np-custom-mix-list">
            {customMix.map((item, index) => {
              const baseColor = BASE_COLORS.find(c => c.id === item.colorId);
              return (
                <div key={index} className="np-custom-mix-item">
                  <select
                    value={item.colorId}
                    onChange={(e) => handleUpdateCustomColor(index, e.target.value)}
                    className="np-color-select"
                  >
                    {BASE_COLORS.map(color => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  <div className="np-color-preview-small" style={{ backgroundColor: baseColor?.hex || '#fff' }} />
                  <div className="np-percentage-input-group">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={item.percentage}
                      onChange={(e) => handleUpdateCustomPercentage(index, parseFloat(e.target.value) || 0)}
                      className="np-percentage-input"
                    />
                    <span>%</span>
                  </div>
                  <button
                    onClick={() => handleRemoveColorFromCustom(index)}
                    className="np-remove-color-btn"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
          <div className="np-custom-mix-actions">
            <button onClick={handleAddColorToCustom} className="np-add-color-btn">
              + Thêm màu
            </button>
            <div className="np-total-percentage">
              Tổng: <strong>{getTotalPercentage().toFixed(1)}%</strong>
              {getTotalPercentage() !== 100 && (
                <span className="np-percentage-warning">
                  {' '}(Cần {(100 - getTotalPercentage()).toFixed(1)}% nữa)
                </span>
              )}
            </div>
          </div>
          {validationError && (
            <div className="np-validation-error">{validationError}</div>
          )}
        </div>
      )}

      {/* Result Color Display */}
      {((mode === 'formula' && selectedFormula) || (mode === 'custom' && customMix.length > 0 && getTotalPercentage() === 100)) && (
        <div className="np-result-color-section">
          <h3>Màu đã pha</h3>
          <div className="np-result-color-display">
            <div
              className="np-result-color-preview"
              style={{ 
                backgroundColor: mode === 'formula' 
                  ? COLOR_FORMULAS.find(f => f.id === selectedFormula)?.targetColor || '#FFFFFF'
                  : calculateResultColor({
                      customMix,
                      volume,
                      basePrice,
                    })
              }}
            />
            <div className="np-result-color-info">
              <div className="np-result-color-hex">
                {mode === 'formula' 
                  ? COLOR_FORMULAS.find(f => f.id === selectedFormula)?.targetColor || '#FFFFFF'
                  : calculateResultColor({
                      customMix,
                      volume,
                      basePrice,
                    })
                }
              </div>
              <div className="np-result-color-name">
                {mode === 'formula' 
                  ? COLOR_FORMULAS.find(f => f.id === selectedFormula)?.name || 'Màu đã pha'
                  : 'Màu tự pha'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="np-volume-section">
        <h3>Chọn dung tích</h3>
        <div className="np-volume-options">
          {[1, 2.5, 5, 10, 18].map(vol => (
            <button
              key={vol}
              className={`np-volume-btn ${volume === vol ? 'active' : ''}`}
              onClick={() => setVolume(vol)}
            >
              {vol}L
            </button>
          ))}
        </div>
        <div className="np-volume-custom">
          <label>Tùy chỉnh:</label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={volume}
            onChange={(e) => setVolume(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
            className="np-volume-input"
          />
          <span>lít</span>
        </div>
      </div>
    </div>
  );
}

export default ColorMixingPanel;

