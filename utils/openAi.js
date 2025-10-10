require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
const getGeminiAPIResponse = async (message) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // console.log("Data is ", data.candidates[0].content.parts[0].text);
    
     return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
    
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Error occurred";
  }
};


module.exports = getGeminiAPIResponse;
