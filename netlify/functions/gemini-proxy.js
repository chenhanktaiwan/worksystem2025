// /netlify/functions/gemini-proxy.js

exports.handler = async function (event, context) {
  // 1. 從伺服器環境變數讀取您的 Gemini API 金鑰
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // 檢查請求方法是否為 POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // 檢查 API 金鑰是否存在
  if (!GEMINI_API_KEY) {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Gemini API key is not configured on the server.' }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required.' }) };
    }

    // 2. 使用 node-fetch 在後端發送請求
    const fetch = require('node-fetch');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // 3. 將結果回傳給前端
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://your-app-name.netlify.app', // 【重要】請換成您的 Netlify 網站網址
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    };

  } catch (error) {
    console.error("Gemini proxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from Gemini API', message: error.message }),
    };
  }
};
