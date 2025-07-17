import React from 'react';
import { Trash2 } from 'lucide-react'; // ← استيراد الأيقونة المطلوبة

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/logo.png"
    alt="Think Solution Logo"
    className={className}
  />
);

// إضافة الأيقونة المطلوبة تحت الاسم TrashIcon
export const TrashIcon = Trash2;
