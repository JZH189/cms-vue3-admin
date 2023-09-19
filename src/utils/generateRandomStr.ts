//生成指定长度随机字符串
export function generateRandomStr(strLength = 16) {
  let code = "";
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const charsArr = chars.split("");

  for (let i = 0; i < strLength; i++) {
    const num = Math.floor(Math.random() * charsArr.length);
    code += charsArr[num];
  }
  return code;
}
