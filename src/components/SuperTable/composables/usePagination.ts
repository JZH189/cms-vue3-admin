import { reactive } from 'vue'

export function usePagination() {
  //分页设置
  const pageData = reactive({
    total: 0,
    current: 1,
    pageSize: 100,
    pageSizes: [100, 200],
  });
  return pageData
}
