# npm run dev 和 npm run build 到底做了什么？(Vite vs Webpack)

当我们执行 `npm run dev` 或 `npm run build` 时，实际上是运行了 `package.json` 中 `scripts` 字段定义的命令。不同的构建工具（Vite 和 Webpack）在这两个阶段的行为差异巨大。

## 1. Vite 项目

Vite 的核心理念是 **利用浏览器原生的 ES Modules (ESM)** 能力，实现极速的开发服务器启动。

### npm run dev (开发环境)

Vite 在开发环境下**不需要打包 (Bundleless)**。

1. **启动 Server**: Vite 立即启动一个本地服务器（基于 Koa/Connect）。
2. **不打包**: 它不会把所有文件打包成一个 bundle.js。
3. **按需编译**:
    - 当浏览器请求 `index.html` 时，Server 返回 HTML。
    - 浏览器解析 HTML 发现 `<script type="module" src="/src/main.ts">`，于是向 Server 发送 `/src/main.ts` 的 HTTP 请求。
    - **拦截与转换**: Vite Server 拦截请求，使用 **esbuild**（Go 编写，速度极快）将 TypeScript/Vue/JSX 实时编译成浏览器能识别的 JavaScript (ESM 格式)。
    - **返回内容**: Server 将编译后的 JS 代码返回给浏览器。
4. **HMR (热更新)**: 修改文件时，Vite 只需要重新编译该文件，并通过 WebSocket 通知浏览器重新请求该模块，更新速度与项目复杂度几乎无关。

**总结**：`npm run dev` = 启动静态服务器 + 拦截请求 + 使用 esbuild 实时单文件转换。

### npm run build (生产环境)

Vite 在生产构建时**会进行打包**。

1. **使用 Rollup**: 虽然开发环境用 esbuild，但生产环境 Vite 默认调用 **Rollup** 进行打包。
    - _为什么不用 esbuild 打包？_ 因为 esbuild 目前在代码分割 (Code Splitting) 和 CSS 处理上还不如 Rollup 成熟。
2. **全量构建**: 读取入口文件，分析依赖图。
3. **优化**: 执行 Tree-shaking（摇树优化，去除无用代码）、代码压缩、CSS 提取等。
4. **输出**: 生成 `dist` 目录，包含经过优化的 HTML、CSS、JS 静态资源。

---

## 2. Webpack 项目

Webpack 是一个 **Module Bundler (模块打包器)**，它的核心理念是将所有资源都视为模块，并打包在一起。

### npm run dev (开发环境)

Webpack 在开发环境下**需要先打包**，然后才能启动服务器。

1. **读取配置**: 读取 `webpack.config.js`。
2. **构建依赖图**: 从 Entry 入口出发，递归解析所有依赖模块（Loader 转译、Plugin 处理）。
3. **内存打包**: 将所有模块打包成一个或多个 bundle 文件（通常存储在内存中，不写入磁盘）。
4. **启动 Server**: 启动 `webpack-dev-server` (Express 编写)，托管内存中的 bundle 文件。
5. **浏览器请求**: 浏览器请求 `bundle.js`，服务器直接返回内存中的打包结果。
6. **HMR**: 修改文件时，Webpack 需要重新编译修改的模块及其依赖链，并生成补丁 (Manifest)，通过 WebSocket 推送给浏览器。随着项目变大，重新编译时间会变长。

**总结**：`npm run dev` = 分析依赖 + 全量/增量打包 + 启动服务器托管 bundle。

### npm run build (生产环境)

Webpack 的生产构建流程与开发环境类似，但增加了更多优化步骤。

1. **全量打包**: 同样从入口递归构建依赖图。
2. **深度优化**:
    - **Minification**: 使用 Terser 压缩 JS。
    - **Tree Shaking**: 标记并去除未引用的代码。
    - **Code Splitting**: 将代码分割成多个 Chunk（如 vendor, common）。
    - **Scope Hoisting**: 作用域提升，减小包体积。
3. **输出磁盘**: 将最终的静态资源写入 `dist` 目录。

---

## 3. 核心对比总结

| 阶段              | Vite                                                         | Webpack                                                          |
| :---------------- | :----------------------------------------------------------- | :--------------------------------------------------------------- |
| **npm run dev**   | **秒开**。不打包，浏览器直接加载 ESM。服务器按需编译单文件。 | **较慢**。先全量打包（或增量），再启动服务器。项目越大启动越慢。 |
| **npm run build** | 使用 **Rollup** 打包。生成标准化、高度优化的静态资源。       | 使用 **Webpack** 自身打包。配置极其灵活，生态插件丰富。          |
| **底层工具**      | 开发用 **esbuild** (Go, 快)，生产用 **Rollup** (JS)。        | 全程使用 **Webpack** (JS, 较慢，但 Webpack 5 有物理缓存优化)。   |
| **原理核心**      | **Bundleless** (无包构建)                                    | **Bundle** (打包构建)                                            |

### 形象比喻

- **Webpack (dev)**: 像是**吃桌餐**。厨师（Webpack）必须把所有菜（模块）都炒好端上桌（打包完成），客人们（浏览器）才能开始动筷子。如果想加个菜，厨师得重新调整整桌菜的摆盘。
- **Vite (dev)**: 像是**吃自助/旋转寿司**。传送带（Server）先转起来，客人（浏览器）想吃什么（请求模块），厨师（esbuild）就现切什么（实时编译）。不用等所有菜都做好就能开始吃。
