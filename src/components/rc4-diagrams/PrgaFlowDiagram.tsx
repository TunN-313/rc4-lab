import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

interface PrgaFlowDiagramProps {
  currentPrgaStep?: number;
  currentI?: number;
  currentJ?: number;
  currentT?: number;
  currentK?: number;
  swappedPair?: [number, number];
  plainByte?: number;
  cipherByte?: number;
  N?: number;
  formulaStr?: string;
  isAnimated?: boolean;
}

export const PrgaFlowDiagram: React.FC<PrgaFlowDiagramProps> = ({
  currentPrgaStep = 0,
  currentI = 1,
  currentJ = 0,
  currentT = 6,
  currentK = 5,
  swappedPair = [1, 0],
  plainByte = 1,
  cipherByte = 4,
  N = 8,
  formulaStr = 't = (6 + 0) mod 8 = 6; k = S[6] = 5',
  isAnimated = true,
}) => {
  return (
    <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            (3) Sơ Đồ Thuật Toán Sinh Dòng Khóa PRGA & Phép XOR (Pseudo-Random Generation)
          </h3>
          <p className="text-xs text-slate-400">
            Mỗi vòng sinh 1 byte khóa: Cập nhật $i, j \to$ Hoán đổi $S[i] \leftrightarrow S[j] \to$ Tính $t \to$ Trích $k = S[t] \to$ XOR dữ liệu
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
            Byte #{currentPrgaStep + 1}
          </span>
          <span className="px-2 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800">
            i={currentI}, j={currentJ}, t={currentT}, k={currentK}
          </span>
        </div>
      </div>

      {/* SVG Canvas for PRGA flowchart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 920 320"
          className="w-full min-w-[780px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradPrgaStep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <marker id="arrowPrgaEmerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#10b981" />
            </marker>
            <marker id="arrowPrgaCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* 1. STEP 1: POINTERS UPDATE */}
          <g transform="translate(20, 95)">
            <rect width="160" height="90" rx="14" fill="#022c22" stroke="#10b981" strokeWidth="2" />
            <text x="80" y="24" fill="#a7f3d0" fontSize="10.5" textAnchor="middle" fontWeight="bold">
              1. CẬP NHẬT CON TRỎ
            </text>
            <line x1="15" y1="32" x2="145" y2="32" stroke="#047857" strokeWidth="1" />
            <text x="80" y="52" fill="#6ee7b7" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              i = (i + 1) mod {N} = {currentI}
            </text>
            <text x="80" y="74" fill="#6ee7b7" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              j = (j + S[i]) mod {N} = {currentJ}
            </text>
          </g>

          {/* Arrow 1 -> 2 */}
          <path d="M 180 140 L 225 140" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowPrgaEmerald)" />

          {/* 2. STEP 2: SWAP S[i] and S[j] */}
          <g transform="translate(235, 95)">
            <rect width="160" height="90" rx="14" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" />
            <text x="80" y="24" fill="#ede9fe" fontSize="10.5" textAnchor="middle" fontWeight="bold">
              2. HOÁN ĐỔI PHẦN TỬ
            </text>
            <line x1="15" y1="32" x2="145" y2="32" stroke="#6d28d9" strokeWidth="1" />
            <text x="80" y="52" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              Đổi chỗ vị trí mảng S:
            </text>
            <text x="80" y="74" fill="#e9d5ff" fontSize="12" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              S[{swappedPair[0]}] ↔ S[{swappedPair[1]}]
            </text>
          </g>

          {/* Arrow 2 -> 3 */}
          <path d="M 395 140 L 440 140" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowPrgaEmerald)" />

          {/* 3. STEP 3: INDEX t & KEY EXTRACTION */}
          <g transform="translate(450, 85)">
            <rect
              width="210"
              height="110"
              rx="14"
              fill="url(#gradPrgaStep)"
              stroke="#34d399"
              strokeWidth="2.5"
              className={isAnimated ? "animate-pulse" : ""}
            />
            <text x="105" y="24" fill="#d1fae5" fontSize="11" textAnchor="middle" fontWeight="bold">
              3. TRÍCH XUẤT BYTE KHÓA k
            </text>
            <rect x="15" y="34" width="180" height="30" rx="6" fill="#022c22" stroke="#059669" strokeWidth="1" />
            <text x="105" y="54" fill="#a7f3d0" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              t = (S[{currentI}] + S[{currentJ}]) mod {N} = {currentT}
            </text>
            <rect x="15" y="70" width="180" height="30" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
            <text x="105" y="90" fill="#fef08a" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              k = S[t] = S[{currentT}] = {currentK}
            </text>
          </g>

          {/* Arrow 3 -> 4 */}
          <path d="M 660 140 L 705 140" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowPrgaEmerald)" />

          {/* 4. STEP 4: XOR ENCRYPT / DECRYPT */}
          <g transform="translate(715, 80)">
            <rect width="180" height="120" rx="14" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
            <text x="90" y="24" fill="#ffe4e6" fontSize="10.5" textAnchor="middle" fontWeight="bold">
              4. PHÉP TOÁN XOR (⊕)
            </text>
            <line x1="15" y1="32" x2="165" y2="32" stroke="#be123c" strokeWidth="1" />
            <text x="90" y="54" fill="#fda4af" fontSize="10" textAnchor="middle" fontFamily="monospace">
              Bản rõ P[{currentPrgaStep}] = {plainByte}
            </text>
            <text x="90" y="74" fill="#fef08a" fontSize="10" textAnchor="middle" fontFamily="monospace">
              Byte khóa k = {currentK}
            </text>
            <rect x="15" y="84" width="150" height="26" rx="6" fill="#881337" />
            <text x="90" y="102" fill="#ffffff" fontSize="11" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              C = {plainByte} ⊕ {currentK} = {cipherByte}
            </text>
          </g>

          {/* Bottom Loopback text */}
          <path
            d="M 805 200 L 805 250 L 100 250 L 100 185"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
            markerEnd="url(#arrowPrgaEmerald)"
          />
          <text x="450" y="275" fill="#34d399" fontSize="10.5" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
            Lặp lại cho byte tiếp theo của bản rõ cho đến khi kết thúc dữ liệu
          </text>
        </svg>
      </div>

      <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Trích xuất: t = ({swappedPair[0]} + {swappedPair[1]}) mod {N} = {currentT} → k = S[{currentT}] = {currentK}
          </span>
        </div>
        <div className="text-rose-300 font-bold">
          XOR: P({plainByte}) ⊕ k({currentK}) = C({cipherByte})
        </div>
      </div>
    </div>
  );
};
