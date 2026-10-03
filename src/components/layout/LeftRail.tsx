import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { Binary, Shield } from 'lucide-react';
import {
  NAV_GROUPS,
  NavGroup,
  NavTab,
} from './navConfig';
import { AccountDropdown } from './AccountDropdown';

interface LeftRailProps {
  activeGroup: NavGroup;
  onSelectGroup: (group: NavGroup) => void;
  user: User | null;
  onOpenAuth: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenMobileDrawer?: () => void;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  activeGroup,
  onSelectGroup,
  user,
  onOpenAuth,
  onNavigate,
  onOpenMobileDrawer,
}) => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const groupsList = Object.values(NAV_GROUPS);

  const handleGroupClick = (group: NavGroup) => {
    onSelectGroup(group);
    if (onOpenMobileDrawer) {
      onOpenMobileDrawer();
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP LEFT RAIL (>= 1024px): NARROW VERTICAL BAR (64px)              */}
      {/* ========================================================================= */}
      <aside
        aria-label="Điều hướng chính"
        className="hidden lg:flex flex-col items-center justify-between w-16 bg-slate-950 border-r border-slate-800/80 py-4 shrink-0 select-none z-30"
      >
        {/* Top: Brand Logo Icon */}
        <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition">
            <Binary className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
          <span className="text-[10px] font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            RC4
          </span>
        </div>

        {/* Center: 5 Group Navigation Buttons with Tooltips */}
        <nav role="navigation" className="flex flex-col items-center gap-3 my-auto w-full px-2" aria-label="Các nhóm chức năng">
          {groupsList.map((group) => {
            const Icon = group.icon;
            const isActive = activeGroup === group.id;

            return (
              <div key={group.id} className="relative group/tooltip flex items-center justify-center w-full">
                <button
                  onClick={() => handleGroupClick(group.id)}
                  aria-label={group.label}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_16px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  {/* Left Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute -left-2 top-2 bottom-2 w-1 rounded-r bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                  )}
                  <Icon className="w-5 h-5" />
                </button>

                {/* Floating Tooltip */}
                <div
                  role="tooltip"
                  className="absolute left-14 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-xs font-medium whitespace-nowrap shadow-xl opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-50 flex flex-col gap-0.5"
                >
                  <span className="font-semibold text-cyan-300">{group.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{group.description}</span>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom: User Avatar Button & Account Popover */}
        <div className="relative flex flex-col items-center gap-2">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            aria-label="Tài khoản người dùng"
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            aria-controls="account-dropdown-menu"
            className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold uppercase transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              user
                ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {user ? (
              user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                user.email?.[0] || 'U'
              )
            ) : (
              <span className="text-xs">?</span>
            )}
          </button>

          {/* Account Dropdown Menu */}
          <AccountDropdown
            user={user}
            isOpen={accountMenuOpen}
            onClose={() => setAccountMenuOpen(false)}
            onOpenAuth={onOpenAuth}
            onNavigate={onNavigate}
          />
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE BOTTOM TAB BAR (< 1024px): 5 GROUPS + AVATAR                    */}
      {/* ========================================================================= */}
      <nav
        role="navigation"
        aria-label="Thanh điều hướng di động"
        className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md px-2 flex items-center justify-around z-40"
      >
        {groupsList.map((group) => {
          const Icon = group.icon;
          const isActive = activeGroup === group.id;

          return (
            <button
              key={group.id}
              onClick={() => handleGroupClick(group.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{group.shortLabel}</span>
            </button>
          );
        })}

        {/* Mobile Avatar Button */}
        <div className="relative">
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            aria-label="Tài khoản"
            aria-haspopup="menu"
            aria-expanded={accountMenuOpen}
            aria-controls="account-dropdown-menu"
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-slate-400 hover:text-slate-200 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-300 font-bold uppercase overflow-hidden">
              {user ? (
                user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.email?.[0] || 'U'
                )
              ) : (
                '?'
              )}
            </div>
            <span className="text-[10px]">Tài khoản</span>
          </button>

          {/* Account Dropdown for Mobile */}
          <AccountDropdown
            user={user}
            isOpen={accountMenuOpen}
            onClose={() => setAccountMenuOpen(false)}
            onOpenAuth={onOpenAuth}
            onNavigate={onNavigate}
          />
        </div>
      </nav>
    </>
  );
};
