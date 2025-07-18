// /netlify/functions/weather-proxy.js

exports.handler = async function (event, context) {
  const CWA_API_KEY = process.env.CWA_API_KEY;
  const city = event.queryStringParameters.locationName || '臺北市';
  
  // 【已修改】更換為「未來一週天氣預報」的資料集識別碼
  const dataId = 'F-D0047-091';
  
  // 注意：這個 API 需要的是 locationName，我們沿用前端傳來的城市名稱
  const apiUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${dataId}?Authorization=${CWA_API_KEY}&locationName=${encodeURIComponent(city)}&elementName=Wx,PoP,MinT,MaxT`;

  try {
    const fetch = require('node-fetch');

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        // 如果 API 回應不成功，將錯誤訊息更詳細地傳回前端
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
    console.error("Weather proxy error:", error); // 在後台日誌中印出更詳細的錯誤
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data', message: error.message }),
    };
  }
};
