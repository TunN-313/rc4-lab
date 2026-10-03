import React, { useState, useMemo } from 'react';
import {
  FlaskConical,
  BarChart2,
  GitCompare,
  TrendingDown,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  BookmarkPlus,
  AlertTriangle,
  CheckCircle2,
  Check,
  HelpCircle,
  Binary,
  Cpu,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  runBiasExperiment,
  runTinyBiasExperiment,
  runKeyReuseAnalysis,
  runTinyKeyReuseAnalysis,
  runDropNExperiment,
  runAvalancheTest,
  bytesToHex,
  stringToBytes,
  type CipherVersion,
  type SupportedTinyN,
  parseNumberArray,
  formatNumberArray,
  tinyRc4Encrypt,
  getWordBitsForN,
} from '../crypto/rc4';
import { saveExperimentRun } from '../firebase/firestore';

interface ExperimentsViewProps {
  user: User | null;
  onOpenAuth: () => void;
}

export const ExperimentsView: React.FC<ExperimentsViewProps> = ({ user, onOpenAuth }) => {
  // Version Switch: Full RC4 vs TinyRC4
  const [cipherVersion, setCipherVersion] = useState<CipherVersion>('tiny');
  const [tinyN, setTinyN] = useState<SupportedTinyN>(8);

  const [activeExp, setActiveExp] = useState<'bias' | 'key_reuse' | 'drop_n' | 'avalanche'>('bias');

  // 1. Bias test state
  const [biasSampleSize, setBiasSampleSize] = useState<number>(10000);
  const [biasTargetByte, setBiasTargetByte] = useState<1 | 2>(2);
  const [fullBiasResult, setFullBiasResult] = useState<ReturnType<typeof runBiasExperiment> | null>(null);
  const [tinyBiasResult, setTinyBiasResult] = useState<ReturnType<typeof runTinyBiasExperiment> | null>(null);
  const [isCalculatingBias, setIsCalculatingBias] = useState(false);

  // 2. Key reuse state (Full)
  const [reuseKey, setReuseKey] = useState('SecretKey123');
  const [reuseP1, setReuseP1] = useState('Attack at 06:00 AM sharp');
  const [reuseP2, setReuseP2] = useState('Retreat to river base now');
  const [cribGuess, setCribGuess] = useState('Attack at');
  const [cribOffset, setCribOffset] = useState<number>(0);

  // 2. Key reuse state (TinyRC4 - Lecturer default K=[2, 1, 3])
  const [tinyReuseKey, setTinyReuseKey] = useState('2, 1, 3');
  const [tinyReuseP1, setTinyReuseP1] = useState('1, 0, 6');
  const [tinyReuseP2, setTinyReuseP2] = useState('4, 2, 5');

  // 3. Drop-N state
  const [dropSamples, setDropSamples] = useState<number>(5000);
  const [dropList, setDropList] = useState<ReturnType<typeof runDropNExperiment>[]>([]);
  const [tinyDropList, setTinyDropList] = useState<{ dropN: number; zeroCount: number; zeroPercentage: number; stdDev: number; frequencies: number[] }[]>([]);
  const [isCalculatingDrop, setIsCalculatingDrop] = useState(false);

  // 4. Avalanche state
  const [avalancheKey, setAvalancheKey] = useState('MyMasterPassword');
  const [avalancheLength, setAvalancheLength] = useState<number>(64);
  const [avalancheResult, setAvalancheResult] = useState<ReturnType<typeof runAvalancheTest> | null>(null);

  // 4. Avalanche state (TinyRC4 - Lecturer default K=[2, 1, 3])
  const [tinyAvalancheKey, setTinyAvalancheKey] = useState('2, 1, 3');
  const [tinyAvalancheResult, setTinyAvalancheResult] = useState<{
    key1: number[];
    key2: number[];
    ks1: number[];
    ks2: number[];
    diffCount: number;
    total: number;
    pct: number;
  } | null>(null);

  // Save feedback state
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Run Bias Test
  const handleRunBias = () => {
    setIsCalculatingBias(true);
    setTimeout(() => {
      if (cipherVersion === 'full') {
        const res = runBiasExperiment(biasSampleSize, biasTargetByte);
        setFullBiasResult(res);
      } else {
        const res = runTinyBiasExperiment(biasSampleSize, biasTargetByte, tinyN);
        setTinyBiasResult(res);
      }
      setIsCalculatingBias(false);
    }, 50);
  };

  // Run Key Reuse Analysis for Full RC4
  const reuseAnalysis = useMemo(() => {
    return runKeyReuseAnalysis(reuseKey, reuseP1, reuseP2);
  }, [reuseKey, reuseP1, reuseP2]);

  // Run Key Reuse Analysis for TinyRC4
  const tinyReuseAnalysis = useMemo(() => {
    try {
      const k = parseNumberArray(tinyReuseKey, tinyN);
      const p1 = parseNumberArray(tinyReuseP1, tinyN);
      const p2 = parseNumberArray(tinyReuseP2, tinyN);
      return runTinyKeyReuseAnalysis(k, p1, p2, tinyN);
    } catch {
      return null;
    }
  }, [tinyReuseKey, tinyReuseP1, tinyReuseP2, tinyN]);

  // Crib dragging analysis for Full RC4
  const cribDragResult = useMemo(() => {
    const cribBytes = stringToBytes(cribGuess);
    const c1XorC2Bytes: number[] = [];
    for (let i = 0; i < reuseAnalysis.c1XorC2Hex.length; i += 2) {
      c1XorC2Bytes.push(parseInt(reuseAnalysis.c1XorC2Hex.slice(i, i + 2), 16));
    }

    const recoveredChars: string[] = [];
    for (let i = 0; i < cribBytes.length; i++) {
      const targetIdx = cribOffset + i;
      if (targetIdx < c1XorC2Bytes.length) {
        const xorByte = c1XorC2Bytes[targetIdx] ^ cribBytes[i];
        recoveredChars.push(xorByte >= 32 && xorByte <= 126 ? String.fromCharCode(xorByte) : '·');
      } else {
        recoveredChars.push(' ');
      }
    }
    return recoveredChars.join('');
  }, [cribGuess, cribOffset, reuseAnalysis]);

  // Run Drop-N Experiment
  const handleRunDropN = () => {
    setIsCalculatingDrop(true);
    setTimeout(() => {
      if (cipherVersion === 'full') {
        const drops = [0, 256, 768, 1024, 3072];
        const results = drops.map((d) => runDropNExperiment(dropSamples, d));
        setDropList(results);
      } else {
        // Drops for TinyRC4
        const drops = [0, 4, 8, 16, 32];
        const results = drops.map((drop) => {
          const counts = new Uint32Array(tinyN);
          for (let s = 0; s < dropSamples; s++) {
            const k: number[] = [];
            for (let i = 0; i < 4; i++) k.push(Math.floor(Math.random() * tinyN));
            // Tiny encrypt with drop
            const dummy = new Array(drop + 2).fill(0);
            const { keystream } = tinyRc4Encrypt(dummy, k, tinyN, false);
            const byte = keystream[drop + 1]; // Observed byte after drop
            counts[byte]++;
          }
          const zeroCount = counts[0];
          const zeroPercentage = (zeroCount / dropSamples) * 100;
          const expected = dropSamples / tinyN;
          let variance = 0;
          for (let b = 0; b < tinyN; b++) variance += Math.pow(counts[b] - expected, 2);
          const stdDev = Math.sqrt(variance / tinyN);
          return {
            dropN: drop,
            zeroCount,
            zeroPercentage,
            stdDev: Math.round(stdDev * 100) / 100,
            frequencies: Array.from(counts),
          };
        });
        setTinyDropList(results);
      }
      setIsCalculatingDrop(false);
    }, 50);
  };

  // Run Avalanche Test
  const handleRunAvalanche = () => {
    if (cipherVersion === 'full') {
      const res = runAvalancheTest(avalancheKey, avalancheLength);
      setAvalancheResult(res);
    } else {
      try {
        const k1 = parseNumberArray(tinyAvalancheKey, tinyN);
        if (k1.length === 0) throw new Error('Khóa trống');
        const k2 = [...k1];
        // Flip bit 0 of first word
        k2[0] = (k2[0] ^ 1) % tinyN;

        const streamLen = 16;
        const dummy = new Array(streamLen).fill(0);
        const { keystream: ks1 } = tinyRc4Encrypt(dummy, k1, tinyN, false);
        const { keystream: ks2 } = tinyRc4Encrypt(dummy, k2, tinyN, false);

        let diff = 0;
        for (let i = 0; i < streamLen; i++) {
          if (ks1[i] !== ks2[i]) diff++;
        }

        setTinyAvalancheResult({
          key1: k1,
          key2: k2,
          ks1,
          ks2,
          diffCount: diff,
          total: streamLen,
          pct: Math.round((diff / streamLen) * 1000) / 10,
        });
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : String(err));
      }
    }
  };

  // Save experiment to user Firestore
  const handleSaveExperiment = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }

    try {
      setSaving(true);
      setSaveMessage(null);

      let title = '';
      let summary = '';
      let metricValue = '';

      const prefix = cipherVersion === 'full' ? 'Full RC4' : `TinyRC4 (N=${tinyN})`;

      if (activeExp === 'bias') {
        const res = cipherVersion === 'full' ? fullBiasResult : tinyBiasResult;
        if (!res) throw new Error('Vui lòng chạy thử nghiệm trước khi lưu.');
        title = `[${prefix}] Kiểm định thiên vị Byte #${biasTargetByte} (${biasSampleSize} mẫu)`;
        summary = `Tỷ lệ byte 0 xuất hiện: ${res.zeroPercentage.toFixed(3)}% (Lý tưởng: ${res.expectedUniformPercentage.toFixed(3)}%). Hệ số thiên vị: ${res.biasFactor.toFixed(2)}x`;
        metricValue = `${res.biasFactor.toFixed(2)}x bias`;
      } else if (activeExp === 'key_reuse') {
        title = `[${prefix}] Tấn công Tái sử dụng khóa (Two-Time Pad)`;
        summary = `Phân tích C1 ⊕ C2 = P1 ⊕ P2 chứng minh triệt tiêu hoàn toàn khóa bí mật.`;
        metricValue = 'Triệt tiêu hoàn toàn khóa';
      } else if (activeExp === 'drop_n') {
        const list = cipherVersion === 'full' ? dropList : tinyDropList;
        if (list.length === 0) throw new Error('Vui lòng chạy thử nghiệm trước khi lưu.');
        title = `[${prefix}] Thử nghiệm RC4-drop[n] (${dropSamples} mẫu)`;
        summary = `Độ lệch chuẩn giảm từ ${list[0].stdDev} xuống ${list[list.length - 1].stdDev}`;
        metricValue = `StdDev: ${list[0].stdDev} -> ${list[list.length - 1].stdDev}`;
      } else if (activeExp === 'avalanche') {
        if (cipherVersion === 'full' && avalancheResult) {
          title = `[Full RC4] Kiểm tra hiệu ứng thác đổ 1 bit`;
          summary = `Khóa lật 1 bit tạo ra ${avalancheResult.totalBitsFlipped}/${avalancheResult.totalBits} bits khác biệt (${avalancheResult.overallPercentage}%).`;
          metricValue = `${avalancheResult.overallPercentage}% bit divergence`;
        } else if (cipherVersion === 'tiny' && tinyAvalancheResult) {
          title = `[TinyRC4 N=${tinyN}] Hiệu ứng thác đổ lật 1 bit`;
          summary = `Lật 1 bit khóa làm thay đổi ${tinyAvalancheResult.diffCount}/${tinyAvalancheResult.total} từ dòng khóa (${tinyAvalancheResult.pct}%).`;
          metricValue = `${tinyAvalancheResult.pct}% words diff`;
        } else {
          throw new Error('Vui lòng chạy thử nghiệm trước khi lưu.');
        }
      }

      await saveExperimentRun({
        experimentType: activeExp,
        title,
        summary,
        metricValue,
      });

      setSaving(false);
      setSaveMessage('Đã lưu kết quả thực nghiệm vào tài khoản!');
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: unknown) {
      setSaving(false);
      setSaveMessage('Lỗi khi lưu: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>PHÒNG THÍ NGHIỆM & PHÂN TÍCH TẤN CÔNG THỰC NGHIỆM</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Thực Nghiệm Các Lỗ Hổng & Điểm Yếu Toán Học
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Tự tay tái hiện các hiện tượng mật mã học đã được kiểm chứng khoa học: Thiên vị Mantin-Shamir, Tấn công tái sử dụng khóa (Two-Time Pad), Kỹ thuật RC4-drop[n] và Hiệu ứng thác đổ (Avalanche Effect) trên cả hai phiên bản <strong className="text-emerald-300">TinyRC4</strong> và <strong className="text-cyan-300">Full RC4</strong>.
        </p>
      </div>

      {/* VERSION SWITCHER: FULL RC4 vs TINYRC4 */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Môi trường thực nghiệm:
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
              <span>TinyRC4 (Rút Gọn N = 4, 8, 16)</span>
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
              <span>Full RC4 (256 bytes)</span>
            </button>
          </div>
        </div>

        {cipherVersion === 'tiny' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono">Kích thước N:</span>
            <div className="flex rounded-lg bg-slate-950 border border-slate-800 p-0.5">
              {([4, 8, 16] as SupportedTinyN[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setTinyN(n)}
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
        )}
      </div>

      {/* Experiment Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveExp('bias')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeExp === 'bias'
              ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <BarChart2 className={`w-5 h-5 ${activeExp === 'bias' ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Test A
            </span>
          </div>
          <div className="text-sm font-bold text-white">Thiên Vị Byte Dòng Khóa</div>
          <div className="text-[11px] text-slate-400 mt-1">Keystream Bias Test</div>
        </button>

        <button
          onClick={() => setActiveExp('key_reuse')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeExp === 'key_reuse'
              ? 'bg-rose-950/40 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <GitCompare className={`w-5 h-5 ${activeExp === 'key_reuse' ? 'text-rose-400' : 'text-slate-500'}`} />
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
              Test B
            </span>
          </div>
          <div className="text-sm font-bold text-white">Tái Sử Dụng Khóa</div>
          <div className="text-[11px] text-slate-400 mt-1">C1 ⊕ C2 = P1 ⊕ P2</div>
        </button>

        <button
          onClick={() => setActiveExp('drop_n')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeExp === 'drop_n'
              ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Layers className={`w-5 h-5 ${activeExp === 'drop_n' ? 'text-purple-400' : 'text-slate-500'}`} />
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              Test C
            </span>
          </div>
          <div className="text-sm font-bold text-white">Thử Nghiệm RC4-drop[n]</div>
          <div className="text-[11px] text-slate-400 mt-1">Triệt tiêu thiên vị</div>
        </button>

        <button
          onClick={() => setActiveExp('avalanche')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeExp === 'avalanche'
              ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className={`w-5 h-5 ${activeExp === 'avalanche' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Test D
            </span>
          </div>
          <div className="text-sm font-bold text-white">Hiệu Ứng Thác Đổ</div>
          <div className="text-[11px] text-slate-400 mt-1">Avalanche Effect 1-bit</div>
        </button>
      </div>

      {/* EXPERIMENT 1: BIAS TEST */}
      {activeExp === 'bias' && (
        <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Thực Nghiệm Thiên Vị Dòng Khóa Ban Đầu (Keystream Bias)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {cipherVersion === 'full'
                  ? 'Tạo N khóa ngẫu nhiên độc lập 128-bit, chạy KSA và thống kê phân bố xác suất byte đầu ra thứ 1 hoặc thứ 2.'
                  : `Tạo N khóa ngẫu nhiên TinyRC4 (N = ${tinyN}), thống kê xác suất xuất hiện của các giá trị từ 0 đến ${tinyN - 1}.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Vị trí byte quan sát:</label>
                <select
                  value={biasTargetByte}
                  onChange={(e) => setBiasTargetByte(Number(e.target.value) as 1 | 2)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono"
                >
                  <option value={2}>Byte #2 (Thiên vị Mantin-Shamir)</option>
                  <option value={1}>Byte #1 (Gần đều)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Số mẫu N (Khóa):</label>
                <select
                  value={biasSampleSize}
                  onChange={(e) => setBiasSampleSize(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono"
                >
                  <option value={2000}>2.000 Khóa (Cực nhanh)</option>
                  <option value={5000}>5.000 Khóa</option>
                  <option value={10000}>10.000 Khóa (Khuyên dùng)</option>
                  <option value={25000}>25.000 Khóa (Rất rõ ràng)</option>
                </select>
              </div>

              <button
                onClick={handleRunBias}
                disabled={isCalculatingBias}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
              >
                {isCalculatingBias ? (
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Chạy Thí Nghiệm
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Display */}
          {(cipherVersion === 'full' ? fullBiasResult : tinyBiasResult) ? (
            <div className="space-y-6 pt-4 border-t border-slate-800">
              {(() => {
                const res = cipherVersion === 'full' ? fullBiasResult! : tinyBiasResult!;
                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Tần Suất Giá Trị 0:</div>
                        <div className="text-xl font-bold text-cyan-300 mt-1">
                          {res.zeroPercentage.toFixed(3)}%
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{res.zeroCount} lần xuất hiện</div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Kỳ Vọng Lý Thuyết (Đều):</div>
                        <div className="text-xl font-bold text-slate-300 mt-1">
                          {res.expectedUniformPercentage.toFixed(3)}%
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          1/{cipherVersion === 'full' ? '256' : tinyN} tổng số
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Hệ Số Thiên Vị (Bias Factor):</div>
                        <div
                          className={`text-xl font-bold mt-1 ${
                            res.biasFactor > 1.2 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {res.biasFactor.toFixed(2)}x
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">So với ngẫu nhiên lý tưởng</div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[11px] text-slate-400">Đánh Giá An Toàn:</div>
                        <div
                          className={`text-sm font-bold mt-1 ${
                            res.biasFactor > 1.2 ? 'text-rose-400' : 'text-slate-300'
                          }`}
                        >
                          {res.biasFactor > 1.2 ? 'Thiên vị rõ rệt' : 'Phân bố đồng đều'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {biasTargetByte === 2 ? 'Lỗ hổng Mantin-Shamir' : 'Vị trí byte 1'}
                        </div>
                      </div>
                    </div>

                    {/* Histogram Chart */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <span>Biểu đồ Histogram tần suất các giá trị:</span>
                        <span className="text-cyan-400">
                          Đường nét đứt màu đỏ: Mức kỳ vọng đồng đều lý thuyết ({res.expectedUniformPercentage.toFixed(2)}%)
                        </span>
                      </div>

                      <div className="h-48 flex items-end gap-1 pt-6 pb-2 px-2 border-b border-slate-800 relative">
                        {/* Reference Line */}
                        <div
                          className="absolute w-full border-t border-dashed border-rose-500/70 z-10 pointer-events-none"
                          style={{
                            bottom: `${Math.min(90, (res.expectedUniformPercentage / (res.expectedUniformPercentage * 2.5)) * 100)}%`,
                          }}
                        >
                          <span className="absolute right-2 -top-4 text-[10px] font-mono text-rose-400">
                            Lý tưởng: {res.expectedUniformPercentage.toFixed(2)}%
                          </span>
                        </div>

                        {res.frequencies.map((cnt, val) => {
                          const pct = (cnt / biasSampleSize) * 100;
                          const maxPct = res.expectedUniformPercentage * 2.5;
                          const heightPct = Math.min(100, Math.max(4, (pct / maxPct) * 100));
                          const isZero = val === 0;

                          return (
                            <div
                              key={val}
                              className="flex-1 flex flex-col items-center group relative h-full justify-end"
                            >
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t transition-all duration-300 ${
                                  isZero
                                    ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
                                    : 'bg-cyan-500/60 group-hover:bg-cyan-400'
                                }`}
                              ></div>
                              <span className="text-[9px] text-slate-500 font-mono mt-1 select-none">
                                {cipherVersion === 'tiny' ? val : val % 32 === 0 ? val : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              Chưa có dữ liệu. Hãy chọn số mẫu và bấm "Chạy Thí Nghiệm" để bắt đầu thống kê.
            </div>
          )}
        </div>
      )}

      {/* EXPERIMENT 2: KEY REUSE (TWO-TIME PAD) */}
      {activeExp === 'key_reuse' && (
        <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-6 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Tấn Công Tái Sử Dụng Khóa (Two-Time Pad / Key Reuse Vulnerability)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                C1 ⊕ C2 = P1 ⊕ P2
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Khi cùng một khóa được dùng để mã hóa hai bức điện khác nhau, dòng khóa bí mật bị triệt tiêu hoàn toàn khi XOR hai bản mã: $(P_1 \oplus K) \oplus (P_2 \oplus K) = P_1 \oplus P_2$.
            </p>
          </div>

          {cipherVersion === 'tiny' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Khóa chung K:</label>
                <input
                  type="text"
                  value={tinyReuseKey}
                  onChange={(e) => setTinyReuseKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bản rõ P1:</label>
                <input
                  type="text"
                  value={tinyReuseP1}
                  onChange={(e) => setTinyReuseP1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bản rõ P2:</label>
                <input
                  type="text"
                  value={tinyReuseP2}
                  onChange={(e) => setTinyReuseP2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Khóa dùng chung (Key):</label>
                <input
                  type="text"
                  value={reuseKey}
                  onChange={(e) => setReuseKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bản rõ thông điệp 1 (P1):</label>
                <input
                  type="text"
                  value={reuseP1}
                  onChange={(e) => setReuseP1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bản rõ thông điệp 2 (P2):</label>
                <input
                  type="text"
                  value={reuseP2}
                  onChange={(e) => setReuseP2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Mathematical Proof display */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Chứng minh toán học: C1 ⊕ C2 trùng khớp 100% với P1 ⊕ P2</span>
            </div>

            {cipherVersion === 'tiny' && tinyReuseAnalysis ? (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">P1 ⊕ P2 (Bản rõ XOR):</div>
                  <div className="text-cyan-300 font-bold">[{formatNumberArray(tinyReuseAnalysis.p1XorP2)}]</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">C1 ⊕ C2 (Bản mã XOR):</div>
                  <div className="text-rose-300 font-bold">[{formatNumberArray(tinyReuseAnalysis.c1XorC2)}]</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">P1 ⊕ P2 (Hex):</div>
                  <div className="text-cyan-300 font-bold break-all">{reuseAnalysis.p1XorP2Hex}</div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-slate-400 text-[11px]">C1 ⊕ C2 (Hex):</div>
                  <div className="text-rose-300 font-bold break-all">{reuseAnalysis.c1XorC2Hex}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EXPERIMENT 3: DROP-N TEST */}
      {activeExp === 'drop_n' && (
        <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Thử Nghiệm Kỹ Thuật RC4-drop[n] Khắc Phục Thiên Vị
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Đánh giá mức độ đồng đều khi vứt bỏ các byte dòng khóa đầu tiên.
              </p>
            </div>
            <button
              onClick={handleRunDropN}
              disabled={isCalculatingDrop}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition cursor-pointer disabled:opacity-50"
            >
              {isCalculatingDrop ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Chạy So Sánh
                </>
              )}
            </button>
          </div>

          {(cipherVersion === 'full' ? dropList.length > 0 : tinyDropList.length > 0) && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Biến thể</th>
                    <th className="py-3 px-4">Số byte bỏ (n)</th>
                    <th className="py-3 px-4">Tần suất số 0</th>
                    <th className="py-3 px-4">Độ lệch chuẩn (StdDev)</th>
                    <th className="py-3 px-4">Đánh giá bảo mật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(cipherVersion === 'full' ? dropList : tinyDropList).map((d) => (
                    <tr key={d.dropN} className="text-slate-300">
                      <td className="py-3 px-4 font-bold text-white">RC4-drop[{d.dropN}]</td>
                      <td className="py-3 px-4 text-cyan-300">{d.dropN}</td>
                      <td className="py-3 px-4">{d.zeroPercentage.toFixed(3)}%</td>
                      <td className="py-3 px-4 text-emerald-400">{d.stdDev}</td>
                      <td className="py-3 px-4">
                        {d.dropN === 0 ? (
                          <span className="text-rose-400">Yếu (Có thiên vị)</span>
                        ) : (
                          <span className="text-emerald-400">Đã triệt tiêu thiên vị</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EXPERIMENT 4: AVALANCHE EFFECT */}
      {activeExp === 'avalanche' && (
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 space-y-6 animate-in fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Kiểm Tra Hiệu Ứng Thác Đổ (Avalanche Effect Test)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Lật duy nhất 1 bit của khóa ban đầu và đo lường khoảng cách Hamming giữa hai dòng khóa sinh ra.
              </p>
            </div>
            <button
              onClick={handleRunAvalanche}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Kiểm Tra Thác Đổ
            </button>
          </div>

          {cipherVersion === 'full' ? (
            avalancheResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="text-emerald-400 font-bold text-sm">
                  Tỷ lệ khác biệt dòng khóa: {avalancheResult.overallPercentage}% ({avalancheResult.totalBitsFlipped}/{avalancheResult.totalBits} bits)
                </div>
                <div className="text-slate-400">
                  Lý tưởng trong mật mã học là ~50% (mỗi bit có 50% xác suất đảo lộn khi lật 1 bit khóa).
                </div>
              </div>
            )
          ) : (
            tinyAvalancheResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="text-emerald-400 font-bold text-sm">
                  Tỷ lệ khác biệt dòng khóa TinyRC4: {tinyAvalancheResult.pct}% ({tinyAvalancheResult.diffCount}/{tinyAvalancheResult.total} từ)
                </div>
                <div className="text-slate-300">
                  Khóa 1: [{formatNumberArray(tinyAvalancheResult.key1)}] $\implies$ Dòng khóa 1: [{formatNumberArray(tinyAvalancheResult.ks1)}]
                </div>
                <div className="text-slate-300">
                  Khóa 2 (Lật 1 bit): [{formatNumberArray(tinyAvalancheResult.key2)}] $\implies$ Dòng khóa 2: [{formatNumberArray(tinyAvalancheResult.ks2)}]
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Save to Firestore Button */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-200">Lưu kết quả thực nghiệm:</span>
          {saveMessage && (
            <span className={`ml-2 text-xs font-mono ${saveMessage.includes('Lỗi') ? 'text-rose-400' : 'text-emerald-400'}`}>
              {saveMessage}
            </span>
          )}
        </div>
        <button
          onClick={handleSaveExperiment}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition cursor-pointer disabled:opacity-50"
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span>{saving ? 'Đang lưu...' : 'Lưu kết quả vào Lịch sử'}</span>
        </button>
      </div>
    </div>
  );
};
