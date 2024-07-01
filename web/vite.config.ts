import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@api': path.resolve(__dirname, 'src/api'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@hooks': path.resolve(__dirname, 'src/hooks'),
			'@utils': path.resolve(__dirname, 'src/utils'),
			'@mytypes': path.resolve(__dirname, 'src/constants/types.ts'),
			'@constants': path.resolve(__dirname, 'src/constants/index.ts'),
		},
	},
	plugins: [react(), TanStackRouterVite()],
})
