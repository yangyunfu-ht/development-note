# Prettier 代码格式化

::: tip 简介
Prettier 是一个“有主见”的代码格式化工具（Opinionated Code Formatter）。它通过解析代码并使用自己的规则重新打印它（并考虑最大行长），来强制执行一致的代码风格，从而消除代码风格争论。
:::

## 1. 核心作用

- **统一风格**：无论团队成员使用什么编辑器，Prettier 都能确保代码风格一致。
- **节省时间**：开发者无需在代码审查（Code Review）中讨论分号、缩进等格式问题。
- **支持广泛**：支持 JavaScript, TypeScript, CSS, SCSS, HTML, Vue, Angular, JSON, Markdown, YAML 等多种语言。

## 2. 安装与使用

### 2.1 安装

推荐在项目中作为开发依赖安装：

```bash
pnpm add -D prettier
```

### 2.2 基础使用

- **格式化所有文件**：

  ```bash
  npx prettier --write .
  ```

- **检查文件格式**：
  ```bash
  npx prettier --check .
  ```

## 3. 配置文件

Prettier 支持多种配置方式，推荐使用 `.prettierrc` 文件（JSON, YAML, JS 均可）或 `prettier.config.js`。

### 3.1 创建配置文件

在项目根目录下创建 `.prettierrc`：

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### 3.2 忽略文件 (.prettierignore)

创建 `.prettierignore` 文件，指定不需要格式化的文件：

```text
# 忽略构建产物
dist
build
coverage

# 忽略依赖
node_modules

# 忽略特定文件
package-lock.json
pnpm-lock.yaml
```

## 4. 常用配置项详解

以下是 Prettier 中最常用的配置项及其可选值说明。

### printWidth

- **描述**：指定一行代码的最大长度，超过该长度将换行。
- **默认值**：`80`
- **说明**：通常设置为 80、100 或 120。

```json
"printWidth": 100
```

### tabWidth

- **描述**：指定一个 tab 等于多少个空格。
- **默认值**：`2`
- **说明**：通常为 2 或 4。

```json
"tabWidth": 2
```

### useTabs

- **描述**：是否使用 tab 进行缩进。
- **默认值**：`false`
- **说明**：`true` 表示使用 tab，`false` 表示使用空格。

```json
"useTabs": false
```

### semi

- **描述**：是否在语句末尾添加分号。
- **默认值**：`true`
- **说明**：`true` 表示添加，`false` 表示不添加（除非可能导致歧义）。

```json
"semi": false
```

### singleQuote

- **描述**：是否使用单引号替代双引号。
- **默认值**：`false`
- **说明**：`true` 表示使用单引号。

```json
"singleQuote": true
```

### quoteProps

- **描述**：对象属性名是否使用引号。
- **默认值**：`"as-needed"`
- **可选值**：
  - `"as-needed"`: 仅在必要时加引号。
  - `"consistent"`: 如果有一个属性需要引号，则所有属性都加引号。
  - `"preserve"`: 保留用户输入的引号使用方式。

```json
"quoteProps": "as-needed"
```

### jsxSingleQuote

- **描述**：在 JSX 中是否使用单引号。
- **默认值**：`false`

```json
"jsxSingleQuote": false
```

### trailingComma

- **描述**：多行时是否打印尾随逗号。
- **默认值**：`"es5"` (v2.0 之前默认 "none")
- **可选值**：
  - `"es5"`: 在 ES5 支持的地方（对象、数组）添加逗号。TypeScript 类型参数中不会添加。
  - `"none"`: 不添加尾随逗号。
  - `"all"`: 尽可能添加尾随逗号（包括函数参数）。

```json
"trailingComma": "es5"
```

### bracketSpacing

- **描述**：对象字面量的大括号间是否有空格。
- **默认值**：`true`
- **示例**：
  - `true`: `{ foo: bar }`
  - `false`: `{foo: bar}`

```json
"bracketSpacing": true
```

### bracketSameLine

- **描述**：HTML/JSX 标签的 `>` 是否与属性在同一行。
- **默认值**：`false`
- **说明**：(原 `jsxBracketSameLine`)

```json
"bracketSameLine": false
```

### arrowParens

- **描述**：箭头函数参数只有一个时是否省略括号。
- **默认值**：`"always"`
- **可选值**：
  - `"always"`: 总是带括号 `(x) => x`
  - `"avoid"`: 省略括号 `x => x`

```json
"arrowParens": "always"
```

### endOfLine

- **描述**：指定行尾换行符。
- **默认值**：`"lf"`
- **可选值**：
  - `"lf"`: Linux/macOS 风格 (`\n`)
  - `"crlf"`: Windows 风格 (`\r\n`)
  - `"cr"`: 仅回车 (`\r`)
  - `"auto"`: 保持现有的行尾风格

```json
"endOfLine": "lf"
```

## 5. 完整配置示例

一个通用的前端项目配置：

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "htmlWhitespaceSensitivity": "ignore",
  "vueIndentScriptAndStyle": false,
  "endOfLine": "lf"
}
```

## 6. 与 ESLint 配合

通常项目中会同时使用 ESLint 和 Prettier。为了避免规则冲突，建议安装 `eslint-config-prettier`：

```bash
pnpm add -D eslint-config-prettier
```

然后在 `.eslintrc` 中扩展配置：

```json
{
  "extends": ["some-other-config-you-use", "prettier"]
}
```

::: tip
`eslint-config-prettier` 会关闭所有与 Prettier 冲突的 ESLint 格式化规则，让 Prettier 专心负责代码风格，ESLint 负责代码质量。
:::
