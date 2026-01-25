# Vite 配置详解

`vite.config.ts` (或 `vite.config.js`) 是 Vite 的配置文件。Vite 会自动解析项目根目录下的该文件。

以下是 Vite 所有核心配置项的详细说明。

## 配置文件结构

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  root: process.cwd(), // 项目根目录
  base: "/", // 开发或生产环境服务的公共基础路径
  mode: "development", // 模式
  plugins: [vue()], // 插件
  publicDir: "public", // 静态资源服务文件夹
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    target: "modules",
    outDir: "dist",
    assetsDir: "assets",
    minify: "esbuild", // 或 'terser'
    sourcemap: false,
  },
});
```

## 1. 共享配置 (Shared Options)

这些选项在开发（dev）和构建（build）中都是通用的。

### `root`

- **类型**: `string`
- **默认**: `process.cwd()`
- **描述**: 项目根目录（`index.html` 文件所在的位置）。可以是一个绝对路径，或者相对于 CWD 的路径。

### `base`

- **类型**: `string`
- **默认**: `/`
- **描述**: 开发或生产环境服务的公共基础路径。合法的值包括：
  - 绝对 URL 路径名，例如 `/foo/`
  - 完整的 URL，例如 `https://foo.com/`
  - 空字符串或 `./`（用于嵌入式部署）

### `mode`

- **类型**: `string`
- **默认**: `'development'` (开发) / `'production'` (构建)
- **描述**: 在配置中指明将会把 `serve` 和 `build` 时默认的 `mode` 覆盖掉。

### `plugins`

- **类型**: `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`
- **描述**: 需要用到的插件数组。Falsy 值的插件会被忽略，插件数组会被扁平化。

### `publicDir`

- **类型**: `string | false`
- **默认**: `"public"`
- **描述**: 作为静态资源服务的文件夹。该目录中的文件会 file_path 在开发中被服务，并在构建时被复制到 `outDir` 的根目录，且始终保持原样。

### `resolve.alias`

- **类型**: `Record<string, string> | Array<{ find: string | RegExp, replacement: string }>`
- **描述**: 将会被传递到 `@rollup/plugin-alias` 作为 entries 的选项。也可以是一个对象，或一个 `{ find, replacement, customResolver }` 的数组。

```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
    'comps': path.resolve(__dirname, 'src/components')
  }
}
```

### `css.preprocessorOptions`

- **类型**: `Record<string, object>`
- **描述**: 指定传递给 CSS 预处理器的选项。例如 SCSS 的全局变量。

## 2. 开发服务器配置 (Server Options)

### `server.host`

- **类型**: `string | boolean`
- **默认**: `'localhost'`
- **描述**: 指定服务器应该监听哪个 IP 地址。 如果将此设置为 `0.0.0.0` 或者 `true` 将监听所有地址，包括局域网和公网地址。

### `server.port`

- **类型**: `number`
- **默认**: `5173`
- **描述**: 指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口。

### `server.strictPort`

- **类型**: `boolean`
- **默认**: `false`
- **描述**: 设为 `true` 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。

### `server.open`

- **类型**: `boolean | string`
- **默认**: `false`
- **描述**: 在服务器启动时自动在浏览器中打开应用程序。

### `server.proxy`

- **类型**: `Record<string, string | ProxyOptions>`
- **描述**: 为开发服务器配置自定义代理规则。

```javascript
server: {
  proxy: {
    // 字符串简写写法
    '/foo': 'http://localhost:4567',
    // 选项写法
    '/api': {
      target: 'http://jsonplaceholder.typicode.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 3. 构建配置 (Build Options)

### `build.target`

- **类型**: `string | string[]`
- **默认**: `'modules'`
- **描述**: 设置最终构建的浏览器兼容目标。默认值是一个特指支持 [原生 ESM script 标签](https://caniuse.com/es6-module) 和 [原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 的浏览器版本。

### `build.outDir`

- **类型**: `string`
- **默认**: `dist`
- **描述**: 指定输出路径（相对于项目根目录）。

### `build.assetsDir`

- **类型**: `string`
- **默认**: `assets`
- **描述**: 指定生成静态资源的存放路径（相对于 `build.outDir`）。

### `build.assetsInlineLimit`

- **类型**: `number`
- **默认**: `4096` (4kb)
- **描述**: 小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 `0` 可以完全禁用此项。

### `build.cssCodeSplit`

- **类型**: `boolean`
- **默认**: `true`
- **描述**: 启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时插入。

### `build.sourcemap`

- **类型**: `boolean | 'inline' | 'hidden'`
- **默认**: `false`
- **描述**: 构建后是否生成 source map 文件。

### `build.minify`

- **类型**: `boolean | 'terser' | 'esbuild'`
- **默认**: `'esbuild'`
- **描述**: 设置为 `false` 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 `esbuild`，它比 terser 快 20-40 倍，压缩率只差 1%-2%。

### `build.rollupOptions`

- **类型**: `RollupOptions`
- **描述**: 自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。

```javascript
build: {
  rollupOptions: {
    input: {
      main: path.resolve(__dirname, 'index.html'),
      nested: path.resolve(__dirname, 'nested/index.html')
    },
    output: {
        manualChunks(id) {
            if (id.includes('node_modules')) {
                return 'vendor';
            }
        }
    }
  }
}
```

## 4. 预览配置 (Preview Options)

### `preview.port`

- **类型**: `number`
- **默认**: `4173`
- **描述**: 指定预览服务器端口。

## 5. 依赖优化配置 (OptimizeDeps Options)

### `optimizeDeps.entries`

- **类型**: `string | string[]`
- **描述**: 默认情况下，Vite 会抓取你的 `index.html` 来检测需要预构建的依赖项。如果指定了此选项，则会使用这些入口文件来检测依赖项。

### `optimizeDeps.exclude`

- **类型**: `string[]`
- **描述**: 在预构建中强制排除的依赖项。

### `optimizeDeps.include`

- **类型**: `string[]`
- **描述**: 默认情况下，不在 `node_modules` 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。
