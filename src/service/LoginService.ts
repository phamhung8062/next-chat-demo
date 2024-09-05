import { fetchApiProxy } from "@/lib/apiClient";
import axios from "axios";

export const getZpid = async () => {
  try {
    const data = await fetchApiProxy({
      url: 'https://id.zalo.me/account?continue=https://chat.zalo.me/',
      method: 'GET',
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'vi-VN,vi;q=0.9,en;q=0.8,af;q=0.7',
        'priority': 'u=1, i',
        'referer': 'https://zaloweb.me/',
        'sec-ch-ua': '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
        'upgrade-insecure-requests': "1",
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getZaloSession = async () => {
  try {
    const zpdid: string | null = localStorage.getItem("zpdid");
    const data = await fetchApiProxy({
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
        'cookie': `zpdid=${zpdid};`,
      },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const veryfifyClient = async () => {
  try {
    const cookie: string | null = localStorage.getItem('zlogin_session');
    const zpdid: string | null = localStorage.getItem("zpdid");
    if (!cookie) {
      console.error('No zlogin_session found in localStorage');
      return;
    }
    const data = await fetchApiProxy({
      url: 'https://id.zalo.me/account/verify-client',
      method: 'POST',
      data: {
        'type': 'device',
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
        'cookie': `zlogin_session=${cookie};zpdid=${zpdid};`,
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
    const response = await fetchApiProxy({
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
  data: DataWaittingScan;
  error_code: number;
}

export interface DataWaittingScan {
  avatar: string;
  display_name: string;
  image: string;
  code: string;
  options: Options;
  token: string;
}


export const getWaittingScan = async (code: string): Promise<WaittingScanResponse | undefined> => {
  try {
    const cookie: string | null = localStorage.getItem('zlogin_session');
    const zpdid: string | null = localStorage.getItem("zpdid");
    if (!cookie) {
      console.error('No zlogin_session found in localStorage');
      return;
    }
    const response = await fetchApiProxy({
      url: 'https://id.zalo.me/account/authen/qr/waiting-scan',
      method: 'POST',
      data: {
        'continue': 'https://chat.zalo.me/',
        'v': '5.5.4',
        "code": code
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
        'cookie': `zlogin_session=${cookie};zpdid=${zpdid}; _zlang=vn;`,
      },
    });

    return response as WaittingScanResponse;
  } catch (error) {
    console.error('Error fetching getWaittingScan code:', error);
  }
};

export const getWaittingScanConfirm = async (code: string): Promise<WaittingScanResponse | undefined> => {
  try {
    const cookie: string | null = localStorage.getItem('zlogin_session');
    const zpdid: string | null = localStorage.getItem("zpdid");
    if (!cookie) {
      console.error('No zlogin_session found in localStorage');
      return;
    }
    const response = await fetchApiProxy({
      url: 'https://id.zalo.me/account/authen/qr/waiting-confirm',
      method: 'POST',
      data: {
        'continue': 'https://chat.zalo.me/',
        'v': '5.5.4',
        "code": code
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
        'cookie': `zlogin_session=${cookie};zpdid=${zpdid}; _zlang=vn;`,
      },
    });

    return response as WaittingScanResponse;
  } catch (error) {
    console.error('Error fetching getWaittingScan code:', error);
  }
};

export interface LoginInfoResponse {
  error_message: string;
  data: string;
  error_code: number;
  error_message_localize: string
}

export const getLoginInfo = async (zcid: string, zcidExt: string, params:string): Promise<LoginInfoResponse | undefined> => {
  try {
    let zpw_sek: string | null = localStorage.getItem('zpw_sek');
    let zpsid: string | null = localStorage.getItem("zpsid");
    if (!zpw_sek) {
      console.error('No zlogin_session found in localStorage');
      return;
    }
    // zpw_sek="7yAl.414443736.a0.3H7Efm00NLROwEvE8G1TLdiYE3qYEdzzPYiJ9Z5CEsSpQ0ywU6mkEtPI5WP1FM1qVNj4I80YDWIW0LaDsMPTLW";
    // zpsid="66aK.414443736.95.EirmzX2EJSJ8PlxS78vDn6NzF_0Xkddm8xb-yckNKqGovHza4OeM7NQEJSG";

    const response = await fetchApiProxy({
      url: `https://wpa.chat.zalo.me/api/login/getLoginInfo?zcid=${zcid}&zcid_ext=${zcidExt}&enc_ver=v2&params=${encodeURIComponent(params)}&type=30&client_version=641`,
      method: 'GET',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/x-www-form-urlencoded',
        'origin': 'https://chat.zalo.me',
        'referer': 'https://chat.zalo.me/',
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'cookie': `zpw_sek=${zpw_sek};zpsid=${zpsid};`,
      },
    });
    return response.data as LoginInfoResponse;
  } catch (error) {
    console.error('Error fetching getWaittingScan code:', error);
  }
};

