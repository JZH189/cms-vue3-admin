/**
 * 获取服务器时间
 */
export async function getTime(): Promise<Date> {
  return new Promise((resolve) => {
    // 获取服务器时间
    let xhr: XMLHttpRequest;
    xhr = new window.XMLHttpRequest();
    // 通过get的方式请求当前文件
    xhr.open("get", "/");
    xhr.send(null);
    // 监听请求状态变化
    xhr.onreadystatechange = function () {
      let time: any;
      let curDate: any;
      if (xhr.readyState === 2) {
        // 获取响应头里的时间戳
        time = xhr.getResponseHeader("Date");
        curDate = new Date(time);
        resolve(curDate);
      }
    };
  });
}
