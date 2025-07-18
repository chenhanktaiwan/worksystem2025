// /netlify/functions/weather-proxy.js

exports.handler = async function (event, context) {
  // 【已修改】從環境變數讀取新的 OpenWeatherMap API 金鑰
  const OWM_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

  // 【已修改】使用臺北市的經緯度
  const lat = '25.0478'; // 臺北緯度
  const lon = '121.5171'; // 臺北經度
  
  // 【已修改】OpenWeatherMap One Call API 3.0 的 URL
  // exclude=current,minutely,hourly,alerts -> 我們只需要每日預報 (daily)
  // units=metric -> 單位使用攝氏度
  // lang=zh_tw -> 語言使用繁體中文
  const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${OWM_API_KEY}&units=metric&lang=zh_tw`;

  try {
    const fetch = require('node-fetch');
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Weather proxy error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data', message: error.message }),
    };
  }
};
