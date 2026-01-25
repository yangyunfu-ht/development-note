# HTML5 新特性详解

HTML5 是 HTML 标准的最新演进版本，它不仅引入了新的语义化标签，还增强了表单功能，引入了多媒体支持和绘图能力，以及一系列新的 API。

## 1. 语义化标签 (Semantic Tags)

HTML5 引入了一系列新的语义化标签，使得文档结构更加清晰，有利于 SEO 和无障碍访问。

### 1.1 常用语义化标签

| 标签           | 描述                                                  |
| :------------- | :---------------------------------------------------- |
| `<header>`     | 定义文档或节的头部（通常包含 Logo、导航、搜索框等）。 |
| `<nav>`        | 定义导航链接的部分。                                  |
| `<section>`    | 定义文档中的节（section），通常包含标题。             |
| `<article>`    | 定义独立的内容（如博客文章、新闻、评论）。            |
| `<aside>`      | 定义侧边栏内容（通常与周围内容相关，但可独立存在）。  |
| `<footer>`     | 定义文档或节的页脚（通常包含版权、联系信息等）。      |
| `<main>`       | 定义文档的主体内容（文档中唯一）。                    |
| `<figure>`     | 规定独立的流内容（图像、图表、照片、代码等）。        |
| `<figcaption>` | 定义 `<figure>` 元素的标题。                          |

### 1.2 示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>HTML5 语义化布局示例</title>
  </head>
  <body>
    <header>
      <h1>网站标题</h1>
      <nav>
        <ul>
          <li><a href="#">首页</a></li>
          <li><a href="#">关于我们</a></li>
        </ul>
      </nav>
    </header>

    <div class="container">
      <main>
        <article>
          <h2>文章标题</h2>
          <p>这是一篇关于 HTML5 的文章...</p>
          <section>
            <h3>第一章</h3>
            <p>章节内容...</p>
          </section>
        </article>
      </main>

      <aside>
        <h3>侧边栏</h3>
        <p>这里是广告或相关链接。</p>
      </aside>
    </div>

    <footer>
      <p>版权所有 &copy; 2026</p>
    </footer>
  </body>
</html>
```

## 2. 表单增强 (Form Enhancements)

HTML5 极大地增强了表单的功能，减少了对 JavaScript 的依赖。

### 2.1 新的 Input 类型

| 类型     | 描述             | 示例                                     |
| :------- | :--------------- | :--------------------------------------- |
| `email`  | 验证电子邮件格式 | `<input type="email">`                   |
| `url`    | 验证 URL 格式    | `<input type="url">`                     |
| `number` | 仅允许数字输入   | `<input type="number" min="1" max="10">` |
| `range`  | 滑块控件         | `<input type="range" min="0" max="100">` |
| `date`   | 日期选择器       | `<input type="date">`                    |
| `color`  | 颜色选择器       | `<input type="color">`                   |
| `search` | 搜索框           | `<input type="search">`                  |
| `tel`    | 电话号码         | `<input type="tel">`                     |

### 2.2 新的表单属性

- `placeholder`: 输入提示信息。
- `required`: 必填字段。
- `autofocus`: 页面加载时自动获取焦点。
- `pattern`: 使用正则表达式验证输入。
- `autocomplete`: 是否启用自动完成 (`on`/`off`)。
- `multiple`: 允许选择多个文件或输入多个值。

### 2.3 示例代码

```html
<form action="/submit">
  <label for="email">邮箱：</label>
  <input
    type="email"
    id="email"
    name="email"
    placeholder="请输入邮箱"
    required
  />

  <label for="age">年龄：</label>
  <input type="number" id="age" name="age" min="18" max="100" />

  <label for="birthday">生日：</label>
  <input type="date" id="birthday" name="birthday" />

  <button type="submit">提交</button>
</form>
```

## 3. 多媒体支持 (Multimedia)

HTML5 原生支持音频和视频播放，不再需要 Flash 插件。

### 3.1 Audio (音频)

```html
<audio controls>
  <source src="music.mp3" type="audio/mpeg" />
  <source src="music.ogg" type="audio/ogg" />
  您的浏览器不支持 audio 元素。
</audio>
```

### 3.2 Video (视频)

```html
<video width="320" height="240" controls poster="poster.jpg">
  <source src="movie.mp4" type="video/mp4" />
  <source src="movie.ogg" type="video/ogg" />
  您的浏览器不支持 video 元素。
</video>
```

## 4. 绘图能力 (Graphics)

### 4.1 Canvas

Canvas 提供了一个通过 JavaScript 绘制 2D 图形的画布。

```html
<canvas
  id="myCanvas"
  width="200"
  height="100"
  style="border:1px solid #000000;"
></canvas>

<script>
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0, 0, 150, 75);
</script>
```

### 4.2 SVG

SVG 是一种基于 XML 的矢量图形格式，支持交互和动画。

```html
<svg width="100" height="100">
  <circle
    cx="50"
    cy="50"
    r="40"
    stroke="green"
    stroke-width="4"
    fill="yellow"
  />
</svg>
```

## 5. 其他重要特性

### 5.1 自定义数据属性 (data-\*)

允许在 HTML 元素上存储额外的信息，无需使用非标准属性。

```html
<div id="user" data-id="123" data-role="admin">用户信息</div>

<script>
  var user = document.getElementById("user");
  console.log(user.dataset.id); // "123"
  console.log(user.dataset.role); // "admin"
</script>
```

### 5.2 拖放 API (Drag and Drop)

```html
<div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
<img
  id="drag1"
  src="img_logo.gif"
  draggable="true"
  ondragstart="drag(event)"
  width="336"
  height="69"
/>

<script>
  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
</script>
```

### 5.3 Web Storage

提供了比 Cookie 更大、更安全的本地存储方案。

- `localStorage`: 永久存储，除非手动删除。
- `sessionStorage`: 会话存储，关闭浏览器标签页后失效。

```javascript
// 存储
localStorage.setItem("username", "John");
// 读取
console.log(localStorage.getItem("username"));
```

### 5.4 新的 API

- **Geolocation API**: 获取用户地理位置。
- **Web Workers**: 后台运行 JavaScript，不阻塞 UI 线程。
- **WebSocket**: 全双工通信协议。
