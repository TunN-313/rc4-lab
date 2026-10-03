import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Laptop, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // If already running in standalone mode, show clean installed badge
  if (isInstalled) {
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
        <Check className="w-3 h-3 text-emerald-400" />
        <span>Đã Cài Đặt PWA</span>
      </span>
    );
  }

  // Chromium / Android / Desktop direct prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition cursor-pointer ${
          compact ? 'px-2.5 py-1.5' : 'px-3.5 py-1.5'
        }`}
        title="Cài đặt RC4 Lab về máy tính / điện thoại để sử dụng ngoại tuyến"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Cài Đặt Ứng Dụng</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-medium transition cursor-pointer ${
            compact ? 'px-2.5 py-1.5' : 'px-3.5 py-1.5'
          }`}
          title="Cài đặt lên iPhone/iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cài Đặt iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <span>Cài Đặt Trên iPhone / iPad</span>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                <p>
                  Trình duyệt Safari trên iOS không hỗ trợ tự động hiển thị hộp thoại cài đặt. Bạn có thể cài đặt thủ công trong 2 bước:
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center font-bold shrink-0 text-[10px]">
                      1
                    </span>
                    <span>
                      Nhấn vào nút <strong>Chia sẻ (Share)</strong> trên thanh công cụ dưới đáy Safari (biểu tượng hình vuông có mũi tên trỏ lên).
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center font-bold shrink-0 text-[10px]">
                      2
                    </span>
                    <span>
                      Cuộn xuống danh sách và chọn <strong>Thêm vào MH chính (Add to Home Screen)</strong>.
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400">
                  ✓ Sau khi thêm, bạn có thể khởi chạy RC4 Lab toàn màn hình như một ứng dụng Native và sử dụng ngoại tuyến không cần Internet.
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop install guidance button if ambient browser prompt not fired yet
  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className={`flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-medium transition cursor-pointer ${
          compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
        }`}
        title="Hướng dẫn cài đặt ứng dụng PWA"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span>Cài Đặt Ứng Dụng</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Laptop className="w-5 h-5 text-cyan-400" />
                <span>Cài Đặt RC4 Lab Về Máy</span>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                Để cài đặt RC4 Lab dưới dạng ứng dụng độc lập trên Chrome, Edge hoặc Brave:
              </p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center font-bold shrink-0 text-[10px]">
                    1
                  </span>
                  <span>
                    Nhìn vào góc phải thanh địa chỉ URL của trình duyệt (Omnibox).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700 text-cyan-300 flex items-center justify-center font-bold shrink-0 text-[10px]">
                    2
                  </span>
                  <span>
                    Nhấn vào biểu tượng <strong>Cài đặt (Install / Màn hình máy tính)</strong> hoặc mở menu <code>...</code> $\rightarrow$ <strong>Cài đặt RC4 Lab</strong>.
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-400">
                ✓ Ứng dụng hỗ trợ chạy ngoại tuyến toàn diện (offline), lưu trữ cục bộ mảng trạng thái hoán vị S và các công cụ mật mã mà không cần kết nối mạng.
              </p>
            </div>

            <button
              onClick={() => setShowDesktopGuide(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
