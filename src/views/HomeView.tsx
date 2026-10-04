import React from 'react';
import {
  ShieldAlert,
  Binary,
  Cpu,
  Zap,
  ArrowRight,
  BookOpen,
  Award,
  Lock,
  Layers,
  FileCode2,
  Clock,
  History,
  TrendingDown,
  Sparkles,
  Download,
  Calculator,
} from 'lucide-react';
import type { NavTab } from '../components/Navbar';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/40 p-8 sm:p-12 shadow-2xl shadow-cyan-950/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Nền tảng học thuật & Giả lập Mật mã học trực quan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Khám Phá Bản Chất <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              Mã Hóa Dòng RC4
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            <strong>RC4</strong> (viết tắt của <em>Rivest Cipher 4</em>, đôi khi gọi là <em>Ron's Code 4</em>) là thuật toán mã hóa dòng đối xứng được phát minh vào năm <strong>1987</strong> bởi nhà mật mã học lừng danh <strong>Ron Rivest</strong> tại RSA Data Security. Với sự tinh gọn đáng kinh ngạc — chỉ cần một mảng 256 byte và vài phép cộng theo modulo — RC4 từng bảo vệ hơn 50% lưu lượng Internet toàn cầu trước khi bị phát hiện các điểm yếu toán học nghiêm trọng.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigate('visualizer')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Mô Phỏng Ma Trận 16x16</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('hand_calculation')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/30 text-amber-200 font-semibold text-sm transition cursor-pointer shadow-lg shadow-amber-500/10"
            >
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>Ví Dụ Tính Tay TinyRC4</span>
            </button>

            <button
              onClick={() => onNavigate('cipher')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-200 font-medium text-sm transition cursor-pointer"
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Công Cụ Mã Hóa & Giải Mã</span>
            </button>

            <button
              onClick={() => onNavigate('experiments')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-200 font-medium text-sm transition cursor-pointer"
            >
              <Binary className="w-4 h-4 text-emerald-400" />
              <span>Phòng Thực Nghiệm Thiên Vị</span>
            </button>

            <button
              onClick={() => onNavigate('download')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 hover:bg-slate-800 text-cyan-300 font-medium text-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Tải Về CLI & Cài PWA</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Badge grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Tác giả & Năm</div>
            <div className="text-base font-bold text-white mt-1">Ron Rivest (1987)</div>
            <div className="text-[11px] text-slate-400">RSA Data Security Inc.</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Loại Mật Mã</div>
            <div className="text-base font-bold text-white mt-1">Stream Cipher</div>
            <div className="text-[11px] text-slate-400">Mã hóa dòng đối xứng</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Độ Dài Khóa</div>
            <div className="text-base font-bold text-white mt-1">40 – 2048 bits</div>
            <div className="text-[11px] text-slate-400">Tương đương 1 – 256 bytes</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <div className="text-[11px] font-mono text-rose-400 uppercase tracking-wider">Hiện Trạng</div>
            <div className="text-base font-bold text-rose-300 mt-1">Đã Bị Cấm (2015)</div>
            <div className="text-[11px] text-slate-400">Theo chuẩn RFC 7465</div>
          </div>
        </div>
      </section>

      {/* Concept Architecture: What is a Stream Cipher? */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Mã Hóa Dòng (Stream Cipher) Là Gì?</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Khác với các thuật toán <strong>mã hóa khối (Block cipher)</strong> như AES hoặc DES phải gom dữ liệu thành từng khối cố định (128-bit hay 64-bit) và cần cơ chế đệm (padding), một <strong>mã hóa dòng (Stream cipher)</strong>:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
              <span><strong>Sinh dòng khóa giả ngẫu nhiên (Keystream):</strong> Thuật toán dùng một khóa bí mật ban đầu để liên tục tạo ra chuỗi byte ngẫu nhiên <code className="font-mono text-emerald-300">K₀, K₁, K₂, …</code></span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
              <span><strong>Mã hóa tức thời theo từng byte/bit:</strong> Mỗi byte bản rõ <code className="font-mono text-cyan-300">Pᵢ</code> được kết hợp với một byte dòng khóa <code className="font-mono text-emerald-300">Kᵢ</code> tương ứng bằng phép toán logic <strong>XOR (⊕)</strong>: <code className="font-mono text-cyan-300">Cᵢ = Pᵢ ⊕ Kᵢ</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
              <span><strong>Độ trễ bằng 0 và không cần đệm:</strong> Dữ liệu có thể được mã hóa và truyền đi ngay khi xuất hiện trên đường truyền (lý tưởng cho streaming âm thanh, video hoặc truyền thông mạng cũ).</span>
            </li>
          </ul>

          {/* Math illustration */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/20 font-mono text-xs space-y-1 text-cyan-300">
            <div className="text-slate-500">// Công thức cốt lõi đối xứng tuyệt đối:</div>
            <div>Bản mã hóa : C[i] = P[i] ⊕ K[i]</div>
            <div>Bản giải mã : P[i] = C[i] ⊕ K[i]  (vì K[i] ⊕ K[i] = 0)</div>
          </div>
        </div>

        {/* The 1994 Leak Story */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">Vụ Rò Rỉ Nổi Tiếng Năm 1994</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Vào thời điểm ra đời (1987), RC4 là <strong>bí mật thương mại độc quyền</strong> thuộc sở hữu của công ty RSA Data Security. Các nhà sản xuất phần mềm phải trả tiền bản quyền đắt đỏ và ký cam kết bảo mật nghiêm ngặt (NDA) để được nhúng RC4.
          </p>
          <div className="space-y-2.5 text-xs text-slate-300">
            <p>
              Tuy nhiên, vào tháng <strong>9 năm 1994</strong>, một lập trình viên ẩn danh đã dịch ngược mã nhị phân và đăng tải toàn bộ mã nguồn C chính xác của RC4 lên danh sách thư điện tử <em>Cypherpunks</em> và nhóm tin <em>sci.crypt</em>.
            </p>
            <p>
              Do cái tên "RC4" đã được đăng ký nhãn hiệu, cộng đồng mã nguồn mở và các dự án bảo mật đã gọi phiên bản công khai này là <strong>ARCFOUR</strong> hoặc <strong>ARC4</strong> (<em>Alleged RC4</em>). Việc lộ diện này đã mở ra kỷ nguyên phân tích mã chuyên sâu kéo dài hàng thập kỷ.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
            <strong>Bài học mật mã học:</strong> "Bảo mật thông qua sự mập mờ" (Security through Obscurity) luôn thất bại. Mật mã học hiện đại yêu cầu thiết kế mở để cả thế giới cùng tấn công thử nghiệm (Nguyên lý Kerckhoffs).
          </div>
        </div>
      </section>

      {/* Structural Pipeline Diagram */}
      <section className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl font-bold text-white">Kiến Trúc Hai Giai Đoạn Của RC4</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            RC4 hoạt động hoàn toàn dựa trên một mảng trạng thái <code className="font-mono text-cyan-300">S</code> gồm 256 byte thông qua hai giải thuật tuần tự:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-center">
          {/* Box 1: Khởi tạo */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-700 space-y-3 relative group hover:border-cyan-400 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">Bước 1</span>
              <div className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px] font-mono">
                1 - 256 bytes
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Khóa Bí Mật & Mảng S</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Khởi tạo mảng <code className="font-mono text-cyan-300">S</code> với <code className="font-mono text-cyan-300">S[0]=0, S[1]=1, …, S[255]=255</code>. Khóa biến thiên <code className="font-mono text-emerald-300">K</code> được nạp vào bộ nhớ để chuẩn bị quá trình xáo trộn.
            </p>
            <div className="font-mono text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              for i = 0 to 255:<br />
              &nbsp;&nbsp;S[i] = i
            </div>
          </div>

          {/* Box 2: KSA */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3 relative group hover:border-cyan-300 transition shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">Bước 2</span>
              <div className="px-2 py-0.5 rounded bg-cyan-900 border border-cyan-700 text-cyan-200 text-[10px] font-mono">
                256 Vòng Trộn
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Thuật Toán KSA</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Key-Scheduling Algorithm:</strong> Dùng khóa để xáo trộn hoán vị mảng <code className="font-mono text-cyan-300">S</code>. Biến con trỏ <code className="font-mono text-amber-300">j</code> cập nhật dựa trên giá trị khóa và phần tử <code className="font-mono text-cyan-300">S[i]</code>.
            </p>
            <div className="font-mono text-[11px] text-cyan-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              j = (j + S[i] + key[i % len]) mod 256<br />
              swap(S[i], S[j])
            </div>
          </div>

          {/* Box 3: PRGA */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-3 relative group hover:border-emerald-300 transition shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">Bước 3</span>
              <div className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono">
                Vô Hạn Bytes
              </div>
            </div>
            <h3 className="text-base font-bold text-white">Thuật Toán PRGA & XOR</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Pseudo-Random Generation:</strong> Liên tục biến đổi <code className="font-mono text-cyan-300">S</code> để sinh byte dòng khóa <code className="font-mono text-emerald-300">Kₜ</code>, sau đó XOR với bản rõ để tạo ra bản mã hóa.
            </p>
            <div className="font-mono text-[11px] text-emerald-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              t = (S[i] + S[j]) mod 256<br />
              K = S[t]; C = P ⊕ K
            </div>
          </div>
        </div>
      </section>

      {/* Technical Summary Specs Table */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Bảng Tóm Tắt Thông Số Kỹ Thuật RC4</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-3 px-4">Đặc tính kỹ thuật</th>
                <th className="py-3 px-4">Thông số chi tiết</th>
                <th className="py-3 px-4">Đánh giá & Ý nghĩa mật mã</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Mô hình mật mã</td>
                <td className="py-3 px-4 font-mono text-cyan-300">Symmetric Stream Cipher</td>
                <td className="py-3 px-4">Mã hóa dòng dùng chung một khóa bí mật cho cả mã hóa và giải mã.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Độ dài khóa bí mật</td>
                <td className="py-3 px-4 font-mono text-cyan-300">40 bit đến 2048 bit (1 đến 256 bytes)</td>
                <td className="py-3 px-4">Khóa thông dụng nhất từng dùng trong thực tế là 40-bit (WEP cũ) và 128-bit.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Dung lượng bộ nhớ nội bộ</td>
                <td className="py-3 px-4 font-mono text-cyan-300">256 bytes (Mảng S) + 2 con trỏ i, j</td>
                <td className="py-3 px-4">Cực kỳ nhẹ, có thể cài đặt dễ dàng trên cả vi điều khiển 8-bit yếu nhất.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Số lượng trạng thái nội bộ</td>
                <td className="py-3 px-4 font-mono text-cyan-300">256! × 256² ≈ 5.5 × 10⁵¹¹</td>
                <td className="py-3 px-4">Không gian trạng thái khổng lồ, ngăn chặn hoàn toàn việc vét cạn trạng thái mảng.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Tốc độ thực thi</td>
                <td className="py-3 px-4 font-mono text-emerald-400">~7 chu kỳ CPU / byte trên x86</td>
                <td className="py-3 px-4">Từng nhanh hơn AES phần mềm gấp nhiều lần trước khi CPU có tập lệnh AES-NI.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Trạng thái tiêu chuẩn hiện tại</td>
                <td className="py-3 px-4 font-mono text-rose-400">Không an toàn - Bị cấm (Deprecated)</td>
                <td className="py-3 px-4">Bị cấm triệt để theo RFC 7465, NIST SP 800-131A, PCI DSS 3.1.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
