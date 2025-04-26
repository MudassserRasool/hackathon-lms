import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../constants/environment.js';
import { QUIZ_GENERATION_PROMPT } from '../data/prompt.js';

class AIService {
  constructor() {
    this.geminiApiKey = GEMINI_API_KEY;
  }

  async generateQuizByGemini(prompt) {
    const ai = new GoogleGenAI({
      apiKey: this.geminiApiKey,
    });
    const config = {
      thinkingConfig: {
        thinkingBudget: 0,
      },
      responseMimeType: 'application/json',
    };
    const model = 'gemini-2.0-flash';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: QUIZ_GENERATION_PROMPT(prompt),
          },
        ],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    // let count = 0;
    let result = '';
    for await (const chunk of response) {
      result += chunk.text;
    }
    console.log('***********************************************');
    console.log(JSON.parse(result));
    console.log('***********************************************');
    return JSON.parse(result);
  }
}

export default new AIService();
