import React from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  details?: string;
  onRetry: () => void;
  onBackToSetup: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = 'Не удалось создать викторину',
  details,
  onRetry,
  onBackToSetup,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto px-4 py-16 text-center">
      <div className="backdrop-blur-xl bg-slate-900/80 border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {message}
          </h2>
          <p className="text-sm text-slate-400">
            {details || 'Произошла ошибка при обращении к AI. Проверьте соединение или попробуйте снова.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Попробовать снова</span>
          </button>

          <button
            type="button"
            onClick={onBackToSetup}
            className="w-full sm:w-auto py-3 px-5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>К настройкам</span>
          </button>
        </div>
      </div>
    </div>
  );
};
