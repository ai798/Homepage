import { defineConfig } from 'vite'
import path from "path";
import type { UserConfig, ConfigEnv } from "vite";
import { loadEnv } from "vite";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import pkg from "./package.json";
import dayjs from "dayjs";
// export default defineConfig({
//   // ...
//   plugins: [
//     vue(),
//     // ...
//     AutoImport({
//       resolvers: [ElementPlusResolver()],
//     }),
//     Components({
//       resolvers: [ElementPlusResolver()],
//     }),
//   ],
// })

const resolve = (dir: string) => path.join(__dirname, dir);

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format("YYYY-MM-DD HH:mm:ss")
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);
  const { VITE_PUBLIC_PATH, VITE_DROP_CONSOLE } = env;

  const isBuild = command === "build";
  return {
      base: VITE_PUBLIC_PATH,
      root,
        plugins: [
        vue(),
        // ...
        AutoImport({
          resolvers: [ElementPlusResolver()],
        }),
        Components({
          resolvers: [ElementPlusResolver()],
        }),
      ],
      esbuild: {
          pure: VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
      },
      resolve: {
          alias: {
              "~/": `${path.resolve(__dirname, "src")}/`,
              '@': resolve('./src'),
          }
      },
      css: {
          preprocessorOptions: {
              scss: {
                  additionalData: `@use "~/styles/theme/index.scss" as *;`
              }
          }
      },
      server: {
          port: 4000, // 服务端口号
          open: true, // 服务启动时是否自动打开浏览器
          proxy:{
            '/api': {
                target: 'http://54.179.149.33:18008',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyReq', function (proxyReq, req, res, options) {
                        // proxyReq.setHeader('cookie', cookie);
                    });
                }
            },
            '/test': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyReq', function (proxyReq, req, res, options) {
                        // proxyReq.setHeader('cookie', cookie);
                    });
                }
            },
          }
      },
      build: {
          reportCompressedSize: false,
          chunkSizeWarningLimit: 2000,
          rollupOptions: {
              // 静态资源分类打包
              output: {
                  chunkFileNames: "static/js/[name]-[hash].js",
                  entryFileNames: "static/js/[name]-[hash].js",
                  assetFileNames: "static/[ext]/[name]-[hash].[ext]"
              }
          }
      },
      define: {
          // 解决打包报错
          __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
          // 系统信息
          __APP_INFO__: JSON.stringify(__APP_INFO__)
      }
  };
};