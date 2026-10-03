import React, { useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Github,
  FileText,
  Radio,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import {
  NAV_GROUPS,
  getPagesForGroup,
  NavGroup,
  NavTab,
} from './navConfig';
import { isFirebaseConfigured } from '../../firebase/config';
import { REPO_URL } from '../../config/project';

interface SidebarNavProps {
  activeGroup: NavGroup;
  activePage: NavTab;
  onSelectPage: (page: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeGroup,
  activePage,
  onSelectPage,
  isOpenMobile,
  onCloseMobile,
}) => {
  const currentGroup = NAV_GROUPS[activeGroup];
  const pages = getPagesForGroup(activeGroup);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile) {
        onCloseMobile();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const GroupIcon = currentGroup.icon;

  const renderContent = (isMobile = false) => (
    <div className="flex flex-col h-full justify-between">
      {/* Group Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
            <GroupIcon className="w-4 h-4" />
            <span>{currentGroup.label}</span>
          </div>
          {isMobile && (
            <button
              onClick={onCloseMobile}
              aria-label="Đóng bảng điều hướng"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-normal">
          {currentGroup.description}
        </p>
      </div>

      {/* Pages List */}
      <nav role="navigation" aria-label="Danh sách trang con" className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {pages.map((page) => {
          const PageIcon = page.icon;
          const isActive = activePage === page.id;

          return (
            <button
              key={page.id}
              onClick={() => {
                onSelectPage(page.id);
                if (isMobile) onCloseMobile();
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-start gap-3 p-3 rounded-xl transition text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                isActive
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'text-slate-300 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                <PageIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isActive ? 'text-cyan-300' : 'text-slate-200'
                    }`}
                  >
                    {page.label}
                  </span>
                  {page.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      {page.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {page.shortDesc}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* MOBILE DRAWER ONLY: Bottom bar content moved here to prevent overlap (Amendment 6) */}
      {isMobile && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/80 space-y-3 text-[11px]">
          {/* Active version & connection */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400">
              <Cpu className="w-3.5 h-3.5" />
              Full RC4 (256B) & TinyRC4 (N=8)
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {isFirebaseConfigured ? 'Online' : 'Offline / Standalone'}
            </span>
          </div>

          {/* Academic safety note */}
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-amber-300 text-[10px] leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Chỉ dùng cho mục đích học tập & nghiên cứu mật mã học. Cấm trong TLS theo RFC 7465.</span>
          </div>

          {/* Links */}
          <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="font-mono text-slate-500">MIT License • 2026</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (>= 1024px) */}
      <aside
        aria-label="Danh mục trang con"
        className="hidden lg:block w-64 bg-slate-950/90 border-r border-slate-800/80 h-full shrink-0 select-none overflow-hidden"
      >
        {renderContent(false)}
      </aside>

      {/* 2. MOBILE SLIDE-IN DRAWER (< 1024px) */}
      {isOpenMobile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu trang con"
          className="lg:hidden fixed inset-0 z-50 flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />

          {/* Drawer content */}
          <aside
            id="mobile-sidebar-drawer"
            className="relative w-80 max-w-[85vw] bg-slate-950 border-r border-cyan-500/30 shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-left duration-200 pb-16"
          >
            {renderContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
