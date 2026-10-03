import React from 'react';
import { ShieldCheck, BookOpen, AlertTriangle, ExternalLink, Terminal, Github } from 'lucide-react';
import type { NavTab } from './Navbar';
import { REPO_URL } from '../config/project';

interface FooterProps {
  onTabChange: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-16 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                RC4 LAB // SIMULATOR
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
                Academic Edition
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Hệ thống phòng thí nghiệm và mô phỏng tương tác thuật toán mã hóa dòng RC4 (Rivest Cipher 4, 1987). Được xây dựng nhằm trang bị cho sinh viên, kỹ sư an toàn thông tin và người yêu mật mã góc nhìn trực quan về nguyên lý hoạt động, cấu trúc KSA/PRGA, cũng như các điểm yếu toán học dẫn đến sự khai tử của RC4 trong RFC 7465.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tiêu chuẩn tham chiếu: RFC 6229, RFC 7465, Shamir & Mantin (2001)</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-3 tracking-wider uppercase text-[11px]">
              Chuyên Mục Nghiên Cứu
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onTabChange('analysis')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Thuật toán KSA & PRGA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('visualizer')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Mô phỏng mảng trạng thái hoán vị S (lưới 16x16 để quan sát)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('hand_calculation')}
                  className="hover:text-amber-400 transition cursor-pointer text-amber-300 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Ví dụ tính tay TinyRC4 (Bài giảng)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('experiments')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Thực nghiệm thiên vị & Tái sử dụng khóa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('apps')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Ứng dụng thực tế (WEP, TLS & Khai tử)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('testing')}
                  className="hover:text-emerald-400 transition cursor-pointer flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Bộ kiểm thử tự động (Unit Tests)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('architecture')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Công nghệ & Kiến trúc hệ thống
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('ux_design')}
                  className="hover:text-cyan-400 transition cursor-pointer"
                >
                  Thiết kế UX/UI & Quy trình
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('download')}
                  className="hover:text-cyan-400 transition cursor-pointer text-cyan-300 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  Tải về rc4_cli.py & Cài đặt PWA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onTabChange('opensource')}
                  className="hover:text-cyan-400 transition cursor-pointer text-slate-300"
                >
                  Mã nguồn mở & Giấy phép MIT
                </button>
              </li>
            </ul>
          </div>

          {/* Disclaimer box */}
          <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Miễn trừ trách nhiệm</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Trang web này phục vụ mục đích đào tạo phi thương mại. Mọi thuật toán mô phỏng đều chạy trực tiếp trên client để giải thích cơ chế mật mã học. Không áp dụng thuật toán RC4 cho bất kỳ hệ thống truyền tin bảo mật nào hiện nay.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © 2026 RC4 Lab — Nền tảng diễn giải mật mã học trực quan. Phát triển cho cộng đồng nghiên cứu an toàn thông tin Việt Nam.
          </div>
          <div className="flex items-center gap-4">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-700">•</span>
            <span className="font-mono text-cyan-400/80">IETF RFC 7465 (Prohibiting RC4)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
