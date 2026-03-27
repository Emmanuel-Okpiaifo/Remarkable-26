import { defineConfig } from 'vite'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const appsScriptUrl = String(env.VITE_APPS_SCRIPT_URL || '').trim()
  const parsedUrl = appsScriptUrl ? new URL(appsScriptUrl) : null

  const proxy =
    parsedUrl && parsedUrl.hostname === 'script.google.com'
      ? {
          '/api/submit': {
            target: `${parsedUrl.protocol}//${parsedUrl.host}`,
            changeOrigin: true,
            secure: true,
            rewrite: () => `${parsedUrl.pathname}${parsedUrl.search}`,
          },
        }
      : undefined

  return {
    plugins: [react()],
    server: { proxy },
  }
})
