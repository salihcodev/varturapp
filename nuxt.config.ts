// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    server: {
      hmr: {
        host: "localhost", // Use '0.0.0.0' or the Docker service name for the host
        port: 24678, // Match the exposed HMR port
      },
      watch: {
        usePolling: true, // Necessary for file watching inside Docker
      },
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
});
