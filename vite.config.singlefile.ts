import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 单文件打包配置：所有 JS/CSS 内联到一个独立 HTML，支持相对路径打开
export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteSingleFile({
      inlinePattern: ['**/*'],
      removeViteModuleLoader: true,
      deleteInlinedFiles: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'dist-singlefile',
    assetsInlineLimit: 100000000, // 把所有资源都内联（Base64）
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
