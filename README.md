## cssinjs 设计与开发

cssinjs 这个库的定位是，用于基础库的样式开发。

### 背景

基础库用 cssinjs 好在哪里？

1. 避免不同版本样式互相覆盖，基础库需要 className 带上 hash

因为一个项目使用基础库（比如 antd 组件库）时，yarn.lock 可能存在多个版本基础库，比如 v2 和 v3，为了防止不同版本的 className 互相覆盖，就需要 className 带上 hash。

> 题外话，antd 一直都不带 hash，所以之前存在过一个问题：antd 在 3.9.0 之后，使用了 SVG 图标替换了原先的 font 图标，但业务的一个页面中，存在 v3.9 以后和 v3.9 以前（依赖的依赖）的 antd，造成了样式互相覆盖，用到箭头的组件，多出了一个箭头

2. 在第 1 点的基础上，要支持样式变量，cssinjs 方案比 scss + cssmodules 更佳

如果基础库不需要支持样式变量，那么在发布前的打包环节，直接打包出 className 带 hash 的 css 即可，cssinjs 方案和 scss + cssmodules 相当不大。

但如果要支持样式变量，打包出来的必须是支持变量的形式，由于 css 变量的兼容性还很不好，业界一般在 cssinjs 方案和 scss + cssmodules 之间做选择。

相比而言，scss + cssmodules 存在两个劣势：

- 如果基础库（如 antd 组件库）打包出来是 scss + cssmodules，使用这个基础库的项目，就必须配置 scss loader 和处理 css modules 的 css-loader，配置过程比较复杂。
- 如果基础库只需要自定义主题色，那使用 scss 的 modifyVars 也可以满足。但如果还需要支持 在页面中切换样式变量（比如从白天模式切换到暗黑模式），用 cssinjs 显然是更好的（scss + cssmodule 很难支持在运行时修改变量，要支持也需要动态修改 stylesheet - 类似大多数 cssinjs 库的实现，过程比较复杂，对于基础库的开发者来说，这个工作就很麻烦了）

### 使用示例

本库的 api 灵感来自，React conf2019 中 [Facebook 自研的 cssinjs 库](https://conf.reactjs.org/event.html?frank)（从开放的资料来看，是完全对齐）。

```jsx
import { stylex } from "cssinjs";

const styles = stylex.create({
  outerWrapper: {
    color: "red",
    padding: "10px",
    backgroundColor: "#ffeb3b"
  },
  container: {
    border: "1px solid #ccc"
  }
});

const Box = (props: BoxProps) => {
  const { children } = props;
  return (
    <div className={styles("outerWrapper", "container")}>
      {children || "这是一个盒子"}
    </div>
  );
};
```

<img src="http://t16img.yangkeduo.com/mms_static/2020-02-03/18b12e14-8cfd-4cdc-b89d-78cb9b044108.png" width="600px" />

### 实现

#### 1. 如何生成 className 唯一的 hash

为了保证一个页面存在不同版本的组件时，组件样式不要互相覆盖，cssinjs 就需要和 cssModules 一样设计，保证 className 后面跟上 hash，如`ant-button-343245`而非`ant-button`。关于 hashCode 函数的设计，有两种思路：

- 每次调用都生成唯一的 hash，但这种办法 ssr 会有问题（client 和 server 端分别执行该函数，className 出现差异，会报 warning）
- 另一种是，根据版本号生成唯一的 hash，缺点是 需要知道当前要发的版本号（比如用到 cssinjs 的基础组件库，在发包前 build 出 css 时 需要有这个 version 号，但往往这个时候尚未发包，还不知道新版本号是多少，就需要额外处理）。优点是 保证每次相同版本号生成的 hash 都是确定的。

具体代码参考`src/utils/hashCode.tsx`

#### 2. 如何将对象形式的样式转为横线形式

如`使用示例`，使用的时候，是`backgroundColor: "#ffeb3b"`的格式，而最终渲染在 head 中 stylesheet 需要是`background-color: #ffeb3b`的格式。

这里借鉴了一下 jss，使用[hyphenate-style-name](https://github.com/rexxars/hyphenate-style-name/blob/master/test/hyphenate-style-name.test.js)的方式。最终代码上也比较简单，主要只需要考虑这几种即可：

- backgroundColor => background-color
- MozTransition => -moz-transition
- msTransition => -ms-transition

具体代码参考`src/utils/dashCase.tsx`

### TODO 备忘

#### 3. 如何挂载 stylesheet

主要分为两种：

- 静态的挂载
- 跟随 props 动态变化的处理

#### 4. 将 scss 变成 css

支持 & 这种形式的，如需将：

```
.container {
  color: 'yellow',
  '& .box': {
    color: 'red'
  }
}
```

转化为：

```
.container {
  color: 'yellow'
};
.container .box {
  color: 'red'
}
```

参考 jss-plugin-nested

#### 5. 如何让后面的 className 优先级高于前面的 className

```jsx
.blue { color: blue; }
.red { color: red; }

<span class="red blue">
  Which color will I be?
</span>
```

这种情况下，需要 span 显示为 blue 而非 red
