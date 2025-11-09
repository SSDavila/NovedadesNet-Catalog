import { ReactElement } from 'react';

interface GradientIconProps {
  gradientId: string;
  icon: ReactElement;
}

export const GradientIcon = ({ gradientId, icon }: GradientIconProps) => {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
          <stop offset="100%" style={{ stopColor: '#FBBF24' }} />
        </linearGradient>
      </defs>
    </svg>
  );
};