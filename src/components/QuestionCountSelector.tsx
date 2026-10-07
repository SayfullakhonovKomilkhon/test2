import React from 'react';
import { Hash } from 'lucide-react';

interface QuestionCountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const COUNT_OPTIONS = [5, 10, 15, 20, 30];

export const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-200">
          Количество вопросов
        </label>
        <span className="text-xs text-indigo-400 font-medium">
          Выбрано: {value} {getQuestionWord(value)}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {COUNT_OPTIONS.map((count) => {
          const isSelected = value === count;
          return (
            <button
              key={count}
              type="button"
              disabled={disabled}
              onClick={() => onChange(count)}
              className={`py-3 px-2 rounded-xl text-center border font-medium transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-600/20 text-white shadow-[0_0_16px_rgba(99,102,241,0.25)] border-2 scale-[1.02]'
                  : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:bg-white/[0.06]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-lg sm:text-xl font-bold tracking-tight">
                {count}
              </div>
              <div
                className={`text-[10px] mt-0.5 uppercase tracking-wider ${
                  isSelected ? 'text-indigo-300 font-semibold' : 'text-slate-500'
                }`}
              >
                {count === 5 ? 'вопросов' : count === 10 ? 'вопросов' : count === 20 ? 'вопросов' : 'вопросов'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

function getQuestionWord(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'вопрос';
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) return 'вопроса';
  return 'вопросов';
}
