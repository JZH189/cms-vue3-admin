/*校验是否为日期字符串*/
export function areTimeString(dateStr: string, Reg = new RegExp(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/g)): boolean {
  return Reg.test(dateStr)
}

/*校验是否为手机号*/
export function arePhone(phoneStr: string): boolean {
  const reg = /^1[3-9]\d{9}$/g
  return reg.test(phoneStr)
}

export function validatePhone(rule: any, value: any, callback: any): void {
  if (!value) {
    callback(new Error('手机号码不能为空！'))
  } else if (value.length < 11) {
    callback(new Error('手机号码必须是11位！'))
  } else if (!arePhone(value)) {
    callback(new Error('手机号码格式不正确！'))
  } else {
    callback()
  }
}
