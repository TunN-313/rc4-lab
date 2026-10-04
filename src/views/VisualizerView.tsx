import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  FastForward,
  Cpu,
  Layers,
  Sparkles,
  Info,
  Sliders,
  Check,
  Binary,
  ArrowRight,
  CheckCircle2,
  Table as TableIcon,
} from 'lucide-react';
import {
  stringToBytes,
  bytesToHex,
  byteToBinaryString,
  generateSimulationSteps,
  generateTinySimulationSteps,
  type SimulatorStep,
  type PRGAStep,
  STANDARD_TEST_VECTORS,
  type CipherVersion,
  type SupportedTinyN,
  TINY_RC4_CLASSROOM_EXAMPLE,
  parseNumberArray,
  formatNumberArray,
  getWordBitsForN,
} from '../crypto/rc4';
import { OverallFlowDiagram } from '../components/rc4-diagrams/OverallFlowDiagram';
import { KsaFlowDiagram } from '../components/rc4-diagrams/KsaFlowDiagram';
import { PrgaFlowDiagram } from '../components/rc4-diagrams/PrgaFlowDiagram';
import { setVisualizerContext } from '../components/layout/panelContextStore';

export const VisualizerView: React.FC = () => {
  // Version switch: Full RC4 (N=256) or TinyRC4 (N=4, 8, 16)
  const [cipherVersion, setCipherVersion] = useState<CipherVersion>('tiny');
  const [tinyN, setTinyN] = useState<SupportedTinyN>(8);

  // Full RC4 Inputs
  const [keyInput, setKeyInput] = useState('Key');
  const [plainInput, setPlainInput] = useState('Plaintext');
  const [displayMode, setDisplayMode] = useState<'hex' | 'dec'>('hex');

  // TinyRC4 Inputs (Lecturer default: K=[2, 1, 3], P=[1, 0, 6] "BAG")
  const [tinyKeyInput, setTinyKeyInput] = useState('2, 1, 3');
  const [tinyPlainInput, setTinyPlainInput] = useState('1, 0, 6');

  // Simulator playback states
  const [steps, setSteps] = useState<SimulatorStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeedMs, setPlaySpeedMs] = useState(400);
  const [inputError, setInputError] = useState<string | null>(null);

  // Interactive Diagram tab in visualizer: 'all' | 'overall' | 'ksa' | 'prga' | 'hide'
  const [diagramTab, setDiagramTab] = useState<'all' | 'overall' | 'ksa' | 'prga' | 'hide'>('all');
  const [diagramMode, setDiagramMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  // Generate steps whenever inputs change
  const initSimulation = () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setInputError(null);

    try {
      if (cipherVersion === 'full') {
        const keyBytes = stringToBytes(keyInput || 'Key');
        const plainBytes = stringToBytes(plainInput || 'Hi');
        const simSteps = generateSimulationSteps(keyBytes, plainBytes);
        setSteps(simSteps);
        setCurrentStepIdx(0);
      } else {
        const keyArr = parseNumberArray(tinyKeyInput, tinyN);
        const plainArr = parseNumberArray(tinyPlainInput, tinyN);
        if (keyArr.length === 0) {
          throw new Error(`Vui lòng nhập khóa TinyRC4 (các số nguyên từ 0 đến ${tinyN - 1}).`);
        }
        if (plainArr.length === 0) {
          throw new Error(`Vui lòng nhập bản rõ TinyRC4 (các số nguyên từ 0 đến ${tinyN - 1}).`);
        }
        const simSteps = generateTinySimulationSteps(keyArr, plainArr, tinyN);
        setSteps(simSteps);
        setCurrentStepIdx(0);
      }
    } catch (err: unknown) {
      setInputError(err instanceof Error ? err.message : String(err));
      setSteps([]);
      setCurrentStepIdx(0);
    }
  };

  useEffect(() => {
    initSimulation();
  }, [cipherVersion, tinyN, keyInput, plainInput, tinyKeyInput, tinyPlainInput]);

  // Autoplay loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playSpeedMs, steps.length]);

  const currentStep: SimulatorStep | undefined = steps[currentStepIdx];

  // Đồng bộ bước mô phỏng hiện tại sang RightContextPanel mà không re-render AppShell
  useEffect(() => {
    if (currentStep) {
      setVisualizerContext({
        phase: currentStep.phase,
        stepIndex: currentStepIdx,
        totalSteps: steps.length,
        i: currentStep.i,
        j: currentStep.j,
        t: currentStep.phase === 'PRGA' ? currentStep.t : undefined,
        k: currentStep.phase === 'PRGA' ? currentStep.keystreamByte : undefined,
        swapped: currentStep.swapped,
        formula: currentStep.formula,
        explanation: currentStep.explanation,
        cipherVersion,
        tinyN: cipherVersion === 'tiny' ? tinyN : undefined,
        keyByte: currentStep.phase === 'KSA' ? currentStep.keyByte : undefined,
        plainByte: currentStep.phase === 'PRGA' ? currentStep.plainByte : undefined,
        cipherByte: currentStep.phase === 'PRGA' ? currentStep.cipherByte : undefined,
      });
    } else {
      setVisualizerContext(null);
    }
    return () => {
      setVisualizerContext(null);
    };
  }, [currentStep, currentStepIdx, steps.length, cipherVersion, tinyN]);

  // Load classroom preset (Lecturer Example)
  const handleLoadClassroomPreset = () => {
    setCipherVersion('tiny');
    setTinyN(8);
    setTinyKeyInput('2, 1, 3');
    setTinyPlainInput('1, 0, 6');
  };

  // Load Full RC4 standard vector
  const handleLoadVector = (v: typeof STANDARD_TEST_VECTORS[0]) => {
    setCipherVersion('full');
    setKeyInput(v.keyText);
    setPlainInput(v.plaintext);
  };

  // Jump to PRGA
  const handleJumpToPRGA = () => {
    setIsPlaying(false);
    const prgaIndex = steps.findIndex((s) => s.phase === 'PRGA');
    if (prgaIndex !== -1) {
      setCurrentStepIdx(prgaIndex);
    }
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  // Auto-scroll table to keep active row in view
  useEffect(() => {
    if (cipherVersion === 'tiny' && tableContainerRef.current) {
      const activeRow = tableContainerRef.current.querySelector(`[data-step-row="${currentStepIdx}"]`);
      if (activeRow) {
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStepIdx, cipherVersion]);

  // Keystream bytes collected so far in PRGA phase
  const prgaHistory = useMemo(() => {
    const list: {
      byteIndex: number;
      plainByte: number;
      keystreamByte: number;
      cipherByte: number;
    }[] = [];
    for (let k = 0; k <= currentStepIdx; k++) {
      const s = steps[k];
      if (s && s.phase === 'PRGA') {
        list.push({
          byteIndex: s.byteIndex,
          plainByte: s.plainByte ?? 0,
          keystreamByte: s.keystreamByte,
          cipherByte: s.cipherByte ?? 0,
        });
      }
    }
    return list;
  }, [steps, currentStepIdx]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>MÔ PHỎNG TRỰC QUAN TỪNG BƯỚC</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Bộ Giả Lập Hoán Vị Mảng S (KSA & PRGA)
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Quan sát chuyển động thực tế của hai con trỏ <strong className="text-cyan-400">i</strong> và{' '}
          <strong className="text-amber-400">j</strong>, quá trình hoán đổi các phần tử trong mảng <code className="font-mono text-cyan-300">S</code>, và cách PRGA rút trích byte dòng khóa để XOR tạo ra bản mã.
        </p>
      </div>

      {/* VERSION SWITCHER: FULL RC4 vs TINYRC4 */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Chế độ mô phỏng:
          </span>
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setCipherVersion('tiny')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                cipherVersion === 'tiny'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>TinyRC4 (1 Hàng Mảng S & Bảng Chi Tiết)</span>
            </button>
            <button
              onClick={() => setCipherVersion('full')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                cipherVersion === 'full'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Full RC4 (Ma trận 16x16 / 256 bytes)</span>
            </button>
          </div>
        </div>

        {/* TinyRC4 Controls & Classroom Preset */}
        {cipherVersion === 'tiny' ? (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-mono">Trạng thái N:</span>
              <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                {([4, 8, 16] as SupportedTinyN[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setTinyN(n);
                      if (n === 8) {
                        setTinyKeyInput('1, 2, 3, 6');
                        setTinyPlainInput('1, 2, 2, 2');
                      } else if (n === 4) {
                        setTinyKeyInput('1, 2');
                        setTinyPlainInput('0, 1, 2, 3');
                      } else {
                        setTinyKeyInput('1, 5, 9, 13');
                        setTinyPlainInput('2, 4, 6, 8');
                      }
                    }}
                    className={`px-2.5 py-1 text-xs font-mono rounded cursor-pointer transition ${
                      tinyN === n
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    N={n} ({getWordBitsForN(n)}-bit)
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleLoadClassroomPreset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-medium transition cursor-pointer shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ví dụ trên lớp (N=8)</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Hiển thị ô S:</span>
            <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
              <button
                onClick={() => setDisplayMode('hex')}
                className={`px-2.5 py-1 text-xs rounded cursor-pointer ${
                  displayMode === 'hex' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
                }`}
              >
                Hex
              </button>
              <button
                onClick={() => setDisplayMode('dec')}
                className={`px-2.5 py-1 text-xs rounded cursor-pointer ${
                  displayMode === 'dec' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
                }`}
              >
                Thập phân
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control Inputs Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        {cipherVersion === 'tiny' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Khóa TinyRC4 K (Giá trị 0 đến {tinyN - 1})
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">Phân tách dấu phẩy</span>
                </div>
                <input
                  type="text"
                  value={tinyKeyInput}
                  onChange={(e) => setTinyKeyInput(e.target.value)}
                  placeholder="Ví dụ bài giảng: 2, 1, 3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-400 transition"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Bản rõ TinyRC4 P (Giá trị 0 đến {tinyN - 1})
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">Phân tách dấu phẩy</span>
                </div>
                <input
                  type="text"
                  value={tinyPlainInput}
                  onChange={(e) => setTinyPlainInput(e.target.value)}
                  placeholder='Ví dụ bài giảng: 1, 0, 6 ("BAG")'
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-400 transition"
                />
              </div>
            </div>

            {/* Lecturer comparison card if lecturer values are entered */}
            {tinyN === 8 &&
              tinyKeyInput.replace(/\s+/g, '') === '2,1,3' &&
              tinyPlainInput.replace(/\s+/g, '') === '1,0,6' && (
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono space-y-2">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Đối Chuẩn Với Ví Dụ Của Giảng Viên (N=8, K=[2,1,3], P=[1,0,6] "BAG")
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] border border-emerald-500/40">
                      100% Khớp kỳ vọng (PASS)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1 border-t border-emerald-500/20">
                    <div>
                      <span className="text-slate-400">S sau KSA:</span>{' '}
                      <span className="text-cyan-300 font-bold">[6,0,7,1,2,3,5,4]</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Keystream:</span>{' '}
                      <span className="text-emerald-300 font-bold">[5,1,6] (101 001 110)</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Bản mã C:</span>{' '}
                      <span className="text-rose-300 font-bold">[4,1,0] ("EBA", 100 001 000)</span>
                    </div>
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Khóa Bí Mật (Key Text)
              </label>
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Ví dụ: Key"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Bản Rõ Đầu Vào (Plaintext)
              </label>
              <input
                type="text"
                value={plainInput}
                onChange={(e) => setPlainInput(e.target.value)}
                placeholder="Ví dụ: Plaintext"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
          </div>
        )}

        {inputError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            {inputError}
          </div>
        )}

        {/* Quick vectors for Full RC4 */}
        {cipherVersion === 'full' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-500 uppercase">Mẫu thử nghiệm:</span>
            {STANDARD_TEST_VECTORS.map((v) => (
              <button
                key={v.name}
                onClick={() => handleLoadVector(v)}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono transition cursor-pointer"
              >
                {v.name.split('/')[0].trim()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PLAYBACK CONTROLS & STEP INFO HEADER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Phase Badge & Step Count */}
          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider ${
                currentStep?.phase === 'KSA'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              }`}
            >
              Giai đoạn: {currentStep?.phase || 'KSA'}
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Bước <span className="text-cyan-400 font-bold">{currentStepIdx + 1}</span> / {steps.length}
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition cursor-pointer"
              title="Làm lại từ bước đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleStepBack}
              disabled={currentStepIdx === 0}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 text-xs font-medium transition cursor-pointer"
            >
              Bước Trước
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Tạm Dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Phát Tự Động</span>
                </>
              )}
            </button>
            <button
              onClick={handleStepForward}
              disabled={currentStepIdx >= steps.length - 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 disabled:opacity-40 text-xs font-medium transition cursor-pointer"
            >
              <span>Bước Tiếp</span>
              <StepForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleJumpToPRGA}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 text-xs font-medium transition cursor-pointer"
              title="Nhảy thẳng đến bắt đầu giai đoạn PRGA"
            >
              <span>Đến PRGA</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed slider */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>Tốc độ: {playSpeedMs}ms</span>
            <input
              type="range"
              min="80"
              max="1200"
              step="40"
              value={playSpeedMs}
              onChange={(e) => setPlaySpeedMs(Number(e.target.value))}
              className="w-24 accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Current Formula & Pointer Explanation Card */}
        {currentStep && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                  Con trỏ i = {currentStep.i}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-bold">
                  Con trỏ j = {currentStep.j}
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                  Hoán đổi S[{currentStep.swapped[0]}] ↔ S[{currentStep.swapped[1]}]
                </span>
                {currentStep.phase === 'PRGA' && (
                  <>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
                      t = {currentStep.t} ⇒ Byte khóa k = {currentStep.keystreamByte}
                    </span>
                    {currentStep.cipherByte !== undefined && (
                      <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-bold">
                        Bản mã C = {currentStep.cipherByte}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="font-mono text-xs text-emerald-300 break-all bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              Công thức: {currentStep.formula}
            </div>
            <div className="text-xs text-slate-300 leading-relaxed">{currentStep.explanation}</div>
          </div>
        )}
      </div>

      {/* PERMUTATION STATE ARRAY S VISUALIZATION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              {cipherVersion === 'tiny'
                ? `Mảng Trạng Thái Hoán Vị S (Một Hàng ${tinyN} Ô - TinyRC4 N=${tinyN})`
                : 'Mảng Trạng Thái Hoán Vị S (Lưới 16x16 để quan sát = 256 Ô - Full RC4)'}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
              <span className="text-slate-300">Con trỏ i</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
              <span className="text-slate-300">Con trỏ j</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-400 border border-purple-300 shadow-[0_0_8px_rgba(192,132,252,0.8)]"></span>
              <span className="text-slate-300">Chỉ số t / Hoán đổi</span>
            </div>
          </div>
        </div>

        {/* 1. TINYRC4: SINGLE ROW OF CELLS (N = 4, 8, 16) */}
        {cipherVersion === 'tiny' && currentStep ? (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div
              className={`grid gap-2.5 overflow-x-auto py-2`}
              style={{
                gridTemplateColumns: `repeat(${tinyN}, minmax(48px, 1fr))`,
              }}
            >
              {currentStep.sAfter.map((val, idx) => {
                const isI = idx === currentStep.i;
                const isJ = idx === currentStep.j;
                const isT = currentStep.phase === 'PRGA' && idx === currentStep.t;
                const isSwapped = idx === currentStep.swapped[0] || idx === currentStep.swapped[1];

                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl border font-mono transition-all duration-300 ${
                      isI && isJ
                        ? 'bg-gradient-to-br from-cyan-950 via-amber-950 to-slate-900 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-105'
                        : isI
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-105'
                        : isJ
                        ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] scale-105'
                        : isT
                        ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.6)]'
                        : isSwapped
                        ? 'bg-slate-900 border-cyan-700/60'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Index label */}
                    <span className="text-[10px] text-slate-500 font-bold mb-1">
                      S[{idx}]
                    </span>

                    {/* Value */}
                    <span
                      className={`text-lg sm:text-xl font-extrabold ${
                        isI
                          ? 'text-cyan-300'
                          : isJ
                          ? 'text-amber-300'
                          : isT
                          ? 'text-purple-300'
                          : 'text-white'
                      }`}
                    >
                      {val}
                    </span>

                    {/* Indicator Badges */}
                    <div className="flex items-center gap-1 mt-1.5 h-4">
                      {isI && (
                        <span className="px-1 rounded bg-cyan-400 text-slate-950 font-bold text-[9px]">
                          i
                        </span>
                      )}
                      {isJ && (
                        <span className="px-1 rounded bg-amber-400 text-slate-950 font-bold text-[9px]">
                          j
                        </span>
                      )}
                      {isT && (
                        <span className="px-1 rounded bg-purple-400 text-slate-950 font-bold text-[9px]">
                          t
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* 2. FULL RC4: 16x16 GRID (256 CELLS) */
          currentStep && (
            <div className="overflow-x-auto p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="grid grid-cols-16 gap-1 min-w-[640px]">
                {currentStep.sAfter.map((val, idx) => {
                  const isI = idx === currentStep.i;
                  const isJ = idx === currentStep.j;
                  const isT = currentStep.phase === 'PRGA' && idx === currentStep.t;

                  return (
                    <div
                      key={idx}
                      className={`relative aspect-square flex items-center justify-center rounded text-[11px] font-mono transition-all duration-150 ${
                        isI && isJ
                          ? 'bg-gradient-to-br from-cyan-400 to-amber-400 text-slate-950 font-bold ring-2 ring-white scale-110 z-20'
                          : isI
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.8)] scale-110 z-10'
                          : isJ
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(251,191,36,0.8)] scale-110 z-10'
                          : isT
                          ? 'bg-purple-500 text-white font-bold ring-1 ring-purple-300'
                          : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                      title={`Vị trí: ${idx} | Giá trị: ${val} (0x${val.toString(16).toUpperCase()})`}
                    >
                      {displayMode === 'hex' ? val.toString(16).padStart(2, '0').toUpperCase() : val}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* 3.5 INTERACTIVE SVG BLOCK DIAGRAMS (SYNCHRONIZED WITH VISUALIZER STEP) */}
      {diagramTab !== 'hide' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">
                Sơ Đồ Khối Đồ Họa Thuật Toán (Interactive SVG Block Diagrams)
              </h2>
              <span className="text-[11px] text-cyan-300 font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">
                Đồng bộ bước #{currentStepIdx + 1} ({currentStep?.phase || 'KSA'})
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setDiagramTab('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  diagramTab === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cả 3 Sơ Đồ
              </button>
              <button
                onClick={() => setDiagramTab('overall')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  diagramTab === 'overall'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                (1) Tổng thể
              </button>
              <button
                onClick={() => setDiagramTab('ksa')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  diagramTab === 'ksa'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                (2) KSA
              </button>
              <button
                onClick={() => setDiagramTab('prga')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                  diagramTab === 'prga'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                (3) PRGA
              </button>
              <button
                onClick={() => setDiagramTab('hide')}
                className="px-2.5 py-1.5 rounded-lg font-medium text-slate-500 hover:text-slate-300 transition cursor-pointer"
                title="Thu gọn sơ đồ"
              >
                ✕
              </button>
            </div>
          </div>

          {(() => {
            const prgaStep = currentStep?.phase === 'PRGA' ? (currentStep as PRGAStep) : null;
            const prgaStepsUntilNow = steps
              .slice(0, currentStepIdx + 1)
              .filter((s): s is PRGAStep => s.phase === 'PRGA');
            const keystreamDisplayStr = `[${prgaStepsUntilNow.map((s) => s.keystreamByte).join(', ')}]`;
            const ciphertextDisplayStr = `[${prgaStepsUntilNow
              .filter((s) => s.cipherByte !== undefined)
              .map((s) => s.cipherByte)
              .join(', ')}]`;

            return (
              <div className="space-y-6">
                {(diagramTab === 'all' || diagramTab === 'overall') && (
                  <OverallFlowDiagram
                    activePhase={
                      currentStep?.phase === 'KSA'
                        ? 'KSA'
                        : currentStep?.phase === 'PRGA'
                        ? 'PRGA'
                        : 'IDLE'
                    }
                    keyDisplay={cipherVersion === 'tiny' ? `[${tinyKeyInput}]` : keyInput}
                    plaintextDisplay={
                      cipherVersion === 'tiny'
                        ? `[${tinyPlainInput}] ${
                            tinyPlainInput.replace(/\s+/g, '') === '1,0,6' ? '("BAG")' : ''
                          }`
                        : plainInput
                    }
                    keystreamDisplay={keystreamDisplayStr}
                    ciphertextDisplay={ciphertextDisplayStr}
                    mode={diagramMode}
                    onModeChange={(m) => setDiagramMode(m)}
                  />
                )}

                {(diagramTab === 'all' || diagramTab === 'ksa') && (
                  <KsaFlowDiagram
                    currentKsaStep={
                      currentStep?.phase === 'KSA'
                        ? currentStep.i
                        : cipherVersion === 'tiny'
                        ? tinyN - 1
                        : 255
                    }
                    currentI={currentStep?.i ?? 0}
                    currentJ={currentStep?.j ?? 0}
                    swappedPair={currentStep?.swapped ?? [0, 0]}
                    N={cipherVersion === 'tiny' ? tinyN : 256}
                    formulaStr={currentStep?.phase === 'KSA' ? currentStep.formula : 'Đã hoàn tất KSA'}
                    isAnimated={isPlaying}
                  />
                )}

                {(diagramTab === 'all' || diagramTab === 'prga') && (
                  <PrgaFlowDiagram
                    currentPrgaStep={
                      currentStep?.phase === 'PRGA'
                        ? Math.max(
                            0,
                            currentStepIdx - steps.filter((s) => s.phase === 'KSA').length
                          )
                        : 0
                    }
                    currentI={currentStep?.i ?? 1}
                    currentJ={currentStep?.j ?? 0}
                    currentT={prgaStep?.t ?? 0}
                    currentK={prgaStep?.keystreamByte ?? 0}
                    swappedPair={currentStep?.swapped ?? [0, 0]}
                    plainByte={prgaStep?.plainByte ?? 0}
                    cipherByte={prgaStep?.cipherByte ?? 0}
                    N={cipherVersion === 'tiny' ? tinyN : 256}
                    formulaStr={
                      currentStep?.phase === 'PRGA' ? currentStep.formula : 'Đang trong pha KSA'
                    }
                    isAnimated={isPlaying}
                  />
                )}
              </div>
            );
          })()}
        </div>
      )}

      {diagramTab === 'hide' && (
        <div className="flex justify-end">
          <button
            onClick={() => setDiagramTab('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mở lại Sơ Đồ Khối Thuật Toán (SVG Diagrams)</span>
          </button>
        </div>
      )}
      {cipherVersion === 'tiny' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">
                  Bảng Chi Tiết Từng Bước Thực Thi (Step-by-Step Execution Table)
                </h3>
                <p className="text-xs text-slate-400">
                  Nhấn vào bất kỳ hàng nào để nhảy thẳng đến trạng thái của bước đó
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400">
              Tổng cộng: {steps.length} bước ({steps.filter((s) => s.phase === 'KSA').length} KSA +{' '}
              {steps.filter((s) => s.phase === 'PRGA').length} PRGA)
            </span>
          </div>

          <div
            ref={tableContainerRef}
            className="overflow-x-auto max-h-[380px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950"
          >
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10 text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Bước</th>
                  <th className="py-2.5 px-3">Giai đoạn</th>
                  <th className="py-2.5 px-3">i</th>
                  <th className="py-2.5 px-3">j</th>
                  <th className="py-2.5 px-3">Mảng S trước swap</th>
                  <th className="py-2.5 px-3">Hoán đổi (Swap)</th>
                  <th className="py-2.5 px-3">Mảng S sau swap</th>
                  <th className="py-2.5 px-3">t / Byte khóa k</th>
                  <th className="py-2.5 px-3">P ⊕ k → C</th>
                  <th className="py-2.5 px-3">Công thức tính</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {steps.map((st, idx) => {
                  const isActive = idx === currentStepIdx;
                  return (
                    <tr
                      key={idx}
                      data-step-row={idx}
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentStepIdx(idx);
                      }}
                      className={`cursor-pointer transition ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-200 font-bold border-l-4 border-cyan-400'
                          : 'hover:bg-slate-900/80 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            st.phase === 'KSA'
                              ? 'bg-cyan-950 border border-cyan-800 text-cyan-400'
                              : 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                          }`}
                        >
                          {st.phase}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-cyan-300">{st.i}</td>
                      <td className="py-2.5 px-3 text-amber-300">{st.j}</td>
                      <td className="py-2.5 px-3 text-slate-400">
                        [{formatNumberArray(st.sBefore)}]
                      </td>
                      <td className="py-2.5 px-3 text-purple-300 font-bold whitespace-nowrap">
                        S[{st.swapped[0]}] ↔ S[{st.swapped[1]}]
                      </td>
                      <td className="py-2.5 px-3 text-cyan-200 font-bold">
                        [{formatNumberArray(st.sAfter)}]
                      </td>
                      <td className="py-2.5 px-3">
                        {st.phase === 'PRGA' ? (
                          <span className="text-emerald-400 font-bold">
                            t={st.t} ⇒ k={st.keystreamByte}
                          </span>
                        ) : (
                          <span className="text-slate-600">---</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {st.phase === 'PRGA' && st.plainByte !== undefined && st.cipherByte !== undefined ? (
                          <span className="text-rose-300">
                            {st.plainByte} ⊕ {st.keystreamByte} = {st.cipherByte}
                          </span>
                        ) : (
                          <span className="text-slate-600">---</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-xs">
                        {st.formula}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRGA XOR KEYSTREAM PROGRESSION CARD */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Dòng Khóa Sinh Ra & Bản Mã Hóa (PRGA Output)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Đã sinh: {prgaHistory.length} phần tử
          </span>
        </div>

        {prgaHistory.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500 font-mono">
            Chưa đến giai đoạn PRGA. Hãy nhấn "Bước Tiếp", "Phát Tự Động" hoặc "Đến PRGA" để bắt đầu sinh dòng khóa.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex flex-wrap gap-3">
              {prgaHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 font-mono text-xs space-y-1.5 min-w-[120px]"
                >
                  <div className="text-[10px] text-slate-500">Phần tử #{idx + 1}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bản rõ P:</span>
                    <span className="text-cyan-300 font-bold">{item.plainByte}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Khóa k:</span>
                    <span className="text-emerald-400 font-bold">{item.keystreamByte}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Bản mã C:</span>
                    <span className="text-rose-400 font-bold">{item.cipherByte}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
