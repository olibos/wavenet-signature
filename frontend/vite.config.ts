import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { fileURLToPath, URL } from 'url'
import tailwindcss from '@tailwindcss/vite'

const csp = {
  "default-src": ["'none'"],
  "script-src": ["'report-sample'", "'self'"],
  "style-src": ["'report-sample'", "'self'"],
  "img-src": ["'self'", "https://purecatamphetamine.github.io/country-flag-icons/", "data:"],
  "manifest-src": ["'self'"],
  "connect-src": ["'self'"],
}
const config = defineConfig(({ mode }) => {
  function patch(csp: Record<string, string[]>) {
    if (mode === 'development') {
      csp['style-src'].push("'unsafe-inline'");
      csp['script-src'].push("'unsafe-inline'");
    }
    return csp;
  }

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      devtools(),
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      viteReact(),
    ],
    server: {
      headers: {
        "Content-Security-Policy-Report-Only":
          Object.entries(patch(csp))
            .map(([key, values]) => `${key} ${values.join(' ')}`)
            .join('; '),
      },
      proxy: {
        '/api': {
          target: 'https://localhost:7030',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});

export default config
