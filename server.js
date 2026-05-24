const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  console.error("Missing GROQ_API_KEY environment variable. Add it to .env or set it in your shell.");
  process.exit(1);
}

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const PORT = process.env.PORT || 3000;
const allowedTestTypes = new Set(["unit", "api", "ui", "regression"]);

app.use(cors());
app.use(express.json());
app.use(express.static("."));

function normalizeInput(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getGroqErrorDetails(error) {
  const message = error?.message || "";

  if (error?.status === 401 || error?.error?.code === "invalid_api_key" || /invalid api key/i.test(message)) {
    return "Invalid API key. Update GROQ_API_KEY in your .env file and restart the server.";
  }

  if (error?.status === 429) {
    return "Groq rate limit exceeded. Please try again in a moment.";
  }

  if (message) {
    return message;
  }

  return "Failed to generate test cases. Please try again later.";
}

app.post("/generate", async (req, res) => {
  const feature = normalizeInput(req.body?.feature);
  const testType = normalizeInput(req.body?.testType);

  if (!feature) {
    return res.status(400).json({ error: "Feature description is required." });
  }

  if (!allowedTestTypes.has(testType)) {
    return res.status(400).json({
      error: "Invalid test type. Choose one of: unit, api, ui, regression."
    });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a QA expert. Generate detailed test cases in this exact format for each test case:
TEST CASE ID: TC001
TITLE:
DESCRIPTION:
STEPS:
EXPECTED RESULT:
Generate at least 5 test cases.`
        },
        {
          role: "user",
          content: `Generate ${testType} test cases for: ${feature}. Do not use # symbols or markdown formatting.`
        }
      ]
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: "No test cases were returned by the AI service." });
    }

    return res.json({ testCases: content });
  } catch (error) {
    console.error("Failed to generate test cases:", error);
    return res.status(500).json({
      error: "Failed to generate test cases.",
      details: getGroqErrorDetails(error)
    });
  }
});

app.listen(PORT, () => {
  console.log(`TestGenie AI running on http://localhost:${PORT}`);
});