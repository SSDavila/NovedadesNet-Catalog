import React, { ReactElement } from 'react';
import { GradientIcon } from './GradientIcon';

interface GradientTitleProps {
  icon: ReactElement;
  text: string;
  gradientId: string;
}

export const GradientTitle = ({ icon, text, gradientId }: GradientTitleProps) => {
  return (
    <>
      <GradientIcon gradientId={gradientId} icon={icon} />
      <h2 className="text-3xl md:text-4xl font-bold inline-flex items-center gap-3">
        {React.cloneElement(icon, { style: { fill: `url(#${gradientId})` } })}
        <span className="bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text">
          {text}
        </span>
      </h2>
    </>
  );
};