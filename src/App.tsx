/**
 * RC4 Lab - Nền Tảng Học Tập & Mô Phỏng Mã Hóa Dòng Tương Tác
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { subscribeAuth } from './firebase/auth';
import { isFirebaseConfigured } from './firebase/config';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar, type NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { AnalysisView } from './views/AnalysisView';
import { ApplicationsView } from './views/ApplicationsView';
import { VisualizerView } from './views/VisualizerView';
import { CipherToolView } from './views/CipherToolView';
import { ExperimentsView } from './views/ExperimentsView';
import { QuizView } from './views/QuizView';
import { HistoryView } from './views/HistoryView';
import { ArchitectureView } from './views/ArchitectureView';
import { UxDesignView } from './views/UxDesignView';
import { TestingView } from './views/TestingView';
import { OpenSourceView } from './views/OpenSourceView';
import { DownloadView } from './views/DownloadView';
import { HandCalculationView } from './views/HandCalculationView';
import { BenchmarkView } from './views/BenchmarkView';
import { OfflineIndicator } from './pwa/OfflineIndicator';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Subscribe to Firebase Authentication state
  useEffect(() => {
    const unsubscribe = subscribeAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Mandatory Cryptographic Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Friendly offline notice when Firebase is not configured */}
      {!isFirebaseConfigured && (
        <aside aria-label="Thông báo chế độ độc lập" className="bg-cyan-950/40 border-b border-cyan-800/40 text-cyan-300 text-[11px] sm:text-xs px-4 py-1.5 flex items-center justify-center gap-2 text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 animate-pulse"></span>
          <span>
            Hệ thống đang hoạt động ở chế độ độc lập (Chưa cấu hình Firebase trong <code>.env</code>). Tất cả 15 module giải thuật, mô phỏng và kiểm thử hoạt động bình thường trên trình duyệt.
          </span>
        </aside>
      )}

      {/* 2. Sticky Cyberpunk Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* 3. Main Dynamic Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && <HomeView onNavigate={(tab) => setActiveTab(tab)} />}
        {activeTab === 'analysis' && <AnalysisView />}
        {activeTab === 'apps' && <ApplicationsView />}
        {activeTab === 'visualizer' && <VisualizerView />}
        {activeTab === 'hand_calculation' && <HandCalculationView />}
        {activeTab === 'cipher' && (
          <CipherToolView user={user} onOpenAuth={() => setAuthModalOpen(true)} />
        )}
        {activeTab === 'experiments' && (
          <ExperimentsView user={user} onOpenAuth={() => setAuthModalOpen(true)} />
        )}
        {activeTab === 'benchmark' && <BenchmarkView />}
        {activeTab === 'quiz' && (
          <QuizView user={user} onOpenAuth={() => setAuthModalOpen(true)} />
        )}
        {activeTab === 'testing' && <TestingView />}
        {activeTab === 'download' && <DownloadView />}
        {activeTab === 'architecture' && <ArchitectureView />}
        {activeTab === 'ux_design' && <UxDesignView />}
        {activeTab === 'opensource' && <OpenSourceView />}
        {activeTab === 'history' && (
          <HistoryView user={user} onOpenAuth={() => setAuthModalOpen(true)} />
        )}
      </main>

      {/* 4. Footer with Citations & Standards */}
      <Footer onTabChange={(tab) => setActiveTab(tab)} />

      {/* 5. Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="login"
      />

      {/* 6. Non-intrusive Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}
