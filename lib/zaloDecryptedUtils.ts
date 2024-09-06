
import * as CryptoJS from 'crypto-js';

export function decodeAESLogin (key : string, encryptedData:string, ivHex:string = "", attempt = 0): string {
  if (!encryptedData) return "";
  try {
    encryptedData = decodeURIComponent(encryptedData);
    const keyBuffer = CryptoJS.enc.Utf8.parse(key);
    const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
    const n = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(encryptedData),
        salt: '',
      },
      keyBuffer,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );
    return n.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('ParamDecryptor error:', error);
    return attempt < 3 ? decodeAESLogin(key, encryptedData, ivHex, attempt + 1) : "";
  }
};

