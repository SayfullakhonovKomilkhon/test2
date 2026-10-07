import React, { useState } from 'react';
import { QuizSettings, Difficulty } from '../types/quiz';
import { DifficultySelector } from './DifficultySelector';
import { QuestionCountSelector } from './QuestionCountSelector';
import { Sparkles, Brain, AlertCircle, Compass } from 'lucide-react';

interface QuizSetupProps {
  initialSettings?: Partial<QuizSettings>;
  onSubmit: (settings: QuizSettings) => void;
  isLoading?: boolean;
}

const EXAMPLE_TOPICS = [
  'История Узбекистана',
  'JavaScript и React',
  'Футбол и Лига Чемпионов',
  'Физика и Вселенная',
  'Искусственный интеллект',
  'Всемирная история',
  'Кинематограф',
  'Python для начинающих',
];

export const QuizSetup: React.FC<QuizSetupProps> = ({
  initialSettings,
  onSubmit,
  isLoading = false,
}) => {
  const [topic, setTopic] = useState(initialSettings?.topic || '');
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(
    initialSettings?.numberOfQuestions || 10
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialSettings?.difficulty || 'medium'
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Введите тему викторины');
      return;
    }
    setError(null);
    onSubmit({
      topic: topic.trim(),
      numberOfQuestions,
      difficulty,
    });
  };

  const handleSelectTopic = (sampleTopic: string) => {
    setTopic(sampleTopic);
    if (error) setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Decorative Glow */}
      <div className="relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-80 h-36 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative backdrop-blur-xl bg-slate-900/80 border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-10 transition-all">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 mb-4 shadow-inner">
              <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text">
              AI Quiz
            </h1>
            <p className="mt-2 text-slate-400 text-sm sm:text-base font-normal max-w-md mx-auto">
              Создай собственную викторину с помощью искусственного интеллекта
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input Field */}
            <div className="space-y-2">
              <label
                htmlFor="topic-input"
                className="block text-sm font-semibold text-slate-200"
              >
                На какую тему создать вопросы?
                <span className="text-indigo-400 ml-1">*</span>
              </label>

              <div className="relative">
                <input
                  id="topic-input"
                  type="text"
                  value={topic}
                  disabled={isLoading}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Например: Искусственный интеллект, история Узбекистана, JavaScript, футбол..."
                  className={`w-full px-4 py-3.5 rounded-xl bg-slate-950/60 border text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-200 text-sm sm:text-base ${
                    error
                      ? 'border-rose-500/80 focus:ring-2 focus:ring-rose-500/30'
                      : 'border-white/15 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-1.5 text-rose-400 text-xs sm:text-sm mt-1.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Topic quick suggestion tags */}
              <div className="pt-2">
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 mb-2">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Или выберите популярную тему:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {EXAMPLE_TOPICS.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleSelectTopic(sample)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        topic === sample
                          ? 'border-indigo-500/60 bg-indigo-500/20 text-indigo-300'
                          : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:border-white/20 hover:bg-white/[0.05]'
                      }`}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Count Selector */}
            <div className="pt-2 border-t border-white/5">
              <QuestionCountSelector
                value={numberOfQuestions}
                onChange={setNumberOfQuestions}
                disabled={isLoading}
              />
            </div>

            {/* Difficulty Selector */}
            <div className="pt-2 border-t border-white/5">
              <DifficultySelector
                value={difficulty}
                onChange={setDifficulty}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-base sm:text-lg shadow-[0_0_30px_rgba(99,102,241,0.35)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2.5 border border-indigo-400/30"
              >
                <Sparkles className="w-5 h-5 text-indigo-200 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Создать викторину</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
