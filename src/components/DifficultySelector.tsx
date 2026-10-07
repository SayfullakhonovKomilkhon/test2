import React from 'react';
import { Difficulty } from '../types/quiz';
import { Shield, Zap, Flame } from 'lucide-react';

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
  disabled?: boolean;
}

interface DifficultyOption {
  id: Difficulty;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  activeBg: string;
}

const options: DifficultyOption[] = [
  {
    id: 'easy',
    title: 'Легкий',
    badge: 'Базовый',
    description: 'Вопросы проверяют базовые знания и понимание основных понятий темы.',
    icon: Shield,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    activeBg: 'bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
  },
  {
    id: 'medium',
    title: 'Средний',
    badge: 'Рекомендуемый',
    description: 'Вопросы требуют хорошего понимания темы и практического применения знаний.',
    icon: Zap,
    color: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    activeBg: 'bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  },
  {
    id: 'hard',
    title: 'Сложный',
    badge: 'Продвинутый',
    description: 'Вопросы требуют глубокого понимания, анализа, сравнения и экспертных знаний.',
    icon: Flame,
    color: 'text-rose-400',
    borderColor: 'border-rose-500/50',
    activeBg: 'bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
  },
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2.5">
      <label className="block text-sm font-semibold text-slate-200">
        Уровень сложности
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = value === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(opt.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? `${opt.borderColor} ${opt.activeBg} border-2`
                  : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSelected && (
                <div
                  className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none rounded-bl-full"
                />
              )}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected
                        ? 'bg-white/15 ' + opt.color
                        : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-white tracking-wide text-sm">
                    {opt.title}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? `${opt.borderColor} ${opt.color} bg-white/5`
                      : 'border-white/10 text-slate-400 bg-white/[0.02]'
                  }`}
                >
                  {opt.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
