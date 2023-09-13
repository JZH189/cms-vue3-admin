interface Ipagination {
  currentPage: number;
  pageSize: number;
  total: number;
  pageSizes: number[];
}

interface Ipages {
  data: any[];
  pagination: Ipagination;
}

interface ItableReturn {
  loading: Ref<boolean>;
  tableList: ComputedRef<any[]>;
  pagination: Ipagination;
  doSearch: PromiseFn;
  doReset: PromiseFn;
}

/**
 *
 * @param props
 * @returns {*}
 */
export function usePagination(props: any): ItableReturn {
  const { queryApi, customRow, noForm } = props;
  //加载状态
  const loading = ref(false);
  //分页
  const pagination = reactive<Ipagination>({
    currentPage: 1,
    pageSize: 50,
    total: 0,
    pageSizes: [50, 100, 200],
  });
  //响应list
  const tableList: any = ref([]);
  // 调用查询接口
  async function queryPages(params?: any) {
    try {
      loading.value = true;
      let result: any;
      if (!noForm) {
        //开启分页和查询表单
        result = await API.post<Ipages>({
          url: queryApi,
          data: {
            currentPage: pagination.currentPage || 1,
            pageSize: pagination.pageSize || 100,
            param: {
              ...params,
            },
          },
        });
        tableList.value =
          typeof customRow === "function"
            ? customRow(result.list)
            : result.list;
        pagination.currentPage = result.pagination.currentPage;
        pagination.pageSize = result.pagination.pageSize;
        pagination.total = result.pagination.total;
      } else {
        //关闭分页和查询表单
        result = await API.get({
          url: queryApi,
        });
        tableList.value =
          typeof customRow === "function"
            ? customRow(result.list)
            : result.list;
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
      console.log('error: ', error);
    }
  }
  //查询
  async function doSearch(params: any) {
    await queryPages(params);
  }
  //重置
  async function doReset(params: any) {
    if (noForm) {
      await queryPages();
      return
    }
    pagination.currentPage = 1;
    pagination.pageSize = 100;
    await queryPages(params);
  }

  return {
    loading,
    pagination,
    tableList,
    doSearch,
    doReset,
  };
}
