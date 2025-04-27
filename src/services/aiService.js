import { GoogleGenAI } from '@google/genai';
import { jsonrepair } from 'jsonrepair';
import OpenAI from 'openai';
import { GEMINI_API_KEY, GPT_API_KEY } from '../constants/environment.js';
import { QUIZ_GENERATION_PROMPT } from '../data/prompt.js';

class AIService {
  constructor() {
    this.geminiApiKey = GEMINI_API_KEY;
    this.openaiApiKey = GPT_API_KEY;
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

    return JSON.parse(result);
  }

  async generateQuizByOpenAI(prompt) {
    const openai = new OpenAI({
      baseURL: 'https://api.aimlapi.com/v1',
      apiKey: this.openaiApiKey,
    });

    // Define the model to use - GPT-4 or GPT-3.5-turbo as needed
    const model = 'google/gemini-2.5-pro-preview'; // google/gemini-2.5-pro-preview //  gpt-4.1-mini-2025-04-14

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant who knows everything.',
        },
        {
          role: 'user',
          content: String(QUIZ_GENERATION_PROMPT(prompt)),
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 5000,
    });

    const result = response.choices[0].message.content;
    // console.log('Result:', result);
    const data = JSON.parse(jsonrepair(result));
    // console.log('Parsed Data:', data);
    return data;
  }
}

export default new AIService();
