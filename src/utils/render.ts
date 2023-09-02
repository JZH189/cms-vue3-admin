import { ElMessageBox, ElButton, ButtonInstance, ElMessageBoxOptions } from 'element-plus'

interface Iconfirm {
  btnType?: ButtonInstance["type"];
  title?: ElMessageBoxOptions["title"];
  message?: ElMessageBoxOptions["message"];
  showCancelButton?: ElMessageBoxOptions["showCancelButton"];
  confirmButtonText?: string;
  cancelButtonText?: string;
  beforeClose?: ElMessageBoxOptions["beforeClose"];
  confirmFn: Fn; //确认回调
  cancelFn?: Fn; //取消回调
}

/**
 * @param icon 图标
 * @returns
 */
export function renderIcon(icon: string) {
  return () => h("span", { class: `i-${icon}` });
};


/**
 * 生成一个button并配置设置点击出现ElMessageBox
 * @param options Iconfirm
 * @returns 
 */
export function renderConfirm(options: Iconfirm) {
  return h(
    ElButton,
    {
      type: options.btnType || "primary",
      onClick: () => {
        ElMessageBox({
          title: options.title || "提示",
          message: options.message || "确定执行此操作？",
          showCancelButton: options.showCancelButton || true,
          confirmButtonText: options.confirmButtonText || "确认",
          cancelButtonText: options.cancelButtonText || "取消",
          beforeClose: options.beforeClose ?
            (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = 'Loading...'
                options.beforeClose && options.beforeClose(action, instance, done);
              } else {
                done()
              }
            } : undefined,
        })
          .then((action) => {
            options.confirmFn(action)
          })
          .catch(() => {
            options.cancelFn && options.cancelFn();
          })
      },
    },
    {
      default: () => "请给我一个文案",
    }
  );
}