import { useUserStoreHook } from "@/store/modules/user";

export function hasPermission(perm: string): boolean {
  const { perms } = useUserStoreHook();
  return perms.includes(perm);
}
