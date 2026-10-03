import React, { useState } from 'react';
import {
  Binary,
  Code2,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  AlertTriangle,
  Flame,
  ArrowRight,
  RefreshCw,
  Zap,
  Info,
} from 'lucide-react';

export const AnalysisView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'algorithms' | 'comparison' | 'security'>('algorithms');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Binary className="w-3.5 h-3.5 text-cyan-400" />
          <span>Giải Phẫu Thuật Toán & Phân Tích Mật Mã Học</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cơ Chế Hoạt Động & Lỗ Hổng Bảo Mật Của RC4
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Tìm hiểu chi tiết cấu trúc toán học của hai thuật toán KSA & PRGA, phép biến đổi đối xứng XOR, bảng so sánh đa chiều với AES / ChaCha20, và phân tích sâu các cuộc tấn công kinh điển khiến RC4 bị khai tử.
        </p>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 pt-4 gap-2">
          <button
            onClick={() => setActiveTab('algorithms')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'algorithms'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Thuật Toán KSA & PRGA
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'comparison'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. So Sánh: RC4 vs AES vs ChaCha20
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'security'
                ? 'border-rose-500 text-rose-300 bg-rose-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Phân Tích An Toàn & Khai Tử
          </button>
        </div>
      </div>

      {/* SECTION 1: KSA & PRGA ALGORITHMS */}
      {activeTab === 'algorithms' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* KSA Box */}
            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
                  Giai đoạn 1: KSA
                </span>
                <span className="text-xs text-slate-400 font-mono">Key-Scheduling Algorithm</span>
              </div>
              <h2 className="text-lg font-bold text-white">Thuật Toán Khởi Tạo & Trộn Khóa (KSA)</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mục đích của KSA là biến đổi mảng số tự nhiên tăng dần $S[i]=i$ thành một hoán vị ngẫu nhiên phụ thuộc hoàn toàn vào khóa bí mật. Khóa có độ dài từ 1 đến 256 byte được lặp lại tuần hoàn bằng phép chia lấy dư <code>key[i % keylen]</code>.
              </p>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 space-y-1.5 overflow-x-auto">
                <div className="text-slate-500">// 1. Khởi tạo mảng S nhận hoán vị đồng nhất (Identity permutation)</div>
                <div><span className="text-purple-400">for</span> i = 0 <span className="text-purple-400">to</span> 255:</div>
                <div className="pl-4">S[i] = i</div>
                <div className="text-slate-500 pt-2">// 2. Trộn mảng S qua 256 vòng lặp dựa trên khóa</div>
                <div>j = 0</div>
                <div><span className="text-purple-400">for</span> i = 0 <span className="text-purple-400">to</span> 255:</div>
                <div className="pl-4 text-cyan-300">j = (j + S[i] + key[i % key_length]) <span className="text-purple-400">mod</span> 256</div>
                <div className="pl-4 text-emerald-300"><span className="text-yellow-400">swap</span>(S[i], S[j])</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <div className="text-white font-semibold">Điểm yếu cốt lõi trong KSA:</div>
                <div>
                  Ở những vòng lặp đầu tiên, giá trị của $S[i]$ có xu hướng giữ nguyên vị trí ban đầu ($S[i]=i$) với xác suất cao, khiến các byte khóa ban đầu ảnh hưởng trực tiếp đến trạng thái của $S$ mà chưa kịp phân tán đều (khuếch tán kém - Poor Avalanche).
                </div>
              </div>
            </div>

            {/* PRGA Box */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold">
                  Giai đoạn 2: PRGA
                </span>
                <span className="text-xs text-slate-400 font-mono">Pseudo-Random Generation</span>
              </div>
              <h2 className="text-lg font-bold text-white">Thuật Toán Sinh Dòng Khóa (PRGA)</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sau khi KSA hoàn tất, hai con trỏ $i$ và $j$ bắt đầu từ 0. Tại mỗi bước sinh một byte dòng khóa, thuật toán dịch chuyển $i$, cập nhật $j$, hoán đổi $S[i]$ và $S[j]$, rồi dùng tổng hai phần tử này làm chỉ số tra cứu byte khóa $K$.
              </p>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-200 space-y-1.5 overflow-x-auto">
                <div className="text-slate-500">// Khởi tạo con trỏ ban đầu</div>
                <div>i = 0, j = 0</div>
                <div className="text-slate-500 pt-2">// Mỗi khi cần xuất 1 byte dòng khóa (Keystream byte):</div>
                <div><span className="text-purple-400">while</span> generating_output:</div>
                <div className="pl-4 text-cyan-300">i = (i + 1) <span className="text-purple-400">mod</span> 256</div>
                <div className="pl-4 text-cyan-300">j = (j + S[i]) <span className="text-purple-400">mod</span> 256</div>
                <div className="pl-4 text-emerald-300"><span className="text-yellow-400">swap</span>(S[i], S[j])</div>
                <div className="pl-4 text-purple-300">t = (S[i] + S[j]) <span className="text-purple-400">mod</span> 256</div>
                <div className="pl-4 text-amber-300">Keystream_Byte K = S[t]</div>
                <div className="pl-4 text-blue-300">Ciphertext_Byte C = Plaintext_Byte P ⊕ K</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <div className="text-white font-semibold">Ưu điểm thiết kế của PRGA:</div>
                <div>
                  Chỉ gồm 3 phép cộng 8-bit và 1 lần hoán đổi bộ nhớ. Thuật toán không sử dụng bất kỳ phép nhân, phép chia hay bảng dịch bit phức tạp nào, giúp nó chạy với tốc độ cực nhanh trên mọi CPU.
                </div>
              </div>
            </div>
          </div>

          {/* Deep dive: The XOR Math & Symmetry */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>Phép Toán XOR (⊕) & Tính Chất Đối Xứng Tuyệt Đối</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mã hóa dòng RC4 không có thuật toán giải mã riêng biệt. Cả bên mã hóa và bên giải mã đều khởi tạo cùng một dòng khóa $K_0, K_1, K_2, \dots$ từ khóa bí mật chung. Toàn bộ tính đối xứng bắt nguồn từ tính chất đại số boolean của phép toán <strong>XOR (Exclusive OR)</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="text-cyan-400 font-bold">1. Tự triệt tiêu (Involution)</div>
                <div className="text-slate-300">A ⊕ A = 0</div>
                <div className="text-slate-400 text-[11px]">XOR một giá trị với chính nó luôn luôn bằng 0.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="text-cyan-400 font-bold">2. Phần tử trung hòa</div>
                <div className="text-slate-300">A ⊕ 0 = A</div>
                <div className="text-slate-400 text-[11px]">XOR với 0 không làm thay đổi giá trị gốc.</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
                <div className="text-cyan-400 font-bold">3. Tính kết hợp & giao hoán</div>
                <div className="text-slate-300">(P ⊕ K) ⊕ K = P ⊕ (K ⊕ K) = P</div>
                <div className="text-slate-400 text-[11px]">Giải mã = Ciphertext ⊕ Keystream.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: COMPARISON TABLE */}
      {activeTab === 'comparison' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-white">So Sánh Đa Chiều: RC4 vs AES vs ChaCha20</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bảng so sánh chi tiết giữa thuật toán mã hóa dòng lịch sử (RC4), tiêu chuẩn mã hóa khối hiện đại của chính phủ Hoa Kỳ (AES), và thuật toán mã hóa dòng thế hệ mới siêu tốc (ChaCha20).
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-950/60 text-slate-300 font-mono">
                    <th className="py-3.5 px-4 font-bold">Tiêu chí so sánh</th>
                    <th className="py-3.5 px-4 text-cyan-400 font-bold">RC4 (Ron Rivest, 1987)</th>
                    <th className="py-3.5 px-4 text-emerald-400 font-bold">AES (Rijndael, 2001)</th>
                    <th className="py-3.5 px-4 text-blue-400 font-bold">ChaCha20 (Bernstein, 2008)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Loại mật mã</td>
                    <td className="py-3 px-4 font-mono text-cyan-300">Stream Cipher</td>
                    <td className="py-3 px-4 font-mono text-emerald-300">Block Cipher (Khối 128-bit)</td>
                    <td className="py-3 px-4 font-mono text-blue-300">Stream Cipher (Khối ARX 512-bit)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Cấu trúc toán học</td>
                    <td className="py-3 px-4">Mảng trạng thái hoán vị S (256 byte)</td>
                    <td className="py-3 px-4">Mạng thay thế - hoán vị (SPN) trong trường Galois GF(2⁸)</td>
                    <td className="py-3 px-4">Thao tác ARX (Add-Rotate-Xor) trên ma trận 4x4 từ 32-bit</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Độ dài khóa hỗ trợ</td>
                    <td className="py-3 px-4 font-mono">40 – 2048 bits</td>
                    <td className="py-3 px-4 font-mono">128, 192, 256 bits</td>
                    <td className="py-3 px-4 font-mono">256 bits</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Cần Vector Khởi Tạo (Nonce/IV)?</td>
                    <td className="py-3 px-4 text-rose-400">Không có chuẩn IV tích hợp (dẫn đến lỗi ghép chuỗi trong WEP)</td>
                    <td className="py-3 px-4 text-emerald-400">Có (Tùy theo Mode như CBC, GCM, CTR)</td>
                    <td className="py-3 px-4 text-blue-400">Có (96-bit Nonce + 32-bit Counter chuẩn RFC 7539, hoặc 192-bit XChaCha20)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Tốc độ trên thiết bị không có phần cứng chuyên dụng</td>
                    <td className="py-3 px-4 text-yellow-400">Rất nhanh nhưng không an toàn</td>
                    <td className="py-3 px-4 text-slate-400">Trung bình (Dễ bị tấn công thời gian Cache-timing trên CPU không hỗ trợ AES-NI)</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">Cực nhanh (Nhanh hơn AES 3x trên điện thoại di động và chip ARM)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Xác thực toàn vẹn (AEAD)</td>
                    <td className="py-3 px-4 text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-400" /> Không có
                    </td>
                    <td className="py-3 px-4 text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Có (Khi dùng AES-GCM)
                    </td>
                    <td className="py-3 px-4 text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Có (Kết hợp ChaCha20-Poly1305)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Kháng tấn công kênh bên (Side-channel)</td>
                    <td className="py-3 px-4 text-rose-400">Kém (Tra cứu bảng S[t] phụ thuộc vào khóa gây rò rỉ bộ nhớ đệm Cache)</td>
                    <td className="py-3 px-4 text-emerald-400">Tuyệt đối an toàn nếu dùng CPU có lệnh AES-NI phần cứng</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">Tuyệt đối an toàn (Thời gian hằng số Constant-time thuần túy, không tra bảng)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Tình trạng khuyến nghị hiện nay</td>
                    <td className="py-3 px-4 text-rose-400 font-bold">TUYỆT ĐỐI CẤM (RFC 7465)</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">TIÊU CHUẨN VÀNG (AES-256-GCM)</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">TIÊU CHUẨN VÀNG (RFC 7539 / TLS 1.3)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Note contrasting RC4 permutation state array with AES/DES S-Box */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3 text-xs">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-cyan-300">Lưu ý quan trọng về thuật ngữ mật mã học:</span>
                <p className="text-slate-300 leading-relaxed">
                  Thuật toán RC4 hoàn toàn <strong>không có S-Box (Substitution-Box)</strong>. S-Box là hộp thay thế phi tuyến tính cố định được thiết kế đặc thù trong các mật mã khối (Block Cipher) như DES hay AES (Rijndael S-Box). Ngược lại, RC4 chỉ sử dụng một <strong>mảng trạng thái hoán vị S</strong> gồm 256 byte động, liên tục bị xáo trộn và hoán đổi vị trí qua từng bước của KSA và PRGA (hiển thị dưới dạng lưới 16x16 để quan sát).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SECURITY ANALYSIS */}
      {activeTab === 'security' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vulnerability 1: Mantin-Shamir Second Byte Bias */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                <AlertTriangle className="w-4 h-4" />
                LỖ HỔNG 1: THIÊN VỊ BYTE THỨ 2 (MANTIN & SHAMIR, 2001)
              </div>
              <h3 className="text-base font-bold text-white">Xu Hướng Trở Về 0 Của Byte Đầu</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trong một thuật toán sinh số giả ngẫu nhiên lý tưởng, mỗi byte đầu ra $K \in [0..255]$ phải xuất hiện với xác suất đồng đều là $1/256 \approx 0.003906$ (~0.3906%).
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-amber-300 border border-amber-500/20">
                P(Byte #2 = 0x00) ≈ 1/128 ≈ 0.0078125 (~0.781%)
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Itsik Mantin và Adi Shamir chứng minh rằng xác suất byte thứ 2 của dòng khóa bằng 0x00 cao gấp đôi bình thường! Kẻ tấn công quan sát đủ nhiều phiên liên lạc (với cùng bản rõ bí mật ở vị trí byte 2) có thể xác định được bản rõ đó mà không cần phá khóa.
              </p>
            </div>

            {/* Vulnerability 2: FMS Attack on WEP */}
            <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <Flame className="w-4 h-4" />
                LỖ HỔNG 2: TẤN CÔNG FMS TRONG MẠNG WI-FI WEP
              </div>
              <h3 className="text-base font-bold text-white">Cơ Chế IV Yếu + Ghép Chuỗi KSA</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Giao thức WEP 802.11b chỉ sử dụng Vector khởi tạo IV dài 24-bit (chỉ có $2^{24} \approx 16.7$ triệu giá trị, lặp lại sau vài giờ trên mạng bận rộn) và ghép thẳng vào trước khóa bí mật: <code>Key_RC4 = IV || Shared_Key</code>.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-rose-300 border border-rose-500/20">
                Khi IV có dạng (B + 3, 255, V), thông tin về byte khóa thứ B bị rò rỉ trực tiếp ra byte đầu tiên của dòng khóa!
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tấn công Fluhrer-Mantin-Shamir (FMS) cho phép các công cụ như Aircrack-ng thu thập các gói tin phát quảng bá công khai và bẻ gãy hoàn toàn mật khẩu Wi-Fi chỉ trong vòng vài phút.
              </p>
            </div>

            {/* Vulnerability 3: Key Reuse */}
            <div className="bg-slate-900/80 border border-red-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold">
                <ShieldAlert className="w-4 h-4" />
                LỖ HỔNG 3: NGUY CƠ TÁI SỬ DỤNG KHÓA (TWO-TIME PAD)
              </div>
              <h3 className="text-base font-bold text-white">Dòng Khóa Triệt Tiêu: C1 ⊕ C2 = P1 ⊕ P2</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nếu một khóa RC4 được sử dụng để mã hóa hai thông điệp khác nhau ($P_1$ và $P_2$), dòng khóa $K$ sẽ giống hệt nhau. Kẻ nghe lén chỉ cần XOR hai bản mã:
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-red-300 border border-red-500/20">
                C1 ⊕ C2 = (P1 ⊕ K) ⊕ (P2 ⊕ K) = P1 ⊕ P2
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Khóa bí mật $K$ biến mất hoàn toàn khỏi phương trình. Bằng kỹ thuật <em>Crib Dragging</em> (kéo trượt từ ngữ phổ biến như "HTTP/1.1", "GET ", "Dear "), kẻ tấn công có thể khôi phục cả hai bản rõ trong nháy mắt.
              </p>
            </div>

            {/* Vulnerability 4: Why RFC 7465 Banished RC4 */}
            <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-bold">
                <FileText className="w-4 h-4" />
                LỖ HỔNG 4: RFC 7465 & KHAI TỬ TRONG TLS
              </div>
              <h3 className="text-base font-bold text-white">Tấn Công Bar Mitzvah & RC4 NOMORE</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Vào năm 2013-2015, các nhà nghiên cứu AlFardan, Bernstein, Paterson, Poettering và Schuldt phát hiện hàng loạt thiên vị thống kê ở cả byte đơn và byte đôi (single/double byte biases) kéo dài qua hàng ngàn byte đầu tiên của RC4.
              </p>
              <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-blue-300 border border-blue-500/20">
                IETF RFC 7465 (Tháng 2/2015): "Prohibiting RC4 Cipher Suites"
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trong trình duyệt web, một đoạn mã JavaScript độc hại gửi hàng triệu yêu cầu HTTPS lặp lại cùng một cookie phiên. Kẻ tấn công nghe trộm mạng WiFi có thể phân tích tần suất thiên vị và giải mã được cookie đăng nhập của người dùng.
              </p>
            </div>
          </div>

          {/* Historic Mitigation: RC4-drop[n] */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
              <span>Biện Pháp Giảm Thiểu Lịch Sử: RC4-drop[n]</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Để loại bỏ các thiên vị ban đầu, các nhà mật mã từng đề xuất biến thể <strong>RC4-drop[n]</strong> (ví dụ <code>RC4-drop[768]</code> hoặc <code>RC4-drop[3072]</code>). Sau khi KSA kết thúc, PRGA sẽ chạy và bỏ đi $n$ byte đầu tiên mà không dùng để mã hóa dữ liệu.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold uppercase tracking-wider">Ưu điểm:</span>
                <p className="text-slate-300">
                  Triệt tiêu hiệu quả các thiên vị Mantin-Shamir và phần lớn các điểm yếu rò rỉ byte đầu tiên ở KSA.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-rose-400 font-bold uppercase tracking-wider">Lý do vẫn bị loại bỏ:</span>
                <p className="text-slate-300">
                  Nó làm giảm tốc độ khởi tạo và không giải quyết được các thiên vị dài hạn ở các byte sau, cũng như không cung cấp tính xác thực thông điệp (Message Authentication). Sự xuất hiện của ChaCha20-Poly1305 và AES-GCM đã hoàn toàn biến RC4-drop thành dĩ vãng.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
