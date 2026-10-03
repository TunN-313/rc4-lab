import React, { useEffect, useState } from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-500/90 border border-amber-400 text-slate-950 px-4 py-2 text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom">
      <WifiOff className="w-4 h-4 shrink-0 text-slate-950" />
      <div>
        <span>Chế độ Ngoại Tuyến (Offline):</span>
        <span className="font-normal ml-1">
          Bộ mô phỏng 16x16 và công cụ mã hóa RC4 vẫn hoạt động bình thường nhờ Service Worker cache.
        </span>
      </div>
    </div>
  );
};
