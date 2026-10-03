import React, { useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { LogIn, LogOut, History, Shield, User as UserIcon } from 'lucide-react';
import { logoutUser } from '../../firebase/auth';
import type { NavTab } from './navConfig';

interface AccountDropdownProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({
  user,
  isOpen,
  onClose,
  onOpenAuth,
  onNavigate,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Menu tài khoản"
      className="absolute bottom-16 left-3 sm:left-14 w-64 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-950/60 p-2 z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
    >
      {user ? (
        <div className="space-y-2">
          {/* User profile info */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold uppercase overflow-hidden shrink-0">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.email?.[0] || 'U'
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-slate-200 font-semibold truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Đã xác thực
              </span>
              <span className="text-slate-500 font-mono">Cloud Sync</span>
            </div>
          </div>

          {/* Action items */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                onNavigate('history');
                onClose();
              }}
              role="menuitem"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition cursor-pointer text-left"
            >
              <History className="w-4 h-4 text-cyan-400" />
              <span>Lịch sử hoạt động</span>
            </button>

            <button
              onClick={async () => {
                await logoutUser();
                onClose();
              }}
              role="menuitem"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <UserIcon className="w-4 h-4 text-cyan-400" />
            <span>Tài Khoản Sinh Viên</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Đăng nhập để tự động lưu trữ và đồng bộ lịch sử mã hóa, kết quả thí nghiệm và điểm thi trắc nghiệm.
          </p>
          <button
            onClick={() => {
              onOpenAuth();
              onClose();
            }}
            role="menuitem"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập / Đăng Ký</span>
          </button>
        </div>
      )}
    </div>
  );
};
