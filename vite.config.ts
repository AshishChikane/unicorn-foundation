// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";
// import inject from "@rollup/plugin-inject";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   plugins: [
//     react(),
//     mode === "development" && componentTagger(),
//     inject({
//       Buffer: ['buffer', 'Buffer'],
//     }),
//   ].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   optimizeDeps: {
//     include: ['wagmi', '@wagmi/chains', 'buffer'], // add 'buffer'
//   },
//   define: {
//     global: 'window', // sometimes required for polyfills to work
//   }
// }));
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    inject({
      Buffer: ['buffer', 'Buffer'],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['wagmi', '@wagmi/chains', 'buffer'], // add 'buffer'
  },
  define: {
    global: 'window', // sometimes required for polyfills to work
  },
  build: {
    rollupOptions: {
      external: ["typedarray-to-buffer"],
      
    },
  },
  
}));
