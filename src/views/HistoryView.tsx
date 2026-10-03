import React, { useState, useEffect } from 'react';
import {
  History,
  Lock,
  FlaskConical,
  Award,
  Trash2,
  LogIn,
  Clock,
  KeyRound,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  subscribeEncryptionRuns,
  deleteEncryptionRun,
  subscribeExperimentRuns,
  deleteExperimentRun,
  subscribeQuizScores,
  deleteQuizScore,
  type EncryptionRunRecord,
  type ExperimentRunRecord,
  type QuizScoreRecord,
} from '../firebase/firestore';

interface HistoryViewProps {
  user: User | null;
  onOpenAuth: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ user, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'encryption' | 'experiments' | 'quiz'>('encryption');

  const [encryptionRuns, setEncryptionRuns] = useState<EncryptionRunRecord[]>([]);
  const [experimentRuns, setExperimentRuns] = useState<ExperimentRunRecord[]>([]);
  const [quizScores, setQuizScores] = useState<QuizScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore collections for the current authenticated user
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubEnc = subscribeEncryptionRuns(user.uid, (runs) => {
      setEncryptionRuns(runs);
      setLoading(false);
    });

    const unsubExp = subscribeExperimentRuns(user.uid, (exps) => {
      setExperimentRuns(exps);
    });

    const unsubQuiz = subscribeQuizScores(user.uid, (scores) => {
      setQuizScores(scores);
    });

    return () => {
      unsubEnc();
      unsubExp();
      unsubQuiz();
    };
  }, [user]);

  const handleDeleteRun = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bản ghi mã hóa này?')) return;
    try {
      await deleteEncryptionRun(id);
    } catch (err: any) {
      alert('Không thể xóa: ' + err.message);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa kết quả thực nghiệm này?')) return;
    try {
      await deleteExperimentRun(id);
    } catch (err: any) {
      alert('Không thể xóa: ' + err.message);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bản ghi điểm số này?')) return;
    try {
      await deleteQuizScore(id);
    } catch (err: any) {
      alert('Không thể xóa: ' + err.message);
    }
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Vừa xong';
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts);
      return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Vừa xong';
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
          <History className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Yêu Cầu Đăng Nhập</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Lịch sử lưu trữ là tính năng dành riêng cho người dùng đã đăng nhập. Mọi tác vụ mã hóa, kết quả thực nghiệm và điểm kiểm tra của bạn sẽ được bảo mật riêng tư trên cơ sở dữ liệu đám mây.
          </p>
        </div>
        <button
          onClick={onOpenAuth}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Đăng Nhập Hoặc Đăng Ký Miễn Phí</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span>Nhật Ký Học Tập Cá Nhân</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Lịch Sử Hoạt Động & Kết Quả Lưu Trữ
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Quản lý các phiên mã hóa RC4 đã lưu, các bài kiểm tra thực nghiệm thống kê và bảng theo dõi điểm số trắc nghiệm mật mã của bạn ({user.email}).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('encryption')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'encryption'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Lịch Sử Mã Hóa ({encryptionRuns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experiments')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'experiments'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Kết Quả Thực Nghiệm ({experimentRuns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'quiz'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Bảng Điểm Trắc Nghiệm ({quizScores.length})</span>
        </button>
      </div>

      {/* TAB 1: ENCRYPTION RUNS */}
      {activeTab === 'encryption' && (
        <div className="space-y-4 animate-in fade-in">
          {encryptionRuns.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
              <Lock className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm text-slate-300 font-medium">Chưa có bản ghi mã hóa nào</div>
              <p className="text-xs text-slate-500">
                Hãy chuyển sang trang "Mã Hóa/Giải Mã" và bấm "Lưu Vào Lịch Sử" để ghi nhận tại đây.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {encryptionRuns.map((run) => (
                <div
                  key={run.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        run.type === 'encrypt'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {run.type === 'encrypt' ? 'Mã Hóa' : 'Giải Mã'}
                    </span>
                    <button
                      onClick={() => handleDeleteRun(run.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                      title="Xóa mục này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="text-slate-400">
                      Khóa: <span className="text-cyan-300">"{run.keySnippet}"</span>
                    </div>
                    <div className="text-slate-400">
                      Đầu ra ({run.outputFormat}):{' '}
                      <span className="text-emerald-300 break-all">{run.outputSnippet}</span>
                    </div>
                    <div className="text-slate-400">
                      Kích thước: <span className="text-white">{run.inputLength} bytes</span>
                    </div>
                  </div>

                  {run.note && (
                    <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                      {run.note}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(run.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXPERIMENT RUNS */}
      {activeTab === 'experiments' && (
        <div className="space-y-4 animate-in fade-in">
          {experimentRuns.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
              <FlaskConical className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm text-slate-300 font-medium">Chưa có kết quả thực nghiệm nào</div>
              <p className="text-xs text-slate-500">
                Hãy sang mục "Thực Nghiệm" và nhấn "Lưu Kết Quả Này" sau khi chạy các bài test.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experimentRuns.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/30 transition space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                      {exp.experimentType}
                    </span>
                    <button
                      onClick={() => handleDeleteExp(exp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                      title="Xóa mục này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{exp.summary}</p>

                  {exp.metricValue && (
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300">
                      Chỉ số đo lường: {exp.metricValue}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(exp.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUIZ SCORES */}
      {activeTab === 'quiz' && (
        <div className="space-y-4 animate-in fade-in">
          {quizScores.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
              <Award className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm text-slate-300 font-medium">Chưa có bài thi nào được ghi nhận</div>
              <p className="text-xs text-slate-500">
                Làm bài trắc nghiệm 10 câu ở mục "Trắc Nghiệm" và lưu lại điểm số của bạn.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-slate-900/80 rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                    <th className="py-3 px-4">Thời gian hoàn thành</th>
                    <th className="py-3 px-4">Điểm số</th>
                    <th className="py-3 px-4">Tỷ lệ chính xác</th>
                    <th className="py-3 px-4">Thời gian làm bài</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {quizScores.map((score) => (
                    <tr key={score.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 text-slate-400">
                        {formatTimestamp(score.createdAt)}
                      </td>
                      <td className="py-3 px-4 font-bold text-cyan-300 text-sm">
                        {score.score} / {score.totalQuestions}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            score.percentage >= 80
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : score.percentage >= 50
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {score.percentage}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {score.timeSpentSeconds ? `${score.timeSpentSeconds} giây` : '---'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteQuiz(score.id)}
                          className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition cursor-pointer"
                          title="Xóa điểm thi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
