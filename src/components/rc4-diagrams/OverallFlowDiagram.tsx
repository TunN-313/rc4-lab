import React, { useState } from 'react';
import { Lock, Unlock, Sparkles } from 'lucide-react';

interface OverallFlowDiagramProps {
  activePhase?: 'IDLE' | 'KSA' | 'PRGA' | 'XOR';
  keyDisplay?: string;
  plaintextDisplay?: string;
  keystreamDisplay?: string;
  ciphertextDisplay?: string;
  mode?: 'encrypt' | 'decrypt';
  onModeChange?: (mode: 'encrypt' | 'decrypt') => void;
}

export const OverallFlowDiagram: React.FC<OverallFlowDiagramProps> = ({
  activePhase = 'IDLE',
  keyDisplay = '[2, 1, 3]',
  plaintextDisplay = '[1, 0, 6] ("BAG")',
  keystreamDisplay = '[5, 1, 6]',
  ciphertextDisplay = '[4, 1, 0] ("EBA")',
  mode: propMode,
  onModeChange,
}) => {
  const [internalMode, setInternalMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const currentMode = propMode !== undefined ? propMode : internalMode;

  const setMode = (newMode: 'encrypt' | 'decrypt') => {
    if (onModeChange) onModeChange(newMode);
    else setInternalMode(newMode);
  };

  const isKsaActive = activePhase === 'KSA';
  const isPrgaActive = activePhase === 'PRGA';
  const isXorActive = activePhase === 'XOR';

  return (
    <div className="bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            (1) Sơ Đồ Khối Tổng Thể Thuật Toán RC4 (Overall Flow Diagram)
          </h3>
          <p className="text-xs text-slate-400">
            Minh họa luồng dữ liệu hai chiều: Khóa <code className="font-mono text-emerald-300">K</code> → KSA → Mảng <code className="font-mono text-cyan-300">S</code> → PRGA → Dòng khóa <code className="font-mono text-purple-300">kᵢ</code> ⊕ Dữ liệu
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('encrypt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              currentMode === 'encrypt'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Quy trình Mã hóa</span>
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              currentMode === 'decrypt'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="w-3 h-3" />
            <span>Quy trình Giải mã</span>
          </button>
        </div>
      </div>

      {/* SVG Diagram Canvas */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 920 320"
          className="w-full min-w-[760px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradKsa" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#083344" />
              <stop offset="100%" stopColor="#164e63" />
            </linearGradient>
            <linearGradient id="gradPrga" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="gradXor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <linearGradient id="gradState" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Marker arrows */}
            <marker id="arrowCyan" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#06b6d4" />
            </marker>
            <marker id="arrowEmerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#10b981" />
            </marker>
            <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 8 4 L 0 8 z" fill="#c084fc" />
            </marker>
          </defs>

          {/* 1. KEY INPUT NODE */}
          <g transform="translate(30, 70)">
            <rect
              width="130"
              height="70"
              rx="12"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <text x="65" y="28" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif">
              KHÓA BÍ MẬT (K)
            </text>
            <text x="65" y="50" fill="#38bdf8" fontSize="13" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              {keyDisplay}
            </text>
          </g>

          {/* Arrow Key -> KSA */}
          <path
            d="M 160 105 L 210 105"
            stroke="#06b6d4"
            strokeWidth="2.5"
            markerEnd="url(#arrowCyan)"
            strokeDasharray={isKsaActive ? "4 4" : "none"}
            className={isKsaActive ? "animate-pulse" : ""}
          />

          {/* 2. KSA BLOCK */}
          <g transform="translate(220, 50)">
            <rect
              width="170"
              height="110"
              rx="16"
              fill="url(#gradKsa)"
              stroke={isKsaActive ? "#22d3ee" : "#0891b2"}
              strokeWidth={isKsaActive ? 3 : 1.5}
              filter={isKsaActive ? "url(#glowCyan)" : undefined}
            />
            <text x="85" y="28" fill="#a5f3fc" fontSize="13" textAnchor="middle" fontWeight="bold">
              Giai Đoạn KSA
            </text>
            <text x="85" y="46" fill="#e0f2fe" fontSize="10" textAnchor="middle" fontStyle="italic">
              Key-Scheduling Algorithm
            </text>
            <line x1="20" y1="56" x2="150" y2="56" stroke="#0891b2" strokeWidth="1" strokeDasharray="2 2" />
            <text x="85" y="74" fill="#67e8f9" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
              j = (j + S[i] + T[i]) mod N
            </text>
            <text x="85" y="92" fill="#bae6fd" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
              swap(S[i], S[j])
            </text>
          </g>

          {/* Arrow KSA -> State S */}
          <path
            d="M 390 105 L 435 105"
            stroke="#06b6d4"
            strokeWidth="2.5"
            markerEnd="url(#arrowCyan)"
          />

          {/* 3. PERMUTATION STATE ARRAY S */}
          <g transform="translate(445, 65)">
            <rect
              width="120"
              height="80"
              rx="12"
              fill="url(#gradState)"
              stroke="#64748b"
              strokeWidth="1.5"
            />
            <text x="60" y="26" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">
              MẢNG S HOÁN VỊ
            </text>
            <text x="60" y="44" fill="#a5f3fc" fontSize="9" textAnchor="middle" fontStyle="italic">
              Sau KSA (N = 8)
            </text>
            <text x="60" y="64" fill="#38bdf8" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              [6,0,7,1..]
            </text>
          </g>

          {/* Arrow State S -> PRGA */}
          <path
            d="M 565 105 L 610 105"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#arrowEmerald)"
          />

          {/* 4. PRGA BLOCK */}
          <g transform="translate(620, 50)">
            <rect
              width="170"
              height="110"
              rx="16"
              fill="url(#gradPrga)"
              stroke={isPrgaActive ? "#34d399" : "#059669"}
              strokeWidth={isPrgaActive ? 3 : 1.5}
              filter={isPrgaActive ? "url(#glowEmerald)" : undefined}
            />
            <text x="85" y="28" fill="#a7f3d0" fontSize="13" textAnchor="middle" fontWeight="bold">
              Giai Đoạn PRGA
            </text>
            <text x="85" y="46" fill="#d1fae5" fontSize="10" textAnchor="middle" fontStyle="italic">
              Pseudo-Random Generator
            </text>
            <line x1="20" y1="56" x2="150" y2="56" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
            <text x="85" y="74" fill="#6ee7b7" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
              i=(i+1)%N; j=(j+S[i])%N
            </text>
            <text x="85" y="92" fill="#a7f3d0" fontSize="9.5" textAnchor="middle" fontFamily="monospace">
              t=(S[i]+S[j])%N; k=S[t]
            </text>
          </g>

          {/* Arrow PRGA Down -> Keystream */}
          <path
            d="M 705 160 L 705 210"
            stroke="#10b981"
            strokeWidth="2.5"
            markerEnd="url(#arrowEmerald)"
            strokeDasharray={isPrgaActive ? "4 4" : "none"}
            className={isPrgaActive ? "animate-pulse" : ""}
          />

          {/* 5. KEYSTREAM NODE */}
          <g transform="translate(635, 215)">
            <rect
              width="140"
              height="60"
              rx="10"
              fill="#064e3b"
              stroke="#34d399"
              strokeWidth="1.5"
            />
            <text x="70" y="22" fill="#a7f3d0" fontSize="10" textAnchor="middle" fontWeight="bold">
              DÒNG KHÓA (KEYSTREAM k)
            </text>
            <text x="70" y="44" fill="#6ee7b7" fontSize="12" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              {keystreamDisplay}
            </text>
          </g>

          {/* Arrow Keystream -> XOR GATE */}
          <path
            d="M 635 245 L 485 245"
            stroke="#34d399"
            strokeWidth="2.5"
            markerEnd="url(#arrowEmerald)"
          />

          {/* 6. INPUT TEXT NODE (Plaintext in encrypt, Ciphertext in decrypt) */}
          <g transform="translate(180, 215)">
            <rect
              width="170"
              height="60"
              rx="10"
              fill="#1e1b4b"
              stroke="#818cf8"
              strokeWidth="1.5"
            />
            <text x="85" y="22" fill="#c7d2fe" fontSize="10" textAnchor="middle" fontWeight="bold">
              {currentMode === 'encrypt' ? 'BẢN RÕ (PLAINTEXT P)' : 'BẢN MÃ (CIPHERTEXT C)'}
            </text>
            <text x="85" y="44" fill="#a5b4fc" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              {currentMode === 'encrypt' ? plaintextDisplay : ciphertextDisplay}
            </text>
          </g>

          {/* Arrow Input -> XOR GATE */}
          <path
            d="M 350 245 L 415 245"
            stroke="#818cf8"
            strokeWidth="2.5"
            markerEnd="url(#arrowPurple)"
          />

          {/* 7. XOR GATE CIRCLE */}
          <g transform="translate(425, 220)">
            <circle
              cx="25"
              cy="25"
              r="24"
              fill="url(#gradXor)"
              stroke={isXorActive ? "#e879f9" : "#a855f7"}
              strokeWidth={isXorActive ? 3 : 2}
              filter={isXorActive ? "url(#glowCyan)" : undefined}
            />
            <line x1="25" y1="9" x2="25" y2="41" stroke="#ffffff" strokeWidth="2.5" />
            <line x1="9" y1="25" x2="41" y2="25" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="25" cy="25" r="18" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 2" />
          </g>
          <text x="450" y="285" fill="#e9d5ff" fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
            Phép XOR đối xứng (⊕)
          </text>

          {/* Arrow XOR -> OUTPUT */}
          <path
            d="M 450 215 L 450 185 L 115 185 L 115 210"
            stroke="#c084fc"
            strokeWidth="2.5"
            markerEnd="url(#arrowPurple)"
            fill="none"
          />

          {/* 8. OUTPUT RESULT NODE */}
          <g transform="translate(30, 215)">
            <rect
              width="140"
              height="60"
              rx="10"
              fill="#4c0519"
              stroke="#fb7185"
              strokeWidth="1.5"
            />
            <text x="70" y="22" fill="#fecdd3" fontSize="10" textAnchor="middle" fontWeight="bold">
              {currentMode === 'encrypt' ? 'KẾT QUẢ BẢN MÃ (C)' : 'BẢN RÕ PHỤC HỒI (P)'}
            </text>
            <text x="70" y="44" fill="#fda4af" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">
              {currentMode === 'encrypt' ? ciphertextDisplay : plaintextDisplay}
            </text>
          </g>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {currentMode === 'encrypt'
              ? 'Mã hóa đối xứng: C[i] = P[i] ⊕ k[i]'
              : 'Giải mã hoàn nguyên: P[i] = C[i] ⊕ k[i] (vì A ⊕ B ⊕ B = A)'}
          </span>
        </div>
        <span className="text-emerald-400 font-bold">Thuần túy từ số 0 (Zero-Dependency)</span>
      </div>
    </div>
  );
};
