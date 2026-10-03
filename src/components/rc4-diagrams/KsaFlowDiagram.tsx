import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

interface KsaFlowDiagramProps {
  currentKsaStep?: number; // 0 to N-1
  currentI?: number;
  currentJ?: number;
  swappedPair?: [number, number];
  N?: number;
  formulaStr?: string;
  isAnimated?: boolean;
}

export const KsaFlowDiagram: React.FC<KsaFlowDiagramProps> = ({
  currentKsaStep = 0,
  currentI = 0,
  currentJ = 2,
  swappedPair = [0, 2],
  N = 8,
  formulaStr = 'j = (0 + 0 + 2) mod 8 = 2',
  isAnimated = true,
}) => {
  return (
    <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            (2) Sơ Đồ Thuật Toán Khởi Tạo & Xáo Trộn Khóa KSA (Key-Scheduling Algorithm)
          </h3>
          <p className="text-xs text-slate-400">
            Mỗi vòng lặp $i$ từ $0 \to {N - 1}$: Tính con trỏ $j$ mới dựa trên khóa $T[i]$ và hoán vị $S[i] \leftrightarrow S[j]$
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
            Vòng KSA: {currentKsaStep + 1}/{N}
          </span>
          <span className="px-2 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800">
            i = {currentI}, j = {currentJ}
          </span>
        </div>
      </div>

      {/* SVG Canvas for KSA flowchart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 900 300"
          className="w-full min-w-[760px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradKsaBox" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#083344" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>
            <marker id="arrowKsaCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#22d3ee" />
            </marker>
            <marker id="arrowKsaAmber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* 1. START / INIT NODE */}
          <g transform="translate(20, 110)">
            <rect width="130" height="70" rx="35" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
            <text x="65" y="32" fill="#e0f2fe" fontSize="11" textAnchor="middle" fontWeight="bold">
              Bắt đầu KSA
            </text>
            <text x="65" y="50" fill="#67e8f9" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
              S[i] = i, j = 0
            </text>
          </g>

          {/* Arrow -> Loop Condition */}
          <path d="M 150 145 L 205 145" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrowKsaCyan)" />

          {/* 2. LOOP CONDITION RHOMBUS (i < N) */}
          <g transform="translate(210, 100)">
            <polygon points="55,0 110,45 55,90 0,45" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="55" y="42" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              i &lt; N?
            </text>
            <text x="55" y="58" fill="#94a3b8" fontSize="9.5" textAnchor="middle">
              (i = {currentI})
            </text>
          </g>

          {/* Arrow Yes -> Formula Node */}
          <path d="M 320 145 L 375 145" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#arrowKsaCyan)" />
          <text x="345" y="135" fill="#34d399" fontSize="10" fontWeight="bold">Đúng</text>

          {/* 3. CALCULATE J FORMULA BLOCK */}
          <g transform="translate(385, 90)">
            <rect
              width="210"
              height="110"
              rx="14"
              fill="url(#gradKsaBox)"
              stroke="#22d3ee"
              strokeWidth="2.5"
              className={isAnimated ? "animate-pulse" : ""}
            />
            <text x="105" y="28" fill="#e0f2fe" fontSize="11" textAnchor="middle" fontWeight="bold">
              Cập nhật con trỏ j
            </text>
            <rect x="15" y="40" width="180" height="34" rx="8" fill="#042f2e" stroke="#14b8a6" strokeWidth="1" />
            <text x="105" y="62" fill="#5eead4" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              j = (j + S[i] + T[i]) % N
            </text>
            <text x="105" y="94" fill="#fef08a" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
              {formulaStr}
            </text>
          </g>

          {/* Arrow Formula -> Swap Block */}
          <path d="M 595 145 L 650 145" stroke="#22d3ee" strokeWidth="2.5" markerEnd="url(#arrowKsaCyan)" />

          {/* 4. SWAP BLOCK */}
          <g transform="translate(660, 95)">
            <rect
              width="170"
              height="100"
              rx="14"
              fill="#1e1b4b"
              stroke="#a855f7"
              strokeWidth="2.5"
            />
            <text x="85" y="28" fill="#f3e8ff" fontSize="11" textAnchor="middle" fontWeight="bold">
              Hoán đổi (Swap)
            </text>
            <rect x="15" y="40" width="140" height="32" rx="8" fill="#3b0764" stroke="#c084fc" strokeWidth="1" />
            <text x="85" y="61" fill="#f5d0fe" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              S[{swappedPair[0]}] ↔ S[{swappedPair[1]}]
            </text>
            <text x="85" y="88" fill="#a5f3fc" fontSize="9.5" textAnchor="middle" fontStyle="italic">
              Tăng i = i + 1
            </text>
          </g>

          {/* Loopback Arrow (Swap -> Back to Condition) */}
          <path
            d="M 745 95 L 745 40 L 265 40 L 265 100"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
            markerEnd="url(#arrowKsaAmber)"
          />
          <text x="500" y="32" fill="#fbbf24" fontSize="9.5" textAnchor="middle" fontWeight="bold">
            Vòng lặp KSA tiếp theo (i = i + 1)
          </text>

          {/* Exit Arrow: i >= N -> Done KSA */}
          <path
            d="M 265 190 L 265 255 L 745 255 L 745 205"
            stroke="#64748b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            fill="none"
          />
          <text x="275" y="225" fill="#f87171" fontSize="10" fontWeight="bold">Sai (i = N)</text>
          <text x="500" y="275" fill="#34d399" fontSize="10.5" textAnchor="middle" fontWeight="bold">
            Hoàn tất KSA → Chuyển mảng S sang giai đoạn PRGA
          </text>
        </svg>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-cyan-400 font-bold">Cặp hoán đổi hiện tại:</span>{' '}
          S[{swappedPair[0]}] đổi chỗ với S[{swappedPair[1]}]
        </div>
        <div className="text-slate-400">
          Công thức: <code className="text-emerald-300 font-bold">{formulaStr}</code>
        </div>
      </div>
    </div>
  );
};
