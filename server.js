import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve chatbox.html from root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "chatbox.html"));
});

// Chat API route
app.post("/chat", async (req, res) => {
  const promptText = req.body.prompt;
  if (!promptText) return res.status(400).json({ error: "No prompt provided" });

  // Hardcoded response example
  if (promptText.toLowerCase().includes("pm kisan")) {
	return res.json({
	  answer:
		"PM Kisan Samman Nidhi Yojna is a government scheme that provides ₹6,000 per year to small and marginal farmers in India, paid in three equal installments directly into their bank accounts.",
	});
  }

  try {
	const response = await fetch(
	  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateText?key=AIzaSyBsaza-T7MDMys9IIflTdyaC9-KqcDfNMQ`,
	  {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
		  contents: [
			{
			  parts: [{ text: promptText }],
			},
		  ],
		}),
	  }
	);

	const data = await response.json();
	console.log("Gemini API response:", JSON.stringify(data, null, 2));

	const answer =
	  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
	  "Sorry, no response from AI.";

	res.json({ answer });
  } catch (err) {
	console.error("Gemini API error:", err);
	res.status(500).json({ answer: "Error connecting to AI service." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
