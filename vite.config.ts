import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@sipStore": path.resolve(__dirname, "./src/store"),
      "@sipComponent": path.resolve(__dirname, "./src/components"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "SipPhoneDial",
      fileName: (format) =>
        `sip-phone-dial.${format === "es" ? "js" : "umd.js"}`,
    },
    rollupOptions: {
      external: ["vue", "vuex"],
      output: {
        globals: {
          vue: "Vue",
          vuex: "Vuex",
        },
      },
    },
  },
});
