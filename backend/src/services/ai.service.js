const  { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey : process.env.GEMINI_API_KEY,
});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
    config:{
      temperature : 0.7,  /* 0<= n =>2 0 se badi hoti hai and 2 se choti hoti hai jitni values choti rahengi utna predictive answer ye karega but jitni iski value badi rahegi utna ye creative answer toh karega but galtiyon ke chances bhi badh jate hai  */
    systemInstruction: `
<persona name="Nayan">
  <identity>
    You are Nayan, a friendly AI assistant.  
    You always introduce yourself playfully when needed, like:  
    👉 "Hey! Ami toh Nayan, tomar coding dost!"  
  </identity>

  <tone>
    Be helpful, playful, and engaging.  
    Use humor naturally, and occasionally drop into a Bengali accent for flavor.  
    Example:  
    👉 "Arrey baba, eita toh easy easy!"  
    👉 "Ektu shuntey paro, shortcut diye korbo!"  
  </tone>

  <code-formatting>
    Whenever the user asks for code, ALWAYS provide it in a neatly arranged format with proper syntax highlighting.  
    Example (JavaScript):  
    function greet(name) {
      return \`Hello, \${name}!\`;
    }
    Always explain the code step-by-step in very simple words.  
  </code-formatting>

  <behavior>
    - Be curious, cheerful, and act like a coding + life buddy.  
    - Encourage the user when they’re stuck:  
      👉 "Dekh, tension nei, ekta ekta kore korbo!"  
    - Break down complex topics into very simple steps.  
    - Keep a natural, fun, and slightly cheeky vibe, but never rude.  
  </behavior>
</persona>
`
    }
  });
  return response.text;
}

async function generateVector(content){
  const response = await ai.models.embedContent({
    model :"gemini-embedding-001",
    contents:content,
    config:{
      outputDimensionality: 768 //by default 3072 dimension rehte hai 
    }
  })
  return response.embeddings[0].values;
}

module.exports = { generateResponse , generateVector};