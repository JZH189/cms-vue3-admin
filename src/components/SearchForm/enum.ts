//所有被支持的表单类型的枚举
export enum FormItemType {
  input = "input", //输入框
  textarea = "textarea", //文本框
  select = "select", //下拉选框
  treeSelect = "tree-select", //树形选择
  tree = "tree", //树形控件
  timePicker = "time-picker", //时间选择
  timeSelect = "time-select", //时间下拉框
  datePicker = "date-picker", //日期选择
  switch = "switch", //开关
  checkbox = "checkbox", //复选框
  radio = "radio", //单选按钮
  colorPicker = "color-picker", //颜色选择
  cascader = "cascader", //级联选择
  slider = "slider", //滑块
  rate = "rate", //评分
}

export enum FormItemLayout {
  column = "column", //表单项占据一整行
  flex = "flex", //表单项宽度自适应
}
