import { defineConfig } from 'vite'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const appsScriptUrl = String(env.VITE_APPS_SCRIPT_URL || '').trim()
  let proxy

  if (appsScriptUrl) {
    try {
      const targetUrl = new URL(appsScriptUrl)
      proxy = {
        '/api/submit': {
          target: `${targetUrl.protocol}//${targetUrl.host}`,
          changeOrigin: true,
          secure: true,
          rewrite: () => `${targetUrl.pathname}${targetUrl.search}`,
        },
      }
    } catch {
      proxy = undefined
    }
  }

  return {
    plugins: [react()],
    server: { proxy },
  }
})
