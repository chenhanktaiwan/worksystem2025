// /netlify/functions/weather-proxy.js

exports.handler = async function (event, context) {
  // 從 Netlify 環境變數中讀取 API 金鑰，這樣更安全
  const CWA_API_KEY = process.env.CWA_API_KEY;
  
  // 從前端請求的 URL 中取得城市名稱
  const city = event.queryStringParameters.locationName || '臺北市';
  // 【已修改】更新為新的資料集識別碼
  const dataId = 'F-C0032-006'; 
  
  const apiUrl = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${dataId}?Authorization=${CWA_API_KEY}&locationName=${encodeURIComponent(city)}&elementName=Wx,PoP,MinT,MaxT`;

  try {
    // 動態 import node-fetch
    const fetch = (await import('node-fetch')).default;

    const response = await fetch(apiUrl);
    const data = await response.json();

    // 回傳成功的回應給前端
    return {
      statusCode: 200,
      headers: {
        // 允許所有來源的請求，解決 CORS 問題
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    // 回傳錯誤訊息
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch weather data' }),
    };
  }
};
