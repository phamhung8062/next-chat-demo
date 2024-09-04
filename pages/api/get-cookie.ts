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
      const zpsid = setCookieHeader.find((cookie: string) => cookie.startsWith('zpsid='));
      if (zpsid) {
        const zpsidValue = zpsid.split(';')[0].split('=')[1];
        localStorage.setItem('zpsid', zpsidValue);
        console.log('zpsid saved to localStorage:', zpsidValue);
      }
    }

    // if (location && location !== 'https://chat.zalo.me/') {
    //   // Recursive call with new location
    //   if(location.include("jr.zaloapp.com") 
    //     || location.include("zingmp3")
    //     || location.include("zingmp3")
    //   ){
    //     headers.cookie ="";
    //   }
    //   // if(location.include("jr.zalo.cloud") 
    //   //   || location.include("jr.nhatkyzalo.vn")
    //   //   || location.include("zingmp3")
    //   // ){
    //   //   headers.cookie ="";
    //   // }
    //   return checkSession(location, headers);
    // }

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

// export const getCookieTest = async (code:string): Promise<WaittingScanResponse | undefined> => {
//   try {
//     const cookie: string | null = localStorage.getItem('zlogin_session');
//     const zpdid: string | null = localStorage.getItem("zpdid");
//     if (!cookie) {
//       console.error('No zlogin_session found in localStorage');
//       return;
//     }
//     const response = await fetchApi({
//       url: 'https://jr.chat.zalo.me/jr/pushsession?token=bT9fuNZpKeNs2FhiBsySMQYbI_5paoB-jKlujNKDHW7ImdJtFifK_VnQlhmhMt4dwP4RW1oz3l6ISRgrQb4PFh3aGxjLk52KqmswwYfk06UZrNBPUF9Eflq-tEzbI4HDZlunsaNm3OwkQUg7Aq1xKwVEOyD_gI3oZLFltGn4J1I1dIoMTlHTbQjC_8nz1G9uwFPput_wIS356iZdAsiiUzVf4VvSbNQUoqAgktHbD5FXupwgTxCd-T4hryifIGKrxhytj2BnNBdnCkYkBIiJAwRQUxreva6EnYlOzITR9aNOgW7KUlCxc_esiVy&continue=https%3A%2F%2Fchat%2Ezalo%2Eme%2F',
//       method: 'GET',
//       headers: {
//         'accept': '*/*',
//         'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8,af;q=0.7',
//         'origin': 'https://id.zalo.me',
//         'priority': 'u=0, i',
//         'referer': 'https://id.zalo.me/',
//         'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"Windows"',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'navigate',
//         'sec-fetch-site': 'cross-site',
//         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
//       },
//     });

//     return response as WaittingScanResponse; 
//   } catch (error) {
//     console.error('Error fetching getWaittingScan code:', error);
//   }
// };