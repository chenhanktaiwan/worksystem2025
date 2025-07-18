// /netlify/functions/weather-proxy.js

exports.handler = async function (event, context) {
  // 從環境變數讀取 OpenWeatherMap API 金鑰
  const OWM_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

  // 使用臺北市的經緯度
  const lat = '25.0478'; // 臺北緯度
  const lon = '121.5171'; // 臺北經度
  
  // 【已修改】更換為 5-day/3-hour Forecast API，這個 API 包含在預設免費方案中
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWM_API_KEY}&units=metric&lang=zh_tw`;

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
        'Access-Control-Allow-Origin': 'https://ephemeral-paletas-17b00b.netlify.app/', 
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
