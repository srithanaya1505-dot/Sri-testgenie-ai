const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const path = require("path");

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.post("/generate", async (req, res) => {
  const { feature, testType} = req.body;

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
        content: `Generate ${testType} test cases for: ${feature} . Do not use # stymbols or markdown formattimg . ` 
      }
    ]
  });

  res.json({ testCases: response.choices[0].message.content });
});

app.listen(3000, () => {
  console.log("TestGenie AI running on http://localhost:3000");
});