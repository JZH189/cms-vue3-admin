import { createProdMockServer } from "vite-plugin-mock/es/createProdMockServer";
import permmenu from "./api/permmenu";

const api = [...permmenu];

export function setupProdMockServer() {
  createProdMockServer(api);
}
