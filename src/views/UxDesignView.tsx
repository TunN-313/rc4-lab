import React from 'react';
import {
  Palette,
  Users,
  Compass,
  Layout,
  Eye,
  Type,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Shield,
  MousePointer,
  Sparkles,
} from 'lucide-react';

export const UxDesignView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tài Liệu Thiết Kế Trải Nghiệm & Giao Diện Người Dùng</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Hệ Thống Thiết Kế UX/UI & Quy Trình Phát Triển
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Tài liệu chi tiết về chân dung người dùng mục tiêu (Personas), sơ đồ luồng người dùng (User Flow), bản phác thảo cấu trúc giao diện (Wireframes), hệ màu Cyberpunk Lab và tiêu chuẩn tiếp cận người dùng (Accessibility - WCAG).
        </p>
      </div>

      {/* 1. Target Personas */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">1. Chân Dung Người Dùng Mục Tiêu (Target Personas)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Persona 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-cyan-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg font-mono">
                MA
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Nguyễn Minh Anh (21 tuổi)</h3>
                <div className="text-[11px] text-cyan-300 font-mono">Sinh viên An toàn thông tin</div>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>Mục tiêu:</strong> Cần hiểu bản chất toán học của KSA và PRGA để làm bài thi môn Mật mã học cơ sở và hoàn thành đồ án mô phỏng mã hóa dòng.
              </p>
              <p>
                <strong>Nỗi đau (Pain point):</strong> Đọc mã giả trong giáo trình quá trừu tượng, khó hình dung các bước hoán đổi mảng $S$ và phép XOR từng byte nhị phân.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-200">
                ★ <strong>Hành vi chính:</strong> Sử dụng "Mô Phỏng 16x16" để tua từng bước và làm bài "Trắc Nghiệm" để kiểm tra kiến thức.
              </div>
            </div>
          </div>

          {/* Persona 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg font-mono">
                TK
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Trần Tuấn Kiệt (28 tuổi)</h3>
                <div className="text-[11px] text-emerald-300 font-mono">Kỹ sư DevSecOps / Security</div>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>Mục tiêu:</strong> Muốn nắm rõ vì sao các tổ chức bảo mật quốc tế (IETF RFC 7465, PCI-DSS) cấm triệt để RC4 trong cấu hình TLS/SSL máy chủ web.
              </p>
              <p>
                <strong>Nỗi đau (Pain point):</strong> Thiếu công cụ thực nghiệm trực quan kiểm chứng độ thiên vị Mantin-Shamir và tấn công tái sử dụng khóa (Two-Time Pad).
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-200">
                ★ <strong>Hành vi chính:</strong> Dùng phòng "Thực Nghiệm" để đo lường thiên vị và thử nghiệm tính năng kéo trượt từ đoán (Crib Dragging).
              </div>
            </div>
          </div>

          {/* Persona 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-lg font-mono">
                QH
              </div>
              <div>
                <h3 className="text-base font-bold text-white">TS. Lê Quang Huy (42 tuổi)</h3>
                <div className="text-[11px] text-purple-300 font-mono">Giảng viên Đại học Mật mã học</div>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>Mục tiêu:</strong> Cần tài liệu trực quan, sinh động để trình chiếu trên màn hình máy chiếu lớp học, minh họa bài giảng về dòng khóa và so sánh AES / ChaCha20.
              </p>
              <p>
                <strong>Nỗi đau (Pain point):</strong> Các công cụ cũ viết bằng Java Applet hoặc Python Tkinter khó chạy trên máy tính sinh viên, thiếu tính tương tác trực tiếp trên trình duyệt.
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-purple-200">
                ★ <strong>Hành vi chính:</strong> Chiếu trang "Phân Tích KSA/PRGA", chạy Test Vectors chuẩn và yêu cầu sinh viên làm bài trắc nghiệm 10 câu.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. User Flow Diagram */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">2. Sơ Đồ Luồng Trải Nghiệm Người Dùng (User Flow)</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Ứng dụng được thiết kế theo lộ trình học tập tăng dần về nhận thức: <strong>Học lý thuyết</strong> $\rightarrow$ <strong>Quan sát trực quan</strong> $\rightarrow$ <strong>Thực nghiệm chuyên sâu</strong> $\rightarrow$ <strong>Đánh giá năng lực</strong> $\rightarrow$ <strong>Lưu trữ kết quả</strong>.
        </p>

        {/* User flow pipeline visual */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Giai đoạn 1</span>
            <h4 className="text-sm font-bold text-white">Học & Tiếp Thu</h4>
            <p className="text-[11px] text-slate-400">
              Đọc Giới thiệu, bối cảnh lịch sử 1994, mã giả KSA/PRGA và bảng so sánh AES / ChaCha20.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2 relative">
            <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">Giai đoạn 2</span>
            <h4 className="text-sm font-bold text-white">Mô Phỏng 16x16</h4>
            <p className="text-[11px] text-slate-400">
              Nhập khóa, xem ma trận $S[256]$ hoán đổi, theo dõi con trỏ $i, j$, quan sát phép toán XOR từng bit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Giai đoạn 3</span>
            <h4 className="text-sm font-bold text-white">Thực Nghiệm Lab</h4>
            <p className="text-[11px] text-slate-400">
              Chạy kiểm định thiên vị 50.000 khóa, tấn công tái sử dụng khóa, thử nghiệm RC4-drop[n] và thác đổ 1-bit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2 relative">
            <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">Giai đoạn 4</span>
            <h4 className="text-sm font-bold text-white">Kiểm Tra Quiz</h4>
            <p className="text-[11px] text-slate-400">
              Làm bài kiểm tra trắc nghiệm 10 câu, nhận phản hồi giải thích chi tiết và ăn mừng pháo hoa.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Giai đoạn 5</span>
            <h4 className="text-sm font-bold text-white">Lưu Trữ & Quản Lý</h4>
            <p className="text-[11px] text-slate-400">
              Đăng nhập tài khoản cá nhân, lưu trữ và tra cứu lịch sử mã hóa, kết quả thí nghiệm và điểm thi.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Wireframe Structural Breakdown */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">3. Bản Phác Thảo Cấu Trúc Các Màn Hình Chính (Wireframe Logic)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wireframe 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 font-mono text-xs">
            <div className="text-cyan-400 font-bold text-sm font-sans flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Cấu Trúc: Màn Hình Mô Phỏng 16x16 (Visualizer)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <div>[Top Bar]: Cảnh báo an toàn mật mã học (Disclaimer)</div>
              <div>[Header]: Bộ chọn khóa bí mật | Bản rõ | Nạp nhanh Test Vector</div>
              <div>[Controls]: Nút Tự Động Chạy (Play) | Tới 1 Bước | Nhảy PRGA | Reset | Tốc độ (50-1000ms) | Hex/Dec</div>
              <div>[Formula Bar]: j = (j + S[i] + K) mod 256 | Con trỏ i, j | Vị trí tra cứu t</div>
              <div>[Grid Viewport]: Ma trận 16 hàng x 16 cột (256 ô) | Hiệu ứng viền sáng con trỏ i (Cyan), j (Amber)</div>
              <div>[Bottom Panel]: Bảng tra cứu XOR trực tiếp: P[i] (Hex/Bin) ⊕ K[i] (Hex/Bin) = C[i]</div>
            </div>
          </div>

          {/* Wireframe 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 font-mono text-xs">
            <div className="text-emerald-400 font-bold text-sm font-sans flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Cấu Trúc: Công Cụ Mã Hóa & Giải Mã (Cipher Tool)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <div>[Presets Strip]: 4 Thẻ Test Vectors chuẩn (RFC 6229, Wikipedia, Dawn, Single Char)</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 border border-slate-800 rounded bg-slate-900">
                  <strong>[Cột Trái - Input]:</strong>
                  <div>• Nút chuyển Mã Hóa / Giải Mã</div>
                  <div>• Định dạng: Text (UTF-8) / Hex</div>
                  <div>• Ô nhập Khóa bí mật</div>
                  <div>• Dropdown RC4-drop[n]</div>
                  <div>• Textarea nhập dữ liệu nguồn</div>
                </div>
                <div className="p-2 border border-slate-800 rounded bg-slate-900">
                  <strong>[Cột Phải - Output]:</strong>
                  <div>• Định dạng: Hex / Base64</div>
                  <div>• Nút Đổi Chiều Xử Lý (Swap)</div>
                  <div>• Nút Sao chép vào Clipboard</div>
                  <div>• Preview Dòng Khóa (Keystream)</div>
                  <div>• Nút Lưu Vào Lịch Sử (Firestore)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wireframe 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 font-mono text-xs">
            <div className="text-rose-400 font-bold text-sm font-sans flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Cấu Trúc: Phòng Thực Nghiệm Lỗ Hổng (Experiments Lab)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <div>[Tab Navigation]: Bias Test | Key Reuse | RC4-drop[n] | Avalanche Test</div>
              <div>[Config]: Chọn vị trí Byte #1/#2 | Số lượng mẫu (5K - 50K keys) | Nút Chạy</div>
              <div>[Metrics]: Tần suất 0x00 | Kỳ vọng 1/256 | Hệ số thiên vị (x2.0 lần)</div>
              <div>[Histogram]: Biểu đồ 256 cột | Cột 0x00 màu đỏ nổi bật | Đường kỳ vọng ngẫu nhiên</div>
              <div>[Key Reuse]: 2 input bản rõ + C1 ⊕ C2 = P1 ⊕ P2 | Trình giả lập Crib Dragging trượt</div>
            </div>
          </div>

          {/* Wireframe 4 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3 font-mono text-xs">
            <div className="text-purple-400 font-bold text-sm font-sans flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Cấu Trúc: Trắc Nghiệm & Kiểm Thử Tự Động (Quiz & Test Runner)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-slate-300">
              <div>[Progress Bar]: Câu hỏi hiện tại [X / 10] | Thanh phần trăm hoàn thành</div>
              <div>[Card]: Tiêu đề câu hỏi | 4 Lựa chọn A, B, C, D (Highlight Xanh/Đỏ khi chọn)</div>
              <div>[Instant Feedback]: Lời giải thích toán học chi tiết vì sao đúng/sai</div>
              <div>[Result Modal]: Điểm số, phần trăm, xếp loại, hiệu ứng Confetti, nút Lưu điểm</div>
              <div>[Test Runner]: Bảng kiểm thử Unit Tests tự động thực thi trong trình duyệt</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Color, Typography & Accessibility */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">4. Hệ Thống Màu Sắc, Phông Chữ & Khả Năng Tiếp Cận (a11y)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Palette */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>Bảng Màu Cyberpunk Lab</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-between text-slate-300">
                <span>Deep Navy Background</span>
                <span className="font-mono text-[11px] text-cyan-400">#070b14</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-between text-cyan-200">
                <span>Neon Cyan (Chỉ số i, Accent)</span>
                <span className="font-mono text-[11px] text-cyan-400">#06b6d4</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-emerald-200">
                <span>Emerald (Hoán đổi, Bản mã)</span>
                <span className="font-mono text-[11px] text-emerald-400">#10b981</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-between text-amber-200">
                <span>Amber (Con trỏ j, Cảnh báo)</span>
                <span className="font-mono text-[11px] text-amber-400">#f59e0b</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-between text-rose-200">
                <span>Rose Red (Lỗ hổng, Byte 0)</span>
                <span className="font-mono text-[11px] text-rose-400">#f43f5e</span>
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>Hệ Thống Kiểu Chữ (Typography)</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <div>
                <strong className="text-white font-sans text-sm">Inter (Sans-serif)</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Dùng cho toàn bộ tiêu đề, nhãn giao diện, giải thích nghiệp vụ và bài đọc nghiên cứu. Thiết kế hình học tối ưu cho màn hình độ phân giải cao.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <strong className="text-cyan-300 font-mono text-sm">Fira Code (Monospace)</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Dùng cho giá trị byte Hex (<code>0x4B</code>), chuỗi nhị phân (<code>01001011</code>), công thức modulo và bảng tra cứu ma trận $S[256]$.
                </p>
              </div>
            </div>
          </div>

          {/* Accessibility (a11y) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Tiếp Cận & Thích Ứng (a11y)</span>
            </h3>
            <ul className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Độ tương phản cao:</strong> Mọi màu chữ đều đạt tiêu chuẩn WCAG AA/AAA ($\ge 4.5:1$).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Điều hướng bàn phím:</strong> Toàn bộ nút bấm, thanh trượt, menu hỗ trợ Tab và phím Enter/Space.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong>Responsive:</strong> Tối ưu cho Mobile (360px+), Tablet (768px+), và Màn hình rộng (1280px+).</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
