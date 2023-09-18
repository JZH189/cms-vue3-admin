import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

interface Idecrypt {
  encryptedKey: string; //加密后的秘钥
  encryptedIV: string; //加密后的Iv
  encryptedData: string; //加密后的data
} 

const publicKey = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4lhLJWccQz6lttR2SYDE\nICrCIa5YLcO1wccyncir5FFN797bK+5S5Cfbvxdpc8CK4Sii6aOkbdf8Cc4nhFpV\nDu2mxMw6cqeNLahUp5jTkHcFOYOTMBe+7grR1iRfg1DLO1Nwt7G7FUefDkK3yfiw\nx0IWGIsbR6yqeKXijFWBPtTwzlbkeENapWsqOaq82atBDAgTIPJY7zdD9J/wFilH\nTihUW0AegLDzmfoDxSZELKbX2pT5wBTSX8FrBDjE5T22MgYbX5jT15LC3jPss72P\nyShBkr2v+XoHLo2iUcDcjLdujU9P1LbYkTn5dhehkOQxbxQ+R6aOVfyKNdiMItVG\nzQIDAQAB\n-----END PUBLIC KEY-----"
// 使用RSA公钥
const rsa = new JSEncrypt();
rsa.setPublicKey(publicKey);

/**
 * 加密方法
 */
export function encrypt(text: string) {
  // 生成随机的AES密钥
  const aesKey = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  //使用RSA公钥加密aesKey
  const encryptedKey = rsa.encrypt(aesKey.toString());
  const encryptedIV = rsa.encrypt(iv.toString());
  // 使用AES密钥加密实际数据
  const encryptedData = CryptoJS.AES.encrypt(text, aesKey, {
    iv: iv,
  }).toString();

  return {
    encryptedKey,
    encryptedData,
    encryptedIV,
  };
}

/**
 * aes解密方法
 */
export function decrypt({ encryptedKey, encryptedIV, encryptedData }: Idecrypt) {
  // 前端接收来自服务器的数据
  // 使用RSA私钥解密AES密钥和IV
  const decryptedAesKey = CryptoJS.enc.Utf8.parse(rsa.decrypt(encryptedKey));
  const decryptedIV = CryptoJS.enc.Utf8.parse(rsa.decrypt(encryptedIV));

  // 使用解密后的AES密钥和IV解密数据
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, decryptedAesKey, {
    iv: decryptedIV,
  }).toString(CryptoJS.enc.Utf8);

  return decryptedData;
}