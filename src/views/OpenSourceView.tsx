import React, { useState } from 'react';
import {
  Code2,
  GitBranch,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  FileCode,
  PackageCheck,
  HeartHandshake,
  Terminal,
  Sparkles,
} from 'lucide-react';

import {
  REPO_FULL_NAME,
  REPO_URL,
  CLONE_CMD,
  REPO_IS_PUBLIC,
} from '../config/project';

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const OpenSourceView: React.FC = () => {
  const [copiedClone, setCopiedClone] = useState(false);
  const [copiedRepoUrl, setCopiedRepoUrl] = useState(false);

  const repoUrl = REPO_URL;
  const cloneCmd = CLONE_CMD;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCmd);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const handleCopyRepo = () => {
    navigator.clipboard.writeText(repoUrl);
    setCopiedRepoUrl(true);
    setTimeout(() => setCopiedRepoUrl(false), 2000);
  };

  // Open-source libraries catalog
  const thirdPartyLibraries = [
    {
      name: 'React 19 & React DOM',
      version: '^19.0.1',
      license: 'MIT',
      author: 'Meta Platforms, Inc.',
      description: 'Thư viện xây dựng giao diện người dùng theo component hướng trạng thái phản ứng.',
      url: 'https://react.dev/',
    },
    {
      name: 'TypeScript',
      version: '^7.0.2',
      license: 'Apache-2.0',
      author: 'Microsoft Corporation',
      description: 'Ngôn ngữ mở rộng có định kiểu tĩnh cho JavaScript, bảo đảm an toàn mảng byte mật mã.',
      url: 'https://www.typescriptlang.org/',
    },
    {
      name: 'Vite',
      version: '^8.3.0',
      license: 'MIT',
      author: 'Evan You & Cộng sự',
      description: 'Công cụ đóng gói module thế hệ mới, tối ưu hóa quá trình biên dịch và dev server.',
      url: 'https://vitejs.dev/',
    },
    {
      name: 'Tailwind CSS v4',
      version: '^4.3.3',
      license: 'MIT',
      author: 'Tailwind Labs, Inc.',
      description: 'Framework tiện ích CSS hiệu năng cao với cấu hình engine mới nhất không cần runtime.',
      url: 'https://tailwindcss.com/',
    },
    {
      name: 'Firebase JS SDK',
      version: '^12.19.0',
      license: 'Apache-2.0',
      author: 'Google LLC',
      description: 'Bộ SDK đám mây tích hợp Authentication (OAuth 2.0) và cơ sở dữ liệu Cloud Firestore.',
      url: 'https://firebase.google.com/',
    },
    {
      name: 'Lucide React',
      version: '^0.546.0',
      license: 'ISC',
      author: 'Lucide Project Contributors',
      description: 'Bộ biểu tượng vector giao diện phòng thí nghiệm thanh mảnh và hiện đại.',
      url: 'https://lucide.dev/',
    },
    {
      name: 'Vite Plugin PWA',
      version: '^1.3.0',
      license: 'MIT',
      author: 'Anthony Fu & Vite PWA Team',
      description: 'Plugin tự động hóa Service Worker và Web App Manifest biến ứng dụng thành Progressive Web App.',
      url: 'https://vite-pwa-org.netlify.app/',
    },
    {
      name: 'Canvas Confetti',
      version: '^1.9.4',
      license: 'ISC',
      author: 'Kiril Vatev',
      description: 'Hiệu ứng pháo hoa chúc mừng bằng HTML5 Canvas cho màn hình tổng kết bài thi trắc nghiệm.',
      url: 'https://www.npmjs.com/package/canvas-confetti',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Mã Nguồn Mở & Cộng Đồng Mật Mã Học</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mã Nguồn Mở & Giấy Phép MIT
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          RC4 Lab là dự án phần mềm mã nguồn mở hoàn toàn miễn phí vì mục đích giáo dục cộng đồng. Mọi cá nhân, sinh viên và tổ chức giáo dục đều có quyền nghiên cứu, sao chép và đóng góp phát triển.
        </p>
      </div>

      {/* GitHub Repository Card */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <GithubIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">{REPO_FULL_NAME}</h2>
                {REPO_IS_PUBLIC ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300">
                    Public Repo
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950/80 border border-amber-800/80 text-amber-300">
                    Private Repo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kho lưu trữ chính thức trên GitHub của dự án RC4 Lab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyRepo}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              {copiedRepoUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép liên kết!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sao Chép URL</span>
                </>
              )}
            </button>

            <a
              href={repoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              <span>Xem Trên GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Clone command strip */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300 overflow-x-auto">
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-slate-500 select-none">$</span>
            <span className="text-cyan-300 select-all">{cloneCmd}</span>
          </div>
          <button
            onClick={handleCopyClone}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
            title="Sao chép lệnh git clone"
          >
            {copiedClone ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </section>

      {/* MIT License Section */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Giấy Phép Mã Nguồn Mở: MIT License</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Copyright (c) 2026 Hoàng Long & RC4 Lab Contributors</span>
        </div>

        {/* Rights breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-bold">✓ Quyền được cấp</span>
            <ul className="text-slate-300 space-y-1 pt-1 text-[11px]">
              <li>• Tự do sử dụng cho mục đích cá nhân & giáo dục</li>
              <li>• Quyền chỉnh sửa, cải tiến mã nguồn</li>
              <li>• Quyền phân phối và triển khai lại</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold">ℹ Điều kiện bắt buộc</span>
            <ul className="text-slate-300 space-y-1 pt-1 text-[11px]">
              <li>• Giữ nguyên thông báo bản quyền gốc (Copyright Notice)</li>
              <li>• Đính kèm toàn văn giấy phép MIT khi phân phối lại</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-rose-400 font-bold">⚠ Giới hạn trách nhiệm</span>
            <ul className="text-slate-300 space-y-1 pt-1 text-[11px]">
              <li>• Không có bảo đảm về tính thương mại</li>
              <li>• Tác giả không chịu trách nhiệm nếu dùng sai mục đích</li>
            </ul>
          </div>
        </div>

        {/* Full License Viewer Box */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400">Toàn văn tệp LICENSE:</div>
          <pre className="p-5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-x-auto select-all">
{`MIT License

Copyright (c) 2026 Hoang Long & RC4 Lab Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

DISCLAIMER:
THIS SOFTWARE IS FOR EDUCATIONAL AND ACADEMIC RESEARCH PURPOSES ONLY.
RC4 IS A CRYPTOGRAPHICALLY BROKEN ALGORITHM WITH DOCUMENTED MATHEMATICAL
VULNERABILITIES (PROHIBITED BY IETF RFC 7465). DO NOT USE THIS CIPHER TO
PROTECT SENSITIVE, PRODUCTION, OR REAL-WORLD DATA.`}
          </pre>
        </div>
      </section>

      {/* Contribution Guidelines */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Hướng Dẫn Đóng Góp Mã Nguồn (Contribution Guidelines)</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Chúng tôi rất hoan nghênh các đóng góp từ sinh viên, giảng viên và kỹ sư an toàn thông tin để hoàn thiện thêm bộ diễn giải mật mã học:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">Bước 1: Fork & Clone</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Fork kho lưu trữ về tài khoản GitHub cá nhân và clone về máy tính của bạn qua Git.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">Bước 2: Tạo Nhánh Mới</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Đặt tên nhánh theo quy ước: <code>feature/ten-tinh-nang</code> hoặc <code>fix/loi-can-sua</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">Bước 3: Lint & Kiểm Thử</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Chạy lệnh <code>npm run lint</code> và thực thi 12 bài Unit Tests để đảm bảo không lỗi kiểu dữ liệu.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold">Bước 4: Tạo Pull Request</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Gửi PR kèm giải thích lý do thay đổi và ảnh chụp màn hình minh họa (nếu có cập nhật UI).
            </p>
          </div>
        </div>
      </section>

      {/* Third-Party Open Source Libraries List */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Thư Viện Mã Nguồn Mở Sử Dụng Trong Dự Án</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">8 Thư viện cốt lõi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-950/70 text-slate-300 font-mono">
                <th className="py-3 px-4 font-bold">Tên Thư Viện</th>
                <th className="py-3 px-4">Phiên Bản</th>
                <th className="py-3 px-4">Giấy Phép</th>
                <th className="py-3 px-4">Tác Giả / Tổ Chức</th>
                <th className="py-3 px-4">Mô Tả Chức Năng</th>
                <th className="py-3 px-4 text-right">Liên Kết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {thirdPartyLibraries.map((lib, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white font-mono">{lib.name}</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">{lib.version}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-200">
                      {lib.license}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{lib.author}</td>
                  <td className="py-3 px-4 text-slate-300">{lib.description}</td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={lib.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 p-1 inline-block"
                      title="Trang chủ thư viện"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
