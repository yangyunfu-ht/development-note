# 如何修改 npm 包的代码

在项目开发中，我们有时会遇到第三方库存在 Bug 或功能不满足需求的情况。直接修改 `node_modules` 下的代码虽然能解燃眉之急，但一旦重新安装依赖（`npm install`），修改就会丢失。

本文总结了 4 种常见的修改 npm 包代码的方案，从临时修复到长期维护都有覆盖。

## 1. 使用 patch-package (通用推荐)

`patch-package` 是最常用的补丁方案，适用于 npm 和 yarn。它会自动记录你在 `node_modules` 中做的修改，并在每次安装依赖后自动应用这些修改。

### 操作步骤

1.  **安装依赖**：

    ```bash
    npm i patch-package --save-dev
    ```

    _(如果是 yarn，还需要安装 postinstall-postinstall)_

2.  **配置 scripts**：
    在 `package.json` 中添加 `postinstall` 脚本：

    ```json
    "scripts": {
      "postinstall": "patch-package"
    }
    ```

3.  **修改源码**：
    直接在 `node_modules/some-package` 中修改你需要改动的代码。

4.  **生成补丁**：
    运行命令生成补丁文件：

    ```bash
    npx patch-package some-package
    ```

    此时项目根目录下会生成一个 `patches/some-package+1.0.0.patch` 文件。

5.  **提交代码**：
    将 `patches` 目录提交到 Git。之后任何人拉取代码并运行 `npm install` 后，`patch-package` 都会自动应用这些补丁。

## 2. 使用 pnpm patch (pnpm 用户推荐)

如果你的项目使用 **pnpm** (v7.4.0+)，它内置了打补丁的功能，不需要安装额外的包。

### 操作步骤

1.  **开始打补丁**：

    ```bash
    pnpm patch <package-name>
    ```

    执行后，控制台会提供一个临时目录的路径（user specific temporary directory），你需要在这个目录中修改代码。

2.  **修改代码**：
    进入上述提示的临时目录，进行代码修改。

3.  **应用补丁**：
    修改完成后，运行：

    ```bash
    pnpm patch-commit <temporary-directory-path>
    ```

4.  **结果**：
    pnpm 会在 `package.json` 的 `pnpm.patchedDependencies` 字段中记录补丁信息，并在根目录下生成 patch 文件。下次 `pnpm install` 时会自动应用。

## 3. 使用 Webpack/Vite Alias (替身法)

如果你只需要修改某个包中的**个别文件**，可以使用构建工具的 `alias` 功能，将对该文件的引用重定向到你项目中的本地文件。

### 操作步骤

1.  **复制文件**：
    将 `node_modules/some-package/lib/foo.js` 复制到你的项目目录，例如 `src/patches/foo.js`，并进行修改。

2.  **配置 Alias**：

    **Vite 配置 (`vite.config.ts`)**:

    ```typescript
    import { defineConfig } from "vite";
    import path from "path";

    export default defineConfig({
      resolve: {
        alias: {
          // 精确匹配到文件
          "some-package/lib/foo.js": path.resolve(
            __dirname,
            "src/patches/foo.js",
          ),
        },
      },
    });
    ```

    **Webpack 配置 (`vue.config.js` / `webpack.config.js`)**:

    ```javascript
    module.exports = {
      configureWebpack: {
        resolve: {
          alias: {
            "some-package/lib/foo.js": path.resolve(
              __dirname,
              "src/patches/foo.js",
            ),
          },
        },
      },
    };
    ```

**缺点**：只适用于模块化引用清晰的场景，如果包内部有复杂的相对路径引用，可能会失效。

## 4. Fork 仓库 (彻底修改)

如果修改量很大，或者你希望将修改贡献回开源社区，建议 Fork 仓库。

### 操作步骤

1.  **Fork 项目**：在 GitHub 上 Fork 该第三方包的仓库。
2.  **修改代码**：在你的仓库中修改代码并提交。
3.  **安装依赖**：
    - **方案 A (推荐)**：如果修改已合并到主仓库，直接等待发版。
    - **方案 B**：如果没有合并，可以直接安装你的 Git 仓库地址：
      ```bash
      npm install github:your-username/package-name#branch-name
      ```
    - **方案 C**：发布属于你自己的 npm 包（例如 `@your-scope/package-name`）。

## 总结

| 方案              | 适用场景              | 优点                                     | 缺点                                             |
| :---------------- | :-------------------- | :--------------------------------------- | :----------------------------------------------- |
| **patch-package** | 通用，小规模 Bug 修复 | 简单，无需配置构建工具，支持所有包管理器 | 需要安装额外依赖                                 |
| **pnpm patch**    | pnpm 项目             | 原生支持，零额外依赖，流程规范           | 仅限 pnpm 用户                                   |
| **Alias**         | 仅修改单个文件        | 不破坏 node_modules，修改直观            | 对复杂依赖关系支持不佳                           |
| **Fork**          | 大规模重构或新增特性  | 彻底，版本控制完整                       | 维护成本高，不仅要维护项目代码还要维护 Fork 的库 |

**建议**：

- 如果是 **pnpm** 项目，首选 **pnpm patch**。
- 如果是 **npm/yarn** 项目，首选 **patch-package**。
