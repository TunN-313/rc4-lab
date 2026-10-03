/**
 * RC4 Lab - Tài Liệu Thiết Kế UX/UI & Quy Trình Phát Triển
 * SPDX-License-Identifier: Apache-2.0
 */

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
  Layers,
  Code2,
  Terminal,
  Cpu,
  Lock,
  Binary,
  GraduationCap,
  Wrench,
  FlaskConical,
  FolderGit2,
  BookOpen,
  KeyRound,
  History,
  Activity,
  FileCode2,
  Check,
} from 'lucide-react';
import {
  NAV_GROUPS,
  NAV_PAGES,
  getPagesForGroup,
  type NavGroup,
  type NavTab,
} from '../components/layout/navConfig';

export const UxDesignView: React.FC = () => {
  const groupsList = Object.values(NAV_GROUPS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* ========================================================================= */}
      {/* HEADER SECTION                                                            */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tài Liệu Thiết Kế Trải Nghiệm & Giao Diện Người Dùng</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Hệ Thống Thiết Kế UX/UI & Quy Trình Phát Triển
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Tài liệu chuẩn hóa kiến trúc giao diện 6 vùng (App Shell), bản đồ điều hướng 5 nhóm chức năng, luồng trải nghiệm học thuật, chân dung người dùng (Personas), bảng token thiết kế và quy trình phối hợp phát triển.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. WIREFRAME SECTION: 6-REGION LAYOUT AS AN SVG / REACT DIAGRAM           */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            1. Kiến Trúc Vỏ Bọc Giao Diện 6 Vùng (App Shell Architecture)
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Giao diện máy tính để bàn (Desktop $\ge$ 1024px) được phân định thành 6 vùng chuyên biệt, tách rời thanh điều hướng tổng quát, danh sách chức năng con, không gian tương tác chính và thanh ngữ cảnh học thuật:
        </p>

        {/* Visual Layout Diagram (High-Fidelity Cyber Mockup) */}
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-950 p-4 sm:p-6 shadow-2xl shadow-cyan-950/40">
          <div className="text-[11px] font-mono text-cyan-400 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Sơ Đồ Bố Cục 6 Vùng Màn Hình Lớn (Desktop $\ge$ 1024px)
            </span>
            <span className="text-slate-500 hidden sm:inline">Tỷ lệ trực quan AppShell.tsx</span>
          </div>

          <div className="w-full aspect-[16/9] max-h-[460px] rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden flex flex-col font-mono text-[10px]">
            {/* Top Workspace Area */}
            <div className="flex-1 flex min-h-0 border-b border-slate-800">
              {/* Region 1: Left Rail */}
              <div className="w-16 bg-slate-950 border-r border-slate-800 p-2 flex flex-col items-center justify-between shrink-0">
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-bold text-[9px]">
                  RC4
                </div>
                <div className="space-y-2 w-full flex flex-col items-center">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-300 text-[10px]">
                    1
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    2
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    3
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    4
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                    5
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-cyan-900/40 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-[9px]">
                  👤
                </div>
              </div>

              {/* Region 2: Sidebar */}
              <div className="w-48 bg-slate-950/80 border-r border-slate-800 p-3 hidden md:flex flex-col justify-between shrink-0">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-cyan-300 uppercase pb-1 border-b border-slate-800 flex items-center justify-between">
                    <span>VÙNG 2: SIDEBAR</span>
                    <span className="text-cyan-400 text-[9px]">256px</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-white font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>Trang con 1 (Active)</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-400">
                    Trang con 2
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-slate-400">
                    Trang con 3
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-900/40 text-[9px] text-slate-500 border border-slate-800/60">
                  Lọc theo nhóm chọn từ Vùng 1
                </div>
              </div>

              {/* Center Area: Region 3 (Tabs) + Region 4 (Main Content) */}
              <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
                {/* Region 3: Tabs */}
                <div className="h-9 px-4 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 text-[9px]">
                      VÙNG 3: TAB 1 (Ví dụ TinyRC4)
                    </div>
                    <div className="px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[9px]">
                      TAB 2 (Full RC4 256B)
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 hidden sm:inline">Phân chế độ trong từng View</span>
                </div>

                {/* Region 4: Main Content Area */}
                <div className="flex-1 p-4 overflow-hidden flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900/40 to-slate-950">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-40 rounded bg-cyan-500/20 border border-cyan-500/40"></div>
                      <div className="h-4 w-24 rounded bg-slate-800"></div>
                    </div>
                    <div className="h-24 rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center justify-center text-slate-300 text-center font-sans text-xs">
                      <div>
                        <strong className="text-white block font-mono text-[11px] mb-1">
                          VÙNG 4: KHÔNG GIAN NỘI DUNG CHÍNH (MAIN VIEWPORT)
                        </strong>
                        <span className="text-[11px] text-slate-400">
                          Chứa toàn bộ 15 màn hình chuyên biệt (Mô phỏng 16x16, Mã hóa/Giải mã, Thực nghiệm, Kiểm thử,...)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900/40 border border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400">
                    <span>Footer tham chiếu & bản quyền ở đáy cuộn</span>
                    <span className="text-cyan-400">Scrollable: #main-content-scroll</span>
                  </div>
                </div>
              </div>

              {/* Region 5: Right Sidebar (Collapsible) */}
              <div className="w-56 bg-slate-950 border-l border-slate-800 p-3 hidden xl:flex flex-col justify-between shrink-0">
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-amber-300 uppercase pb-1 border-b border-slate-800 flex items-center justify-between">
                    <span>VÙNG 5: NGỮ CẢNH</span>
                    <span className="text-amber-400 text-[9px]">320px</span>
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[9px] text-cyan-200 space-y-1">
                    <div className="font-bold text-cyan-300">Live Step Info / Hints</div>
                    <div>$i, j, t$, công thức bước hiện tại</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[9px] text-slate-300 space-y-1">
                    <div className="font-bold text-slate-200">Ghi Chú Khoa Học</div>
                    <div>Đối chuẩn RFC 6229 & 7465</div>
                  </div>
                </div>
                <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800 text-[9px] text-slate-500 text-center">
                  Thu gọn tự do (Collapse)
                </div>
              </div>
            </div>

            {/* Region 6: Bottom Bar */}
            <div className="h-7 px-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">VÙNG 6: BOTTOM BAR (36px)</span>
                <span>• Full RC4 & TinyRC4</span>
                <span className="text-emerald-400">• Online Ready</span>
              </div>
              <div className="text-amber-300 hidden sm:inline">
                Khuyến cáo học thuật RFC 7465
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <span>GitHub</span>
                <span>• MIT License</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown of the 6 Regions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                Vùng 1
              </span>
              <span className="font-mono text-xs text-slate-400">Width: 64px</span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Left Rail (Thanh Ray Trái)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thanh dọc hẹp cố định chứa logo nhận diện, 5 biểu tượng nhóm chức năng kèm Tooltip nổi và Avatar mở menu tài khoản cá nhân.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                Vùng 2
              </span>
              <span className="font-mono text-xs text-slate-400">Width: 256px</span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Sidebar (Thanh Điều Hướng Nhóm)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Liệt kê danh sách các trang con thuộc nhóm đang chọn với Icon, tên trang, tóm tắt nhiệm vụ và huy hiệu nổi bật (Badge).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                Vùng 3
              </span>
              <span className="font-mono text-xs text-slate-400">Height: 36px</span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Tabs (Thanh Phân Chế Độ Con)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Thanh Tab đặt bên trong từng View để đổi phân nhánh: TinyRC4 / Full RC4 (Visualizer), Văn bản / Tệp (Cipher), 4 loại thử nghiệm (Experiments).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                Vùng 4
              </span>
              <span className="font-mono text-xs text-slate-400">Flex: 1 1 0%</span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Main Content (Khu Vực Nội Dung Chính)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Khung nhìn cuộn độc lập (`#main-content-scroll`) hiển thị nội dung trọn vẹn của 15 trang, tự động cuộn lên đầu trang khi chuyển hướng URL.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                Vùng 5
              </span>
              <span className="font-mono text-xs text-slate-400">Width: 320px (Collapsible)</span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Right Sidebar (Thanh Ngữ Cảnh Hỗ Trợ)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bảng thông tin ngữ cảnh bên phải: cập nhật bước chạy hoạt họa mô phỏng, công thức con trỏ, hướng dẫn mã hóa và khuyến cáo bảo mật.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                Vùng 6
              </span>
              <span className="font-mono text-xs text-slate-400">Height: 36px</span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Bottom Bar (Thanh Trạng Thái Đáy)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hiển thị phiên bản thuật toán đang chạy, tình trạng kết nối Cloud/Offline, cảnh báo miễn trừ trách nhiệm giáo dục và liên kết mã nguồn GitHub.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. NAVIGATION STRUCTURE: DYNAMIC TABLE FROM navConfig.ts                  */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">
            2. Cấu Trúc Điều Hướng 5 Nhóm & Toàn Bộ 15 Trang (Đọc Trực Tiếp Từ navConfig)
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Bảng phân bổ các module theo nhóm chức năng được nạp trực tiếp từ tập tin cấu hình hệ thống <code className="text-cyan-300">src/components/layout/navConfig.ts</code>, đảm bảo tính nhất quán tuyệt đối giữa kiến trúc và giao diện thực tế:
        </p>

        {/* Dynamic Groups & Pages Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono">
                <th className="py-3 px-4 w-44">Nhóm Chức Năng</th>
                <th className="py-3 px-4 w-52">Tên Trang & Hash Route</th>
                <th className="py-3 px-4">Tóm Tắt Nhiệm Vụ Nghiệp Vụ</th>
                <th className="py-3 px-4 w-28 text-center">Huy Hiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {groupsList.map((group) => {
                const GroupIcon = group.icon;
                const pages = group.pageIds.map((id) => NAV_PAGES[id]).filter(Boolean);

                return (
                  <React.Fragment key={group.id}>
                    {pages.map((page, pIdx) => {
                      const PageIcon = page.icon;
                      return (
                        <tr
                          key={page.id}
                          className="hover:bg-slate-900/80 transition group/row"
                        >
                          {pIdx === 0 && (
                            <td
                              rowSpan={pages.length}
                              className="py-3 px-4 align-top border-r border-slate-800 bg-slate-950/40"
                            >
                              <div className="flex items-center gap-2 font-bold text-white mb-1">
                                <div className="p-1 rounded-md bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                                  <GroupIcon className="w-3.5 h-3.5" />
                                </div>
                                <span>{group.label}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 leading-normal">
                                {group.description}
                              </p>
                              <div className="mt-2 text-[9px] font-mono text-cyan-400">
                                ID: <code>{group.id}</code>
                              </div>
                            </td>
                          )}
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <PageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="font-semibold text-white group-hover/row:text-cyan-300 transition">
                                {page.label}
                              </span>
                            </div>
                            <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                              #{'/'}
                              {page.id}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-slate-300 leading-relaxed text-[11px]">
                            {page.shortDesc}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {page.badge ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 border border-cyan-800 text-cyan-300">
                                {page.badge}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-[10px]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}

              {/* Special Route: History */}
              <tr className="bg-slate-950/60 border-t border-slate-700/80">
                <td className="py-3 px-4 align-top border-r border-slate-800 text-slate-400">
                  <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tài Khoản Cá Nhân</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    Truy cập qua Avatar menu hoặc URL trực tiếp (kèm Auth Guard)
                  </p>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-semibold text-amber-200">
                      Lịch Sử Cá Nhân
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                    #/history
                  </div>
                </td>
                <td className="py-2.5 px-4 text-slate-300 leading-relaxed text-[11px]">
                  Lưu trữ và tra cứu lịch sử mã hóa, kết quả thí nghiệm thiên vị và điểm thi trắc nghiệm trên Cloud Firestore.
                </td>
                <td className="py-2.5 px-4 text-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 border border-amber-800 text-amber-300">
                    Cá nhân
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Behavioral Adaptations */}
        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Quy Tắc Thích Ứng Trên Thiết Bị Di Động (&lt; 1024px)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-white block font-sans">1. Thanh Tab Đáy Cố Định</strong>
              <p className="text-[11px] text-slate-400">
                Left Rail chuyển thành Bottom Navigation Bar 5 biểu tượng nhóm chức năng + Avatar để chạm ngón tay cái dễ dàng.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-white block font-sans">2. Ngăn Kéo Trượt (Drawer)</strong>
              <p className="text-[11px] text-slate-400">
                Sidebar chuyển thành Slide-in Drawer có nền mờ backdrop, mở ra từ nút Menu hamburger ở góc trên bên trái.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-white block font-sans">3. Ẩn Bảng Ngữ Cảnh Phải</strong>
              <p className="text-[11px] text-slate-400">
                Right Sidebar tự động ẩn trên màn hình di động nhằm dành 100% diện tích cho nội dung học tập và bảng tính toán.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <strong className="text-white block font-sans">4. Tích Hợp Bottom Bar</strong>
              <p className="text-[11px] text-slate-400">
                Thanh trạng thái đáy được ẩn trên mobile để tránh đè lấn Bottom Nav; thông tin phiên bản và disclaimer được chuyển vào đáy Drawer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. USER FLOW DIAGRAM                                                      */}
      {/* ========================================================================= */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white">3. Sơ Đồ Luồng Trải Nghiệm Người Dùng (User Flow)</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Ứng dụng thiết lập một lộ trình học tập tăng dần về mặt nhận thức theo 4 giai đoạn logic, đồng thời cung cấp luồng tài khoản bảo mật để đồng bộ dữ liệu nghiên cứu cá nhân:
        </p>

        {/* 4-Stage Learning Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-cyan-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Giai đoạn 1</span>
              <BookOpen className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Học Lý Thuyết (Learn)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Đọc phân tích KSA/PRGA, tính chất toán học phép XOR, bối cảnh lịch sử 1994 và ví dụ bài giảng tính tay TinyRC4 ($N=8$).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2 relative group shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">Giai đoạn 2</span>
              <Cpu className="w-4 h-4 text-cyan-300" />
            </div>
            <h4 className="text-sm font-bold text-white">Mô Phỏng Trực Quan (Simulate)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Theo dõi ma trận hoán vị $S$ (16x16 & 1 hàng), điều khiển bước chạy KSA/PRGA, quan sát trực quan con trỏ $i, j, t$.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2 relative group shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Giai đoạn 3</span>
              <FlaskConical className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">Thực Nghiệm Chuyên Sâu (Experiment)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Chạy kiểm định thiên vị 50.000 khóa, thực hành tấn công tái sử dụng khóa (Crib Dragging), đo đạc hiệu ứng thác đổ.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2 relative group shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">Giai đoạn 4</span>
              <GraduationCap className="w-4 h-4 text-purple-300" />
            </div>
            <h4 className="text-sm font-bold text-white">Kiểm Tra Năng Lực (Quiz)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Làm bài thi trắc nghiệm ngẫu nhiên 10 câu, nhận phản hồi giải thích đáp án tức thời và lưu điểm số vào hồ sơ cá nhân.
            </p>
          </div>
        </div>

        {/* Account Flow & History Guard */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Luồng Quản Lý Tài Khoản & Cơ Chế Bảo Vệ Tuyến Đường (Route Guard)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">Bước A • Chế Độ Khách (Guest)</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Người dùng chưa đăng nhập có toàn quyền sử dụng 100% tất cả 15 module giải thuật, chạy mô phỏng, thực nghiệm và kiểm thử offline trong trình duyệt.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">Bước B • Đăng Nhập / Đăng Ký (Auth Modal)</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bấm nút đăng nhập trên Avatar hoặc ở các tính năng lưu trữ để mở cửa sổ xác thực an toàn qua Email/Password hoặc Google Sign-In.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">Bước C • Đồng Bộ Đám Mây & Route Guard</span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Khi truy cập trực tiếp <code className="text-amber-300">#/history</code> khi chưa đăng nhập, hệ thống tự động mở AuthModal và fallback an toàn về trang trước mà không để lộ màn hình trống.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PERSONAS, DESIGN TOKENS & ACCESSIBILITY                                */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        {/* Personas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">4. Chân Dung Người Dùng Mục Tiêu (Target Personas)</h2>
          </div>
          <p className="text-xs text-slate-400 italic">
            * Các nhân vật dưới đây là nhân vật giả định phục vụ thiết kế, không phải người thật.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <strong>Mục tiêu:</strong> Cần hiểu sâu bản chất toán học của KSA và PRGA để chuẩn bị bài thi môn Mật mã học cơ sở và làm bài tập lớn.
                </p>
                <p>
                  <strong>Nỗi đau:</strong> Giáo trình chỉ có mã giả khô khan, khó hình dung trực quan cơ chế tráo đổi mảng hoán vị và phép XOR từng byte nhị phân.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-200">
                  ★ <strong>Hành vi chính:</strong> Dùng "Mô Phỏng Mảng S" để tua từng bước và làm bài "Trắc Nghiệm" để đánh giá kiến thức.
                </div>
              </div>
            </div>

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
                  <strong>Mục tiêu:</strong> Cần chứng cứ thực nghiệm rõ ràng vì sao RC4 bị cấm triệt để trong cấu hình TLS/SSL theo RFC 7465.
                </p>
                <p>
                  <strong>Nỗi đau:</strong> Thiếu công cụ chạy thử nghiệm thống kê thiên vị Mantin-Shamir và tấn công tái sử dụng khóa (Two-Time Pad).
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-200">
                  ★ <strong>Hành vi chính:</strong> Chạy bài test thiên vị 50.000 khóa và giả lập tấn công kéo trượt từ đoán (Crib Dragging).
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-purple-500/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-lg font-mono">
                  QH
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Lê Quang Huy (42 tuổi)</h3>
                  <div className="text-[11px] text-purple-300 font-mono">Giảng viên Mật mã học & An toàn thông tin</div>
                </div>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <p>
                  <strong>Mục tiêu:</strong> Cần công cụ trực quan, tương tác trực tiếp trên trình duyệt để trình chiếu bài giảng trên lớp và minh họa ví dụ tính tay.
                </p>
                <p>
                  <strong>Nỗi đau:</strong> Các applet Java cũ đã bị trình duyệt chặn, script Python CLI khó hiển thị đồ họa tương tác cho sinh viên.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-purple-200">
                  ★ <strong>Hành vi chính:</strong> Trình chiếu "Ví Dụ Tính Tay TinyRC4", chiếu sơ đồ KSA/PRGA và tải file `rc4_cli.py` về cho sinh viên thực hành.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Design Tokens & Accessibility */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Hệ Thống Design Tokens & Khả Năng Tiếp Cận Đã Triển Khai</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pointer Colors */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>Màu Sắc Con Trỏ & Trạng Thái</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#020617] border border-slate-800 flex items-center justify-between text-slate-300">
                  <span>Nền Cyber Dark</span>
                  <span className="font-mono text-[11px] text-cyan-400">#020617</span>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-between text-cyan-200">
                  <span>Con trỏ i (Duyệt tuần tự)</span>
                  <span className="font-mono text-[11px] text-cyan-400">#06b6d4</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-between text-amber-200">
                  <span>Con trỏ j (Xáo trộn khóa)</span>
                  <span className="font-mono text-[11px] text-amber-400">#f59e0b</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-between text-purple-200">
                  <span>Chỉ số tra cứu t = (S[i]+S[j])</span>
                  <span className="font-mono text-[11px] text-purple-400">#a855f7</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-emerald-200">
                  <span>Khóa k = S[t] & Hoán đổi</span>
                  <span className="font-mono text-[11px] text-emerald-400">#10b981</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-between text-rose-200">
                  <span>Thiên vị byte 2 & Lỗ hổng</span>
                  <span className="font-mono text-[11px] text-rose-400">#f43f5e</span>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-cyan-400" />
                <span>Hệ Thống Phông Chữ (Typography)</span>
              </h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div>
                  <strong className="text-white font-sans text-sm">Inter (Sans-serif)</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Dùng cho toàn bộ thanh điều hướng, tiêu đề bài viết, nhãn form, văn bản giải thích nghiệp vụ và kết quả nghiên cứu.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <strong className="text-cyan-300 font-mono text-sm">Fira Code (Monospace)</strong>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Dùng cho mảng byte Hex (<code>0x4B</code>), chuỗi nhị phân, công thức toán học modulo, ma trận hoán vị $S$ và mã nguồn CLI.
                  </p>
                </div>
              </div>
            </div>

            {/* Implemented Accessibility */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Khả Năng Tiếp Cận Thực Tế (a11y)</span>
              </h3>
              <ul className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>Vòng nét chọn (Focus Ring):</strong> Toàn bộ nút bấm, biểu tượng và liên kết đều có <code>focus-visible:ring-2 focus-visible:ring-cyan-400</code> viền sáng rõ nét.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>Phím Escape:</strong> Nhấn <kbd className="px-1 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-cyan-300">Esc</kbd> tự động đóng nhanh menu tài khoản và ngăn kéo di động.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>Thuộc tính ARIA đầy đủ:</strong> Khai báo chuẩn <code>aria-expanded</code>, <code>aria-controls</code>, <code>role="navigation"</code>, <code>role="region"</code> và <code>role="menu"</code>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>
                    <strong>Độ tương phản:</strong> Giao diện hướng tới mức WCAG AA cho chữ và điều hướng chính.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DESIGN PROCESS NOTE                                                    */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-cyan-950/20">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-base">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h2>5. Quy Trình Thiết Kế & Phát Triển (Design & Engineering Process)</h2>
        </div>
        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          <p>
            Dự án RC4 Lab áp dụng quy trình phát triển lặp có kiểm soát chặt chẽ, kết hợp minh bạch giữa các công cụ trí tuệ nhân tạo (AI) và chuyên môn kỹ thuật của nhóm phát triển:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                <span>Vai Trò Của Các Công Cụ Trí Tuệ Nhân Tạo (AI)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
                  <span>
                    <strong>Google AI Studio:</strong> Sinh bản dựng khởi đầu (first build) của ứng dụng từ các đặc tả giao diện và thuật toán cơ sở ban đầu.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
                  <span>
                    <strong>Google Antigravity:</strong> Đảm nhiệm quá trình tái cấu trúc chuyên sâu (refactoring), sửa lỗi và hiện thực hóa toàn bộ kiến trúc bố cục App Shell 6 vùng.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
                  <span>
                    <strong>Trợ lý AI hội thoại:</strong> Hỗ trợ soạn thảo, tối ưu prompt và rà soát chéo (code review) mã nguồn trong các phiên làm việc.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Vai Trò Trọng Tâm Của Nhóm Kỹ Sư Phát Triển</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono text-[10px] mt-0.5">•</span>
                  <span>
                    <strong>Định nghĩa yêu cầu:</strong> Xác lập toàn bộ yêu cầu bảo mật, mục tiêu học thuật và cấu trúc điều hướng của hệ thống.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono text-[10px] mt-0.5">•</span>
                  <span>
                    <strong>Đối chuẩn thuật toán:</strong> Rà soát và đối chuẩn từng bước KSA/PRGA với ví dụ bài giảng của giảng viên và các tài liệu RFC tiêu chuẩn.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono text-[10px] mt-0.5">•</span>
                  <span>
                    <strong>Kiểm thử & Quyết định:</strong> Thực thi kiểm thử tự động (<code className="text-emerald-300 font-mono">npm run lint</code>, <code className="text-emerald-300 font-mono">npm run build</code>) qua từng bước nhỏ và đưa ra mọi quyết định kỹ thuật cuối cùng.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
