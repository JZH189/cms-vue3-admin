import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import permmenu from "./api/permmenu";
import list from "./api/list";

const api = [...permmenu, ...list];

export function setupProdMockServer() {
  createProdMockServer(api);
}
