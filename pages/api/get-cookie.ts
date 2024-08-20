import axios, { AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

interface CheckSessionResponse {
  location?: string;
  cookies?: string | null;
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

    if (setCookieHeader) {
      // Tìm và lưu giá trị zpsid vào localStorage
      const zpsid = setCookieHeader.find((cookie: string) => cookie.startsWith('zpsid='));
      if (zpsid) {
        const zpsidValue = zpsid.split(';')[0].split('=')[1];
        localStorage.setItem('zpsid', zpsidValue);
        console.log('zpsid saved to localStorage:', zpsidValue);
      }
    }

    if (location && location !== 'https://chat.zalo.me/') {
      // Recursive call with new location
      if(location.include("jr.zaloapp.com") 
        || location.include("zingmp3")
        || location.include("zingmp3")
      ){
        headers.cookie ="";
      }
      // if(location.include("jr.zalo.cloud") 
      //   || location.include("jr.nhatkyzalo.vn")
      //   || location.include("zingmp3")
      // ){
      //   headers.cookie ="";
      // }
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
  const headers = {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
    'cookie': 'zpdid=4X3yab7thJeG6vMLKl_3E1yQbv9S_y8q;',
    'referer': 'https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F',
    'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
  };

  try {
    const result = await checkSession(initialUrl, headers);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}