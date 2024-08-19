import { NextApiRequest, NextApiResponse } from 'next';
import axios, { Method } from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { url, method, data, headers: customHeaders } = req.body;

    if (!url || !method) {
      res.status(400).json({ message: 'Missing required parameters' });
      return;
    }

    const response = await axios({
      url,
      method: method as Method,
      data,
      headers: {
        ...customHeaders, // Headers tùy chỉnh được gửi từ client
        // Cookie: req.headers.cookie || '',
      },
      withCredentials: true,
    });
    // Trích xuất cookie nếu cần thiết
    const setCookieHeader = response.headers['set-cookie'];
    let extractedCookies:any = {};
    
    if (setCookieHeader) {
      setCookieHeader.forEach(cookie => {
        const [name, value] = cookie.split(';')[0].split('=');
        extractedCookies[name] = value;
      });
    }

    // Gửi lại dữ liệu API cùng với các cookie cần thiết về client
    res.status(200).json({
      data: response.data,
      cookies: extractedCookies,
    });
  } catch (error) {
    console.error('API Proxy error:', error);
    res.status(500).json({ message: 'Error proxying the request' });
  }
}