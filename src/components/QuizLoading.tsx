import React, { useEffect, useState } from 'react';
import { Sparkles, Brain, Cpu, CheckCircle2 } from 'lucide-react';

interface QuizLoadingProps {
  topic: string;
  numberOfQuestions: number;
}

const LOADING_STEPS = [
  'Анализируем выбранную тему...',
  'Генерируем проверенные вопросы...',
  'Формируем правдоподобные варианты ответа...',
  'Проверяем баланс сложности...',
  'Финальная компиляция теста...',
];

export const QuizLoading: React.FC<QuizLoadingProps> = ({
  topic,
  numberOfQuestions,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-16 text-center">
      <div className="relative">
        {/* Glow ambient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative backdrop-blur-xl bg-slate-900/80 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          {/* Animated AI Brain Icon with Orb */}
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-b-purple-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
            <div className="p-4 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 shadow-inner">
              <Brain className="w-8 h-8 text-indigo-300 animate-pulse" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text">
              AI создает вашу викторину...
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Тема: <span className="text-indigo-300 font-semibold">«{topic}»</span> • {numberOfQuestions} вопросов
            </p>
          </div>

          {/* Stepper info */}
          <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-left space-y-2.5">
            {LOADING_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className={`flex items-center space-x-2.5 text-xs sm:text-sm transition-all duration-300 ${
                    isCurrent
                      ? 'text-indigo-300 font-medium'
                      : isPast
                      ? 'text-slate-400 line-through opacity-70'
                      : 'text-slate-600'
                  }`}
                >
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-spin shrink-0" style={{ animationDuration: '3s' }} />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 flex items-center justify-center text-[9px] text-slate-600">
                      {idx + 1}
                    </div>
                  )}
                  <span>{step}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Генерация с использованием Google Gemini</span>
          </div>
        </div>
      </div>
    </div>
  );
};
