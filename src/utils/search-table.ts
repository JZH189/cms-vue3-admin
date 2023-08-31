import { cloneDeep, get } from "lodash-es";
import { usePagination } from "vue-request";

export function searchTable(options) {
  const { searchData, columnData, baseURL, queryApi } = options;
  const { data, loading, current, pageSize, total, run } =
    usePagination(pagerService);
  const exportLoading = ref(false);
  const pagination = reactive({ current, pageSize, total });
  const tableList = computed(() => get(data.value, "rows", []));
  const searchList = ref(cloneDeep(searchData || []));
  const columnList = ref(cloneDeep(columnData || []));
  let searchParams: any = null;

  // 重置查询条件
  function resetSearchParams() {
    //重置查询条件的时候不清空字段的options
    searchData.forEach((element) => {
      if (element.options) {
        const current = searchList.value.filter(
          (item) => item.key === element.key
        );
        if (current.length) {
          element.options = cloneDeep(current[0].options);
        }
      }
    });
    searchList.value = cloneDeep(searchData || []);
  }

  // 获取查询参数
  function getSearchParams() {
    const params: { errorMsg?: string } = {};
    return params;
  }

  // 调用查询接口，该函数会通过run执行
  async function pagerService(params?: any) {
    // 改变pageSize时，把currentPage重置为1
    if (params.pageSize && pageSize.value !== params.pageSize) {
      params.currentPage = 1;
    }
    // 默认展示100条
    if (!params.pageSize || params.pageSize < 100) params.pageSize = 100;
    const reqParams = {
      currentPage: params.currentPage || 1,
      pageSize: params.pageSize || 100,
      q: { ...params, currentPage: undefined, pageSize: undefined },
    };
    const result: any = await API.post({
      baseURL,
      url: queryApi,
      data: reqParams,
    });
    return result;
  }
  /**
   * @description:查询表格数据
   * @param {*} initFlag 该参数为true，则不会上报搜索事件，因此默认发起的查询可设为true
   * @param {*} params 发起查询时传参（除搜索条件以外的参数）
   * @return {*}
   */
  async function doSearch(initFlag = false, params = {}) {
    // 获取搜索条件的参数
    const curParams = getSearchParams();
    // 校验参数
    if (curParams.errorMsg) return;
    searchParams = curParams;
    await run({ ...curParams, ...params });
  }

  return {
    searchList,
    columnList,
    loading,
    tableList,
    pagination,
    exportLoading,
    resetSearchParams,
    doSearch,
  };
}
