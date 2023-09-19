import MD5 from "crypto-js/md5";
import { generateRandomStr } from "./generateRandomStr";

/**
 * 生成sign
 */
export function genSign(params) {
  // 密钥(与后端保持一致)
  const secret = "victorjianghjkfdhj";
  // 13位时间戳
  const timestampStr = String(new Date().getTime());
  // 20位随机数(要求在指定时间内（例如60s）产生的随机数重复的概率为0)
  const nonce = generateRandomStr(20);
  params.timestampStr = timestampStr;
  params.nonce = nonce;
  // 取 key
  const sortedKeys: string[] = [];
  for (const key in params) {
    // 注意这里，要剔除掉 sign 参数本身
    if (key !== "sign") {
      sortedKeys.push(key);
    }
  }
  // 参数名 ASCII 码从小到大排序（字典序）
  sortedKeys.sort();
  // 1 拼接参数
  let str = "";
  sortedKeys.forEach((key) => {
    str += key + params[key];
  });
  // 2 拼接密钥
  str += secret;
  // 3 hash请求的参数
  const sign = MD5(str).toString().toUpperCase();
  return sign;
}
