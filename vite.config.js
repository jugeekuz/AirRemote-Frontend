import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' 
// https://vitejs.dev/config/
import basicSsl from '@vitejs/plugin-basic-ssl';
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    https: true
  },
  define: {
    global: {},
    'process.env': {}
  },
  plugins: [react(), 
    svgr({ 
      svgrOptions: {
        
      },
    }),
    basicSsl()],
})
