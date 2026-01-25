# TypeScript 配置详解 (tsconfig.json)

`tsconfig.json` 文件用于指定 TypeScript 项目的根文件和编译选项。

## 1. 顶层配置 (Top Level)

| 字段          | 类型     | 含义       | 作用                                 |
| :------------ | :------- | :--------- | :----------------------------------- |
| files         | string[] | 文件列表   | 指定需要编译的单个文件列表。         |
| include       | string[] | 包含文件   | 指定需要包含在编译中的文件匹配模式。 |
| exclude       | string[] | 排除文件   | 指定编译时需要排除的文件匹配模式。   |
| extends       | string   | 继承配置   | 继承其他配置文件的配置。             |
| references    | object[] | 项目引用   | 指定引用的项目（用于复合项目）。     |
| compileOnSave | boolean  | 保存时编译 | IDE 选项，保存文件时是否自动编译。   |

## 2.编译器选项 (Compiler Options)

### (1). 基础选项 (Basic Options)

| 选项               | 类型     | 默认值   | 含义                                                   |
| :----------------- | :------- | :------- | :----------------------------------------------------- |
| target             | string   | ES3      | 指定 ECMAScript 目标版本 (如 `ES5`, `ES6`, `ESNext`)。 |
| module             | string   | CommonJS | 指定生成模块代码的系统 (如 `CommonJS`, `ESNext`)。     |
| lib                | string[] | -        | 指定要包含在编译中的库文件 (如 `DOM`, `ES2015`)。      |
| allowJs            | boolean  | false    | 允许编译 JavaScript 文件。                             |
| checkJs            | boolean  | false    | 报告 JavaScript 文件中的错误。                         |
| jsx                | string   | -        | 指定 JSX 代码生成模式 (如 `preserve`, `react`)。       |
| declaration        | boolean  | false    | 生成相应的 `.d.ts` 声明文件。                          |
| declarationMap     | boolean  | false    | 为声明文件生成 source map。                            |
| sourceMap          | boolean  | false    | 生成相应的 `.map` 文件。                               |
| outFile            | string   | -        | 将输出连接到单个文件。                                 |
| outDir             | string   | -        | 指定输出目录。                                         |
| rootDir            | string   | -        | 指定输入文件的根目录，用于控制输出目录结构。           |
| removeComments     | boolean  | false    | 删除编译输出中的所有注释。                             |
| noEmit             | boolean  | false    | 不生成输出文件。                                       |
| importHelpers      | boolean  | false    | 从 `tslib` 导入辅助工具函数。                          |
| downlevelIteration | boolean  | false    | 对迭代器进行降级处理 (针对旧目标环境)。                |
| isolatedModules    | boolean  | false    | 将每个文件作为单独的模块编译。                         |

### (2). 严格类型检查 (Strict Type-Checking Options)

| 选项                         | 类型    | 默认值 | 含义                                                   |
| :--------------------------- | :------ | :----- | :----------------------------------------------------- |
| strict                       | boolean | false  | 启用所有严格类型检查选项。                             |
| noImplicitAny                | boolean | false  | 对隐含 `any` 类型的表达式和声明报错。                  |
| strictNullChecks             | boolean | false  | 启用严格的 `null` 和 `undefined` 检查。                |
| strictFunctionTypes          | boolean | false  | 启用严格的函数类型检查。                               |
| strictBindCallApply          | boolean | false  | 启用严格的 `bind`, `call`, `apply` 方法参数检查。      |
| strictPropertyInitialization | boolean | false  | 确保类的属性在构造函数中被初始化。                     |
| noImplicitThis               | boolean | false  | 当 `this` 表达式值为 `any` 类型时报错。                |
| alwaysStrict                 | boolean | false  | 以严格模式 (`use strict`) 解析并为每个源文件生成代码。 |

### (3). 模块解析 (Module Resolution Options)

| 选项                         | 类型     | 默认值 | 含义                                         |
| :--------------------------- | :------- | :----- | :------------------------------------------- |
| moduleResolution             | string   | node      | 指定模块解析策略 (`node/nodenext`,`classic`, `bundler`)。     |
| baseUrl                      | string   | -      | 解析非相对模块名称的基础目录。               |
| paths                        | object   | -      | 路径映射列表，相对于 `baseUrl`。             |
| rootDirs                     | string[] | -      | 将多个目录视为一个虚拟根目录。               |
| typeRoots                    | string[] | -      | 包含类型声明文件的目录列表。                 |
| types                        | string[] | -      | 需要包含的类型声明文件名列表。               |
| allowSyntheticDefaultImports | boolean  | false  | 允许从没有默认导出的模块中默认导入。         |
| esModuleInterop              | boolean  | false  | 启用 CommonJS 和 ES Modules 之间的互操作性。 |
| preserveSymlinks             | boolean  | false  | 不解析符号链接的真实路径。                   |
| allowUmdGlobalAccess         | boolean  | false  | 允许在模块中访问 UMD 全局变量。              |

### (4). 附加检查 (Additional Checks)

| 选项                       | 类型    | 默认值 | 含义                                  |
| :------------------------- | :------ | :----- | :------------------------------------ |
| noUnusedLocals             | boolean | false  | 报告未使用的局部变量。                |
| noUnusedParameters         | boolean | false  | 报告未使用的函数参数。                |
| noImplicitReturns          | boolean | false  | 每个分支都必须有返回值。              |
| noFallthroughCasesInSwitch | boolean | false  | 报告 switch 语句的 fallthrough 错误。 |

### (5). 实验性选项 (Experimental Options)

| 选项                   | 类型    | 默认值 | 含义                            |
| :--------------------- | :------ | :----- | :------------------------------ |
| experimentalDecorators | boolean | false  | 启用对 ES7 装饰器的实验性支持。 |
| emitDecoratorMetadata  | boolean | false  | 为装饰器生成类型元数据。        |
