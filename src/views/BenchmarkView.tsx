import React, { useState, useRef } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  BarChart3,
  TrendingUp,
  Table as TableIcon,
  ShieldAlert,
  Info,
  Sliders,
  CheckCircle2,
  Clock,
  HardDrive,
  Cpu,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';
import { fullRc4ProcessUint8Array } from '../crypto/rc4';

export interface BenchmarkSizeResult {
  sizeLabel: string;
  sizeBytes: number;
  rc4Times: number[];
  rc4AvgMs: number;
  rc4MinMs: number;
  rc4MaxMs: number;
  rc4ThroughputMBs: number;

  // Optional WebCrypto AES-GCM comparison
  aesTimes?: number[];
  aesAvgMs?: number;
  aesMinMs?: number;
  aesMaxMs?: number;
  aesThroughputMBs?: number;
}

export const BenchmarkView: React.FC = () => {
  // Configuration
  const [runsPerSize, setRunsPerSize] = useState<number>(5);
  const [includeAesGcm, setIncludeAesGcm] = useState<boolean>(true);

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPct, setProgressPct] = useState<number>(0);
  const [results, setResults] = useState<BenchmarkSizeResult[] | null>(null);

  // Chart display settings
  const [chartMetric, setChartMetric] = useState<'time' | 'throughput'>('time');
  const [chartScale, setChartScale] = useState<'linear' | 'log'>('linear');
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    series: 'rc4' | 'aes';
    x: number;
    y: number;
    label: string;
    value: string;
  } | null>(null);

  // Benchmark target sizes: 1 KB, 10 KB, 100 KB, 1 MB, 5 MB
  const SIZES = [
    { label: '1 KB', bytes: 1024 },
    { label: '10 KB', bytes: 10 * 1024 },
    { label: '100 KB', bytes: 100 * 1024 },
    { label: '1 MB', bytes: 1024 * 1024 },
    { label: '5 MB', bytes: 5 * 1024 * 1024 },
  ];

  // Run the full benchmark asynchronously
  const runBenchmark = async () => {
    setIsRunning(true);
    setResults(null);
    setProgressPct(0);

    const newResults: BenchmarkSizeResult[] = [];
    const totalSteps = SIZES.length;

    try {
      for (let sIdx = 0; sIdx < SIZES.length; sIdx++) {
        const item = SIZES[sIdx];
        setProgressMsg(`Đang khởi tạo dữ liệu ngẫu nhiên cho khối ${item.label}...`);
        setProgressPct(Math.round((sIdx / totalSteps) * 100));

        // Yield to browser UI thread
        await new Promise((r) => setTimeout(r, 20));

        // Generate pseudo-random data
        const data = new Uint8Array(item.bytes);
        // Fill pseudo-random bytes efficiently
        for (let i = 0; i < item.bytes; i += 65536) {
          const chunk = Math.min(65536, item.bytes - i);
          const sub = data.subarray(i, i + chunk);
          if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(sub);
          } else {
            for (let k = 0; k < chunk; k++) sub[k] = Math.floor(Math.random() * 256);
          }
        }

        // 16-byte random key
        const key = new Uint8Array(16);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
          crypto.getRandomValues(key);
        } else {
          for (let k = 0; k < 16; k++) key[k] = Math.floor(Math.random() * 256);
        }

        // 1. Measure RC4
        const rc4Times: number[] = [];
        for (let r = 0; r < runsPerSize; r++) {
          setProgressMsg(
            `Đo RC4: Khối ${item.label} (${(item.bytes / 1024).toFixed(0)} KB) - Lần chạy ${r + 1}/${runsPerSize}...`
          );
          await new Promise((r) => setTimeout(r, 5));

          const t0 = performance.now();
          fullRc4ProcessUint8Array(data, key, 0);
          const elapsed = performance.now() - t0;
          rc4Times.push(elapsed);
        }

        const rc4AvgMs = rc4Times.reduce((a, b) => a + b, 0) / rc4Times.length;
        const rc4MinMs = Math.min(...rc4Times);
        const rc4MaxMs = Math.max(...rc4Times);
        const sizeInMB = item.bytes / (1024 * 1024);
        const rc4ThroughputMBs = sizeInMB / (Math.max(0.0001, rc4AvgMs) / 1000);

        // 2. Measure WebCrypto AES-GCM (Optional comparison)
        let aesTimes: number[] | undefined;
        let aesAvgMs: number | undefined;
        let aesMinMs: number | undefined;
        let aesMaxMs: number | undefined;
        let aesThroughputMBs: number | undefined;

        if (includeAesGcm && typeof crypto !== 'undefined' && crypto.subtle) {
          try {
            const aesKey = await crypto.subtle.generateKey(
              { name: 'AES-GCM', length: 256 },
              true,
              ['encrypt']
            );

            aesTimes = [];
            for (let r = 0; r < runsPerSize; r++) {
              setProgressMsg(
                `Đo WebCrypto AES-GCM: Khối ${item.label} - Lần chạy ${r + 1}/${runsPerSize}...`
              );
              await new Promise((r) => setTimeout(r, 5));

              const iv = new Uint8Array(12);
              crypto.getRandomValues(iv);

              const t0 = performance.now();
              await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, data);
              const elapsed = performance.now() - t0;
              aesTimes.push(elapsed);
            }

            aesAvgMs = aesTimes.reduce((a, b) => a + b, 0) / aesTimes.length;
            aesMinMs = Math.min(...aesTimes);
            aesMaxMs = Math.max(...aesTimes);
            aesThroughputMBs = sizeInMB / (Math.max(0.0001, aesAvgMs) / 1000);
          } catch (e) {
            console.warn('WebCrypto AES-GCM benchmark error:', e);
          }
        }

        newResults.push({
          sizeLabel: item.label,
          sizeBytes: item.bytes,
          rc4Times,
          rc4AvgMs: Math.round(rc4AvgMs * 100) / 100,
          rc4MinMs: Math.round(rc4MinMs * 100) / 100,
          rc4MaxMs: Math.round(rc4MaxMs * 100) / 100,
          rc4ThroughputMBs: Math.round(rc4ThroughputMBs * 10) / 10,
          aesTimes,
          aesAvgMs: aesAvgMs !== undefined ? Math.round(aesAvgMs * 100) / 100 : undefined,
          aesMinMs: aesMinMs !== undefined ? Math.round(aesMinMs * 100) / 100 : undefined,
          aesMaxMs: aesMaxMs !== undefined ? Math.round(aesMaxMs * 100) / 100 : undefined,
          aesThroughputMBs:
            aesThroughputMBs !== undefined ? Math.round(aesThroughputMBs * 10) / 10 : undefined,
        });

        // Update progress
        setProgressPct(Math.round(((sIdx + 1) / totalSteps) * 100));
      }

      setResults(newResults);
    } catch (err: unknown) {
      alert(`Lỗi trong quá trình đo: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsRunning(false);
      setProgressMsg('');
    }
  };

  // Export results as JSON
  const handleExportJson = () => {
    if (!results) return;
    const jsonStr = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rc4_benchmark_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper values for SVG Line Chart
  const svgWidth = 840;
  const svgHeight = 340;
  const paddingLeft = 70;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 50;

  const chartInnerWidth = svgWidth - paddingLeft - paddingRight;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  // Calculate coordinates for points
  const pointsData = results?.map((r, i) => {
    const x = paddingLeft + (i / (results.length - 1)) * chartInnerWidth;
    const rc4Val = chartMetric === 'time' ? r.rc4AvgMs : r.rc4ThroughputMBs;
    const aesVal =
      r.aesAvgMs !== undefined
        ? chartMetric === 'time'
          ? r.aesAvgMs
          : r.aesThroughputMBs ?? 0
        : undefined;
    return {
      label: r.sizeLabel,
      bytes: r.sizeBytes,
      rc4Val,
      aesVal,
      x,
      r,
    };
  });

  // Calculate min & max Y
  const allYValues: number[] = [];
  pointsData?.forEach((p) => {
    if (p.rc4Val !== undefined) allYValues.push(p.rc4Val);
    if (p.aesVal !== undefined) allYValues.push(p.aesVal);
  });

  const rawMaxY = allYValues.length > 0 ? Math.max(...allYValues) : 100;
  const maxY = Math.max(1, rawMaxY * 1.15);
  const minY = 0;

  const getYCoord = (val: number) => {
    if (chartScale === 'log') {
      const logMin = Math.log10(Math.max(0.01, minY + 0.01));
      const logMax = Math.log10(Math.max(0.1, maxY));
      const logVal = Math.log10(Math.max(0.01, val));
      const ratio = (logVal - logMin) / (logMax - logMin);
      return paddingTop + chartInnerHeight - Math.max(0, Math.min(1, ratio)) * chartInnerHeight;
    }
    const ratio = (val - minY) / (maxY - minY);
    return paddingTop + chartInnerHeight - Math.max(0, Math.min(1, ratio)) * chartInnerHeight;
  };

  // Generate SVG path strings
  let rc4Path = '';
  let aesPath = '';

  if (pointsData && pointsData.length > 0) {
    rc4Path = pointsData
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${getYCoord(p.rc4Val)}`)
      .join(' ');

    if (includeAesGcm && pointsData.some((p) => p.aesVal !== undefined)) {
      aesPath = pointsData
        .filter((p) => p.aesVal !== undefined)
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${getYCoord(p.aesVal!)}`)
        .join(' ');
    }
  }

  // Y-axis grid ticks (4 ticks)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
    const val = minY + pct * (maxY - minY);
    return {
      val: Math.round(val * 10) / 10,
      y: getYCoord(val),
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>KIỂM THỬ ĐO LƯỜNG HIỆU NĂNG THỰC TẾ</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Đo Hiệu Năng & Thông Lượng RC4 (Performance Benchmark)
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed mt-1">
              Thực hiện mã hóa liên tục trên các khối dữ liệu ngẫu nhiên <strong className="text-cyan-300">1 KB, 10 KB, 100 KB, 1 MB, 5 MB</strong>, đo đạc thời gian bằng <code className="text-emerald-300 font-mono">performance.now()</code> với số lần lặp trung bình. Hiển thị đồ thị biểu diễn và bảng thông lượng (MB/s).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runBenchmark}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đo...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt Đầu Đo Hiệu Năng</span>
                </>
              )}
            </button>

            {results && (
              <button
                onClick={handleExportJson}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
                title="Tải kết quả dạng JSON"
              >
                <Download className="w-4 h-4 text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BENCHMARK CONFIGURATION CONTROLS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Cấu Hình Tham Số Kiểm Thử</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">5 khối kích thước chuẩn</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Runs per size */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              Số lần lặp mỗi khối (Tính trung bình):
            </label>
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              {[3, 5, 10].map((runs) => (
                <button
                  key={runs}
                  onClick={() => setRunsPerSize(runs)}
                  disabled={isRunning}
                  className={`flex-1 py-1.5 font-mono rounded-lg transition cursor-pointer ${
                    runsPerSize === runs
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {runs} lần
                </button>
              ))}
            </div>
          </div>

          {/* Toggle WebCrypto AES-GCM comparison */}
          <div className="flex flex-col justify-center">
            <label className="block font-semibold text-slate-300 mb-1.5">
              Đối chiếu WebCrypto AES-GCM:
            </label>
            <label className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeAesGcm}
                onChange={(e) => setIncludeAesGcm(e.target.checked)}
                disabled={isRunning}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
              <span className="text-slate-300">
                Bật so sánh AES-GCM <span className="text-amber-400 font-bold">(Tham khảo)</span>
              </span>
            </label>
          </div>

          {/* Technical scope note */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              RC4 được thực thi trực tiếp bằng JavaScript Scratch Engine (V8 JIT). AES-GCM được chạy qua WebCrypto API tăng tốc phần cứng AES-NI của CPU.
            </span>
          </div>
        </div>

        {/* Live Progress Bar when running */}
        {isRunning && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold">{progressMsg}</span>
              <span className="text-emerald-400 font-bold">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* BENCHMARK RESULTS (CHART & TABLE) */}
      {results && (
        <div className="space-y-8">
          {/* 1. INTERACTIVE SVG LINE CHART */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  Đồ Thị Biểu Diễn Hiệu Năng (Performance Line Chart)
                </h3>
              </div>

              {/* Chart metric & scale switchers */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Metric switcher */}
                <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setChartMetric('time')}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      chartMetric === 'time'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Thời gian (ms)
                  </button>
                  <button
                    onClick={() => setChartMetric('throughput')}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      chartMetric === 'throughput'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Thông lượng (MB/s)
                  </button>
                </div>

                {/* Scale switcher */}
                <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setChartScale('linear')}
                    className={`px-2.5 py-1 rounded-lg font-mono transition cursor-pointer ${
                      chartScale === 'linear'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Linear
                  </button>
                  <button
                    onClick={() => setChartScale('log')}
                    className={`px-2.5 py-1 rounded-lg font-mono transition cursor-pointer ${
                      chartScale === 'log'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    Log10
                  </button>
                </div>
              </div>
            </div>

            {/* SVG Canvas */}
            <div className="relative w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full min-w-[700px] h-auto select-none font-mono"
              >
                <defs>
                  <linearGradient id="gridCyanGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Background Grid Lines */}
                {yTicks.map((tick, i) => (
                  <g key={i}>
                    <line
                      x1={paddingLeft}
                      y1={tick.y}
                      x2={svgWidth - paddingRight}
                      y2={tick.y}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={tick.y + 4}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="end"
                    >
                      {tick.val}
                    </text>
                  </g>
                ))}

                {/* X-Axis labels */}
                {pointsData?.map((p, i) => (
                  <g key={i}>
                    <line
                      x1={p.x}
                      y1={paddingTop}
                      x2={p.x}
                      y2={svgHeight - paddingBottom}
                      stroke="#1e293b"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={svgHeight - paddingBottom + 20}
                      fill="#94a3b8"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}

                {/* Y-Axis Label */}
                <text
                  x={paddingLeft}
                  y={paddingTop - 12}
                  fill="#94a3b8"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {chartMetric === 'time' ? 'Thời gian trung bình (ms)' : 'Thông lượng (MB/s)'}
                </text>

                {/* RC4 Series Path */}
                {rc4Path && (
                  <path
                    d={rc4Path}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* WebCrypto AES Series Path */}
                {aesPath && (
                  <path
                    d={aesPath}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* RC4 Data Points */}
                {pointsData?.map((p, i) => {
                  const y = getYCoord(p.rc4Val);
                  return (
                    <g
                      key={`rc4-${i}`}
                      className="cursor-pointer"
                      onMouseEnter={() =>
                        setHoveredPoint({
                          index: i,
                          series: 'rc4',
                          x: p.x,
                          y,
                          label: `${p.label} (RC4)`,
                          value:
                            chartMetric === 'time'
                              ? `${p.rc4Val} ms`
                              : `${p.rc4Val} MB/s`,
                        })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle
                        cx={p.x}
                        cy={y}
                        r="6"
                        fill="#083344"
                        stroke="#22d3ee"
                        strokeWidth="3"
                      />
                      <text
                        x={p.x}
                        y={y - 12}
                        fill="#22d3ee"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {p.rc4Val}
                      </text>
                    </g>
                  );
                })}

                {/* AES-GCM Data Points */}
                {includeAesGcm &&
                  pointsData?.map((p, i) => {
                    if (p.aesVal === undefined) return null;
                    const y = getYCoord(p.aesVal);
                    return (
                      <g
                        key={`aes-${i}`}
                        className="cursor-pointer"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            index: i,
                            series: 'aes',
                            x: p.x,
                            y,
                            label: `${p.label} (WebCrypto AES-GCM)`,
                            value:
                              chartMetric === 'time'
                                ? `${p.aesVal} ms`
                                : `${p.aesVal} MB/s`,
                          })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        <rect
                          x={p.x - 5}
                          y={y - 5}
                          width="10"
                          height="10"
                          fill="#451a03"
                          stroke="#fbbf24"
                          strokeWidth="2.5"
                        />
                        <text
                          x={p.x}
                          y={y + 18}
                          fill="#fbbf24"
                          fontSize="9.5"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {p.aesVal}
                        </text>
                      </g>
                    );
                  })}
              </svg>

              {/* Tooltip Popup on Hover */}
              {hoveredPoint && (
                <div
                  className="absolute pointer-events-none p-2.5 rounded-xl bg-slate-950/95 border border-cyan-500/50 text-xs font-mono shadow-2xl text-white transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${(hoveredPoint.x / svgWidth) * 100}%`,
                    top: `${(hoveredPoint.y / svgHeight) * 100}%`,
                  }}
                >
                  <div className="font-bold text-cyan-300">{hoveredPoint.label}</div>
                  <div className="text-white mt-0.5">{hoveredPoint.value}</div>
                </div>
              )}
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-cyan-400 rounded-full"></span>
                <span className="w-3 h-3 rounded-full border-2 border-cyan-400 bg-cyan-950"></span>
                <span className="text-cyan-300 font-bold">
                  RC4 (Pure TypeScript Scratch Engine)
                </span>
              </div>

              {includeAesGcm && (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-400"></span>
                  <span className="w-3 h-3 border-2 border-amber-400 bg-amber-950"></span>
                  <span className="text-amber-300 font-bold">
                    WebCrypto AES-GCM (Hardware AES-NI - Đối chiếu tham khảo)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. DETAILED THROUGHPUT (MB/s) TABLE */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Bảng Thông Lượng & Thời Gian Chi Tiết (Throughput & Latency Table)
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Tính trung bình qua {runsPerSize} lần đo mỗi khối
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-3 px-3.5">Khối dữ liệu</th>
                    <th className="py-3 px-3.5">Dung lượng (Bytes)</th>
                    <th className="py-3 px-3.5">Thời gian TB RC4 (ms)</th>
                    <th className="py-3 px-3.5">Thông lượng RC4 (MB/s)</th>
                    <th className="py-3 px-3.5">Min / Max RC4 (ms)</th>
                    {includeAesGcm && (
                      <>
                        <th className="py-3 px-3.5 text-amber-400">AES-GCM TB (ms)</th>
                        <th className="py-3 px-3.5 text-amber-400">Thông lượng AES (MB/s)</th>
                      </>
                    )}
                    <th className="py-3 px-3.5 text-center">Đánh giá tính chất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {results.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/80 transition text-slate-300">
                      <td className="py-3 px-3.5 font-bold text-white">{r.sizeLabel}</td>
                      <td className="py-3 px-3.5 text-slate-400">
                        {r.sizeBytes.toLocaleString()} B
                      </td>
                      <td className="py-3 px-3.5 text-cyan-300 font-bold">{r.rc4AvgMs} ms</td>
                      <td className="py-3 px-3.5 text-emerald-400 font-bold text-sm">
                        {r.rc4ThroughputMBs} MB/s
                      </td>
                      <td className="py-3 px-3.5 text-slate-400 text-[11px]">
                        {r.rc4MinMs} / {r.rc4MaxMs} ms
                      </td>
                      {includeAesGcm && (
                        <>
                          <td className="py-3 px-3.5 text-amber-300 font-bold">
                            {r.aesAvgMs !== undefined ? `${r.aesAvgMs} ms` : '---'}
                          </td>
                          <td className="py-3 px-3.5 text-amber-400 font-bold text-sm">
                            {r.aesThroughputMBs !== undefined ? `${r.aesThroughputMBs} MB/s` : '---'}
                          </td>
                        </>
                      )}
                      <td className="py-3 px-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                          Tuyến tính O(n)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Technical Analysis Note */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
              <div className="flex items-center gap-2 text-amber-30 tập font-bold">
                <Info className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">Nhận Xét Kỹ Thuật Về Độ Phức Tạp & Thông Lượng</span>
              </div>
              <ul className="space-y-1 list-disc list-inside text-slate-400">
                <li>
                  <strong className="text-cyan-300">Tính tuyến tính <code className="font-mono text-cyan-300">O(n)</code>:</strong> Thời gian thực thi của thuật toán RC4 tăng tỉ lệ thuận trực tiếp với kích thước dữ liệu (khối 5 MB gấp ~5 lần khối 1 MB), bởi vì mỗi byte đầu ra đòi hỏi số phép toán hoán đổi và XOR không đổi.
                </li>
                <li>
                  <strong className="text-amber-300">Đối chiếu WebCrypto AES-GCM:</strong> WebCrypto AES-GCM được tăng tốc trực tiếp bằng phần cứng CPU (AES-NI Instructions) và thực thi trong C++ engine của trình duyệt, do đó đạt thông lượng cực đại trên các khối lớn. RC4 ở đây thể hiện sức mạnh của thuật toán mật mã dòng phần mềm gọn nhẹ, chạy độc lập không cần thư viện ngoài.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* INITIAL PROMPT IF NOT RUN YET */}
      {!results && !isRunning && (
        <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Chưa Có Dữ Liệu Đo Lường</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Nhấn nút <strong>"Bắt Đầu Đo Hiệu Năng"</strong> để chạy thử nghiệm trên 5 khối kích thước (1 KB, 10 KB, 100 KB, 1 MB, 5 MB) và tạo biểu đồ thông lượng.
            </p>
          </div>
          <button
            onClick={runBenchmark}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Chạy Kiểm Thử Ngay</span>
          </button>
        </div>
      )}
    </div>
  );
};
