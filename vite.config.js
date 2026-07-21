import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],

    test: {
        environment: "jsdom",
        setupFiles: "./src/test/setup.js",
        globals: true,
        css: true,

        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.{js,jsx}"],
            exclude: ["src/main.jsx", "src/test/**", "src/**/*.test.{js,jsx}"],
        },
    },
});
