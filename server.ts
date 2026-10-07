import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('WARNING: GEMINI_API_KEY environment variable is not set. Gemini API calls will fail.');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function getDifficultyDescription(diff: string): string {
  switch (diff) {
    case 'easy':
      return 'Легкий уровень: базовые знания, факты и основные термины, понятные начинающим.';
    case 'hard':
      return 'Сложный уровень: глубокие детали, неочевидные факты, анализ, сравнительный анализ и экспертные вопросы.';
    case 'medium':
    default:
      return 'Средний уровень: хорошее знание темы, практическое понимание, тонкости и уверенное владение материалом.';
  }
}

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

async function callGeminiWithFallback<T>(
  execute: (modelName: string) => Promise<T>
): Promise<T> {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    let attempt = 0;
    const maxRetries = 2;
    let delayMs = 1500;

    while (attempt < maxRetries) {
      attempt++;
      try {
        return await execute(model);
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const isQuotaOrDemand =
          msg.includes('429') ||
          msg.includes('503') ||
          msg.includes('RESOURCE_EXHAUSTED') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand');

        console.warn(`Model ${model} attempt ${attempt} failed:`, msg);

        if (isQuotaOrDemand) {
          // If quota exhausted or high demand, move quickly to the next candidate model
          break;
        }

        await new Promise((r) => setTimeout(r, delayMs));
        delayMs *= 1.5;
      }
    }
  }

  throw lastError;
}

// Generate Quiz endpoint
app.post('/api/quiz/generate', async (req: Request, res: Response) => {
  try {
    const { topic, numberOfQuestions, difficulty } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Введите тему викторины' });
    }

    const cleanTopic = topic.trim();
    const count = Number(numberOfQuestions) || 10;
    const validCounts = [5, 10, 15, 20, 30];
    const targetCount = validCounts.includes(count) ? count : 10;
    const diff = ['easy', 'medium', 'hard'].includes(difficulty) ? difficulty : 'medium';

    const diffDesc = getDifficultyDescription(diff);

    const quizData = await callGeminiWithFallback(async (model) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: `Создай интерактивную викторину по теме: "${cleanTopic}".
Количество вопросов: ровно ${targetCount}.
Уровень сложности: ${diff} (${diffDesc}).`,
        config: {
          systemInstruction: `Ты — авторитетный и точный составитель викторин и тестов.
Твоя задача — сгенерировать ровно ${targetCount} вопросов строго и исключительно по теме: "${cleanTopic}".
КРИТИЧЕСКИЕ ПРАВИЛА:
1. ТЕМА — СТРОГИЙ ПРИОРИТЕТ. Все вопросы должны быть ТОЛЬКО по теме "${cleanTopic}". Никаких посторонних вопросов. Если тема "История Узбекистана" — только история Узбекистана. Если "Физика" — только физика. Если "JavaScript" — только JavaScript.
2. КОЛИЧЕСТВО: Ровно ${targetCount} вопросов.
3. СЛОЖНОСТЬ: ${diffDesc}.
4. В каждом вопросе ровно 4 правдоподобных и уникальных варианта ответа (массив строк options).
5. Ровно один правильный ответ, указанный в correctAnswer (индекс 0, 1, 2 или 3).
6. Равномерно распределяй правильные ответы между 0, 1, 2, 3 (не делай правильным всегда 0 или 1).
7. Никаких повторяющихся вопросов или дублирующихся ответов.
8. Все факты должны быть абсолютно достоверными. Не придумывай ложные факты.
9. Язык: русский.
10. Ответ строго в JSON по предоставленной схеме.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Название викторины' },
              topic: { type: Type.STRING, description: 'Тема викторины' },
              difficulty: { type: Type.STRING, description: 'Сложность (easy, medium, hard)' },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.INTEGER, description: 'Номер вопроса от 1 до N' },
                    question: { type: Type.STRING, description: 'Текст вопроса' },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Ровно 4 варианта ответа',
                    },
                    correctAnswer: {
                      type: Type.INTEGER,
                      description: 'Индекс правильного ответа (от 0 до 3)',
                    },
                    explanation: {
                      type: Type.STRING,
                      description: 'Краткое понятное объяснение правильного ответа',
                    },
                  },
                  required: ['id', 'question', 'options', 'correctAnswer', 'explanation'],
                },
              },
            },
            required: ['title', 'topic', 'difficulty', 'questions'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error('Пустой ответ от Gemini');
      }

      const parsed = JSON.parse(text);

      if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('Список вопросов пуст');
      }

      const validQuestions = parsed.questions
        .filter((q: any) => {
          return (
            q &&
            typeof q.question === 'string' &&
            q.question.trim().length > 0 &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            q.options.every((opt: any) => typeof opt === 'string' && opt.trim().length > 0) &&
            typeof q.correctAnswer === 'number' &&
            q.correctAnswer >= 0 &&
            q.correctAnswer <= 3 &&
            typeof q.explanation === 'string'
          );
        })
        .map((q: any, idx: number) => ({
          id: idx + 1,
          question: q.question.trim(),
          options: q.options.map((o: string) => o.trim()),
          correctAnswer: Math.floor(q.correctAnswer),
          explanation: q.explanation.trim(),
        }));

      if (validQuestions.length < Math.min(targetCount, 5)) {
        throw new Error(`Слишком мало валидных вопросов: ${validQuestions.length} из ${targetCount}`);
      }

      return {
        title: parsed.title || `Викторина: ${cleanTopic}`,
        topic: cleanTopic,
        difficulty: diff,
        questions: validQuestions.slice(0, targetCount),
      };
    });

    return res.json(quizData);
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return res.status(500).json({
      error: 'Не удалось создать викторину',
      details: error?.message || 'Непредвиденная ошибка сервера',
    });
  }
});

// Explain Question in detail endpoint
app.post('/api/quiz/explain', async (req: Request, res: Response) => {
  try {
    const { topic, question, options, correctAnswer, selectedAnswer } = req.body;

    if (!question || !Array.isArray(options) || typeof correctAnswer !== 'number') {
      return res.status(400).json({ error: 'Некорректные параметры для объяснения' });
    }

    const correctOptionText = options[correctAnswer] || '';
    const selectedOptionText = typeof selectedAnswer === 'number' ? options[selectedAnswer] : null;
    const isCorrect = selectedAnswer === correctAnswer;

    const prompt = `Вопрос из викторины по теме "${topic || 'Общие знания'}":
"${question}"

Варианты ответа:
${options.map((opt, i) => `${i + 1}. ${opt} ${i === correctAnswer ? '(Правильный ответ)' : ''}`).join('\n')}

Пользователь выбрал: ${selectedOptionText ? `"${selectedOptionText}"` : 'не дал ответа'} (${isCorrect ? 'верно' : 'ошибочно'}).

Пожалуйста, объясни подробно и простым языком:
1. Почему вариант "${correctOptionText}" является правильным с фактами и контекстом.
2. ${!isCorrect && selectedOptionText ? `Почему вариант "${selectedOptionText}" является ошибочным и какая в нём частая путаница.` : 'В чём ключевая суть вопроса.'}
3. Краткий совет или мнемоническое правило для запоминания.`;

    const explanation = await callGeminiWithFallback(async (model) => {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: `Ты — дружелюбный и эрудированный преподаватель.
Твоя цель — доступно, интересно и структурированно объяснить ответ на вопрос викторины.
Отвечай на русском языке строго в формате JSON по заданной схеме.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              whyCorrect: {
                type: Type.STRING,
                description: 'Подробное и понятное объяснение, почему правильный ответ именно такой',
              },
              whyChosenWasIncorrect: {
                type: Type.STRING,
                description: 'Разбор ошибки пользователя (если был дан неверный ответ) или дополнительный контекст',
              },
              keyTakeaway: {
                type: Type.STRING,
                description: 'Ключевой вывод или полезный совет для легкого запоминания',
              },
            },
            required: ['whyCorrect', 'keyTakeaway'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error('Пустой ответ от модели');
      }

      return JSON.parse(text);
    });

    return res.json(explanation);
  } catch (error: any) {
    console.error('Error generating deep explanation:', error);
    return res.status(500).json({
      error: 'Не удалось получить подробное объяснение',
      details: error?.message || 'Ошибка генерации',
    });
  }
});

// Start Express server and connect Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server started on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
