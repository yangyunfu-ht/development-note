# Monorepo：单体仓库详解

在现代前端工程化中，**代码仓库管理策略**是一个核心话题。目前主流的两种策略是 **Monorepo (单体仓库)** 和 **Polyrepo (多体仓库)**。

## 1. 什么是 Monorepo？

**Monorepo** (Monolithic Repository) 是一种项目管理策略，指**将多个项目（Project）的代码存储在同一个 Git 仓库中**。

与之相对的是 **Polyrepo** (Multirepo)，即**一个项目对应一个仓库**。

### 1.1 典型结构

```text
root/
├── packages/
│   ├── ui-lib/       (UI 组件库，被 web-app 引用)
│   ├── utils/        (工具函数库，被多个项目引用)
│   ├── web-app-1/    (业务应用 1)
│   └── web-app-2/    (业务应用 2)
├── package.json      (根配置)
└── pnpm-workspace.yaml
```

## 2. 解决了什么问题？

Monorepo 的出现主要是为了解决 Polyrepo 在多项目协作时遇到的痛点：

1. **代码复用困难 (Code Sharing Friction)**
    - **Polyrepo**: 如果 `web-app-1` 想复用 `ui-lib` 的代码，必须先将 `ui-lib` 发布到 NPM，然后在 `web-app-1` 中升级依赖版本。流程繁琐（修改 -> 发包 -> 更新依赖），调试困难。
    - **Monorepo**: 直接在本地引用源码，修改 `ui-lib` 后，`web-app-1` 能够立即感知并生效，无需发包。

2. **依赖版本不一致 (Dependency Hell)**
    - **Polyrepo**: `Project A` 使用 React v16，`Project B` 使用 React v17。随着时间推移，维护多个项目的依赖版本一致性变得极难，导致重复打包、版本冲突等问题。
    - **Monorepo**: 可以在根目录统一管理 `devDependencies`（如 TypeScript, ESLint, Jest），确保所有子项目使用相同的工具链和版本。

3. **工程配置割裂**
    - **Polyrepo**: 每个项目都有自己的 `tsconfig.json`, `.eslintrc`, CI 脚本。当需要升级构建工具或规范时，需要在 N 个仓库中逐一修改。
    - **Monorepo**: 共享配置，一次修改，所有项目生效。

4. **原子性提交缺失 (Lack of Atomic Commits)**
    - **Polyrepo**: 这是一个经典场景——你修改了 `API` 库的接口，同时需要修改使用该接口的 `Frontend` 和 `Backend` 项目。在 Polyrepo 中，你无法在一个 Commit 中完成这三个修改，这可能导致 CI 挂掉或版本不兼容。
    - **Monorepo**: 你可以在一个 Commit 中同时修改库文件和调用该库的业务代码，保证了变更的原子性。

## 3. 核心优势与劣势

### 3.1 优势 (Pros)

- **可见性 (Visibility)**: 所有人都能看到整个组织的代码，便于跨团队协作和代码复用。
- **一致性 (Consistency)**: 统一的构建流程、代码规范和依赖版本。
- **开发效率**: 模块化开发更顺畅，重构代码更容易（可以利用 IDE 的重构功能跨包修改）。

### 3.2 劣势 (Cons)

- **性能问题**: 随着项目规模扩大，`git clone`、`git status` 和 `npm install` 的速度会变慢。需要配合专业的构建工具（如 Turborepo, Nx）来解决。
- **权限控制 (Access Control)**: Git 原生不支持目录级别的权限控制。通常 Monorepo 意味着开发者拥有所有代码的读写权限（虽然可以通过 Code Review 限制合并）。
- **构建复杂性**: 需要配置复杂的 CI/CD 流程，确保只构建和测试发生变更的项目（增量构建），否则 CI 时间会无法忍受。

## 4. 与 Polyrepo (多体仓库) 的对比

| 特性         | Monorepo (单体仓库)                      | Polyrepo (多体仓库)                             |
| :----------- | :--------------------------------------- | :---------------------------------------------- |
| **代码共享** | **极佳**。源码引用，实时生效。           | **困难**。需发包到 NPM，链路长。                |
| **依赖管理** | **统一**。易于统一技术栈版本。           | **分散**。容易导致版本碎片化。                  |
| **调试体验** | **简单**。像调试本地代码一样调试依赖库。 | **繁琐**。需 `npm link`，经常遇到符号链接问题。 |
| **Git 管理** | **大仓库**。提交记录混合，体积大。       | **小仓库**。职责单一，体积小。                  |
| **CI/CD**    | **复杂**。需实现增量检测 (Affected)。    | **简单**。每个仓库独立配置。                    |

## 5. 搭建方案概览

目前主流的 Monorepo 搭建工具和生态如下：

- **pnpm workspace**: 基础方案，最轻量、最高效的包管理方案。
- **Turborepo**: 进阶方案，解决 Monorepo 的**构建任务调度**和**缓存**问题。
- **Nx**: 全能方案，功能强大但学习曲线较陡，适合超大型企业级 Monorepo。

## 6. 最佳实践推荐

对于大多数中小型团队或开源项目，推荐组合：

> **pnpm workspace (包管理) + Turborepo (构建加速) + Changesets (发包管理)**

1. 使用 **pnpm** 处理依赖安装和 workspace 链接。
2. 使用 **Turborepo** 配置 `build`, `test`, `lint` 的任务依赖和缓存。
3. 使用 **Changesets** 管理版本号和 Changelog 生成。

## 7. 实战指南：搭建 pnpm + Turborepo + Changesets

以下是从零搭建一个生产级 Monorepo 的完整步骤。

### 7.1 初始化项目

首先，创建项目目录并进行初始化：

```bash
mkdir my-monorepo && cd my-monorepo
pnpm init
git init
```

### 7.2 配置 pnpm Workspace

在根目录创建 `pnpm-workspace.yaml` 文件，定义工作区：

```yaml
# pnpm-workspace.yaml
packages:
  - "packages/*" # 通用组件库、工具库
  - "apps/*" # 业务应用
```

### 7.3 创建目录结构

创建基础目录：

```bash
mkdir apps packages
```

### 7.4 接入 Turborepo

安装 `turbo` 并创建配置文件：

```bash
pnpm add turbo -D -w
```

在根目录创建 `turbo.json`：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"], // 依赖上游的 build 任务（拓扑排序）
      "outputs": ["dist/**", ".next/**"] // 缓存输出目录
    },
    "lint": {
      "outputs": [] // 无输出文件，仅检查状态
    },
    "dev": {
      "cache": false, // dev 任务不缓存
      "persistent": true // 标记为持久运行进程
    }
  }
}
```

### 7.5 配置根目录 package.json

在 `package.json` 中添加便捷脚本：

```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  }
}
```

### 7.6 接入 Changesets (版本管理)

Changesets 是管理 Monorepo 版本和 Changelog 的利器。

1. **安装与初始化**:

    ```bash
    pnpm add @changesets/cli -D -w
    pnpm changeset init
    ```

2. **日常开发流程**:
    当你修改了某个包的代码后，运行：

    ```bash
    pnpm changeset
    ```

    交互式选择变更的包，填写变更类型（patch/minor/major）和说明。这会生成一个临时的 markdown 文件。

3. **发包流程**:
    在 CI/CD 或发包时运行：

    ```bash
    # 1. 消耗所有临时 changeset 文件，更新版本号并生成 CHANGELOG.md
    pnpm changeset version

    # 2. 提交代码并打 tag

    # 3. 发布到 npm
    pnpm publish -r
    ```

### 7.7 演示：创建一个 UI 库并引用它

#### 步骤 1: 创建 UI 库 (`packages/ui`)

```bash
mkdir -p packages/ui
cd packages/ui
pnpm init
```

修改 `packages/ui/package.json`:

```json
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "main": "index.js",
  "scripts": {
    "build": "tsc"
  }
}
```

创建一个简单的 `index.js`:

```js
export const Button = () => console.log("I am a Button");
```

#### 步骤 2: 创建 Web 应用 (`apps/web`)

```bash
cd ../../
mkdir -p apps/web
cd apps/web
pnpm init
```

修改 `apps/web/package.json` 并添加依赖：

```json
{
  "name": "web-app",
  "dependencies": {
    "@repo/ui": "workspace:*" // 使用 workspace 协议引用本地包
  },
  "scripts": {
    "build": "echo 'building web'",
    "dev": "node index.js"
  }
}
```

#### 步骤 3: 安装依赖并运行

回到根目录：

```bash
# 自动链接本地包
pnpm install

# 使用 Turbo 并行构建所有项目
pnpm build
```

此时，Turborepo 会根据依赖关系，先构建 `@repo/ui`，再构建 `web-app`。且第二次运行 `pnpm build` 时，如果源码未变，会直接命中缓存（Full Turbo），耗时为几毫秒。
