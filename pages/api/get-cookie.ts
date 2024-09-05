import axios, { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

interface CheckSessionResponse {
  location?: string;
  cookies?: string | null;
}

const checkSession = async (url: string, headers: Record<string, string>): Promise<CheckSessionResponse> => {
  try {
    console.log('url', url);
    const response: AxiosResponse = await axios.get(url, {
      headers,
      maxRedirects: 0, // Do not follow redirects automatically
      validateStatus: (status) => status === 301 || status === 302 || status === 200
    });
    const location = response.headers['location'];
    const setCookieHeader = response.headers['set-cookie'];
    console.log('setCookieHeader', response);
    console.log('setCookieHeader', setCookieHeader);

    if (setCookieHeader) {
      // Tìm và lưu giá trị zpsid vào localStorage
      const zpw_sek = setCookieHeader.find((cookie: string) => cookie.startsWith('zpw_sek='));
      console.log('zpw_sek', zpw_sek);
      if (zpw_sek) {
        const zpsidValue = zpw_sek.split(';')[0].split('=')[1];
        console.log('zpsidValue', zpsidValue);
        localStorage.setItem('zpw_sek', zpsidValue);
      }
    }

    if (location && location !== 'https://chat.zalo.me/') {
      return checkSession(location, headers);
    }

    // Reached the final URL or there's no redirect
    return {
      location,
      cookies: setCookieHeader ? setCookieHeader.join('; ') : null,
    };
  } catch (error) {
    throw new Error('Error during API call: ' + error);
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const initialUrl = 'https://id.zalo.me/account/checksession?continue=https%3A%2F%2Fchat.zalo.me%2F';
  const cookies = req.headers.cookie || "";
  const headers = {
    'accept': '*/*',
    'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8,af;q=0.7',
    'origin': 'https://id.zalo.me',
    'priority': 'u=0, i',
    'referer': 'https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F',
    'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'cookie':cookies,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  };

  try {
    const result = await checkSession(initialUrl, headers);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
