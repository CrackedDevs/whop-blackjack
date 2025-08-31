import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    __DEV__: true,
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-svg': path.resolve('./src/components/SvgCompat.web.tsx'),
      'react-native-haptic-feedback': path.resolve('./src/components/WebStubs.tsx'),
      'react-native-gesture-handler': path.resolve('./src/components/WebStubs.tsx'),
      'react-native-reanimated': path.resolve('./src/components/WebStubs.tsx'),
      './hooks/useChessGame': path.resolve('./src/hooks/useChessGame.web.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['react-native-haptic-feedback', 'react-native-gesture-handler', 'react-native-reanimated'],
  },
  server: {
    port: 3000,
    host: true,
  },
})