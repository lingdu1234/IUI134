import presetUno from '@unocss/preset-uno'
import { defineConfig } from '@unocss/vite'

export default defineConfig({
  content: {
    pipeline: {
      exclude: [
        'node_modules',
        'dist',
        '.git',
        'public',
        'build',
        './stats.html',
      ],
    },
  },
  presets: [presetUno()],
  shortcuts: {},
  theme: {
    colors: {},
  },
})
