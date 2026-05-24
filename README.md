# TestGenie AI

AI-powered test case generator built with Express and the Groq SDK.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root
   ```env
   GROQ_API_KEY=your_real_groq_api_key
   PORT=3000
   ```

3. Start the server
   ```bash
   npm start
   ```

4. Open the app in your browser
   ```text
   http://localhost:3000
   ```

## Notes

- Do not paste your API key in the terminal command unless you are comfortable with it being visible in shell history.
- The app expects a valid Groq API key to generate test cases.
- If the API key is invalid, the server will return a clear error message.

## Scripts

- `npm start` — start the server
- `npm run dev` — start the server
- `npm test` — placeholder script
