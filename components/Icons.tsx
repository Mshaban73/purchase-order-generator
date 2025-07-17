import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/logo.png"
    alt="Think Solution Logo"
    className={className}
  />
);
