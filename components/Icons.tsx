import React from 'react';
import { Trash2 } from 'lucide-react'; // ← أيقونة الحذف من lucide

// أيقونة الشعار (من مجلد public مباشرة)
export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src="/logo.png" // ← الصورة يجب أن تكون داخل مجلد public باسم logo.png
    alt="Think Solution Logo"
    className={className}
  />
);

// أيقونة الحذف (يمكن استخدامها في أي مكان)
export const TrashIcon = Trash2;
