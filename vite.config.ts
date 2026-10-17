import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 纯静态站：产物落到 dist/，Vercel 直接托管，不跑任何函数，全程零成本。
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
  },
});
