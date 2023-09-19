import JSEncrypt from "jsencrypt";
import * as CryptoJS from "crypto-js";
import { generateRandomStr } from "./generateRandomStr";

interface Idecrypt {
  encryptedKey: string; //加密后的秘钥
  encryptedData: string; //加密后的data
}

const publicKey =
  "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4lhLJWccQz6lttR2SYDE\nICrCIa5YLcO1wccyncir5FFN797bK+5S5Cfbvxdpc8CK4Sii6aOkbdf8Cc4nhFpV\nDu2mxMw6cqeNLahUp5jTkHcFOYOTMBe+7grR1iRfg1DLO1Nwt7G7FUefDkK3yfiw\nx0IWGIsbR6yqeKXijFWBPtTwzlbkeENapWsqOaq82atBDAgTIPJY7zdD9J/wFilH\nTihUW0AegLDzmfoDxSZELKbX2pT5wBTSX8FrBDjE5T22MgYbX5jT15LC3jPss72P\nyShBkr2v+XoHLo2iUcDcjLdujU9P1LbYkTn5dhehkOQxbxQ+R6aOVfyKNdiMItVG\nzQIDAQAB\n-----END PUBLIC KEY-----";
// 使用RSA公钥
const crypt = new JSEncrypt();
crypt.setPublicKey(publicKey);

/**
 * 加密方法
 */
export function encrypt(text: string) {
  // 生成随机的AES密钥
  const aesKey = generateRandomStr(16);
  //使用RSA公钥加密aesKey
  const encryptedKey = crypt.encrypt(aesKey);
  // 使用AES密钥加密实际数据
  const encryptedData = CryptoJS.AES.encrypt(text, aesKey).toString();

  return {
    encryptedKey,
    encryptedData,
  };
}

/**
 * aes解密方法
 */
export function decrypt({ encryptedKey, encryptedData }: Idecrypt) {
  // 使用RSA私钥解密AES密钥
  const decryptedAesKey = crypt.decrypt(encryptedKey);
  // 使用解密后的AES密钥解密数据
  const decryptedData = CryptoJS.AES.decrypt(
    encryptedData,
    decryptedAesKey
  ).toString();

  return decryptedData;
}
