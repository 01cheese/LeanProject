import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: "AIzaSyCC25qefuH5VpLtls601SF4iF83wedaBtY" });

export function cleanData(obj) {
  if (Array.isArray(obj)) return obj.map(cleanData).filter(Boolean);
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key in obj) {
      const val = cleanData(obj[key]);
      if (
        val !== '' &&
        val !== null &&
        val !== undefined &&
        !(Array.isArray(val) && val.length === 0) &&
        !(typeof val === 'object' && Object.keys(val).length === 0)
      ) {
        result[key] = val;
      }
    }
    return Object.keys(result).length ? result : null;
  }
  return obj;
}

export function formatPrompt(data) {
  return `
Ти — експерт Lean-консалтингу з глибокими знаннями у принципах Lean Production (5S, Lean Canvas, Kaizen, Kanban, типи втрат).

На основі наданого JSON, проаналізуй усі доступні шаблони проєкту Lean, включаючи:
- 5S (Sort, Set in Order, Shine, Standardize)
- Lean Canvas (Problem, Solution, Unique Value Proposition, тощо)
- KAIZEN-ідеї
- Kanban-дошку
- Аудит втрат
- Загальні метадані про проєкт

**Завдання:**
1. Згенеруй **розгорнуті рекомендації**, які допоможуть покращити роботу цього проєкту на основі принципів Lean.
2. Визнач **ключові проблеми** або неефективності.
3. Додай **конкретні поради для учасників** (admin і user), які вони можуть впровадити.
4. Якщо можливо, наведи приклади шаблонів або стратегій (5Why, A3, Ishikawa), які слід використати.
5. Склади **план покращення** у 3-5 пунктах.
6. Врахуй "priority", "visibility", "audit", "ideas", "kanban" та інше з JSON.
7. Не пиши привітання чи фрази які розкриють що ти нейронна меража, відповідай в діловому виваженому виді.
Також не пиши фрази типу "На основі наданого JSON".

${JSON.stringify(data, null, 2)}
  `.trim();
}
