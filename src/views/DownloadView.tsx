import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Terminal,
  FileCode,
  ShieldAlert,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Code2,
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  rc4EncryptBytes,
  bytesToHex,
  hexToBytes,
  stringToBytes,
  bytesToString,
  bytesToBase64,
  STANDARD_TEST_VECTORS,
} from '../crypto/rc4';
import cliCode from '../../public/rc4_cli.py?raw';

export const DownloadView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // In-Browser Interactive CLI Simulator states
  const [cliMode, setCliMode] = useState<'encrypt' | 'decrypt' | 'test'>('encrypt');
  const [cliKey, setCliKey] = useState('Key');
  const [cliInputType, setCliInputType] = useState<'text' | 'hex'>('text');
  const [cliInputData, setCliInputData] = useState('Plaintext');
  const [cliFormat, setCliFormat] = useState<'hex' | 'base64' | 'text'>('hex');
  const [cliDropN, setCliDropN] = useState<number>(0);
  const [cliOutput, setCliOutput] = useState<string>('');
  const [cliRunning, setCliRunning] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(cliCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyCommand = async (cmd: string, id: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 2000);
    } catch {
      // fallback
    }
  };

  // Simulate CLI Execution in Browser
  const runSimulatedCLI = () => {
    setCliRunning(true);
    setTimeout(() => {
      try {
        if (cliMode === 'test') {
          let testLog = '=================================================================\n';
          testLog += '  RC4 LAB CLI - BỘ KIỂM ĐỊNH TEST VECTORS CHUẨN MẬT MÃ HỌC\n';
          testLog += '=================================================================\n\n';

          let allPass = true;
          STANDARD_TEST_VECTORS.forEach((tv, idx) => {
            const cipher = rc4EncryptBytes(stringToBytes(tv.keyText), stringToBytes(tv.plaintext));
            const actualHex = bytesToHex(cipher.ciphertextBytes);
            const passed = actualHex.toUpperCase() === tv.expectedCipherHex.toUpperCase();
            if (!passed) allPass = false;

            testLog += `${passed ? '[PASSED]' : '[FAILED]'} Test #${idx + 1}: ${tv.name}\n`;
            testLog += `  Key       : ${tv.keyText}\n`;
            testLog += `  Plaintext : ${tv.plaintext}\n`;
            testLog += `  Expected  : ${tv.expectedCipherHex}\n`;
            testLog += `  Actual    : ${actualHex}\n\n`;
          });

          // Round-trip test
          testLog += '--- Kiểm Tra Round-Trip (Mã hóa -> Giải mã lại) ---\n';
          const sample = 'Xin chào Việt Nam! Mật mã học RC4 Stream Cipher 2026.';
          const sampleKey = 'ChuyenNganhATTT';
          const enc = rc4EncryptBytes(stringToBytes(sampleKey), stringToBytes(sample));
          const dec = rc4EncryptBytes(stringToBytes(sampleKey), enc.ciphertextBytes);
          const recovered = bytesToString(dec.ciphertextBytes);
          const rtPass = recovered === sample;
          testLog += `${rtPass ? '[PASSED]' : '[FAILED]'} Round-trip Unicode: ${recovered}\n\n`;

          testLog += '=================================================================\n';
          testLog += allPass
            ? '  KẾT QUẢ: 100% CÁC TEST VECTORS ĐÃ VƯỢT QUA CHUẨN XÁC!\n'
            : '  KẾT QUẢ: CÓ CA KIỂM THỬ THẤT BẠI!\n';
          testLog += '=================================================================';
          setCliOutput(testLog);
        } else {
          // Encrypt or Decrypt
          if (!cliKey.trim()) {
            setCliOutput('Lỗi: Bạn phải cung cấp khóa bí mật thông qua --key hoặc --key-hex.');
            setCliRunning(false);
            return;
          }

          const keyBytes = stringToBytes(cliKey);
          let inputBytes: number[];

          if (cliInputType === 'hex') {
            try {
              inputBytes = hexToBytes(cliInputData.replace(/\s+/g, ''));
            } catch {
              setCliOutput('Lỗi: Chuỗi hex đầu vào không hợp lệ.');
              setCliRunning(false);
              return;
            }
          } else {
            inputBytes = stringToBytes(cliInputData);
          }

          // RC4 crypt (symmetric)
          const result = rc4EncryptBytes(keyBytes, inputBytes, cliDropN);
          const outBytes = result.ciphertextBytes;

          if (cliFormat === 'hex') {
            setCliOutput(bytesToHex(outBytes));
          } else if (cliFormat === 'base64') {
            setCliOutput(bytesToBase64(outBytes));
          } else if (cliFormat === 'text') {
            try {
              setCliOutput(bytesToString(outBytes));
            } catch {
              setCliOutput(
                'Cảnh báo: Dữ liệu không thể giải mã thành UTF-8 hợp lệ. Hiển thị dạng Hex thay thế:\n' +
                  bytesToHex(outBytes)
              );
            }
          }
        }
      } catch (err: unknown) {
        setCliOutput(`Lỗi xử lý RC4: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setCliRunning(false);
      }
    }, 150);
  };

  // Construct current simulated command string
  const getConstructedCliCmd = () => {
    if (cliMode === 'test') {
      return 'python rc4_cli.py --test';
    }
    const modeStr = cliMode;
    const keyParam = `--key "${cliKey}"`;
    const inputParam =
      cliInputType === 'hex' ? `--hex "${cliInputData}"` : `--text "${cliInputData}"`;
    const formatParam = cliFormat !== 'hex' ? ` --format ${cliFormat}` : '';
    const dropParam = cliDropN > 0 ? ` --drop ${cliDropN}` : '';
    return `python rc4_cli.py ${modeStr} ${keyParam} ${inputParam}${formatParam}${dropParam}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. Header & Academic Safety Notice */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>STANDALONE TOOLS // PWA & PYTHON CLI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tải Về RC4 CLI & Cài Đặt Ứng Dụng PWA
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Tải về bộ công cụ dòng lệnh (Command-Line Interface) Python 3 độc lập không phụ thuộc thư viện ngoài, hoặc cài đặt trực tiếp RC4 Lab về máy tính / điện thoại di động dưới dạng Progressive Web App (PWA) để học tập và mô phỏng ngoại tuyến (Offline).
        </p>

        {/* Academic Safety Warning Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300">
              CẢNH BÁO AN TOÀN MẬT MÃ HỌC (RFC 7465):
            </span>
            <p className="text-slate-300 leading-relaxed">
              Mã nguồn Python <code className="text-amber-300 font-mono">rc4_cli.py</code> và toàn bộ thuật toán trong ứng dụng này chỉ phục vụ mục đích học tập, thực nghiệm tấn công mật mã và giảng dạy an toàn thông tin. RC4 chứa điểm yếu thiên vị byte đầu và không an toàn cho bất kỳ hệ thống sản xuất hay bảo vệ dữ liệu nhạy cảm nào trong thực tế.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Top Action Highlights: Download Python CLI & PWA Install */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Python CLI Card */}
        <div className="bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>rc4_cli.py</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-900/60 border border-cyan-700 text-cyan-300 font-mono">
                      Python 3
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Công cụ dòng lệnh RC4 độc lập (Zero-dependency)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                ~8.3 KB
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Chạy trực tiếp với trình thông dịch Python 3 tiêu chuẩn mà không cần cài đặt thêm thư viện (chỉ dùng thư viện có sẵn <code className="text-cyan-300">sys</code>, <code className="text-cyan-300">argparse</code>, <code className="text-cyan-300">base64</code>). Hỗ trợ mã hóa/giải mã văn bản, hex, Base64, đường ống STDIN và tích hợp sẵn 4 bộ Test Vectors chuẩn RFC.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mã hóa / Giải mã đối xứng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Xuất Hex, Base64, UTF-8</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kiểm định --test tự động</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hỗ trợ RC4-drop[n]</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800/80">
            <a
              href="/rc4_cli.py"
              download="rc4_cli.py"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải rc4_cli.py (.py)</span>
            </a>
            <button
              onClick={handleCopyCode}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép mã</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PWA Offline Installation Card */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>RC4 Lab PWA</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-900/60 border border-emerald-700 text-emerald-300 font-mono">
                      Offline Ready
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Ứng dụng Web Cấp Tiến (Progressive Web App)</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                Service Worker
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Cài đặt RC4 Lab trực tiếp lên máy tính (Windows, macOS, Linux) hoặc thiết bị di động (Android, iOS) thông qua trình duyệt. Hoạt động như một phần mềm độc lập không viền, cho phép mô phỏng mảng trạng thái hoán vị S (lưới 16x16 để quan sát), chạy thử nghiệm thiên vị và mã hóa kể cả khi mất mạng.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hoạt động 100% khi mất mạng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Giao diện độc lập (Standalone)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Khởi chạy từ Desktop / Màn hình chính</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tự động cập nhật bản mới</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Cài đặt trực tiếp vào hệ điều hành:</span>
            <PWAInstallButton />
          </div>
        </div>
      </section>

      {/* 3. In-Browser Interactive CLI Simulator */}
      <section className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Trình Thử Nghiệm CLI Trực Tiếp Trong Trình Duyệt</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-300">
                  Interactive Simulator
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Thử nghiệm tương đương các tham số của <code className="text-cyan-300">rc4_cli.py</code> trước khi chạy trên máy thật
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCliMode('encrypt');
              setCliKey('Key');
              setCliInputType('text');
              setCliInputData('Plaintext');
              setCliFormat('hex');
              setCliDropN(0);
              setCliOutput('');
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>
        </div>

        {/* Simulator Form Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          {/* Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Chế độ (Mode)</label>
            <div className="grid grid-cols-3 gap-1">
              {(['encrypt', 'decrypt', 'test'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setCliMode(m)}
                  className={`py-1.5 text-xs font-mono rounded-lg border transition cursor-pointer ${
                    cliMode === m
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {m === 'test' ? '--test' : m}
                </button>
              ))}
            </div>
          </div>

          {cliMode !== 'test' && (
            <>
              {/* Key */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Khóa bí mật (--key)
                </label>
                <input
                  type="text"
                  value={cliKey}
                  onChange={(e) => setCliKey(e.target.value)}
                  placeholder="Nhập khóa..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Input Data */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Dữ liệu đầu vào</label>
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      onClick={() => setCliInputType('text')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        cliInputType === 'text'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'text-slate-500'
                      }`}
                    >
                      --text
                    </button>
                    <button
                      onClick={() => setCliInputType('hex')}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${
                        cliInputType === 'hex'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'text-slate-500'
                      }`}
                    >
                      --hex
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={cliInputData}
                  onChange={(e) => setCliInputData(e.target.value)}
                  placeholder={cliInputType === 'hex' ? 'BBF316E8...' : 'Văn bản...'}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Format & Drop */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Định dạng</label>
                  <select
                    value={cliFormat}
                    onChange={(e) => setCliFormat(e.target.value as 'hex' | 'base64' | 'text')}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="hex">hex</option>
                    <option value="base64">base64</option>
                    <option value="text">text</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bỏ byte (--drop)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="4096"
                    value={cliDropN}
                    onChange={(e) => setCliDropN(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </>
          )}

          {cliMode === 'test' && (
            <div className="md:col-span-3 flex items-center text-xs text-slate-400 italic">
              Chế độ --test sẽ tự động kích hoạt bộ 4 Test Vectors mật mã chuẩn (RFC 6229, Wikipedia, Tactical Dawn) và kiểm tra vòng tròn Unicode round-trip.
            </div>
          )}
        </div>

        {/* Live Command Line Display */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-cyan-500/30">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono text-cyan-300 py-1">
            <span className="text-slate-500 select-none">$</span>
            <span className="font-semibold whitespace-nowrap">{getConstructedCliCmd()}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleCopyCommand(getConstructedCliCmd(), 'sim-cmd')}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedCmd === 'sim-cmd' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép lệnh</span>
                </>
              )}
            </button>
            <button
              onClick={runSimulatedCLI}
              disabled={cliRunning}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{cliRunning ? 'Đang chạy...' : 'Chạy Lệnh CLI'}</span>
            </button>
          </div>
        </div>

        {/* Simulated Terminal Output Box */}
        {cliOutput && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                STDOUT / KẾT QUẢ TRẢ VỀ (Exit Code: 0)
              </span>
              <button
                onClick={() => handleCopyCommand(cliOutput, 'stdout')}
                className="hover:text-white transition flex items-center gap-1"
              >
                {copiedCmd === 'stdout' ? (
                  <span className="text-emerald-400">Đã sao chép</span>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Sao chép kết quả</span>
                  </>
                )}
              </button>
            </div>
            <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-60 overflow-y-auto">
              {cliOutput}
            </pre>
          </div>
        )}
      </section>

      {/* 4. Complete Command Examples & Usage Guide */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileCode className="w-5 h-5 text-cyan-400" />
          <span>Tài Liệu Hướng Dẫn Sử Dụng & Ví Dụ Mẫu (CLI Cheat Sheet)</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Example 1 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">
                1. Mã hóa văn bản xuất chuỗi Hex (Chuẩn RFC)
              </span>
              <button
                onClick={() =>
                  handleCopyCommand('python rc4_cli.py encrypt --key Key --text Plaintext', 'cmd-1')
                }
                className="text-slate-400 hover:text-white"
              >
                {copiedCmd === 'cmd-1' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <code className="block p-2 rounded bg-slate-900 text-xs font-mono text-slate-200 overflow-x-auto">
              python rc4_cli.py encrypt --key Key --text Plaintext
            </code>
            <p className="text-[11px] text-slate-400">
              Kết quả xuất chuỗi Hex chuẩn: <code className="text-emerald-400 font-mono">BBF316E8D940AF0AD3</code>
            </p>
          </div>

          {/* Example 2 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">
                2. Giải mã chuỗi Hex về văn bản UTF-8
              </span>
              <button
                onClick={() =>
                  handleCopyCommand(
                    'python rc4_cli.py decrypt --key Key --hex BBF316E8D940AF0AD3 --format text',
                    'cmd-2'
                  )
                }
                className="text-slate-400 hover:text-white"
              >
                {copiedCmd === 'cmd-2' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <code className="block p-2 rounded bg-slate-900 text-xs font-mono text-slate-200 overflow-x-auto">
              python rc4_cli.py decrypt --key Key --hex BBF316E8D940AF0AD3 --format text
            </code>
            <p className="text-[11px] text-slate-400">
              Kết quả giải mã hoàn nguyên: <code className="text-emerald-400 font-mono">Plaintext</code>
            </p>
          </div>

          {/* Example 3 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">
                3. Mã hóa xuất định dạng Base64
              </span>
              <button
                onClick={() =>
                  handleCopyCommand(
                    'python rc4_cli.py encrypt --key "MatKhau123" --text "Du lieu bi mat" --format base64',
                    'cmd-3'
                  )
                }
                className="text-slate-400 hover:text-white"
              >
                {copiedCmd === 'cmd-3' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <code className="block p-2 rounded bg-slate-900 text-xs font-mono text-slate-200 overflow-x-auto">
              python rc4_cli.py encrypt --key "MatKhau123" --text "Du lieu bi mat" --format base64
            </code>
            <p className="text-[11px] text-slate-400">
              Thích hợp cho việc truyền tải qua URL, JSON hoặc giao thức HTTP.
            </p>
          </div>

          {/* Example 4 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">
                4. Chạy bộ kiểm định Test Vectors chuẩn
              </span>
              <button
                onClick={() => handleCopyCommand('python rc4_cli.py --test', 'cmd-4')}
                className="text-slate-400 hover:text-white"
              >
                {copiedCmd === 'cmd-4' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <code className="block p-2 rounded bg-slate-900 text-xs font-mono text-slate-200 overflow-x-auto">
              python rc4_cli.py --test
            </code>
            <p className="text-[11px] text-slate-400">
              Kiểm tra tính tuân thủ 100% các vector mật mã chuẩn trong RFC 6229 và Wikipedia.
            </p>
          </div>

          {/* Example 5 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">
                5. Kỹ thuật đường ống STDIN (Linux / macOS / PowerShell)
              </span>
              <button
                onClick={() =>
                  handleCopyCommand(
                    'cat file.txt | python rc4_cli.py encrypt --key "MyKey" > file.enc',
                    'cmd-5'
                  )
                }
                className="text-slate-400 hover:text-white"
              >
                {copiedCmd === 'cmd-5' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <code className="block p-2 rounded bg-slate-900 text-xs font-mono text-slate-200 overflow-x-auto">
              cat file.txt | python rc4_cli.py encrypt --key "MyKey" &gt; file.enc
            </code>
            <p className="text-[11px] text-slate-400">
              Xử lý file dữ liệu lớn thông qua luồng byte nhị phân tiêu chuẩn.
            </p>
          </div>

          {/* Example 6 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">
                6. Biến thể RC4-drop[n] khắc phục thiên vị byte đầu
              </span>
              <button
                onClick={() =>
                  handleCopyCommand(
                    'python rc4_cli.py encrypt --key "SafeKey" --text "Payload" --drop 768',
                    'cmd-6'
                  )
                }
                className="text-slate-400 hover:text-white"
              >
                {copiedCmd === 'cmd-6' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <code className="block p-2 rounded bg-slate-900 text-xs font-mono text-slate-200 overflow-x-auto">
              python rc4_cli.py encrypt --key "SafeKey" --text "Payload" --drop 768
            </code>
            <p className="text-[11px] text-slate-400">
              Vứt bỏ 768 byte dòng khóa đầu để triệt tiêu các mối tương quan Mantin-Shamir.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Full Source Code Viewer */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Toàn Bộ Mã Nguồn rc4_cli.py</h3>
              <p className="text-xs text-slate-400">
                Tệp Python duy nhất ({cliCode.split('\n').length} dòng), sạch sẽ, chú thích chi tiết bằng tiếng Việt
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
            <a
              href="/rc4_cli.py"
              download="rc4_cli.py"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file .py</span>
            </a>
          </div>
        </div>

        {/* Code display with line numbers */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-2 text-slate-300 font-semibold">rc4_cli.py</span>
            </div>
            <span>{cliCode.split('\n').length} dòng • UTF-8</span>
          </div>
          <div className="max-h-[460px] overflow-y-auto p-4 font-mono text-xs text-slate-300 leading-relaxed">
            <pre className="whitespace-pre">
              {cliCode.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-900/50">
                  <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
