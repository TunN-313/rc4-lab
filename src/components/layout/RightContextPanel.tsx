import React from 'react';
import {
  PanelRightClose,
  PanelRightOpen,
  Info,
  Sparkles,
  ShieldAlert,
  BookOpen,
  Activity,
  Layers,
  Binary,
  ArrowRightLeft,
  KeyRound,
  FileCode2,
  Lock,
  Cpu,
} from 'lucide-react';
import { CONTEXT_PANEL_DATA, NavTab } from './navConfig';
import { useDynamicPanelContext } from './panelContextStore';

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
  const dynamicContext = useDynamicPanelContext();
  const data = CONTEXT_PANEL_DATA[activePage] || CONTEXT_PANEL_DATA.home;

  return (
    <>
      {/* Desktop Toggle Button when panel is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          title="Mở thanh ngữ cảnh hỗ trợ"
          aria-label="Mở thanh ngữ cảnh hỗ trợ"
          aria-expanded="false"
          aria-controls="right-context-panel"
          className="hidden xl:flex fixed right-0 top-1/2 -translate-y-1/2 z-30 p-2 rounded-l-xl bg-slate-900 border-l border-y border-cyan-500/40 text-cyan-400 hover:text-white hover:bg-cyan-500/20 shadow-xl transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <PanelRightOpen className="w-4 h-4" />
        </button>
      )}

      {/* Main Right Context Sidebar */}
      <aside
        id="right-context-panel"
        role="region"
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
            aria-expanded={isOpen}
            aria-controls="right-context-panel"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0 ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        {/* Panel Content Sections */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* ========================================================================= */}
          {/* 1. DYNAMIC CONTEXT: VISUALIZER VIEW (Live Step Info, Formula, Pointers)   */}
          {/* ========================================================================= */}
          {activePage === 'visualizer' && (
            <div className="space-y-3">
              {dynamicContext.visualizer ? (
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-2.5 shadow-lg shadow-cyan-950/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-mono uppercase font-bold text-cyan-300">
                        {dynamicContext.visualizer.phase === 'KSA'
                          ? 'KSA: Xáo Trộn Mảng S'
                          : 'PRGA: Sinh Dòng Khóa'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-900/60 border border-cyan-700/60 text-cyan-200">
                      Bước {dynamicContext.visualizer.stepIndex + 1} /{' '}
                      {dynamicContext.visualizer.totalSteps}
                    </span>
                  </div>

                  {/* Dynamic Explanation */}
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-cyan-500/20 text-[11px] text-slate-200 leading-relaxed font-sans">
                    {dynamicContext.visualizer.explanation}
                  </div>

                  {/* Active Formula & Variables */}
                  <div className="space-y-1.5 font-mono text-[10px] bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-cyan-300 font-bold">
                      {dynamicContext.visualizer.formula}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-slate-300 border-t border-slate-800/80">
                      <div>
                        Con trỏ <span className="text-cyan-400 font-bold">i</span> ={' '}
                        {dynamicContext.visualizer.i}
                      </div>
                      <div>
                        Con trỏ <span className="text-amber-400 font-bold">j</span> ={' '}
                        {dynamicContext.visualizer.j}
                      </div>
                      {dynamicContext.visualizer.t !== undefined && (
                        <div>
                          Vị trí <span className="text-purple-400 font-bold">t</span> ={' '}
                          {dynamicContext.visualizer.t}
                        </div>
                      )}
                      {dynamicContext.visualizer.k !== undefined && (
                        <div>
                          Khóa <span className="text-emerald-400 font-bold">k</span> ={' '}
                          {dynamicContext.visualizer.k}
                        </div>
                      )}
                    </div>
                    <div className="text-emerald-400 pt-0.5 text-[10px]">
                      Hoán đổi: S[{dynamicContext.visualizer.swapped[0]}] ↔ S[
                      {dynamicContext.visualizer.swapped[1]}]
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400 text-center">
                  Bấm <strong>Chạy (Play)</strong> hoặc <strong>Tới 1 Bước</strong> để theo dõi tiến trình thời gian thực.
                </div>
              )}

              {/* Pointer Legend Card */}
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2">
                <h4 className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chú giải các con trỏ trạng thái</span>
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0"></span>
                    <span>
                      <strong className="text-cyan-300">Con trỏ i (Cyan):</strong> Duyệt tuần tự mảng S (từ 0 đến N-1 trong KSA; tăng tiến modulo N trong PRGA).
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0"></span>
                    <span>
                      <strong className="text-amber-300">Con trỏ j (Amber):</strong> Tích lũy vị trí hoán vị ngẫu nhiên dựa trên khóa bí mật.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400 mt-1 shrink-0"></span>
                    <span>
                      <strong className="text-purple-300">Chỉ số t / k (Purple):</strong> Vị trí tra cứu byte dòng khóa PRGA $k = S[t]$ với $t = (S[i] + S[j]) \pmod N$.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0"></span>
                    <span>
                      <strong className="text-emerald-300">Cặp hoán đổi (Emerald):</strong> Hai ô trạng thái vừa tráo đổi $S[i] \leftrightarrow S[j]$.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. DYNAMIC CONTEXT: CIPHER TOOL VIEW (Format Hints, Drop & SHA-256)       */}
          {/* ========================================================================= */}
          {activePage === 'cipher' && (
            <div className="space-y-3">
              {dynamicContext.cipher && (
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-cyan-300">Trạng thái công cụ</span>
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-200">
                      {dynamicContext.cipher.activeMode === 'encrypt' ? 'Mã Hóa' : 'Giải Mã'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                    <div>Input: {dynamicContext.cipher.inputFormat.toUpperCase()} ({dynamicContext.cipher.dataLengthBytes} bytes)</div>
                    <div>Output: {dynamicContext.cipher.outputFormat.toUpperCase()}</div>
                    <div>RC4-drop: {dynamicContext.cipher.dropBytes} bytes</div>
                  </div>
                </div>
              )}

              {/* SHA-256 Integrity Verification Note */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
                  <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Đối chiếu tính toàn vẹn SHA-256</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  SHA-256 dùng để đối chiếu bản gốc và bản giải mã, đảm bảo không có bit nào bị suy biến hay sai lệch trong quá trình mã hóa/giải mã.
                </p>
              </div>

              {/* RC4-drop Security Guidance */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Khuyến cáo an toàn RC4-drop</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  RFC 7465 cấm RC4 trong TLS. Nghiên cứu của Mironov đề xuất vứt khoảng 768 đến 3072 byte đầu; RFC 4345 (SSH) vứt 1536 byte đầu để triệt tiêu thiên vị KSA.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. DYNAMIC CONTEXT: EXPERIMENTS VIEW (Scientific Notes)                   */}
          {/* ========================================================================= */}
          {activePage === 'experiments' && (
            <div className="space-y-3">
              {/* Mantin-Shamir Bias Scientific Note */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                <h4 className="text-[11px] font-semibold text-rose-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  <span>Thiên vị Mantin-Shamir (Byte #2)</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Byte thứ hai của dòng khóa Z₂ bằng 0 với xác suất ≈ 2/256 = 1/128 (gấp đôi mức ngẫu nhiên 1/256). Phát hiện bởi Itsik Mantin và Adi Shamir năm 2001.
                </p>
              </div>

              {/* Key Reuse Analysis Note */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <h4 className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Tấn công tái sử dụng khóa (Key Reuse)</span>
                </h4>
                <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-cyan-300">
                  C₁ ⊕ C₂ = (P₁ ⊕ K) ⊕ (P₂ ⊕ K) = P₁ ⊕ P₂
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Dòng khóa K bị triệt tiêu hoàn toàn. Kẻ tấn công dùng kỹ thuật Crib Dragging (trượt cụm từ nghi ngờ) để khôi phục cả hai bản rõ mà không cần khóa.
                </p>
              </div>

              {/* RC4-drop Scientific Recommendation */}
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
                <h4 className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>Chuẩn bỏ byte đầu (RC4-drop)</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  RFC 7465 cấm RC4 trong TLS. Nghiên cứu của Mironov đề xuất vứt khoảng 768 đến 3072 byte đầu; RFC 4345 (SSH) vứt 1536 byte đầu để phân phối byte đạt xấp xỉ đều.
                </p>
              </div>

              {/* Avalanche Test Note */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <h4 className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Kiểm định hiệu ứng thác đổ (Avalanche)</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Mật mã khối chuẩn (AES) đạt ~50% bit thay đổi ngay lập tức. RC4 vì là mã hóa dòng nên ở các byte đầu có rò rỉ KSA rõ rệt.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. STATIC PAGE CONTEXT SECTIONS (From navConfig)                          */}
          {/* ========================================================================= */}
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
