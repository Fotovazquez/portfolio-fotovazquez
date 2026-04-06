import handler from './api/top10.js';

const mockReq = { method: 'GET' };
const mockRes = {
  setHeader: (k, v) => console.log(`SetHeader: ${k} = ${v}`),
  status: (code) => {
    console.log(`Status: ${code}`);
    return {
      end: () => console.log('End called'),
      json: (data) => console.log('JSON Response:', JSON.stringify(data, null, 2))
    };
  }
};

process.env.RAPIDAPI_KEY = '2855dc7a3emsh893c61563b3be96p1ba884jsn5cecabe1eb5a';

handler(mockReq, mockRes).then(() => console.log('Finished')).catch(console.error);
