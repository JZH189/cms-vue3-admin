import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
console.log("generatedRoutes: ", generatedRoutes);

export const routes = setupLayouts(generatedRoutes);
