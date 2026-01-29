# TypeScript 增量编译详解

在大型 TypeScript 项目中，每次修改代码后重新编译整个项目可能会非常耗时。为了解决这个问题，TypeScript 引入了**增量编译 (Incremental Compilation)** 机制。

## 什么是增量编译？

增量编译是指在后续的编译过程中，只重新编译那些**发生变化的文件**以及**受这些变化影响的文件**，而不是重新编译整个项目。

TypeScript 编译器会将上一次编译的工程构建信息存储在一个文件中（通常是 `.tsbuildinfo`）。在下一次编译时，编译器会读取这个文件，分析哪些文件发生了改变，从而跳过未改变且未受影响的部分，显著缩短编译时间。

## 如何开启增量编译？

开启增量编译非常简单，只需要在 `tsconfig.json` 配置文件中添加 `incremental` 选项。

### 1. 基础配置

在 `compilerOptions` 中设置 `"incremental": true`：

```json
// tsconfig.json
{
  "compilerOptions": {
    // ... 其他配置
    "incremental": true
  }
}
```

### 2. 自定义构建信息文件路径 (可选)

默认情况下，TypeScript 会在输出目录下生成一个 `.tsbuildinfo` 文件。如果你想指定这个文件的名称或位置，可以使用 `tsBuildInfoFile` 选项：

```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true,
    // 将构建信息文件存放在 .cache 目录下
    "tsBuildInfoFile": "./.cache/.tsbuildinfo",
    "outDir": "./dist"
  }
}
```

> **注意**：`.tsbuildinfo` 文件包含了编译的缓存信息，通常建议将其添加到 `.gitignore` 中，避免提交到版本控制系统，除非你希望在 CI/CD 环境中利用缓存（但这通常需要额外的配置来保证缓存的一致性）。

## 增量编译的优点

1. **显著提升编译速度**：
    这是最核心的优势。对于拥有数千个文件的大型项目，全量编译可能需要几十秒甚至几分钟，而增量编译通常只需要几秒钟，极大地提高了开发效率和反馈速度。

2. **更快的类型检查**：
    在使用 `tsc --noEmit` 进行类型检查时，增量编译同样生效，可以快速反馈类型错误。

3. **支持 watch 模式**：
    虽然 `tsc --watch` 本身就是一种增量编译（在内存中），但开启 `incremental` 后，即使重启了 `tsc --watch` 进程（例如关闭终端后重新打开），依然可以利用磁盘上的 `.tsbuildinfo` 文件进行快速启动（热启动）。

4. **项目引用 (Project References) 的基础**：
    增量编译是 TypeScript 项目引用（Project References）特性的核心基础，使得 monorepo 结构下的多包构建更加高效。

## 原理简析

当你开启 `incremental: true` 并运行 `tsc` 后，TypeScript 会执行以下操作：

1. **生成 .tsbuildinfo**：编译器会分析项目结构、依赖关系以及每个文件的签名（哈希值），并将这些信息序列化存储到 `.tsbuildinfo` 文件中。
2. **二次编译**：当你再次运行 `tsc` 时，编译器会：
    - 加载 `.tsbuildinfo` 文件。
    - 比较当前文件的修改时间和哈希值。
    - 计算出哪些文件是“脏”的（已修改）。
    - 根据依赖图，找出依赖于“脏”文件的其他文件。
    - 只重新编译这些受影响的文件。

## 总结

对于任何非微型的 TypeScript 项目，都**强烈建议**开启 `incremental: true`。这是一个几乎没有副作用（除了多一个缓存文件）但能带来巨大性能收益的配置。
