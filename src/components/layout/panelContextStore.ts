/**
 * RC4 Lab - Dynamic Panel Context Store
 * Store cập nhật trạng thái thời gian thực giữa các View (Visualizer, Cipher, Experiments)
 * và RightContextPanel mà KHÔNG làm re-render toàn bộ AppShell trong quá trình chạy tự động (auto-play).
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSyncExternalStore } from 'react';

export interface VisualizerStepContext {
  phase: 'KSA' | 'PRGA';
  stepIndex: number;
  totalSteps: number;
  i: number;
  j: number;
  t?: number;
  k?: number;
  swapped: [number, number];
  formula: string;
  explanation: string;
  cipherVersion: 'full' | 'tiny';
  tinyN?: number;
  keyByte?: number;
  plainByte?: number;
  cipherByte?: number;
}

export interface CipherFormatContext {
  activeMode: 'encrypt' | 'decrypt';
  inputFormat: 'text' | 'hex';
  outputFormat: 'hex' | 'base64';
  dropBytes: number;
  dataLengthBytes: number;
  keyLengthBytes: number;
}

export interface ExperimentsContext {
  activeTab: 'bias' | 'key_reuse' | 'drop_n' | 'avalanche';
  biasKeyCount?: number;
  biasTargetByte?: 1 | 2;
}

export interface DynamicPanelState {
  visualizer?: VisualizerStepContext | null;
  cipher?: CipherFormatContext | null;
  experiments?: ExperimentsContext | null;
}

type Listener = () => void;

let currentState: DynamicPanelState = {};
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

/**
 * Cập nhật thông tin bước mô phỏng động của VisualizerView
 */
export function setVisualizerContext(ctx: VisualizerStepContext | null) {
  currentState = { ...currentState, visualizer: ctx };
  emitChange();
}

/**
 * Cập nhật thông tin định dạng và gợi ý của CipherToolView
 */
export function setCipherContext(ctx: CipherFormatContext | null) {
  currentState = { ...currentState, cipher: ctx };
  emitChange();
}

/**
 * Cập nhật thông tin thí nghiệm đang chọn của ExperimentsView
 */
export function setExperimentsContext(ctx: ExperimentsContext | null) {
  currentState = { ...currentState, experiments: ctx };
  emitChange();
}

/**
 * Đăng ký lắng nghe thay đổi store
 */
export function subscribePanelContext(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Lấy snapshot trạng thái hiện tại (dùng cho useSyncExternalStore)
 */
export function getPanelContextSnapshot(): DynamicPanelState {
  return currentState;
}

/**
 * Hook đọc trạng thái động dành riêng cho RightContextPanel.
 * Đảm bảo chỉ RightContextPanel re-render khi store thay đổi.
 */
export function useDynamicPanelContext(): DynamicPanelState {
  return useSyncExternalStore(subscribePanelContext, getPanelContextSnapshot);
}
