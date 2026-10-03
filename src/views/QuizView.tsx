import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Sparkles,
  BookmarkPlus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { User } from 'firebase/auth';
import { RC4_QUIZ_QUESTIONS } from '../data/quizQuestions';
import { saveQuizScore } from '../firebase/firestore';

interface QuizViewProps {
  user: User | null;
  onOpenAuth: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ user, onOpenAuth }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentQ = RC4_QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = RC4_QUIZ_QUESTIONS.length;

  // Track answer
  const handleSelectOption = (optionIndex: number) => {
    if (selectedAnswers[currentIdx] !== undefined) return; // Answered already
    setSelectedAnswers((prev) => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Completed quiz!
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      setElapsedTime(timeSpent);
      setIsCompleted(true);

      // Calculate score
      let correct = 0;
      RC4_QUIZ_QUESTIONS.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctIndex) correct++;
      });

      if (correct >= 7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
    setSavedSuccess(false);
  };

  // Compute final score
  const score = Object.entries(selectedAnswers).reduce((acc, [idx, ans]) => {
    const q = RC4_QUIZ_QUESTIONS[Number(idx)];
    return ans === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((score / totalQuestions) * 100);

  // Save to Firebase
  const handleSaveScore = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    try {
      setSaving(true);
      await saveQuizScore({
        score,
        totalQuestions,
        percentage,
        timeSpentSeconds: elapsedTime,
      });
      setSaving(false);
      setSavedSuccess(true);
    } catch (err: any) {
      setSaving(false);
      alert('Lỗi lưu điểm số: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Đánh Giá Năng Lực Mật Mã Học</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Bài Trắc Nghiệm Kiến Thức RC4 (10 Câu)
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Kiểm tra độ hiểu sâu của bạn về cấu trúc hoán vị S, thuật toán KSA, PRGA, các dạng tấn công FMS, Mantin-Shamir và lý do khai tử theo RFC 7465.
        </p>
      </div>

      {!isCompleted ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">
                Câu Hỏi {currentIdx + 1} / {totalQuestions}
              </span>
              <span className="text-slate-400">
                Đã trả lời: {Object.keys(selectedAnswers).length}/{totalQuestions}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQ.question}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIdx] === optIdx;
                const isAnswered = selectedAnswers[currentIdx] !== undefined;
                const isCorrect = optIdx === currentQ.correctIndex;

                let optionClass =
                  'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

                if (isAnswered) {
                  if (isCorrect) {
                    optionClass =
                      'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-medium shadow-[0_0_12px_rgba(16,185,129,0.2)]';
                  } else if (isSelected) {
                    optionClass =
                      'bg-rose-950/50 border-rose-500 text-rose-200 font-medium shadow-[0_0_12px_rgba(244,63,94,0.2)]';
                  } else {
                    optionClass = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between gap-3 cursor-pointer ${optionClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-xs sm:text-sm">{opt}</span>
                    </div>

                    {isAnswered && (
                      <div className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instant Feedback Explanation */}
          {selectedAnswers[currentIdx] !== undefined && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in ${
                selectedAnswers[currentIdx] === currentQ.correctIndex
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                {selectedAnswers[currentIdx] === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Chính xác!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-amber-400" />
                    <span>Giải thích chi tiết:</span>
                  </>
                )}
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Next / Finish Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentIdx] === undefined}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-40"
            >
              <span>{currentIdx < totalQuestions - 1 ? 'Câu Tiếp Theo' : 'Xem Điểm Tổng Kết'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Summary Score Card */
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto text-white shadow-xl shadow-cyan-500/30">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Kết Quả Bài Kiểm Tra RC4
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Bạn đã hoàn thành 10 câu hỏi trong {elapsedTime} giây.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto font-mono text-center">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px] uppercase">Điểm Số</div>
              <div className="text-2xl font-bold text-cyan-400">
                {score} <span className="text-xs text-slate-500">/ 10</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px] uppercase">Tỷ Lệ Đúng</div>
              <div className="text-2xl font-bold text-emerald-400">{percentage}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[11px] uppercase">Xếp Loại</div>
              <div className="text-xs font-bold text-purple-300 mt-2">
                {score >= 9 ? 'Xuất Sắc' : score >= 7 ? 'Khá Tốt' : score >= 5 ? 'Đạt' : 'Cần Ôn Lại'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm Lại Bài Thi</span>
            </button>

            <button
              onClick={handleSaveScore}
              disabled={saving || savedSuccess}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition cursor-pointer shadow-lg ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/20'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>
                {savedSuccess
                  ? 'Đã Lưu Điểm Thành Công!'
                  : user
                  ? 'Lưu Điểm Vào Hồ Sơ'
                  : 'Đăng Nhập Để Lưu Điểm'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
