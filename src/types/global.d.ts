declare global {
  interface Pagination {
    currentPage: number;
    pageSize: number;
    total: number;
  }

  /**
   * 列表响应对象
   */
  interface ListResult<T> {
    /**
     * 数据列表
     */
    list: T[];
  }

  /**
   * 分页响应对象
   */
  interface PageResult<T> {
    /**
     * 数据列表
     */
    list: T[];
    /**
     * 数据总数
     */
    pagination: Pagination;
  }

  /**
   * 弹窗属性
   */
  interface DialogOption {
    /**
     * 弹窗标题
     */
    title?: string;
    /**
     * 是否显示
     */
    visible: boolean;
  }
  /**
   * 组件数据源
   */
  interface OptionType {
    /**
     * 值
     */
    value: number;
    /**
     * 文本
     */
    label: string;
    /**
     * 子列表
     */
    children?: OptionType[];
  }
}
