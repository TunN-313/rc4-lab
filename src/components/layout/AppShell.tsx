import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { Menu, PanelRightOpen, PanelRightClose, BookOpen } from 'lucide-react';
import { LeftRail } from './LeftRail';
import { SidebarNav } from './SidebarNav';
import { RightContextPanel } from './RightContextPanel';
import { BottomBar } from './BottomBar';
import {
  NavGroup,
  NavTab,
  NAV_PAGES,
  NAV_GROUPS,
} from './navConfig';

interface AppShellProps {
  activeGroup: NavGroup;
  activePage: NavTab;
  onSelectGroup: (group: NavGroup) => void;
  onSelectPage: (page: NavTab) => void;
  user: User | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeGroup,
  activePage,
  onSelectGroup,
  onSelectPage,
  user,
  onOpenAuth,
  children,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Phím Escape đóng mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileDrawerOpen) {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen]);

  const currentPage = NAV_PAGES[activePage] || NAV_PAGES.home;
  const currentGroup = NAV_GROUPS[activeGroup] || NAV_GROUPS.home_group;
  const PageIcon = currentPage.icon;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* ========================================================================= */}
      {/* MOBILE TOP HEADER (< 1024px)                                              */}
      {/* ========================================================================= */}
      <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-slate-950/95 border-b border-slate-800/80 backdrop-blur-md shrink-0 z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Mở danh sách trang con"
            aria-expanded={mobileDrawerOpen}
            aria-controls="mobile-sidebar-drawer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shrink-0">
              <PageIcon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-bold text-white truncate">
                {currentPage.label}
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono truncate">
                {currentGroup.label}
              </p>
            </div>
          </div>
        </div>

        {/* Right Toggle Button on Mobile (Optional indicator) */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
            v2.5
          </span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE: LEFT RAIL + SIDEBAR + CONTENT + RIGHT CONTEXT PANEL       */}
      {/* ========================================================================= */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* 1. Vùng 1: Left Rail (Narrow vertical icon bar on desktop) */}
        <LeftRail
          activeGroup={activeGroup}
          onSelectGroup={onSelectGroup}
          user={user}
          onOpenAuth={onOpenAuth}
          onNavigate={onSelectPage}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
        />

        {/* 2. Vùng 2: Sidebar (List of sub-pages) */}
        <SidebarNav
          activeGroup={activeGroup}
          activePage={activePage}
          onSelectPage={onSelectPage}
          isOpenMobile={mobileDrawerOpen}
          onCloseMobile={() => setMobileDrawerOpen(false)}
          user={user}
          onOpenAuth={onOpenAuth}
        />

        {/* 3 & 4. Vùng 3 & 4: Main Content Area (Scrollable view) */}
        <main
          id="main-content-scroll"
          className="flex-1 min-w-0 overflow-y-auto pb-16 lg:pb-0 bg-slate-950 focus:outline-none"
          tabIndex={-1}
        >
          {children}
        </main>

        {/* 5. Vùng 5: Right Context Panel (Contextual notes, formulas & glossary) */}
        <RightContextPanel
          activePage={activePage}
          isOpen={rightPanelOpen}
          onToggle={() => setRightPanelOpen(!rightPanelOpen)}
        />
      </div>

      {/* ========================================================================= */}
      {/* 6. Vùng 6: BOTTOM BAR (Desktop only, hidden on < 1024px)                  */}
      {/* ========================================================================= */}
      <BottomBar />
    </div>
  );
};
