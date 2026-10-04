import React from 'react';
import {
  Cpu,
  Layers,
  Server,
  Database,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  GitBranch,
  Terminal,
  Globe,
  Monitor,
  Code2,
  HardDrive,
  Cloud,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Kiến Trúc Kỹ Thuật & Quyết Định Công Nghệ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Công Nghệ & Kiến Trúc Hệ Thống RC4 Lab
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Tài liệu phân tích các quyết định công nghệ đằng sau RC4 Lab: Sự kết hợp giữa React 19, TypeScript, Vite ở tầng giao diện và nền tảng Serverless Firebase (Auth + Cloud Firestore) ở tầng backend đám mây.
        </p>
      </div>

      {/* Tech Stack Components Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Tech Stack Được Lựa Chọn & Vai Trò</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frontend Box */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold">
                Tầng Giao Diện & Mô Phỏng
              </span>
              <span className="text-xs text-slate-400 font-mono">Client-Side Runtime</span>
            </div>
            <h3 className="text-lg font-bold text-white">Frontend: React 19 + TypeScript + Vite + Tailwind CSS</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                <div>
                  <strong className="text-white">React 19 & Hooks:</strong> Quản lý trạng thái của lưới 16x16 (256 ô), con trỏ <code className="font-mono text-cyan-300">i</code>, <code className="font-mono text-amber-300">j</code> và vòng lặp tự chạy từng bước.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                <div>
                  <strong className="text-white">TypeScript 5:</strong> Đảm bảo tính an toàn kiểu dữ liệu tuyệt đối cho các mảng byte 8-bit (<code className="font-mono text-cyan-300">Uint8Array</code>, mảng số <code className="font-mono text-slate-200">0..255</code>, phép toán <code className="font-mono text-purple-300">mod 256</code>) và các cấu trúc dữ liệu mô phỏng KSA/PRGA.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                <div>
                  <strong className="text-white">Vite 8:</strong> Công cụ build và dev server dựa trên ES Modules, khởi động nhanh khi phát triển.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></div>
                <div>
                  <strong className="text-white">Tailwind CSS v4:</strong> Hệ thống utility-first thế hệ mới cho phép thiết kế giao diện Cybersecurity Lab chuẩn dark mode, neon cyan/green và tối ưu hóa hiển thị trên mọi độ phân giải.
                </div>
              </li>
            </ul>
          </div>

          {/* Backend Box */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold">
                Tầng Đám Mây & Dữ Liệu
              </span>
              <span className="text-xs text-slate-400 font-mono">Serverless Backend</span>
            </div>
            <h3 className="text-lg font-bold text-white">Backend: Firebase Authentication + Cloud Firestore</h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                <div>
                  <strong className="text-white">Firebase Authentication:</strong> Cung cấp xác thực an toàn bằng cả tài khoản Google (OAuth 2.0 popup) và Email/Mật khẩu. Tự động quản lý token JWT mà không cần máy chủ xác thực riêng.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                <div>
                  <strong className="text-white">Cloud Firestore NoSQL:</strong> Cơ sở dữ liệu tài liệu phân tán với khả năng đồng bộ theo thời gian thực (Realtime Listeners). Lưu trữ nhật ký mã hóa, kết quả thí nghiệm và điểm thi trắc nghiệm.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></div>
                <div>
                  <strong className="text-white">Quy tắc bảo mật Firestore (ABAC):</strong> Triển khai kiểm soát truy cập dựa trên thuộc tính với `firestore.rules`. Bảo đảm cô lập tuyệt đối dữ liệu: người dùng chỉ có thể đọc/ghi các bản ghi của chính họ.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* WHY: The 4 Key Architectural Drivers */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Tại Sao Chọn Kiến Trúc Này? (Architectural Rationale)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-bold font-mono text-xs uppercase tracking-wider">
              1. Không Cần Quản Trị Server
            </div>
            <h4 className="text-sm font-semibold text-white">Hoàn Toàn Serverless</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Không cần duy trì máy chủ VPS, không cấu hình Nginx/Docker, không bảo trì hệ điều hành. Hệ thống tự động thu nhỏ về 0 (scale-to-zero) khi không có người dùng truy cập.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-bold font-mono text-xs uppercase tracking-wider">
              2. Chi Phí 0 Đồng (Free Tier)
            </div>
            <h4 className="text-sm font-semibold text-white">Tối Ưu Hóa Ngân Sách</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gói Spark của Firebase cung cấp 50.000 lượt đọc và 20.000 lượt ghi mỗi ngày hoàn toàn miễn phí, lý tưởng cho dự án học thuật và nghiên cứu phi lợi nhuận.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-purple-400 font-bold font-mono text-xs uppercase tracking-wider">
              3. Tốc Độ Lặp Lại Nhanh
            </div>
            <h4 className="text-sm font-semibold text-white">Fast Iteration & Delivery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Giao tiếp trực tiếp giữa Client SDK và Firestore giúp loại bỏ nhu cầu viết hàng chục API endpoint trung gian, cho phép tập trung 100% vào nghiệp vụ mật mã học.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-bold font-mono text-xs uppercase tracking-wider">
              4. Mật Mã Phía Client (Zero Latency)
            </div>
            <h4 className="text-sm font-semibold text-white">Hiệu Suất Thực Thi Tức Thì</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toàn bộ thuật toán RC4 chạy trên CPU của máy khách. Khi chạy thực nghiệm 50.000 khóa, việc tính toán diễn ra trực tiếp trên luồng JS mà không tốn 1 byte băng thông mạng server.
            </p>
          </div>
        </div>
      </section>

      {/* Visual System Architecture Diagram */}
      <section className="bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xl font-bold text-white">Sơ Đồ Kiến Trúc Hệ Thống Tổng Thể</h2>
          <p className="text-xs text-slate-400">
            Dòng dữ liệu tương tác giữa Single-Page Application (SPA) và các dịch vụ đám mây Firebase
          </p>
        </div>

        {/* Diagram ASCII/Canvas representation */}
        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
          <div className="min-w-[700px] flex items-center justify-between gap-6 font-mono text-xs">
            {/* Box 1: User Client Browser */}
            <div className="flex-1 p-4 rounded-xl border border-cyan-500/40 bg-slate-900/90 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Monitor className="w-4 h-4" />
                <span>CLIENT SPA (Trình Duyệt Web)</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <strong>UI Component Layer:</strong>
                  <div className="text-slate-400 text-[10px] mt-0.5">
                    Visualizer (16x16 Grid), Cipher Tool, Bias Lab, Quiz, Test Runner
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-cyan-500/30 text-cyan-200">
                  <strong>Pure Cryptographic Core (Client-side):</strong>
                  <div className="text-slate-400 text-[10px] mt-0.5">
                    KSA (256 vòng) • PRGA Engine • XOR Logic • Web Crypto API RNG
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <strong>Firebase Client SDK:</strong>
                  <div className="text-slate-400 text-[10px] mt-0.5">
                    auth.onAuthStateChanged • getDoc • setDoc • onSnapshot
                  </div>
                </div>
              </div>
            </div>

            {/* Arrows */}
            <div className="flex flex-col items-center justify-center gap-6 text-slate-500 font-bold">
              <div className="flex items-center gap-1 text-cyan-400 text-[10px]">
                <span>OAuth / JWT</span>
                <span className="text-base">⇄</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-[10px]">
                <span>Data Sync</span>
                <span className="text-base">⇄</span>
              </div>
            </div>

            {/* Box 2: Firebase Backend Cloud */}
            <div className="flex-1 p-4 rounded-xl border border-emerald-500/40 bg-slate-900/90 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Cloud className="w-4 h-4" />
                <span>FIREBASE SERVERLESS SERVICES</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">
                  <strong className="text-cyan-300">Firebase Authentication:</strong>
                  <div className="text-slate-400 text-[10px] mt-0.5">
                    Google Identity Platform • Email/Password Credential Store
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-emerald-500/30">
                  <strong className="text-emerald-300">Cloud Firestore + firestore.rules:</strong>
                  <div className="text-slate-400 text-[10px] mt-0.5 space-y-0.5">
                    <div>• <code>/users/{'{uid}'}</code> (Hồ sơ cá nhân)</div>
                    <div>• <code>/encryption_runs/{'{id}'}</code> (Lịch sử mã hóa)</div>
                    <div>• <code>/experiment_runs/{'{id}'}</code> (Kết quả thí nghiệm)</div>
                    <div>• <code>/quiz_scores/{'{id}'}</code> (Bảng điểm 10 câu)</div>
                  </div>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-amber-500/20 text-amber-300 text-[10px]">
                  Bảo mật: Rule validation chặn mọi truy cập trái phép của người dùng khác
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table with Alternatives */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          <span>Bảng So Sánh Với Các Giải Pháp Kiến Trúc Khác</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Đánh giá ưu nhược điểm giữa giải pháp được chọn (React + Firebase) so với các mô hình phần mềm truyền thống khác:
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-950/60 text-slate-300 font-mono">
                <th className="py-3 px-3 font-bold">Mô hình kiến trúc</th>
                <th className="py-3 px-3">Trải nghiệm tiếp cận (UX)</th>
                <th className="py-3 px-3">Hiệu năng mô phỏng</th>
                <th className="py-3 px-3">Chi phí & Bảo trì</th>
                <th className="py-3 px-3">Đánh giá phù hợp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr className="bg-cyan-950/20">
                <td className="py-3 px-3 font-bold text-cyan-300 font-mono">
                  React + Vite + Firebase (Lựa chọn hiện tại)
                </td>
                <td className="py-3 px-3 text-emerald-400">
                  Truy cập tức thì trên mọi trình duyệt web (Desktop, Mobile), không cần cài đặt.
                </td>
                <td className="py-3 px-3 text-emerald-400">
                  Cực cao (~60FPS mô phỏng 16x16, chạy hàng vạn mẫu phân tích thiên vị tức thời).
                </td>
                <td className="py-3 px-3 text-emerald-400 font-bold">
                  0 USD / tháng (Serverless, tự mở rộng vô hạn).
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    Tối ưu nhất
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-200 font-mono">
                  Python (Flask / Django) + PostgreSQL
                </td>
                <td className="py-3 px-3">
                  Cần triển khai máy chủ web; tải trang lại hoặc dùng WebSocket cho mô phỏng.
                </td>
                <td className="py-3 px-3 text-yellow-400">
                  Bị nghẽn nếu gửi từng bước hoán đổi mảng qua mạng (Network Latency).
                </td>
                <td className="py-3 px-3 text-rose-400">
                  Cần thuê VPS (5 – 20 USD/tháng), phải cấu hình sao lưu DB và giám sát uptime.
                </td>
                <td className="py-3 px-3 text-slate-400">
                  Tốn công vận hành không cần thiết.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-200 font-mono">
                  Node.js (Express) + MongoDB
                </td>
                <td className="py-3 px-3">
                  Web SPA truyền thống, cần viết hệ thống API RESTful và cấu hình xác thực JWT.
                </td>
                <td className="py-3 px-3 text-emerald-400">
                  Tương đương nếu xử lý client-side.
                </td>
                <td className="py-3 px-3 text-yellow-400">
                  Cần máy chủ backend Node liên tục chạy 24/7 để nhận request.
                </td>
                <td className="py-3 px-3 text-slate-400">
                  Tăng gấp đôi code boilerplate.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-200 font-mono">
                  Ứng Dụng CLI (C / Python)
                </td>
                <td className="py-3 px-3 text-rose-400">
                  Chỉ phù hợp với người dùng thành thạo terminal; không có giao diện trực quan 16x16.
                </td>
                <td className="py-3 px-3 text-emerald-400 font-bold">
                  Siêu nhanh (tốc độ mã máy C).
                </td>
                <td className="py-3 px-3 text-emerald-400">
                  Không tốn chi phí server.
                </td>
                <td className="py-3 px-3 text-slate-400">
                  Khó tiếp cận cho sinh viên mới học.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-bold text-slate-200 font-mono">
                  Desktop GUI (Electron / PyQt)
                </td>
                <td className="py-3 px-3 text-rose-400">
                  Người dùng phải tải file cài đặt dung lượng lớn (100MB+), lo ngại virus/malware.
                </td>
                <td className="py-3 px-3 text-emerald-400">
                  Tương tự web nhưng tốn RAM lớn.
                </td>
                <td className="py-3 px-3 text-yellow-400">
                  Phải duy trì nhiều bản build (Windows, macOS, Linux).
                </td>
                <td className="py-3 px-3 text-slate-400">
                  Kém linh hoạt hơn nền tảng web.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
