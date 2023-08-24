/**
 *
 * @param icon 图标
 * @returns
 */
export const renderIcon = (icon: string) => {
  return () => h("span", { class: `i-${icon}` });
};
