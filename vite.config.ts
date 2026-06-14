import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import http from "http";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://worldcup26.ir",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq: http.ClientRequest, req: http.IncomingMessage) => {
            const url = new URL(req.url ?? "", "http://localhost");
            const apiPath = url.searchParams.get("path");
            if (apiPath) {
              proxyReq.path = `/${apiPath}`;
            }
          });
        },
      },
    },
  },
});
