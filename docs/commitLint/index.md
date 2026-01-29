# Git 提交规范体系

::: tip 简介
在一个多人协作的项目中，规范的 Git 提交信息（Commit Message）至关重要。它可以帮助团队快速定位问题、生成变更日志（Changelog）以及自动化版本管理。本节将介绍如何构建一套完整的 Git 提交规范体系。
:::

## 1. 核心工具概览

- **[Commitlint](https://commitlint.js.org/)**: 用于检查提交信息是否符合规范（如 Angular 规范）。
- **[Husky](https://typicode.github.io/husky/)**: Git Hooks 工具，在 `git commit` 或 `git push` 时触发脚本。
- **[Simple-git-hooks](https://github.com/toplenboren/simple-git-hooks)**: 一个更轻量级的 Husky 替代品，配置更简单。
- **[Lint-staged](https://github.com/okonet/lint-staged)**: 仅对暂存区（staged）的文件运行检查，提高 lint 速度。
- **[cz-git](https://cz-git.qbb.sh/zh/)**: 一款工程性更强、轻量级、高度自定义的 Commitizen 适配器，提供友好的交互式提交界面。

## 2. Commitlint (校验规则)

Commitlint 负责在提交时校验 Commit Message 格式。最常用的是 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 规范。

### 安装（Commitlint）

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

### 配置

在根目录创建 `commitlint.config.js`：

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  // 自定义规则
  rules: {
    // type 枚举
    "type-enum": [
      2,
      "always",
      [
        "feat", // 新功能
        "fix", // 修复 bug
        "docs", // 文档变更
        "style", // 代码格式（不影响功能，例如空格、分号等格式修正）
        "refactor", // 代码重构（不包括 bug 修复、功能新增）
        "perf", // 性能优化
        "test", // 添加疏漏测试或已有测试改动
        "build", // 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）
        "ci", // 修改 CI 配置、脚本
        "chore", // 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
        "revert", // 回滚 commit
      ],
    ],
    // subject 大小写不做校验
    "subject-case": [0],
  },
};
```

## 3. Git Hooks (触发机制)

我们需要在 `git commit` 时自动触发校验。这里介绍两种方案：**Husky** (主流) 和 **Simple-git-hooks** (轻量)。

### 方案 A: 使用 Husky

1. **安装**

   ```bash
   pnpm add -D husky
   ```

2. **初始化**

   ```bash
   npx husky init
   ```

   这会在 `.husky/` 目录下创建 `pre-commit` 等文件，并修改 `package.json` 的 `prepare` 脚本。

3. **添加 Commit Msg Hook**
   创建 `.husky/commit-msg` 文件：

   ```bash
   npx --no -- commitlint --edit "$1"
   ```

### 方案 B: 使用 Simple-git-hooks (推荐轻量级)

如果你觉得 Husky 配置繁琐，可以使用 simple-git-hooks。

1. **安装**

   ```bash
   pnpm add -D simple-git-hooks
   ```

2. **配置**
   在 `package.json` 中添加：

   ```json
   {
     "simple-git-hooks": {
       "pre-commit": "npx lint-staged",
       "commit-msg": "npx --no -- commitlint --edit $1"
     }
   }
   ```

3. **应用 Hooks**

   ```bash
   # 手动应用
   npx simple-git-hooks

   # 建议在 prepare 脚本中运行，确保依赖安装后自动应用
   npm pkg set scripts.prepare="simple-git-hooks"
   ```

## 4. Lint-staged (增量检查)

为了避免每次提交都检查所有文件，我们使用 Lint-staged 只检查暂存区的文件。

### (1). 安装

```bash
pnpm add -D lint-staged
```

### (2). 配置

在 `package.json` 中添加配置：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,less,md,html,json}": ["prettier --write"]
  }
}
```

配合 Husky 或 Simple-git-hooks 的 `pre-commit` 钩子使用：

```bash
# .husky/pre-commit 或 simple-git-hooks 配置中
npx lint-staged
```

## 5. Commitizen & cz-git (交互式提交)

为了让开发者更轻松地写出规范的 Commit Message，我们可以使用交互式工具。`cz-git` 是目前 Vue、Vite 等项目都在使用的适配器。

### 1. 安装

```bash
pnpm add -D commitizen cz-git
```

### 2. 配置

修改 `package.json`，指定适配器：

```json
{
  "scripts": {
    "commit": "git-cz"
  },
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

修改 `commitlint.config.js` 以支持 cz-git 的自定义选项（可选）：

```javascript
/** @type {import('cz-git').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  prompt: {
    alias: { fd: "docs: fix typos" },
    messages: {
      type: "选择你要提交的类型 :",
      scope: "选择一个提交范围（可选）:",
      customScope: "请输入自定义的提交范围 :",
      subject: "填写简短精炼的变更描述 :\n",
      body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      footerPrefixsSelect: "选择关联issue前缀（可选）:",
      customFooterPrefix: "输入自定义issue前缀 :",
      footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      confirmCommit: "是否提交或修改commit ?",
    },
    types: [
      { value: "feat", name: "feat:     新增功能" },
      { value: "fix", name: "fix:      修复缺陷" },
      { value: "docs", name: "docs:     文档变更" },
      { value: "style", name: "style:    代码格式" },
      { value: "refactor", name: "refactor: 代码重构" },
      { value: "perf", name: "perf:     性能优化" },
      { value: "test", name: "test:     测试用例" },
      { value: "build", name: "build:    构建流程" },
      { value: "ci", name: "ci:       集成流程" },
      { value: "chore", name: "chore:    回退/辅助" },
      { value: "revert", name: "revert:   回退 commit" },
    ],
  },
};
```

### 使用

现在，你可以使用 `pnpm commit` 代替 `git commit` 来唤起交互式界面。

## 6. 完整工作流总结

1. **开发代码** -> `git add .`
2. **提交代码** -> `pnpm commit` (触发 Commitizen + cz-git)
3. **输入信息** -> 交互式选择 type, scope, subject 等
4. **生成 Commit** -> 触发 `commit-msg` hook (Commitlint)
   - 校验通过 -> 继续
   - 校验失败 -> 终止提交，报错提示
5. **Pre-commit** -> 触发 `pre-commit` hook (Lint-staged)
   - 对暂存文件执行 ESLint/Prettier
   - 修复格式并重新 add
6. **完成提交** -> 生成符合规范的 Commit 记录
