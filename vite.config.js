import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	server: {
		cors: true,
		headers: {
			'Cross-Origin-Embedder-Policy': 'credentialless',
		},
		proxy: {
			'/api': {
				target: 'https://locscout-backend.vercel.app',
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
				configure: (proxy, _options) => {
					proxy.on('error', (err, _req, _res) => {
						console.log('Proxy error:', err);
					});
					proxy.on('proxyReq', (proxyReq, req, _res) => {
						console.log('Proxy request:', req.method, req.url);
					});
					proxy.on('proxyRes', (proxyRes, req, _res) => {
						console.log('Proxy response:', proxyRes.statusCode, req.url);
					});
				}
			}
		}
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false,
		minify: 'terser',
		target: 'es2015',
		cssCodeSplit: true,
		chunkSizeWarningLimit: 2000,
		terserOptions: {
			compress: {
				drop_console: false,
				drop_debugger: true
			}
		},
		rollupOptions: {
			output: {
				entryFileNames: 'assets/[name].[hash].js',
				chunkFileNames: 'assets/[name].[hash].js',
				assetFileNames: 'assets/[name].[hash].[ext]',
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						if (id.includes('@tensorflow/tfjs')) {
							return 'tensorflow';
						}
						if (id.includes('react')) {
							return 'vendor-react';
						}
						if (id.includes('@radix-ui')) {
							return 'vendor-ui';
						}
						return 'vendor';
					}
				}
			}
		}
	},
	resolve: {
		extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	optimizeDeps: {
		include: [
			'react',
			'react-dom',
			'react-router-dom',
			'@tensorflow/tfjs'
		]
	}
});
