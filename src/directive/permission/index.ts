import { useUserStoreHook } from "@/store/modules/user";
import { Directive, DirectiveBinding } from "vue";

/**
 * 按钮权限
 */
export const hasPerm: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { perms } = useUserStoreHook();
    const { value } = binding;
    if (value) {
      //dom展示需要的权限标识
      const hasPerm = perms.includes(value);
      if (!hasPerm) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error("need perms! Like v-has-perm='sys:user:add'");
    }
  },
};
