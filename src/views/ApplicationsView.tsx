import React from 'react';
import {
  Radio,
  Wifi,
  Globe,
  Monitor,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export const ApplicationsView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Radio className="w-3.5 h-3.5 text-cyan-400" />
          <span>Lịch Sử Triển Khai & Khai Tử</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ứng Dụng Thực Tế & Hành Trình Lụi Tàn Của RC4
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Từ vị thế là giải thuật bảo mật thống trị thế giới Internet, được nhúng trong mọi thiết bị Wi-Fi, trình duyệt web và hệ điều hành, đến khi bị cấm hoàn toàn bởi các tổ chức tiêu chuẩn quốc tế.
        </p>
      </div>

      {/* Grid: Where RC4 Was Used */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>Những Nơi RC4 Từng Được Sử Dụng Rộng Rãi</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* App 1: WEP Wi-Fi */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 relative group hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Wifi className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mạng Không Dây WEP (802.11b)</h3>
            <div className="text-[11px] font-mono text-cyan-400">1997 – 2004</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Giao thức bảo mật Wi-Fi đầu tiên trong lịch sử (Wired Equivalent Privacy). WEP dùng RC4 với khóa 64-bit hoặc 128-bit kết hợp với 24-bit IV phát công khai.
            </p>
            <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/40">
              <strong>Hậu quả:</strong> Tấn công FMS bẻ khóa mật khẩu Wi-Fi trong chưa đầy 3 phút bằng cách bắt gói tin qua không trung.
            </div>
          </div>

          {/* App 2: WPA-TKIP */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 relative group hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">WPA-TKIP (Giải pháp quá độ)</h3>
            <div className="text-[11px] font-mono text-blue-400">2003 – 2006</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thiết kế để vá lỗ hổng WEP trên phần cứng Wi-Fi cũ mà không cần thay chip. TKIP tiếp tục dùng lõi RC4 nhưng bổ sung thuật toán trộn khóa con cho từng gói tin (per-packet key mixing).
            </p>
            <div className="text-[11px] text-yellow-300 bg-yellow-950/40 p-2.5 rounded-lg border border-yellow-900/40">
              <strong>Hậu quả:</strong> Tấn công Beck-Tews (2008) giải mã gói tin nhỏ; sau đó WPA2 chuyển sang chuẩn cứng AES-CCMP.
            </div>
          </div>

          {/* App 3: SSL / TLS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 relative group hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Giao Thức Web SSL / TLS</h3>
            <div className="text-[11px] font-mono text-emerald-400">1995 – 2015</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Từng là bộ mã hóa chủ lực trong TLS 1.0 và TLS 1.1 (<code>TLS_RSA_WITH_RC4_128_SHA</code>). Vào năm 2011, khi cuộc tấn công BEAST nhắm vào CBC mode của AES, các chuyên gia bảo mật thậm chí từng khuyến nghị quay lại dùng RC4!
            </p>
            <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/40">
              <strong>Hậu quả:</strong> Tấn công Bar Mitzvah & RC4 NOMORE khôi phục cookie HTTPS, dẫn tới lệnh cấm vĩnh viễn theo RFC 7465.
            </div>
          </div>

          {/* App 4: Windows RDP & MPPE */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 relative group hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Microsoft RDP & MPPE</h3>
            <div className="text-[11px] font-mono text-purple-400">Windows NT 4.0 – Windows 7</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Remote Desktop Protocol (RDP) và Microsoft Point-to-Point Encryption (MPPE dùng trong VPN PPTP) dựa trên RC4 để bảo vệ luồng hình ảnh màn hình và kết nối mạng nội bộ của doanh nghiệp.
            </p>
          </div>

          {/* App 5: PDF Encryption */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 relative group hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Tài Liệu Adobe PDF Cũ</h3>
            <div className="text-[11px] font-mono text-amber-400">PDF 1.1 – PDF 1.6 (Acrobat 2 - 7)</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Adobe Acrobat sử dụng RC4 40-bit và 128-bit để bảo vệ tài liệu bằng mật khẩu và phân quyền in ấn / sao chép nội dung, trước khi nâng cấp lên AES-128 và AES-256 từ bản PDF 1.7.
            </p>
          </div>

          {/* App 6: BitTorrent & Khác */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 relative group hover:border-cyan-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">BitTorrent Protocol (MSE / PE)</h3>
            <div className="text-[11px] font-mono text-teal-400">Message Stream Encryption</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Các máy khách BitTorrent (như uTorrent, qBittorrent) sử dụng biến thể RC4-drop[768] để làm rối luồng dữ liệu (traffic obfuscation), ngăn chặn các nhà mạng viễn thông (ISP) nhận diện và bóp băng thông P2P.
            </p>
          </div>
        </div>
      </section>

      {/* Deprecation Timeline */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-400" />
          <span>Dòng Thời Gian Các Cuộc Tấn Công & Quá Trình Bị Khai Tử</span>
        </h2>

        <div className="relative border-l border-slate-800 ml-3 sm:ml-6 space-y-8 pl-6 sm:pl-8">
          {/* Milestone 1 */}
          <div className="relative group">
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950"></div>
            <div className="text-xs font-mono text-cyan-400">1987 & 1994</div>
            <h3 className="text-base font-bold text-white">Ra đời & Rò rỉ mã nguồn ẩn danh</h3>
            <p className="text-xs text-slate-400 mt-1">
              Ron Rivest tạo ra RC4 cho RSA Security. Năm 1994, mã nguồn xuất hiện trên Cypherpunks và được cộng đồng đón nhận nồng nhiệt vì tốc độ phi thường.
            </p>
          </div>

          {/* Milestone 2 */}
          <div className="relative group">
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-yellow-500 border-4 border-slate-950"></div>
            <div className="text-xs font-mono text-yellow-400">2001</div>
            <h3 className="text-base font-bold text-white">Phát hiện thiên vị Mantin-Shamir & Bẻ khóa WEP (FMS)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Itsik Mantin và Adi Shamir công bố thiên vị byte thứ 2. Cùng năm đó, Fluhrer-Mantin-Shamir chứng minh cơ chế ghép khóa của Wi-Fi WEP bị vỡ vụn hoàn toàn.
            </p>
          </div>

          {/* Milestone 3 */}
          <div className="relative group">
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-950"></div>
            <div className="text-xs font-mono text-amber-400">2013</div>
            <h3 className="text-base font-bold text-white">Đòn giáng mạnh từ Paterson & AlFardan</h3>
            <p className="text-xs text-slate-400 mt-1">
              Chứng minh kẻ tấn công có thể khôi phục mật khẩu hoặc cookie HTTPS bằng cách phân tích hàng triệu gói tin RC4 trong kết nối TLS.
            </p>
          </div>

          {/* Milestone 4 */}
          <div className="relative group">
            <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-rose-500 border-4 border-slate-950"></div>
            <div className="text-xs font-mono text-rose-400">Tháng 2, 2015</div>
            <h3 className="text-base font-bold text-white">IETF RFC 7465: Cấm Tuyệt Đối RC4 Trong TLS</h3>
            <p className="text-xs text-slate-400 mt-1">
              Tổ chức Tiêu chuẩn Internet IETF ban hành RFC 7465, cấm các máy chủ và máy khách TLS đàm phán bất kỳ bộ mã hóa RC4 nào. Các trình duyệt Chrome, Firefox, Edge lần lượt loại bỏ hoàn toàn mã nguồn RC4.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Alternatives Recommendation */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Các Thuật Toán Hiện Đại Khuyên Dùng</h2>
            <p className="text-xs text-slate-400">Thay thế hoàn toàn mã hóa dòng không an toàn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* ChaCha20-Poly1305 */}
          <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">ChaCha20-Poly1305 (RFC 7539 / 8439)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                AEAD Stream
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thiết kế bởi Daniel J. Bernstein, đây là "người kế vị tinh thần" hoàn hảo cho RC4: là một mã hóa dòng chạy bằng phần mềm thuần túy với tốc độ vượt trội, tích hợp sẵn thuật toán xác thực Poly1305 MAC, kháng hoàn toàn tấn công kênh bên (Side-channel) và được áp dụng mặc định trong TLS 1.3, WireGuard VPN và giao thức SSH.
            </p>
            <div className="text-[11px] text-emerald-400 font-mono">
              ✓ Khóa 256-bit | Nonce 96-bit hoặc 192-bit | Miễn phí bản quyền
            </div>
          </div>

          {/* AES-256-GCM */}
          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">AES-256-GCM (NIST SP 800-38D)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                AEAD Block
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Chuẩn mã hóa tiêu chuẩn vàng của chính phủ Hoa Kỳ và toàn cầu. Chế độ Galois/Counter Mode (GCM) biến khối mã hóa 128-bit thành dòng dữ liệu liên tục đồng thời tính toán mã xác thực GMAC. Nhờ lệnh tăng tốc phần cứng AES-NI tích hợp trên hầu hết CPU hiện đại, tốc độ xử lý có thể vượt qua 5-10 GB/giây.
            </p>
            <div className="text-[11px] text-cyan-400 font-mono">
              ✓ Khóa 128/256-bit | Xác thực phần cứng | Tiêu chuẩn bắt buộc PCI-DSS
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
