import axios, { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

interface CheckSessionResponse {
  location?: string;
  cookies?: {} | null;
}

const checkSession = async (url: string, headers: Record<string, string>): Promise<CheckSessionResponse> => {
  try {
    const response: AxiosResponse = await axios.get(url, {
      headers,
      maxRedirects: 0, // Do not follow redirects automatically
      validateStatus: (status) => status === 301 || status === 302 || status === 200
    });
    const location = response.headers['location'];
    const setCookieHeader = response.headers['set-cookie'];
    if (location && location !== 'https://chat.zalo.me/') {
      return checkSession(location, headers);
    }
    let extractedCookies:any = {};
    if (setCookieHeader) {
      setCookieHeader.forEach(cookie => {
        const [name, value] = cookie.split(';')[0].split('=');
        extractedCookies[name] = value;
      });
    }
    return {
      location,
      cookies: extractedCookies,
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
