import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCC25qefuH5VpLtls601SF4iF83wedaBtY" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: " Ти — експерт Lean-консалтингу з глибокими знаннями у принципах Lean Production (5S, Lean Canvas, Kaizen, Kanban, типи втрат). \n" +
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
      "\n" +
      "Ось сам JSON ",
  });
  console.log(response.text);
}

main();