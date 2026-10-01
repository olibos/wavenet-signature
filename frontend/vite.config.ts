import { defineConfig, type UserConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const csp = {
  "default-src": ["'none'"],
  "script-src": ["'report-sample'", "'self'"],
  "style-src": ["'report-sample'", "'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "https://purecatamphetamine.github.io/country-flag-icons/", "data:"],
  "manifest-src": ["'self'"],
  "connect-src": ["'self'"],
}
const config = defineConfig(({ mode }) => {
  function patch(csp: Record<string, string[]>) {
    if (mode === 'development') {
      csp['script-src'].push("'unsafe-inline'");
    }
    return csp;
  }

  return {
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            minSize: 20000,
            groups: [
              {
                name: 'phone',
                test: /node_modules\/libphonenumber-js/,
                priority: 30,
              },
              {
                name: 'react-vendor',
                test: /node_modules[\\/]react/,
                priority: 20,
              },
              {
                name: 'vendor',
                test: /node_modules/,
                priority: 10,
              },
              {
                name: 'common',
                minShareCount: 2,
                minSize: 10000,
                priority: 5,
              },
            ],
          },
        }
      },
    },
    plugins: [
      tailwindcss(),
      devtools(),
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
  } satisfies UserConfig;
});

export default config
