import type { Ref } from 'vue'
import type { ElTable } from 'element-plus'
import { inject, provide } from 'vue'

const tableKey = Symbol('basic-table')

type Instance = {
  wrapRef: Ref<Nullable<HTMLDivElement>>
  tableRef: Ref<Nullable<InstanceType<typeof ElTable>>>
}

export function createTableContext(instance: Instance): void {
  provide(tableKey, instance)
}

export function useTableContext(): Instance {
  return inject(tableKey) as Instance
}
