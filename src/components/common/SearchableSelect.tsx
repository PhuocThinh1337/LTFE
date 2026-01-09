import React, { useState, useEffect, useRef } from 'react';
import './SearchableSelect.css';

interface Option {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  disabled = false,
  className = '',
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset search term when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`np-searchable-select ${className}`} ref={wrapperRef}>
      <div
        className={`np-searchable-select-input ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span style={{ color: selectedOption ? '#333' : '#999' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span style={{ fontSize: '10px', color: '#666' }}>▼</span>
      </div>

      {isOpen && !disabled && (
        <div className="np-searchable-select-dropdown open">
          <div className="np-searchable-select-search">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="np-searchable-select-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  className={`np-searchable-select-option ${opt.value === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="np-searchable-select-empty">Không tìm thấy kết quả</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
