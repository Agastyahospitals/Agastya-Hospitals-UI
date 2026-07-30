// vite.config.js
import { defineConfig } from "file:///C:/Users/djkri/OneDrive/Desktop/Projects/New%20Agastya/Agastya-Hospitals-UI/Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/djkri/OneDrive/Desktop/Projects/New%20Agastya/Agastya-Hospitals-UI/Frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import { viteStaticCopy } from "file:///C:/Users/djkri/OneDrive/Desktop/Projects/New%20Agastya/Agastya-Hospitals-UI/Frontend/node_modules/vite-plugin-static-copy/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/_redirects",
          dest: "."
        }
      ]
    })
  ],
  server: {
    port: 3002,
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkamtyaVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFByb2plY3RzXFxcXE5ldyBBZ2FzdHlhXFxcXEFnYXN0eWEtSG9zcGl0YWxzLVVJXFxcXEZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxkamtyaVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFByb2plY3RzXFxcXE5ldyBBZ2FzdHlhXFxcXEFnYXN0eWEtSG9zcGl0YWxzLVVJXFxcXEZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9kamtyaS9PbmVEcml2ZS9EZXNrdG9wL1Byb2plY3RzL05ldyUyMEFnYXN0eWEvQWdhc3R5YS1Ib3NwaXRhbHMtVUkvRnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tICd2aXRlLXBsdWdpbi1zdGF0aWMtY29weSdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZpdGVTdGF0aWNDb3B5KHtcbiAgICAgIHRhcmdldHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJ3B1YmxpYy9fcmVkaXJlY3RzJyxcbiAgICAgICAgICBkZXN0OiAnLidcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDIsXG4gICAgb3BlbjogdHJ1ZVxuICB9XG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBNGIsU0FBUyxvQkFBb0I7QUFDemQsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsc0JBQXNCO0FBRy9CLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxLQUFLO0FBQUEsVUFDTCxNQUFNO0FBQUEsUUFDUjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
