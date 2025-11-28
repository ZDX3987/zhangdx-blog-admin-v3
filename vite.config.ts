import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    define: {
        // 启用生产环境构建下激活不匹配的详细警告
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8888',
                // target: 'http://47.113.97.58:8888',
                changeOrigin: true,
                rewrite(path) {
                    return path.replace(/^\/api/, '')
                }
            }
        }
    },
    plugins: [vue()],
})
