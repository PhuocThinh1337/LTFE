import React from 'react';
import './Avatar.css';

interface AvatarProps {
  name: string;
  avatar?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

function Avatar({ name, avatar, size = 'medium', className = '' }: AvatarProps): React.JSX.Element {
  const getInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const sizeClass = `np-avatar-${size}`;

  if (avatar) {
    return (
      <div className={`np-avatar ${sizeClass} ${className}`}>
        <img 
          src={avatar} 
          alt={name}
          className="np-avatar-image"
          onError={(e) => {
            // Fallback to initial nếu ảnh lỗi
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.classList.add('np-avatar-fallback');
            }
          }}
        />
        <div className="np-avatar-fallback-initial">{getInitial(name)}</div>
      </div>
    );
  }

  return (
    <div className={`np-avatar ${sizeClass} np-avatar-initial ${className}`}>
      {getInitial(name)}
    </div>
  );
}

export default Avatar;

