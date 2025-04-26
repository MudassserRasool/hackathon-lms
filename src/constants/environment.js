const mongoUrl = process.env.MONGODB_URI;
const GOOGLE_CONSOLE_API_KEY = process.env.GOOGLE_CONSOLE_API_KEY;
const PORT = process.env.PORT || 4000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export { GEMINI_API_KEY, GOOGLE_CONSOLE_API_KEY, mongoUrl, PORT };
