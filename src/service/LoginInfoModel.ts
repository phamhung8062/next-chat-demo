import CryptoJS from 'crypto-js'; // Đảm bảo bạn đã cài đặt thư viện này: npm install crypto-js

interface ClassAConstructor {
  type: number;
  imei: string;
  firstLaunchTime: number;
}

export class LoginInfoModel {
  zcid: string | null;
  zcid_ext: string;
  encryptKey: string | null;
  enc_ver: string;

  

  constructor({ type, imei, firstLaunchTime }: ClassAConstructor) {
    this.enc_ver = 'v2';
    this.zcid = null;
    this.encryptKey = null;
    this.zcid_ext = '547dc02';

    this.createZcid(type, imei, firstLaunchTime);
    this.createEncryptKey();
  }

  createZcid = (type1: number, imei1: string, firstLaunchTime1: number) => {
    const a = `${type1},${imei1},${firstLaunchTime1}`;
    const s = LoginInfoModel.encodeAES('3FC4F0D2AB50057BCE0D90D9187A22B1', a, 'hex', true);
    console.log('zcid', s);
    this.zcid = s;
  };

  getParams = () => {
    return this.zcid
      ? {
          zcid: this.zcid,
          zcid_ext: this.zcid_ext,
          enc_ver: this.enc_ver,
        }
      : null;
  };

  getEncryptKey = () => {
    return this.encryptKey ? this.encryptKey : null;
  };

  createEncryptKey = (e = 0) => {
    const t = (e: string, t: string) => {
      const { even: n } = LoginInfoModel.processStr(e);
      const { even: a, odd: s } = LoginInfoModel.processStr(t);
      if (!n || !a || !s) return false;
      const i = n.slice(0, 8).join('') + a.slice(0, 12).join('') + s.reverse().slice(0, 12).join('');
      this.encryptKey = i;
      console.log('this.encryptKey ', i);
      return true;
    };

    if (!this.zcid || !this.zcid_ext) {
      return false;
    }
    try {
      let n = null;
      n = CryptoJS.MD5(this.zcid_ext).toString().toUpperCase();
      if (t(n, this.zcid) || !(e < 3)) return false;
      this.createEncryptKey(e + 1);
    } catch (n) {
      return e < 3 && this.createEncryptKey(e + 1);
    }
    return true;
  };

  static randomString(e: number, t: number) {
    const n = e || 6;
    const a = t && t > e ? t : 12;
    let s = Math.floor(Math.random() * (a - n + 1)) + n;
    if (s > 12) {
      let e = '';
      for (; s > 0; ) {
        e += Math.random().toString(16).substr(2, s > 12 ? 12 : s);
        s -= 12;
      }
      return e;
    }
    return Math.random().toString(16).substr(2, s);
  }

  static processStr(e: string) {
    if (!e || typeof e !== 'string') {
      return {
        even: null,
        odd: null,
      };
    }
    const [t, n] = [...e].reduce(
      (e, t, n) => (e[n % 2].push(t), e),
      [[], []] as [string[], string[]]
    );
    return {
      even: t,
      odd: n,
    };
  }

  static encodeAES = (encrypt: string, t: string, n: string, a = false, s = 0): string | null => {
    if (!t) return null;
    try {
      const kk = n === 'hex' ? CryptoJS.enc.Hex : CryptoJS.enc.Base64;
      const i = CryptoJS.enc.Utf8.parse(encrypt);
      const o = CryptoJS.enc.Hex.parse('00000000000000000000000000000000');
      const r = CryptoJS.AES.encrypt(t, i, {
        iv: o,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).ciphertext.toString(kk);
      const data = a ? r.toUpperCase() : r;
      return data;
    } catch (o) {
      return s < 3 ? LoginInfoModel.encodeAES(encrypt, t, n, a, s + 1) : null;
    }
  };
}