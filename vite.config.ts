import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/snake',
  resolve: {
    alias: {
      utils: path.resolve(__dirname, 'src/utils'),
      components: path.resolve(__dirname, 'src/components'),
    },
  },
});
