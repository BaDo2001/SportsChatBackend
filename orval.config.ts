import { defineConfig } from "orval";

export default defineConfig({
  sportradar: {
    input: "./sportradar/openapi.yaml",
    output: "./sportradar/sportradar.ts",
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
