// /netlify/functions/weather-proxy.js

exports.handler = async function (event, context) {
  const CWA_API_KEY = process.env.CWA_API_KEY;
  const city = event.queryStringParameters.locationName || '臺北市';
  
  // 【已修改】使用最通用的官方資料集識別碼
  const dataId = 'F-C0032-001';
  
  const apiUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${dataId}?Authorization=${CWA_API_KEY}&locationName=${encodeURIComponent(city)}&elementName=Wx,PoP,MinT,MaxT`;

  try {
    // 由於我們在 package.json 中指定了 v2，這裡可以使用 CommonJS 的 require 語法
    const fetch = require('node-fetch');

    const response = await fetch(apiUrl);
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data', message: error.message }),
    };
  }
};
