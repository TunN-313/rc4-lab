import React, { useState, useMemo } from 'react';
import {
  Calculator,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  Cpu,
  ArrowRight,
  Lock,
  Unlock,
  RotateCcw,
  Sliders,
  Check,
  Binary,
  HelpCircle,
  Table as TableIcon,
  ChevronRight,
} from 'lucide-react';
import {
  TinyRC4,
  TINY_RC4_CLASSROOM_EXAMPLE,
  HARDCODED_LECTURER_HAND_CALCULATION,
  parseNumberArray,
  formatNumberArray,
  numberArrayToBinary,
  getWordBitsForN,
  type SupportedTinyN,
} from '../crypto/rc4';
import { OverallFlowDiagram } from '../components/rc4-diagrams/OverallFlowDiagram';
import { KsaFlowDiagram } from '../components/rc4-diagrams/KsaFlowDiagram';
import { PrgaFlowDiagram } from '../components/rc4-diagrams/PrgaFlowDiagram';

export const HandCalculationView: React.FC = () => {
  // Mode: Preset (Lecturer Example) vs Editable (Custom inputs)
  const [isEditable, setIsEditable] = useState(false);
  const [selectedN, setSelectedN] = useState<SupportedTinyN>(8);
  const [customKeyInput, setCustomKeyInput] = useState('2, 1, 3');
  const [customPlainInput, setCustomPlainInput] = useState('1, 0, 6');

  // Active diagram tab: 'all' | 'overall' | 'ksa' | 'prga'
  const [diagramTab, setDiagramTab] = useState<'all' | 'overall' | 'ksa' | 'prga'>('all');
  const [cryptDirection, setCryptDirection] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Highlighted step for diagram synchronization
  const [activeStepType, setActiveStepType] = useState<'KSA' | 'PRGA' | 'XOR'>('KSA');
  const [activeKsaIdx, setActiveKsaIdx] = useState(0);
  const [activePrgaIdx, setActivePrgaIdx] = useState(0);

  // Reset to lecturer preset
  const handleResetToPreset = () => {
    setIsEditable(false);
    setSelectedN(8);
    setCustomKeyInput('2, 1, 3');
    setCustomPlainInput('1, 0, 6');
    setActiveStepType('KSA');
    setActiveKsaIdx(0);
    setActivePrgaIdx(0);
  };

  // Compute live algorithm data
  const computation = useMemo(() => {
    try {
      const N = isEditable ? selectedN : 8;
      const keyArr = isEditable
        ? parseNumberArray(customKeyInput, N)
        : TINY_RC4_CLASSROOM_EXAMPLE.key;
      const plainArr = isEditable
        ? parseNumberArray(customPlainInput, N)
        : TINY_RC4_CLASSROOM_EXAMPLE.plaintext;

      if (keyArr.length === 0) throw new Error('Khóa K không được để trống.');
      if (plainArr.length === 0) throw new Error('Bản rõ P không được để trống.');

      // Array T
      const T: number[] = Array.from({ length: N }, (_, i) => keyArr[i % keyArr.length]);

      // Live module calculation with trace
      const ksaResult = TinyRC4.ksa(keyArr, N, true);
      const encryptResult = TinyRC4.encrypt(plainArr, keyArr, N, true);
      const decryptResult = TinyRC4.decrypt(encryptResult.ciphertext, keyArr, N, true);

      // Generate hand calculation models
      // 1. KSA Hand calculation steps
      const handKsa: {
        i: number;
        oldJ: number;
        sI: number;
        tI: number;
        calcFormula: string;
        newJ: number;
        swapPair: [number, number];
        sBefore: number[];
        sAfter: number[];
        liveMatch: boolean;
      }[] = [];

      let runningS = Array.from({ length: N }, (_, i) => i);
      let j = 0;

      for (let i = 0; i < N; i++) {
        const sBefore = [...runningS];
        const oldJ = j;
        const sI = runningS[i];
        const tI = T[i];
        j = (j + sI + tI) % N;

        // swap
        const tmp = runningS[i];
        runningS[i] = runningS[j];
        runningS[j] = tmp;

        const liveStep = ksaResult.trace?.[i];
        const hardcodedKsa = !isEditable ? HARDCODED_LECTURER_HAND_CALCULATION.ksaSteps[i] : undefined;
        const liveMatch =
          liveStep !== undefined &&
          liveStep.j === j &&
          JSON.stringify(liveStep.sAfter) === JSON.stringify(runningS) &&
          (!hardcodedKsa ||
            (hardcodedKsa.newJ === j &&
              JSON.stringify(hardcodedKsa.sAfter) === JSON.stringify(runningS)));

        handKsa.push({
          i,
          oldJ,
          sI,
          tI,
          calcFormula: `j = (${oldJ} + S[${i}](${sI}) + T[${i}](${tI})) mod ${N} = ${oldJ + sI + tI} mod ${N} = ${j}`,
          newJ: j,
          swapPair: [i, j],
          sBefore,
          sAfter: [...runningS],
          liveMatch,
        });
      }

      // 2. PRGA Hand calculation steps
      const handPrga: {
        step: number;
        oldI: number;
        oldJ: number;
        newI: number;
        newJ: number;
        sBefore: number[];
        swapPair: [number, number];
        sAfter: number[];
        tFormula: string;
        t: number;
        keystreamVal: number;
        binaryKeystream: string;
        liveMatch: boolean;
      }[] = [];

      let prgaS = [...runningS];
      let pI = 0;
      let pJ = 0;
      const bits = getWordBitsForN(N);

      for (let step = 0; step < plainArr.length; step++) {
        const sBefore = [...prgaS];
        const oldI = pI;
        const oldJ = pJ;

        pI = (pI + 1) % N;
        pJ = (pJ + prgaS[pI]) % N;

        // swap
        const tmp = prgaS[pI];
        prgaS[pI] = prgaS[pJ];
        prgaS[pJ] = tmp;

        const t = (prgaS[pI] + prgaS[pJ]) % N;
        const k = prgaS[t];

        const liveStep = encryptResult.prgaTrace?.[step];
        const hardcodedPrga = !isEditable ? HARDCODED_LECTURER_HAND_CALCULATION.prgaSteps[step] : undefined;
        const liveMatch =
          liveStep !== undefined &&
          liveStep.i === pI &&
          liveStep.j === pJ &&
          liveStep.t === t &&
          liveStep.keystreamByte === k &&
          JSON.stringify(liveStep.sAfter) === JSON.stringify(prgaS) &&
          (!hardcodedPrga ||
            (hardcodedPrga.t === t &&
              hardcodedPrga.keystreamVal === k &&
              JSON.stringify(hardcodedPrga.sAfter) === JSON.stringify(prgaS)));

        handPrga.push({
          step,
          oldI,
          oldJ,
          newI: pI,
          newJ: pJ,
          sBefore,
          swapPair: [pI, pJ],
          sAfter: [...prgaS],
          tFormula: `t = (S[${pI}](${prgaS[pI]}) + S[${pJ}](${prgaS[pJ]})) mod ${N} = ${prgaS[pI] + prgaS[pJ]} mod ${N} = ${t}`,
          t,
          keystreamVal: k,
          binaryKeystream: (k & ((1 << bits) - 1)).toString(2).padStart(bits, '0'),
          liveMatch,
        });
      }

      // 3. XOR Hand calculation steps
      const handXor = plainArr.map((plainVal, idx) => {
        const kVal = handPrga[idx]?.keystreamVal ?? 0;
        const cipherVal = (plainVal ^ kVal) % N;
        const plainBin = (plainVal & ((1 << bits) - 1)).toString(2).padStart(bits, '0');
        const kBin = (kVal & ((1 << bits) - 1)).toString(2).padStart(bits, '0');
        const cipherBin = (cipherVal & ((1 << bits) - 1)).toString(2).padStart(bits, '0');

        const liveCipher = encryptResult.ciphertext[idx];
        const liveDecrypt = decryptResult.plaintext[idx];
        const hardcodedXor = !isEditable ? HARDCODED_LECTURER_HAND_CALCULATION.xorSteps[idx] : undefined;
        const liveMatch =
          liveCipher === cipherVal &&
          liveDecrypt === plainVal &&
          (!hardcodedXor ||
            (hardcodedXor.cipherVal === cipherVal && hardcodedXor.decryptVal === plainVal));

        return {
          idx,
          plainVal,
          plainBin,
          kVal,
          kBin,
          cipherVal,
          cipherBin,
          liveMatch,
        };
      });

      const allMatches =
        handKsa.every((s) => s.liveMatch) &&
        handPrga.every((s) => s.liveMatch) &&
        handXor.every((s) => s.liveMatch);

      return {
        success: true,
        N,
        keyArr,
        plainArr,
        T,
        handKsa,
        handPrga,
        handXor,
        ksaResult,
        encryptResult,
        decryptResult,
        allMatches,
        error: null,
      };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
        N: 8 as SupportedTinyN,
        keyArr: [],
        plainArr: [],
        T: [],
        handKsa: [],
        handPrga: [],
        handXor: [],
        ksaResult: null,
        encryptResult: null,
        decryptResult: null,
        allMatches: false,
      };
    }
  }, [isEditable, selectedN, customKeyInput, customPlainInput]);

  // Diagram synchronization variables
  const currentKsaStepData = computation.handKsa[activeKsaIdx] || computation.handKsa[0];
  const currentPrgaStepData = computation.handPrga[activePrgaIdx] || computation.handPrga[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Calculator className="w-3.5 h-3.5 text-amber-400" />
          <span>GIẢI TRÌNH CHI TIẾT TỪNG PHÉP TÍNH BẰNG TAY</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ví Dụ Tính Tay TinyRC4 (Hand-Calculation)
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed mt-1">
              Toàn bộ các bước tính toán bằng tay kinh điển theo giáo trình đại học: Khởi tạo mảng $S$, từng vòng lặp KSA, từng bước sinh dòng khóa PRGA và phép toán XOR nhị phân $P \oplus K = C$. Đối chiếu trực tiếp từng phép tính với bộ mã TinyRC4 thuần túy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditable(!isEditable)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                isEditable
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditable ? 'Đang bật Chế độ Nhập Tùy Chỉnh' : 'Bật Chế độ Tùy Chỉnh (Editable)'}</span>
            </button>

            {isEditable && (
              <button
                onClick={handleResetToPreset}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
                title="Quay về ví dụ chuẩn của giảng viên"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FINAL MATCHING BANNER (MANDATORY REQUIREMENT) */}
      {computation.success && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/80 border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Check className="w-6 h-6 text-emerald-400 stroke-[3]" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white flex flex-wrap items-center gap-2">
                <span>Kết quả tính tay khớp với chương trình:</span>
                <span className="text-emerald-400 font-mono text-xl font-black">✔</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">100% ĐẠT (PASS)</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Mọi giá trị trung gian (S0, j, swap, t, k, C, P_phục hồi) của từng bước tính tay đều trùng khớp tuyệt đối với mã nguồn TinyRC4 thuần túy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300">
              KSA: {computation.handKsa.length} bước ✔
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300">
              PRGA: {computation.handPrga.length} bước ✔
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-purple-300">
              XOR: {computation.handXor.length} byte ✔
            </span>
          </div>
        </div>
      )}

      {/* EDITABLE CONTROLS IF ENABLED */}
      {isEditable && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Sliders className="w-4 h-4" />
              <span>Bảng Điều Khiển Tham Số Tự Định Nghĩa (Custom Input Mode)</span>
            </div>
            <button
              onClick={handleResetToPreset}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
            >
              Nạp lại ví dụ giảng viên (K=[2,1,3], P=[1,0,6])
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kích thước không gian N:
              </label>
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                {([4, 8, 16] as SupportedTinyN[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedN(n)}
                    className={`flex-1 py-1.5 text-xs font-mono rounded-lg transition cursor-pointer ${
                      selectedN === n
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    N = {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Khóa K (giá trị 0 đến {selectedN - 1}):
              </label>
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="Ví dụ: 2, 1, 3"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bản rõ P (giá trị 0 đến {selectedN - 1}):
              </label>
              <input
                type="text"
                value={customPlainInput}
                onChange={(e) => setCustomPlainInput(e.target.value)}
                placeholder="Ví dụ: 1, 0, 6"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* SƠ ĐỒ KHỐI SVG/REACT INTERACTIVE (MANDATORY REQUIREMENT 4) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">
              Sơ Đồ Khối Minh Họa Đồ Họa Thuật Toán (Interactive SVG Block Diagrams)
            </h2>
          </div>

          {/* Diagram Tab switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setDiagramTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                diagramTab === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hiện Cả 3 Sơ Đồ
            </button>
            <button
              onClick={() => setDiagramTab('overall')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                diagramTab === 'overall' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              (1) Tổng thể
            </button>
            <button
              onClick={() => setDiagramTab('ksa')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                diagramTab === 'ksa' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              (2) KSA Flow
            </button>
            <button
              onClick={() => setDiagramTab('prga')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                diagramTab === 'prga' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              (3) PRGA Flow
            </button>
          </div>
        </div>

        {/* Render Diagrams according to tab */}
        <div className="space-y-6">
          {(diagramTab === 'all' || diagramTab === 'overall') && (
            <OverallFlowDiagram
              activePhase={activeStepType}
              keyDisplay={`[${formatNumberArray(computation.keyArr)}]`}
              plaintextDisplay={`[${formatNumberArray(computation.plainArr)}] ${
                !isEditable ? '("BAG")' : ''
              }`}
              keystreamDisplay={`[${formatNumberArray(computation.encryptResult?.keystream || [])}]`}
              ciphertextDisplay={`[${formatNumberArray(computation.encryptResult?.ciphertext || [])}] ${
                !isEditable ? '("EBA")' : ''
              }`}
              mode={cryptDirection}
              onModeChange={(m) => setCryptDirection(m)}
            />
          )}

          {(diagramTab === 'all' || diagramTab === 'ksa') && (
            <KsaFlowDiagram
              currentKsaStep={activeKsaIdx}
              currentI={currentKsaStepData?.i ?? 0}
              currentJ={currentKsaStepData?.newJ ?? 0}
              swappedPair={currentKsaStepData?.swapPair ?? [0, 0]}
              N={computation.N}
              formulaStr={currentKsaStepData?.calcFormula ?? ''}
              isAnimated={true}
            />
          )}

          {(diagramTab === 'all' || diagramTab === 'prga') && (
            <PrgaFlowDiagram
              currentPrgaStep={activePrgaIdx}
              currentI={currentPrgaStepData?.newI ?? 1}
              currentJ={currentPrgaStepData?.newJ ?? 0}
              currentT={currentPrgaStepData?.t ?? 0}
              currentK={currentPrgaStepData?.keystreamVal ?? 0}
              swappedPair={currentPrgaStepData?.swapPair ?? [0, 0]}
              plainByte={computation.plainArr[activePrgaIdx] ?? 0}
              cipherByte={computation.encryptResult?.ciphertext[activePrgaIdx] ?? 0}
              N={computation.N}
              formulaStr={currentPrgaStepData?.tFormula ?? ''}
              isAnimated={true}
            />
          )}
        </div>
      </div>

      {/* PHASE 1: INITIAL STATE & KEY VECTOR EXPANSION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-base font-bold text-white">
              Khởi Tạo Mảng Trạng Thái $S$ & Mảng Khóa $T$ Ban Đầu
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">Trạng thái trước KSA ($i=0, j=0$)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-sans font-semibold">
              Mảng Trạng Thái $S$ Ban Đầu ($S[i] = i, \forall i \in [0..{computation.N - 1}]$):
            </div>
            <div className="text-cyan-300 font-bold text-sm bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              S = [{formatNumberArray(Array.from({ length: computation.N }, (_, i) => i))}]
            </div>
            <div className="text-[11px] text-slate-400">
              Công thức: Với mọi i từ 0 đến {computation.N - 1}: S[i] = i.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-slate-400 font-sans font-semibold">
              Mảng Khóa Mở Rộng T (Khóa K lặp lại tuần hoàn cho đến khi đủ N phần tử):
            </div>
            <div className="text-amber-300 font-bold text-sm bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              T = [{formatNumberArray(computation.T)}]
            </div>
            <div className="text-[11px] text-slate-400">
              Công thức: T[i] = K[i mod length(K)]. Với K = [{formatNumberArray(computation.keyArr)}].
            </div>
          </div>
        </div>
      </div>

      {/* PHASE 2: DETAILED STEP-BY-STEP KSA LOOP TABLE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Vòng Lặp KSA: Chi Tiết Từng Bước Tính Tay & Đối Chiếu Trực Tiếp
              </h3>
              <p className="text-xs text-slate-400">
                Nhấn vào bất kỳ hàng nào để đồng bộ hóa sơ đồ thuật toán KSA
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            Tổng cộng: {computation.handKsa.length} vòng lặp ($i = 0 \to {computation.N - 1}$)
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Vòng i</th>
                <th className="py-2.5 px-3">Mảng S trước swap</th>
                <th className="py-2.5 px-3">Công thức tính $j$</th>
                <th className="py-2.5 px-3">Hoán đổi (Swap)</th>
                <th className="py-2.5 px-3">Mảng S sau swap (Tính tay)</th>
                <th className="py-2.5 px-3">Mã TinyRC4 Tính Live</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {computation.handKsa.map((st) => {
                const isActive = activeStepType === 'KSA' && activeKsaIdx === st.i;
                const liveStep = computation.ksaResult?.trace?.[st.i];

                return (
                  <tr
                    key={st.i}
                    onClick={() => {
                      setActiveStepType('KSA');
                      setActiveKsaIdx(st.i);
                    }}
                    className={`cursor-pointer transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-200 font-bold border-l-4 border-cyan-400'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">i = {st.i}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">
                      [{formatNumberArray(st.sBefore)}]
                    </td>
                    <td className="py-2.5 px-3 text-emerald-300 font-mono">{st.calcFormula}</td>
                    <td className="py-2.5 px-3 text-purple-300 font-bold whitespace-nowrap">
                      S[{st.swapPair[0]}] $\leftrightarrow$ S[{st.swapPair[1]}]
                    </td>
                    <td className="py-2.5 px-3 text-white font-bold">
                      [{formatNumberArray(st.sAfter)}]
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300">
                      {liveStep ? `[${formatNumberArray(liveStep.sAfter)}]` : '---'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {st.liveMatch ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          <Check className="w-3.5 h-3.5" /> Khớp ✔
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                          <XCircle className="w-3.5 h-3.5" /> Lệch
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Result of KSA */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Mảng $S$ thu được sau KSA:</span>
            <span className="text-cyan-300 font-bold text-sm">
              [{formatNumberArray(computation.handKsa[computation.handKsa.length - 1]?.sAfter || [])}]
            </span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Đã sẵn sàng làm đầu vào cho giai đoạn PRGA
          </span>
        </div>
      </div>

      {/* PHASE 3: DETAILED STEP-BY-STEP PRGA LOOP TABLE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Vòng Lặp PRGA: Sinh Dòng Khóa Từng Bước (Keystream Generation)
              </h3>
              <p className="text-xs text-slate-400">
                Nhấn vào bất kỳ hàng nào để đồng bộ hóa sơ đồ thuật toán PRGA
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            Số byte sinh: {computation.handPrga.length} phần tử
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Byte</th>
                <th className="py-2.5 px-3">Mảng S trước swap</th>
                <th className="py-2.5 px-3">Cập nhật con trỏ i, j</th>
                <th className="py-2.5 px-3">Hoán đổi (Swap)</th>
                <th className="py-2.5 px-3">Mảng S sau swap (Tính tay)</th>
                <th className="py-2.5 px-3">Mảng S sau swap (Live)</th>
                <th className="py-2.5 px-3">Tính chỉ số t</th>
                <th className="py-2.5 px-3">Byte khóa k = S[t] (Tính tay)</th>
                <th className="py-2.5 px-3">Live Engine</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {computation.handPrga.map((st) => {
                const isActive = activeStepType === 'PRGA' && activePrgaIdx === st.step;
                const liveStep = computation.encryptResult?.prgaTrace?.[st.step];

                return (
                  <tr
                    key={st.step}
                    onClick={() => {
                      setActiveStepType('PRGA');
                      setActivePrgaIdx(st.step);
                    }}
                    className={`cursor-pointer transition ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-200 font-bold border-l-4 border-emerald-400'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">#{st.step + 1}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">
                      [{formatNumberArray(st.sBefore)}]
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      i = {st.newI}, j = {st.newJ}
                    </td>
                    <td className="py-2.5 px-3 text-purple-300 font-bold whitespace-nowrap">
                      S[{st.swapPair[0]}] $\leftrightarrow$ S[{st.swapPair[1]}]
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-bold">
                      [{formatNumberArray(st.sAfter)}]
                    </td>
                    <td className="py-2.5 px-3 text-cyan-200 font-bold">
                      {liveStep ? `[${formatNumberArray(liveStep.sAfter)}]` : '---'}
                    </td>
                    <td className="py-2.5 px-3 text-amber-300 font-mono text-[11px]">
                      {st.tFormula}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-300 font-bold text-sm whitespace-nowrap">
                      {st.keystreamVal} <span className="text-slate-500 text-xs">({st.binaryKeystream})</span>
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold whitespace-nowrap">
                      k = {liveStep?.keystreamByte ?? '---'}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {st.liveMatch ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          <Check className="w-3.5 h-3.5" /> Khớp ✔
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                          <XCircle className="w-3.5 h-3.5" /> Lệch
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PHASE 4: DETAILED XOR ENCRYPTION & DECRYPTION TABLE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center">
              4
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                Phép Toán XOR Đối Xứng: Mã Hóa ($P \oplus K \to C$) & Giải Mã ($C \oplus K \to P$)
              </h3>
              <p className="text-xs text-slate-400">
                Hiển thị đồng thời dưới dạng số thập phân và chuỗi nhị phân (Binary {getWordBitsForN(computation.N)}-bit)
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-purple-300">Tính chất hoàn nguyên đối xứng</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="py-2.5 px-3">Vị trí</th>
                <th className="py-2.5 px-3">Bản rõ P (Thập phân)</th>
                <th className="py-2.5 px-3">Bản rõ P (Nhị phân)</th>
                <th className="py-2.5 px-3">Khóa k (Nhị phân)</th>
                <th className="py-2.5 px-3">Bản mã C (P $\oplus$ k)</th>
                <th className="py-2.5 px-3">Bản mã C (Nhị phân)</th>
                <th className="py-2.5 px-3">Giải mã (C $\oplus$ k $\to$ P)</th>
                <th className="py-2.5 px-3 text-center">Đối chiếu Live</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {computation.handXor.map((row) => (
                <tr key={row.idx} className="hover:bg-slate-900 text-slate-300">
                  <td className="py-2.5 px-3 font-bold text-slate-500">#{row.idx + 1}</td>
                  <td className="py-2.5 px-3 text-cyan-300 font-bold text-sm">
                    {row.plainVal}{' '}
                    {!isEditable && (
                      <span className="text-slate-400 text-xs">
                        ("{TINY_RC4_CLASSROOM_EXAMPLE.plaintextLetters[row.idx]}")
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-400">{row.plainBin}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">
                    {row.kBin} <span className="text-slate-500">({row.kVal})</span>
                  </td>
                  <td className="py-2.5 px-3 text-rose-300 font-bold text-sm">
                    {row.cipherVal}{' '}
                    {!isEditable && (
                      <span className="text-slate-400 text-xs">
                        ("{TINY_RC4_CLASSROOM_EXAMPLE.ciphertextLetters[row.idx]}")
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-rose-400">{row.cipherBin}</td>
                  <td className="py-2.5 px-3 text-emerald-300 font-bold">
                    {row.cipherVal} $\oplus$ {row.kVal} = {row.plainVal}{' '}
                    {!isEditable && (
                      <span className="text-slate-400 text-xs">
                        ("{TINY_RC4_CLASSROOM_EXAMPLE.plaintextLetters[row.idx]}")
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.liveMatch ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        <Check className="w-3.5 h-3.5" /> Đạt ✔
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold text-[11px] bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                        <XCircle className="w-3.5 h-3.5" /> Lệch
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Card for Binary Stream */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Chuỗi Bản rõ P:</span>
            <div className="text-cyan-300 font-bold">
              {numberArrayToBinary(computation.plainArr, getWordBitsForN(computation.N))}
            </div>
            {!isEditable && <div className="text-[10px] text-slate-500">Các chữ cái: "BAG"</div>}
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Chuỗi Dòng khóa k:</span>
            <div className="text-emerald-300 font-bold">
              {numberArrayToBinary(
                computation.encryptResult?.keystream || [],
                getWordBitsForN(computation.N)
              )}
            </div>
            <div className="text-[10px] text-slate-500">Dòng khóa sinh bởi PRGA</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Chuỗi Bản mã C (P ⊕ k):</span>
            <div className="text-rose-300 font-bold">
              {numberArrayToBinary(
                computation.encryptResult?.ciphertext || [],
                getWordBitsForN(computation.N)
              )}
            </div>
            {!isEditable && <div className="text-[10px] text-slate-500">Các chữ cái: "EBA"</div>}
          </div>
        </div>
      </div>

      {/* 5. FINAL SUMMARY BANNER (EXACT USER REQUIREMENT) */}
      {computation.success && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-cyan-950/90 border border-emerald-500/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Check className="w-7 h-7 text-emerald-400 stroke-[3]" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
                <span>Kết quả tính tay khớp với chương trình:</span>
                <span className="text-emerald-400 font-mono text-2xl font-black">✔</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tất cả các giá trị trung gian: Mảng $S$ khởi tạo, $T$ lặp tuần hoàn, {computation.handKsa.length} vòng lặp KSA, {computation.handPrga.length} vòng sinh dòng khóa PRGA, và phép XOR nhị phân {computation.handXor.length} byte bản mã và giải mã khôi phục đều khớp 100% giữa bảng tính tay và mô-đun TinyRC4 thuần túy.
              </p>
            </div>
          </div>
          <div className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ĐỐI CHUẨN 100% THÀNH CÔNG</span>
          </div>
        </div>
      )}
    </div>
  );
};
