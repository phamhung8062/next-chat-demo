import { fetchApi } from "@/lib/apiClient";

export const getZaloSession = async () => {
  try {
    const zpdid: string | null = localStorage.getItem("zpdid");
    const data = await fetchApi({
      url: 'https://id.zalo.me/account/logininfo',
      method: 'POST',
      data: {
        'continue': 'https://chat.zalo.me/',
        'v': '5.5.4',
      },
      headers: {
        'accept': '*/*',
        'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8,af;q=0.7',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://id.zalo.me',
        'priority': 'u=1, i',
        'referer': 'https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F',
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'cookie': `zpdid=${zpdid};_zlang=vn;`,
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export interface QrResponse {
  error_message: string;
  data: Data;
  error_code: number;
}

export interface Data {
  image: string;
  code: string;
  options: Options;
  token: string;
}

export interface Options {
  enabledMultiLayer: boolean;
  enabledCheckOCR: boolean;
}

export const getQrcode = async (): Promise<QrResponse | undefined> => {
  try {
    const cookie: string | null = localStorage.getItem('zlogin_session');
    const zpdid: string | null = localStorage.getItem("zpdid");
    if (!cookie) {
      console.error('No zlogin_session found in localStorage');
      return;
    }
    const response = await fetchApi({
      url: 'https://id.zalo.me/account/authen/qr/generate',
      method: 'POST',
      data: {
        'continue': 'https://chat.zalo.me/',
        'v': '5.5.4',
      },
      headers: {
        'accept': '*/*',
        'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8,af;q=0.7',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://id.zalo.me',
        'priority': 'u=1, i',
        'referer': 'https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F',
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'cookie': `zlogin_session=${cookie};zpdid=${zpdid};_zlang=vn;`,
      },
    });

    return response as QrResponse; // Đảm bảo response là ApiResponse
  } catch (error) {
    console.error('Error fetching QR code:', error);
  }
};


export interface WaittingScanResponse {
  error_message: string;
  data: Data;
  error_code: number;
}

export interface DataWaittingScan {
  avatar: string;
  display_name: string;
}


export const getWaittingScan = async (code:string): Promise<WaittingScanResponse | undefined> => {
  try {
    const cookie: string | null = localStorage.getItem('zlogin_session');
    const zpdid: string | null = localStorage.getItem("zpdid");
    if (!cookie) {
      console.error('No zlogin_session found in localStorage');
      return;
    }
    const response = await fetchApi({
      url: 'https://id.zalo.me/account/authen/qr/waiting-scan',
      method: 'POST',
      data: {
        'continue': 'https://chat.zalo.me/',
        'v': '5.5.4',
        "code":code
      },
      headers: {
        'accept': '*/*',
        'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8,af;q=0.7',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://id.zalo.me',
        'priority': 'u=1, i',
        'referer': 'https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F',
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'cookie': `zlogin_session=${cookie};zpdid=${zpdid};_zlang=vn;`,
      },
    });

    return response as WaittingScanResponse; 
  } catch (error) {
    console.error('Error fetching getWaittingScan code:', error);
  }
};