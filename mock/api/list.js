function getValue(arr) {
  const random = Math.random();
  return arr[Math.floor(random * arr.length)];
}
export default [
  {
    url: "/api/table",
    method: "post",
    response: ({ body }) => {
      const totalCount = 999;
      const currentPage = Number(body.param.currentPage || 1);
      const pageSize =
        body.param.showAll === 1 ? 1000 : Number(body.param.pageSize || 15);
      const start = pageSize * (currentPage - 1) + 1;
      const end = start + pageSize > totalCount ? totalCount : start + pageSize;
      const genderValues = ["男", "女"];
      const surnameValues = "赵钱李孙张杨徐刘蒋金王黄欧周龙谢左崔龚陈秦".split(
        ""
      );
      const nameValues = "黄河之水天上来奔流到海不复还".split("");
      let rows = [];
      if (body.param.orderBy) {
        const allRows = [];
        for (let i = 0; i < totalCount; i++) {
          allRows.push({
            id: i,
            name:
              getValue(surnameValues) +
              getValue(nameValues) +
              getValue(nameValues),
            gender: getValue(genderValues),
            tel: `132${Math.random().toString().slice(2, 10)}`,
            address:
              i % 2 === 0 ? "深圳市南山区" : "黄河之水天上来奔流到海不复还",
          });
        }
        allRows.sort((a, b) => {
          if (body.param.asc) {
            if (a[body.param.orderBy] > b[body.param.orderBy]) return 1;
            return -1;
          }
          if (a[body.param.orderBy] > b[body.param.orderBy]) return -1;
          return 1;
        });
        rows = allRows.slice(start, end);
      } else {
        for (let i = start; i < end; i++) {
          rows.push({
            id: i,
            name:
              getValue(surnameValues) +
              getValue(nameValues) +
              getValue(nameValues),
            gender: getValue(genderValues),
            tel: `132${Math.random().toString().slice(2, 10)}`,
            address:
              i % 2 === 0 ? "深圳市南山区" : "黄河之水天上来奔流到海不复还",
          });
        }
      }
      if (body.param.showAll === 1) {
        return {
          code: "0",
          message: "ok",
          result: rows,
        };
      }
      return {
        code: "0",
        message: "ok",
        result: {
          totalCount,
          rows,
        },
      };
    },
  },
];
