import React, { useState } from 'react';
import {
  Binary,
  Cpu,
  BookOpen,
  FlaskConical,
  HelpCircle,
  History,
  KeyRound,
  LogIn,
  LogOut,
  Menu,
  X,
  Radio,
  Layers,
  Palette,
  FileCheck,
  Code2,
  Download,
  Calculator,
  Zap,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { logoutUser } from '../firebase/auth';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export type NavTab =
  | 'home'
  | 'analysis'
  | 'apps'
  | 'visualizer'
  | 'hand_calculation'
  | 'cipher'
  | 'experiments'
  | 'benchmark'
  | 'quiz'
  | 'history'
  | 'architecture'
  | 'ux_design'
  | 'testing'
  | 'opensource'
  | 'download';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  user: User | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  user,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Giới Thiệu', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'analysis', label: 'Phân Tích', icon: <Binary className="w-3.5 h-3.5" /> },
    { id: 'apps', label: 'Ứng Dụng', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'visualizer', label: 'Mô Phỏng Mảng S', icon: <Cpu className="w-3.5 h-3.5" />, badge: 'Trực quan' },
    { id: 'hand_calculation', label: 'Ví dụ tính tay TinyRC4', icon: <Calculator className="w-3.5 h-3.5 text-amber-400" />, badge: 'Ví dụ' },
    { id: 'cipher', label: 'Mã Hóa/Giải Mã', icon: <KeyRound className="w-3.5 h-3.5" /> },
    { id: 'experiments', label: 'Thực Nghiệm', icon: <FlaskConical className="w-3.5 h-3.5" />, badge: '4 Test' },
    { id: 'benchmark', label: 'Đo Hiệu Năng', icon: <Zap className="w-3.5 h-3.5 text-amber-400" />, badge: '5 Khối' },
    { id: 'quiz', label: 'Trắc Nghiệm', icon: <HelpCircle className="w-3.5 h-3.5" />, badge: '10 Câu' },
    { id: 'download', label: 'Tải Về', icon: <Download className="w-3.5 h-3.5 text-cyan-400" />, badge: 'CLI' },
    { id: 'testing', label: 'Kiểm Thử', icon: <FileCheck className="w-3.5 h-3.5 text-emerald-400" />, badge: '18 Tests' },
    { id: 'architecture', label: 'Kiến Trúc', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'ux_design', label: 'Thiết Kế UX/UI', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'opensource', label: 'Mã Nguồn Mở', icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" />, badge: 'MIT' },
    { id: 'history', label: 'Lịch Sử', icon: <History className="w-3.5 h-3.5" /> },
  ];

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-[37px] z-40 bg-slate-950/95 border-b border-cyan-500/20 backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0 mr-2"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition">
              <Binary className="w-4 h-4 text-cyan-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 font-mono">
                  RC4<span className="text-white">.LAB</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 hidden sm:inline-block">
                  v2.5
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden 2xl:flex items-center space-x-0.5 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1 rounded font-mono ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Intermediate Desktop Navbar (1024px - 1535px) */}
          <nav className="hidden lg:flex 2xl:hidden items-center space-x-0.5 overflow-x-auto py-1 max-w-[800px]">
            {navItems.slice(0, 7).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
            {/* More dropdown button for 8..11 */}
            <div className="relative group">
              <button
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition border cursor-pointer ${
                  ['hand_calculation', 'download', 'testing', 'architecture', 'ux_design', 'opensource', 'history'].includes(activeTab)
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    : 'text-slate-400 border-transparent hover:bg-slate-900'
                }`}
              >
                <span>Thêm</span>
                <span className="text-[10px]">▼</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl hidden group-hover:block z-50">
                {navItems.slice(7).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition cursor-pointer text-left ${
                      activeTab === item.id
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* User Auth & PWA Action Section */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Direct PWA In-App Install Button */}
            <div className="hidden sm:block">
              <PWAInstallButton compact={true} />
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-xs text-slate-200 font-medium truncate max-w-[120px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Đã đăng nhập
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs uppercase shadow">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.email?.[0] || 'U'
                  )}
                </div>
                <button
                  onClick={() => logoutUser()}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition border border-transparent hover:border-rose-500/20 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng Nhập</span>
              </button>
            )}

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800"
              aria-label="Mở Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-cyan-500/30 px-4 pt-2 pb-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {/* Mobile Install Quick Bar */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300 font-medium">Cài đặt PWA offline:</span>
            <PWAInstallButton compact={true} />
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          </div>
        </div>
      )}
    </header>
  );
};
