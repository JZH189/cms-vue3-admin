import { ref, unref, computed, VNode, watch, useSlots, useAttrs, reactive, cloneVNode } from 'vue'

interface ItableColumns {
  slot: any[]
  storage: any[]
  render: any[]
}
function isElTableColumn(vnode) {
  return vnode.type?.name === 'ElTableColumn'
}

export function useTable(props) {
  const multipleSelection = ref([])
  const userAttrs = useAttrs()
  const tableHeight: any = ref(undefined)
  function handleSelectionChange(val) {
    multipleSelection.value = val
  }
  function getTableHeight() {
    const tableForm = document.getElementsByClassName('grid-form')[0]
    const pageEl = document.getElementsByClassName('pagination')[0]
    const appHeaderHeight = 50
    const outerPageHeight = 90
    const tableFormHieght = tableForm ? unref((tableForm as HTMLElement).offsetHeight) : 0
    const tableHeaderHeight = 44
    const tableTitleHeight = 40
    const paginationHeight = pageEl ? unref((pageEl as HTMLElement).offsetHeight) : 0
    const documentHeight = document.documentElement.offsetHeight
    const countHeight = appHeaderHeight + outerPageHeight + tableFormHieght + tableHeaderHeight + tableTitleHeight + paginationHeight
    let height = 0
    if (!tableFormHieght) {
      height = documentHeight - 250
    } else {
      height = documentHeight - countHeight
    }
    tableHeight.value = height
    return height
  }
  const mergeAttrs = computed(() => ({
    onSelectionChange: handleSelectionChange,
    ...userAttrs,
    ...props,
  }))
  /**
   * 对 slot 进行分类, 让table-column在table中从左到右排列
   * 此时要考虑以下几种情况：
   * 1、Table-column定义了fixed：left 属性的列需要固定列到table的最左边
   * 2、Table-column定义了fixed：right 属性的列需要固定列到table的最右边
   * 3、剩下的就是按照先后顺序从左到右排列
   */
  const tableSlots = computed(() => {
    //获取tableColumn插槽内容
    const tableColumn = useSlots().default?.() || useSlots().tablColumn?.()
    const tableLeft: VNode[] = [] //固定到左侧列
    const tableRight: VNode[] = [] //固定到右侧列
    const contents: VNode[] = [] // 存内容列
    tableColumn?.forEach((vnode) => {
      if (isElTableColumn(vnode)) {
        //vnode.props就是用户传入的props
        const { fixed } = vnode.props || {}
        if (fixed) {
          if (fixed === 'left') {
            return tableLeft.push(vnode)
          } else if (fixed === 'right') {
            return tableRight.push(vnode)
          }
        } else {
          return contents.push(vnode)
        }
      }
    })
    return {
      tableLeft,
      tableRight,
      contents,
    }
  })
  // 收集筛选后的列数据
  const tableColumns: ItableColumns = reactive({
    slot: computed(() =>
      tableSlots.value.contents.map(({ props }) => ({
        prop: props?.prop, // 列标识
        label: props?.label, // 列名称
        visiable: props?.visiable || true, // 是否可见
      })),
    ),
    storage: [],
    render: computed(() => {
      const slot = [...tableColumns.slot]
      const storage: VNode[] = [...tableColumns.storage]
      const result: VNode[] = []
      storage.forEach((vnode) => {
        // @ts-ignore
        const index = slot.findIndex(({ prop }) => prop === vnode.prop)
        if (index >= 0) {
          const propsFromSlot = slot[index]
          result.push({
            ...propsFromSlot, // 可能新增属性 所以用 slot 的数据兜底
            ...vnode,
          })
          slot.splice(index, 1) // storage 里不存在的列
        }
        // slot 中没有找到的则会被过滤掉
      })
      // @ts-ignore
      result.push(...slot)
      return result
    }),
  })
  // 最终被呈现的slot
  const finalSlot = computed(() => {
    const { contents } = tableSlots.value
    const result: VNode[] = []
    // @ts-ignore
    tableColumns.render.forEach(({ prop, visiable }) => {
      // 如果visiable为false则不渲染
      if (!visiable) return
      // 从 slots.contents 中寻找对应 prop 的 VNode
      const vnode = contents.find((vnode) => prop === vnode.props?.prop)
      if (!vnode) return
      // 克隆 VNode 并修改部分属性
      const cloned: VNode = cloneVNode(vnode)
      result.push(cloned)
    })
    return result
  })
  // 强制新表格列
  const key = ref(0)
  watch(finalSlot, () => (key.value += 1))
  //向el-table传递插槽
  const defaultSlots = () => [tableSlots.value.tableLeft, finalSlot.value, tableSlots.value.tableRight]

  return {
    multipleSelection,
    tableHeight,
    getTableHeight,
    mergeAttrs,
    key,
    tableColumns,
    defaultSlots,
  }
}
