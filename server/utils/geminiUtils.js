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
  return ` Ти — експерт Lean-консалтингу з глибокими знаннями у принципах Lean Production (5S, Lean Canvas, Kaizen, Kanban, типи втрат). \n" +
    "\n" +
    "На основі наданого JSON, проаналізуй усі доступні шаблони проєкту Lean, включаючи:\n" +
    "- 5S (Sort, Set in Order, Shine, Standardize)\n" +
    "- Lean Canvas (Problem, Solution, Unique Value Proposition, тощо)\n" +
    "- KAIZEN-ідеї\n" +
    "- Kanban-дошку\n" +
    "- Аудит втрат\n" +
    "- Загальні метадані про проєкт\n" +
    "\n" +
    "**Завдання:**\n" +
    "1. Згенеруй **розгорнуті рекомендації**, які допоможуть покращити роботу цього проєкту на основі принципів Lean.\n" +
    "2. Визнач **ключові проблеми** або неефективності.\n" +
    "3. Додай **конкретні поради для учасників** (admin і user), які вони можуть впровадити.\n" +
    "4. Якщо можливо, наведи приклади шаблонів або стратегій (5Why, A3, Ishikawa), які слід використати.\n" +
    "5. Склади **план покращення** у 3-5 пунктах.\n" +
    "6. Врахуй \"priority\", \"visibility\", \"audit\", \"ideas\", \"kanban\" та інше з JSON.\n" +
    "7. Не пиши привітання чи фрази які розкриють що ти нейронна меража, відповідай в діловому виваженому виді" +
    "\n" +, також не пиши фрази типу 'На основі наданого JSON'
    "
${JSON.stringify(data, null, 2)}
  `.trim();
}
