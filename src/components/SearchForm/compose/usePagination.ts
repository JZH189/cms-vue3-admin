interface Ipagination {
  currentPage: number;
  pageSize: number;
  total: number;
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
 * @param queryApi 接口地址
 * @returns {*}
 */
export function usePagination(queryApi: string): ItableReturn {

  const loading = ref(false)

  const pagination = reactive<Ipagination>({
    currentPage: 1,
    pageSize: 100,
    total: 0,
  });

  const tableList: any = ref([])

  // 调用查询接口
  async function queryPages(params?: any) {
    loading.value = true
    let { currentPage, pageSize, param = {} } = params;
    // 改变pageSize时，把currentPage重置为1
    if (pageSize && pageSize.value && pageSize.value !== pageSize) {
      currentPage = 1;
    }
    // 默认展示100条
    if (!pageSize) pageSize = 100;
    const reqParams = {
      currentPage: currentPage || 1,
      pageSize: pageSize || 100,
      param: {
        ...param,
        currentPage: undefined,
        pageSize: undefined,
      },
    };
    const result = await API.post<Ipages>({
      url: queryApi,
      data: reqParams,
    });
    loading.value = false;
    tableList.value = result.data
    pagination.currentPage = result.pagination.currentPage
    pagination.pageSize = result.pagination.pageSize;
    pagination.total = result.pagination.total;
  }
  /**
   * @description:查询表格数据
   * @param {*} params 发起查询时传参
   * @return {*}
   */
  async function doSearch(params: any) {
    if (!params.param) {
      await queryPages({
        param: params,
      });
      return;
    }
    await queryPages(params);
  }

  /**
   * @param params 请求参数
   */
  async function doReset(params: any) {
    pagination.currentPage = 1;
    pagination.pageSize = 100;
    if (!params.param) {
      await queryPages({
        param: params,
      });
      return;
    }
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
