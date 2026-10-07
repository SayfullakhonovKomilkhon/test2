import React, { useState } from 'react';
import { QuizQuestion as IQuizQuestion, DeepExplanationResult } from '../types/quiz';
import { explainQuestion } from '../services/api';
import {
  CheckCircle,
  XCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
  Lightbulb,
  AlertTriangle,
  Compass,
  Loader2,
} from 'lucide-react';

interface QuestionReviewProps {
  questions: IQuizQuestion[];
  selectedAnswers: Record<number, number>;
  topic: string;
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({
  questions,
  selectedAnswers,
  topic,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [deepExplanations, setDeepExplanations] = useState<
    Record<number, { data?: DeepExplanationResult; loading: boolean; error?: string }>
  >({});
  const [expandedDetails, setExpandedDetails] = useState<Record<number, boolean>>({});

  const handleRequestDeepExplanation = async (q: IQuizQuestion) => {
    // If already open, toggle it
    if (expandedDetails[q.id]) {
      setExpandedDetails((prev) => ({ ...prev, [q.id]: false }));
      return;
    }

    setExpandedDetails((prev) => ({ ...prev, [q.id]: true }));

    // If already loaded, don't re-fetch
    if (deepExplanations[q.id]?.data) {
      return;
    }

    setDeepExplanations((prev) => ({
      ...prev,
      [q.id]: { loading: true },
    }));

    try {
      const result = await explainQuestion({
        topic,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedAnswer: selectedAnswers[q.id],
      });

      setDeepExplanations((prev) => ({
        ...prev,
        [q.id]: { loading: false, data: result },
      }));
    } catch (err: any) {
      setDeepExplanations((prev) => ({
        ...prev,
        [q.id]: {
          loading: false,
          error: err?.message || 'Не удалось получить подробное объяснение',
        },
      }));
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const isCorrect = selectedAnswers[q.id] === q.correctAnswer;
    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    return true;
  });

  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer
  ).length;
  const incorrectCount = questions.length - correctCount;

  return (
    <div className="w-full space-y-6 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Разбор вопросов
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Проверьте свои ответы и изучите подробные объяснения от AI
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950/60 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Все ({questions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              filter === 'incorrect'
                ? 'bg-rose-600/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Ошибки</span>
            <span className="bg-rose-500/30 text-rose-200 text-[10px] px-1.5 py-0.2 rounded-full">
              {incorrectCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('correct')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center space-x-1 ${
              filter === 'correct'
                ? 'bg-emerald-600/80 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Верные</span>
            <span className="bg-emerald-500/30 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded-full">
              {correctCount}
            </span>
          </button>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm bg-slate-900/40 rounded-2xl border border-white/5">
          Вопросов в этой категории нет
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const userAnswerIndex = selectedAnswers[q.id];
            const isCorrect = userAnswerIndex === q.correctAnswer;
            const hasUserAnswered = typeof userAnswerIndex === 'number';
            const userAnswerText = hasUserAnswered ? q.options[userAnswerIndex] : 'Нет ответа';
            const correctAnswerText = q.options[q.correctAnswer];
            const isExpanded = !!expandedDetails[q.id];
            const deepExp = deepExplanations[q.id];

            return (
              <div
                key={q.id}
                className={`backdrop-blur-md bg-slate-900/70 border rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
                  isCorrect
                    ? 'border-emerald-500/25 hover:border-emerald-500/40'
                    : 'border-rose-500/25 hover:border-rose-500/40'
                }`}
              >
                {/* Header row: Question number & Status Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Вопрос {q.id}
                  </span>
                  <div
                    className={`inline-flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                      isCorrect
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>✓ Правильно</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>✕ Неправильно</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <h4 className="text-base sm:text-lg font-semibold text-white leading-snug mb-4">
                  {q.question}
                </h4>

                {/* Answers Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4 text-xs sm:text-sm">
                  {/* Selected Answer */}
                  <div
                    className={`p-3 rounded-xl border flex flex-col justify-between ${
                      isCorrect
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                        : 'border-rose-500/30 bg-rose-500/5 text-rose-300'
                    }`}
                  >
                    <span className="text-[11px] font-semibold text-slate-400 mb-1">
                      Выбранный вами ответ:
                    </span>
                    <span className="font-medium text-white">{userAnswerText}</span>
                  </div>

                  {/* Correct Answer */}
                  <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 text-indigo-300 flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 mb-1">
                      Правильный ответ:
                    </span>
                    <span className="font-medium text-white">{correctAnswerText}</span>
                  </div>
                </div>

                {/* Short Gemini explanation (Always shown for incorrect answers, and accessible for correct too) */}
                <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3.5 text-xs sm:text-sm text-slate-300 mb-3 space-y-1">
                  <div className="font-semibold text-indigo-300 flex items-center space-x-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Почему правильный ответ такой:</span>
                  </div>
                  <p className="leading-relaxed pl-5.5 text-slate-300">
                    {q.explanation}
                  </p>
                </div>

                {/* AI Deep Explanation Action Button */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleRequestDeepExplanation(q)}
                    className="inline-flex items-center space-x-2 text-xs font-semibold px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>
                      {isExpanded ? 'Скрыть подробное объяснение' : 'Объяснить подробнее (AI)'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 ml-1" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 ml-1" />
                    )}
                  </button>
                </div>

                {/* Expanded AI Deep Breakdown */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
                    {deepExp?.loading && (
                      <div className="flex items-center space-x-3 py-4 px-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-400 shrink-0" />
                        <span>Gemini готовит подробный образовательный разбор...</span>
                      </div>
                    )}

                    {deepExp?.error && (
                      <div className="py-3 px-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm">
                        {deepExp.error}
                      </div>
                    )}

                    {deepExp?.data && (
                      <div className="space-y-3 bg-gradient-to-br from-indigo-950/40 to-purple-950/20 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2 text-indigo-300 font-bold border-b border-white/10 pb-2">
                          <Brain className="w-4 h-4 text-indigo-400" />
                          <span>Подробный разбор от Gemini</span>
                        </div>

                        {/* Why Correct */}
                        <div className="space-y-1">
                          <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Суть и правильность ответа:</span>
                          </div>
                          <p className="text-slate-200 leading-relaxed pl-5">
                            {deepExp.data.whyCorrect}
                          </p>
                        </div>

                        {/* Why User Chosen Was Incorrect */}
                        {deepExp.data.whyChosenWasIncorrect && (
                          <div className="space-y-1 pt-1">
                            <div className="font-semibold text-rose-400 flex items-center space-x-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>Разбор ошибки / частая путаница:</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed pl-5">
                              {deepExp.data.whyChosenWasIncorrect}
                            </p>
                          </div>
                        )}

                        {/* Key Takeaway */}
                        {deepExp.data.keyTakeaway && (
                          <div className="space-y-1 pt-1 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                            <div className="font-semibold text-amber-400 flex items-center space-x-1.5">
                              <Compass className="w-3.5 h-3.5 shrink-0" />
                              <span>Совет для запоминания:</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed pl-5 italic">
                              «{deepExp.data.keyTakeaway}»
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
