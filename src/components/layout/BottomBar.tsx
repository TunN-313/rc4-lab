import React from 'react';
import {
  Cpu,
  ShieldAlert,
  Github,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';
import { isFirebaseConfigured } from '../../firebase/config';
import { PWAInstallButton } from '../../pwa/PWAInstallButton';
import { REPO_URL } from '../../config/project';

export const BottomBar: React.FC = () => {
  return (
    <footer
      aria-label="Thanh trạng thái hệ thống"
      className="hidden lg:flex items-center justify-between h-9 px-4 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 select-none z-30 shrink-0"
    >
      {/* Left: Active Version & Connectivity Status */}
      <div className="flex items-center gap-3 font-mono">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Full RC4 (256B) & TinyRC4 (N=8)</span>
        </div>

        <span className="text-slate-700">•</span>

        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400">
            {isFirebaseConfigured ? 'Cloud Sync Online' : 'Chế độ Độc Lập (Offline Ready)'}
          </span>
        </div>
      </div>

      {/* Center: Educational Disclaimer Notice */}
      <div className="flex items-center gap-1.5 text-amber-300/90 font-medium">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Chỉ dùng cho mục đích học tập & nghiên cứu — Bị cấm trong TLS theo RFC 7465</span>
      </div>

      {/* Right: GitHub, License & PWA */}
      <div className="flex items-center gap-3">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-400 hover:text-white transition"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>

        <span className="text-slate-700">•</span>

        <span className="font-mono text-slate-500">MIT License</span>

        <span className="text-slate-700">•</span>

        <PWAInstallButton compact={true} />
      </div>
    </footer>
  );
};
