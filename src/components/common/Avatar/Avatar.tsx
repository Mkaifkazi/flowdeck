import type { CSSProperties } from 'react';
import './Avatar.css';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
}

const Avatar = ({ src, name, size = 'md', style }: AvatarProps) => {
  const sizeClass = `avatar-${size}`;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`avatar ${sizeClass}`} style={style}>
      {src ? <img src={src} alt={name} /> : <span>{initials}</span>}
    </div>
  );
};

export default Avatar;
