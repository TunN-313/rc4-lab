import React from 'react';
import {
  PanelRightClose,
  PanelRightOpen,
  Info,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { CONTEXT_PANEL_DATA, NavTab } from './navConfig';

interface RightContextPanelProps {
  activePage: NavTab;
  isOpen: boolean;
  onToggle: () => void;
}

export const RightContextPanel: React.FC<RightContextPanelProps> = ({
  activePage,
  isOpen,
  onToggle,
}) => {
  const data = CONTEXT_PANEL_DATA[activePage] || CONTEXT_PANEL_DATA.home;

  return (
    <>
      {/* Desktop Toggle Button when panel is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          title="Mở thanh ngữ cảnh hỗ trợ"
          aria-label="Mở thanh ngữ cảnh hỗ trợ"
          className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-l-xl bg-slate-900 border-l border-y border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-500/20 shadow-xl transition cursor-pointer"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
      )}

      {/* Main Right Context Sidebar */}
      <aside
        aria-label="Thanh ngữ cảnh kiến thức"
        className={`bg-slate-950/95 border-l border-slate-800/80 shrink-0 select-none transition-all duration-300 ease-in-out z-20 flex flex-col ${
          isOpen
            ? 'w-72 sm:w-80 opacity-100'
            : 'w-0 opacity-0 overflow-hidden pointer-events-none border-l-0'
        } hidden xl:flex h-full`}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-white truncate">
                  {data.title}
                </h3>
                {data.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono shrink-0">
                    {data.badge}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {data.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onToggle}
            title="Thu gọn bảng ngữ cảnh"
            aria-label="Thu gọn bảng ngữ cảnh"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0 ml-1"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Content Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {data.sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5 shadow-sm"
            >
              <h4 className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                <span>{sec.heading}</span>
              </h4>
              <div className="text-[11px] text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {sec.content}
              </div>
            </div>
          ))}

          {/* Quick tips & reminders */}
          {data.tips && data.tips.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mẹo & Lưu ý học tập:</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 pl-4 list-disc marker:text-emerald-400 leading-relaxed">
                {data.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Standard Academic Notice */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
            <span>
              Tài liệu và công thức được đối chuẩn trực tiếp theo bài giảng đại học và các chuẩn RFC 6229, RFC 7465.
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
