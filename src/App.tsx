/**
 * RC4 Lab - Nền Tảng Học Tập & Mô Phỏng Mã Hóa Dòng Tương Tác
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import type { User } from 'firebase/auth';
import { subscribeAuth } from './firebase/auth';
import { isFirebaseConfigured } from './firebase/config';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AppShell } from './components/layout/AppShell';
import {
  getGroupForPage,
  ALL_PAGE_KEYS,
  NAV_GROUPS,
  type NavTab,
  type NavGroup,
} from './components/layout/navConfig';

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

/**
 * Trích xuất mã định danh trang hợp lệ từ hash URL (e.g. #/visualizer -> visualizer)
 */
function getTabFromHash(hash: string): NavTab | null {
  if (!hash) return null;
  const clean = hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (ALL_PAGE_KEYS.includes(clean as NavTab)) {
    return clean as NavTab;
  }
  return null;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Khởi tạo tab từ hash URL hoặc mặc định là 'home'
  const initialHashTab = typeof window !== 'undefined' ? getTabFromHash(window.location.hash) : null;
  const initialTab: NavTab = initialHashTab || 'home';

  const [activeTab, setActiveTab] = useState<NavTab>(initialTab);
  const [activeGroup, setActiveGroup] = useState<NavGroup>(getGroupForPage(initialTab));
  const previousTabRef = useRef<NavTab>(initialTab === 'history' ? 'home' : initialTab);

  // Đăng ký lắng nghe trạng thái Firebase Authentication
  useEffect(() => {
    const unsubscribe = subscribeAuth((currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Đảm bảo hash URL luôn được chuẩn hóa
  useEffect(() => {
    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
      window.location.hash = '#/' + initialTab;
    }
  }, [initialTab]);

  // Điều hướng chuyển trang tập trung: đồng bộ hash, group, tab và cuộn trang
  const handleNavigate = (page: NavTab) => {
    // Điều kiện bảo vệ: Nếu vào trang history khi chưa đăng nhập và đã kiểm tra auth xong
    if (page === 'history' && !user && authReady) {
      setAuthModalOpen(true);
      const fallback = previousTabRef.current === 'history' ? 'home' : (previousTabRef.current || 'home');
      window.location.hash = '#/' + fallback;
      return;
    }

    if (activeTab !== 'history') {
      previousTabRef.current = activeTab;
    }

    setActiveTab(page);
    setActiveGroup(getGroupForPage(page));

    const targetHash = '#/' + page;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }

    // Cuộn vùng nội dung chính lên đầu trang
    const scrollEl = document.getElementById('main-content-scroll');
    if (scrollEl) {
      scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi chọn nhóm chức năng từ LeftRail hoặc Mobile Drawer
  const handleSelectGroup = (group: NavGroup) => {
    setActiveGroup(group);
    const groupPages = NAV_GROUPS[group]?.pageIds;
    // Nếu trang hiện tại không nằm trong nhóm được chọn, tự động chuyển đến trang đầu của nhóm
    if (groupPages && groupPages.length > 0 && !groupPages.includes(activeTab)) {
      handleNavigate(groupPages[0]);
    }
  };

  // Lắng nghe sự kiện thay đổi hash của trình duyệt (Back, Forward, nhập URL trực tiếp)
  useEffect(() => {
    const handleHashChange = () => {
      const targetTab = getTabFromHash(window.location.hash);
      if (!targetTab) {
        if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
          handleNavigate('home');
        }
        return;
      }

      if (targetTab === 'history' && !user && authReady) {
        setAuthModalOpen(true);
        const fallback = previousTabRef.current === 'history' ? 'home' : (previousTabRef.current || 'home');
        window.location.hash = '#/' + fallback;
        return;
      }

      if (activeTab !== 'history') {
        previousTabRef.current = activeTab;
      }

      setActiveTab(targetTab);
      setActiveGroup(getGroupForPage(targetTab));

      const scrollEl = document.getElementById('main-content-scroll');
      if (scrollEl) {
        scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user, authReady, activeTab]);

  // Kiểm tra quyền khi trạng thái đăng nhập được tải xong (tránh tình trạng refresh vào thẳng #/history khi chưa login)
  useEffect(() => {
    if (authReady && activeTab === 'history' && !user) {
      setAuthModalOpen(true);
      const fallback = previousTabRef.current === 'history' ? 'home' : (previousTabRef.current || 'home');
      setActiveTab(fallback);
      setActiveGroup(getGroupForPage(fallback));
      window.location.hash = '#/' + fallback;
    }
  }, [authReady, user, activeTab]);

  return (
    <>
      <AppShell
        activeGroup={activeGroup}
        activePage={activeTab}
        onSelectGroup={handleSelectGroup}
        onSelectPage={handleNavigate}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      >
        {/* 1. Banner cảnh báo an toàn mật mã học bắt buộc */}
        <DisclaimerBanner />

        {/* Thông báo chế độ độc lập khi chưa cấu hình Firebase */}
        {!isFirebaseConfigured && (
          <aside
            aria-label="Thông báo chế độ độc lập"
            className="bg-cyan-950/40 border-b border-cyan-800/40 text-cyan-300 text-[11px] sm:text-xs px-4 py-1.5 flex items-center justify-center gap-2 text-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 animate-pulse"></span>
            <span>
              Hệ thống đang hoạt động ở chế độ độc lập (Chưa cấu hình Firebase trong <code>.env</code>). Tất cả 15 module giải thuật, mô phỏng và kiểm thử hoạt động bình thường trên trình duyệt.
            </span>
          </aside>
        )}

        {/* 2. Vùng hiển thị toàn bộ 15 trang của ứng dụng */}
        {activeTab === 'home' && <HomeView onNavigate={handleNavigate} />}
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

        {/* 3. Footer tham chiếu tiêu chuẩn & liên kết chuyển nhanh */}
        <Footer onTabChange={handleNavigate} />
      </AppShell>

      {/* 4. Modal đăng nhập / đăng ký tài khoản */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="login"
      />

      {/* 5. Chỉ báo trạng thái ngoại tuyến PWA */}
      <OfflineIndicator />
    </>
  );
}
