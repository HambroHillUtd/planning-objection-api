// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors({
  origin: "https://www.hambrohillunited.co.uk"
}));  
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { ref, address, postcode, objections } = req.body;

    const prompt = `
You are a UK planning expert.

Write a formal objection letter.

Reference: ${ref}
Address: ${address}
Postcode: ${postcode}
Concerns: ${objections}

Rules:
- Be professional
- Do NOT invent facts
`;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  }
);

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on " + PORT));
