---
title: Webpack进阶
tags: Webpack
categories: 前端
---
## 1. webpack实现模块化原理

### 1.1 CommonJs原理

1. 定义一个add函数并导出

```
const add = (num1, num2) => {
  return num1 + num2
}
module.exports = add
```

2. webpack打包后的代码为

```js
// 定义一个对象
// 模块的路径作为key 函数为value
var __webpack_modules__ = {
  './src/js/add.js': function (module) {
    const add = (num1, num2) => {
      return num1 + num2
    }
    // 将我们要导出的变量放到modle中的exports对象
    module.exports = add
  }
}
// 定义一个对象作为加载模块的缓存
var __webpack_module_cache__ = {}

// 加载模块的函数
function __webpack_require__(moduleId) {
  // 判断缓存中是否加载过
  var cachedModule = __webpack_module_cache__[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  // module和__webpack_module_cache__赋值了同一个对象
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {}
  })
  // 加载执行模块
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__)

  // 导出module.exports(add: function)
  return module.exports
}

// 立即执行函数 开始执行代码
!(function () {
  // 调用函数 加载./src/js/add.js模块
  const add = __webpack_require__('./src/js/add.js')

  console.log(add(10, 20))
})()
```



### 1.2 EsModel原理

1. 定义一个add函数并导出

```js
export const add = (num1, num2) => {
  return num1 + num2
}
```

2. webpack打包后的代码为

```js
// 定义一个对象
var __webpack_modules__ = {
  './src/js/add.js': function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__)
    // 调用d函数给exports设置了一个代理definition
    __webpack_require__.d(__webpack_exports__, {
      add: function () {
        return add
      }
    })
    const add = (num1, num2) => {
      return num1 + num2
    }
  }
}
// 模块的缓存
var __webpack_module_cache__ = {}

function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  var module = (__webpack_module_cache__[moduleId] = {
    exports: {}
  })

  __webpack_modules__[moduleId](module, module.exports, __webpack_require__)

  return module.exports
}

!(function () {
  // __webpack_require__函数对象添加一个属性d 值为函数
  __webpack_require__.d = function (exports, definition) {
    for (var key in definition) {
      if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
      }
    }
  }
})()

!(function () {
  // __webpack_require__函数对象添加一个属性o 值为函数
  __webpack_require__.o = function (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }
})()

!(function () {
  // __webpack_require__函数对象添加一个属性r 值为函数
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    }
    Object.defineProperty(exports, '__esModule', { value: true })
  }
})()

var __webpack_exports__ = {}

// 开始加载模块
!(function () {
  // 调用r的目的是记录一个__esModule -> true
  __webpack_require__.r(__webpack_exports__)
  // _js_add_js__WEBPACK_IMPORTED_MODULE_0__ 是返回的exports
  var _js_add_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__('./src/js/add.js')

  console.log((0, _js_add_js__WEBPACK_IMPORTED_MODULE_0__.add)(10, 20))
})()
```



## 2. devtool

### 2.1 source-map

- 我们的代码通常运行在浏览器上时，是通过打包压缩的： 

  - 也就是真实跑在浏览器上的代码，和我们编写的代码其实是有差异的； 

  - 比如ES6的代码可能被转换成ES5； 

  - 比如对应的代码行号、列号在经过编译后肯定会不一致； 

  - 比如代码进行丑化压缩时，会将编码名称等修改； 

  - 比如我们使用了TypeScript等方式编写的代码，最终转换成JavaScript； 

- 但是，当代码报错需要调试时（debug），调试转换后的代码是很困难的 n 但是我们能保证代码不出错吗？不可能。 

- 那么如何可以调试这种转换后不一致的代码呢？答案就是source-map 

  - source-map是从已转换的代码，映射到原始的源文件； 

  - 使浏览器可以重构原始源并在调试器中显示重建的原始源

- 下面几个值不会生成source-map

  - false：不使用source-map，也就是没有任何和source-map相关的内容。 
  - none：production模式下的默认值，不生成source-map。 
  - eval：development模式下的默认值，不生成source-map
    - 但是它会在eval执行的代码中，添加 //# sourceURL=； 
    - 它会被浏览器在执行时解析，并且在调试面板中生成对应的一些文件目录，方便我们调试代码；

**socurce map文件**

- version：当前使用的版本，也就是最新的第三版； 
- sources：从哪些文件转换过来的source-map和打包的代码（最初始的文件）； 
- names：转换前的变量和属性名称（因为我目前使用的是development模式，所以不需要保留转换前的名 称）； 
- mappings：source-map用来和源文件映射的信息（比如位置信息等），一串base64 VLQ（veriablelength quantity可变长度值）编码； pfile：打包后的文件（浏览器加载的文件）； 
- sourceContent：转换前的具体代码信息（和sources是对应的关系）； 
- sourceRoot：所有的sources相对的根目录

```json
{
  "version": 3,
  "file": "main.js",
  "mappings": ";;;;;;;;;;;;;;AAAO;AACP;AACA;;;;;;;UCFA;UACA;;UAEA;UACA;UACA;UACA;UACA;UACA;UACA;UACA;UACA;UACA;UACA;UACA;UACA;;UAEA;UACA;;UAEA;UACA;UACA;;;;;WCtBA;WACA;WACA;WACA;WACA,yCAAyC,wCAAwC;WACjF;WACA;WACA;;;;;WCPA,8CAA8C;;;;;WCA9C;WACA;WACA;WACA,uDAAuD,iBAAiB;WACxE;WACA,gDAAgD,aAAa;WAC7D;;;;;;;;;;;;ACNiC;AACjC;AACA;AACA;AACA,YAAY,+CAAG",
  "sources": [
    "webpack://webpack_text/./src/js/add.js",
    "webpack://webpack_text/webpack/bootstrap",
    "webpack://webpack_text/webpack/runtime/define property getters",
    "webpack://webpack_text/webpack/runtime/hasOwnProperty shorthand",
    "webpack://webpack_text/webpack/runtime/make namespace object",
    "webpack://webpack_text/./src/index.js"
  ],
  "sourcesContent": [
    "export const add = (num1, num2) => {\r\n  return num1 + num2\r\n}\r\n",
    "// The module cache\nvar __webpack_module_cache__ = {};\n\n// The require function\nfunction __webpack_require__(moduleId) {\n\t// Check if module is in cache\n\tvar cachedModule = __webpack_module_cache__[moduleId];\n\tif (cachedModule !== undefined) {\n\t\treturn cachedModule.exports;\n\t}\n\t// Create a new module (and put it into the cache)\n\tvar module = __webpack_module_cache__[moduleId] = {\n\t\t// no module.id needed\n\t\t// no module.loaded needed\n\t\texports: {}\n\t};\n\n\t// Execute the module function\n\t__webpack_modules__[moduleId](module, module.exports, __webpack_require__);\n\n\t// Return the exports of the module\n\treturn module.exports;\n}\n\n",
    "// define getter functions for harmony exports\n__webpack_require__.d = function(exports, definition) {\n\tfor(var key in definition) {\n\t\tif(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {\n\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: definition[key] });\n\t\t}\n\t}\n};",
    "__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }",
    "// define __esModule on exports\n__webpack_require__.r = function(exports) {\n\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n\t}\n\tObject.defineProperty(exports, '__esModule', { value: true });\n};",
    "import { add } from './js/add.js'\r\n\r\nconsole.log(asd)\r\n\r\nconsole.log(add(10, 20))\r\n"
  ],
  "names": [],
  "sourceRoot": ""
}

```

### 2.2 eval-source-map

会生成sourcemap，但是source-map是以DataUrl添加到eval函数的后面

```json
   eval(
          '\n;// CONCATENATED MODULE: ./src/js/add.js\nconst add = (num1, num2) => 
          {\r\n  return num1 + num2\r\n}\r\n\n;// CONCATENATED MODULE: ./src/index.js\n\r\n\r\nconsole.log
          (add(10, 20))\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=
          utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiODI1LmpzIiwibWFwcGluZ3MiOiI7O0FBQU87QUFDUDtBQUNBOz
          s7QUNGaUM7QUFDakM7QUFDQSxZQUFZLEdBQUciLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrX3RleHQvLi9
          zcmMvanMvYWRkLmpzPzA4ZjQiLCJ3ZWJwYWNrOi8vd2VicGFja190ZXh0Ly4vc3JjL2luZGV4LmpzP2I2MzU
          iXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGFkZCA9IChudW0xLCBudW0yKSA9PiB7XHJcbi
          AgcmV0dXJuIG51bTEgKyBudW0yXHJcbn1cclxuIiwiaW1wb3J0IHsgYWRkIH0gZnJvbSAnLi9qcy9hZG
          QuanMnXHJcblxyXG5jb25zb2xlLmxvZyhhZGQoMTAsIDIwKSlcclxuIl0sIm5hbWVzIjpbXSwic291
          cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///825\n'
     )
```

### 2.3 inline-source-map

会生成sourcemap，但是source-map是以DataUrl添加到bundle文件的后面

```json
!function(){"use strict";console.log(30)}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9
uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoieUJBRUFBLFFBQVFDLElDRENDLEciL
CJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrX3RleHQvLi9zcmMvaW5kZXguanMiLCJ3ZWJ
wYWNrOi8vd2VicGFja190ZXh0Ly4vc3JjL2pzL2FkZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ
pbXBvcnQgeyBhZGQgfSBmcm9tICcuL2pzL2FkZC5qcydcclxuXHJcbmNvbnNvbGUubG9nKGFkZCg
xMCwgMjApKVxyXG4iLCJleHBvcnQgY29uc3QgYWRkID0gKG51bTEsIG51bTIpID0+IHtcclxuICB
yZXR1cm4gbnVtMSArIG51bTJcclxufVxyXG4iXSwibmFtZXMiOlsiY29uc29sZSIsImxvZyIsI
m51bTEiXSwic291cmNlUm9vdCI6IiJ9
```

### 2.4 cheap-source-map

会生成sourcemap，但是会更加高效一些（cheap低开销），因为它没有生成列映射（Column Mapping）, 因为在开发中，我们只需要行信息通常就可以定位到错误了

### 2.5 cheap-module-source-map

会生成sourcemap，类似于cheap-source-map，但是对源自loader的sourcemap处理会更好。

**cheap-source-map和cheap-module-source-map的区别**

如果源码需要使用loader进行处理，比如bable，那么cheap-source-map报错的位置和部分代码会和写的不一样，cheap-module-source-map和自己编写的一样

### 2.6 hidden-source-map

会生成sourcemap，但是不会对source-map文件进行引用，相当于删除了打包文件中对sourcemap的引用注释，如果我们手动添加进来，那么sourcemap就会生效了

### 2.7 nosources-source-map

会生成sourcemap，但是生成的sourcemap只有错误信息的提示，不会生成源代码文件

### 2.8 多个值的组合

事实上，webpack提供给我们的26个值，是可以进行多组合的。 

组合的规则如下： 

- inline-|hidden-|eval：三个值时三选一； 
- nosources：可选值； 
-  cheap可选值，并且可以跟随module的值； 

==[inline-|hidden-|eval-] [][nosources-][cheap-[module-]] source-map==

那么在开发中，最佳的实践是什么呢？ 

- 开发阶段：推荐使用 source-map或者cheap-module-source-map  这分别是vue和react使用的值，可以获取调试信息，方便快速开发；  
- 测试阶段：推荐使用 source-map或者cheap-module-source-map 测试阶段我们也希望在浏览器下看到正确的错误提示； 
- 发布阶段：false、缺省值（不写）

## 3. babel

Babel是一个工具链，主要用于旧浏览器或者缓解中将ECMAScript 2015+代码转换为向后兼容版本的 JavaScript；

### 3.1 babel编译器执行原理

### 3.2 webpack中使用bable

1.安装@babel/core和 babel-loader

```shel
npm install babel-loader @babel/core -D
```

2.在webpack中配置

```js
module: {
	rules: [
		{
			test: /\.js$/,
			use: 'babel-loader'
		}
	]
}
```

但是这样配置并没有将es6的代码转成es5，因为我们需要安装插件

- 比如我们需要转换箭头函数，那么我们就可以使用箭头函数转换相关的插件

```shell
npm install @babel/plugin-transform-arrow-functions -D
```

- 比如需要将const转成var

```shell
npm install @babel/plugin-transform-block-scoping -D 
```

在webpack中配置

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ['plugin-transform-arrow-functions', 'plugin-transform-block-scoping']
        }
      }
    }
  ]
}
```

如果我们一个个去安装使用插件，那么需要手动来管理大量的babel插件，我们可以直接给webpack提供一个 preset，webpack会根据我们的预设来加载对应的插件列表，并且将其传递给babel。

```shell
npm install @babel/preset-env -D
```

在webpack中配置

```js
module: {
	rules: [
		{
			test: /\.js$/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['babel/preset-env']
				}
			}
		}
	]
}
```

我们最终打包的JavaScript代码，是需要跑在目标浏览器上的，需要通过browserslist工具来告知babel需要适配的浏览器。

### 3.3 babel的配置文件

像之前一样，我们可以将babel的配置信息放到一个独立的文件中，babel给我们提供了两种配置文件的编写： 

- babel.config.json（或者.js，.cjs，.mjs）文件； 
- .babelrc.json（或者.babelrc，.js，.cjs，.mjs）文件；

它们两个有什么区别呢？目前很多的项目都采用了多包管理的方式（babel本身、element-plus、umi等）； 

- .babelrc.json：早期使用较多的配置方式，但是对于配置Monorepos项目是比较麻烦的； 
- babel.config.json（babel7）：可以直接作用于Monorepos项目的子包，更加推荐；



**babel.config.js**

```js
module.exports = {
  presets: ['@babel/preset-env']
}
```

**webpack.config.js**

```
module: {
	rules: [
		{
			test: /\.js$/,
			use: 'babel-loader',
			exclude: /(node_modules)/
		}
	]
}
```

### 3.4 polyfill

为什么时候会用到polyfill呢？ 

- 比如我们使用了一些语法特性（例如：Promise, Generator, Symbol等以及实例方法例如 Array.prototype.includes等） 
- 但是某些浏览器压根不认识这些特性，必然会报错； 
- 我们可以使用polyfill来填充或者说打一个补丁，那么就会包含该特性了；

1. 安装

```shell
npm install core-js regenerator-runtime --save
```

2. 在babel.config.js配置

**useBuiltIns属性有三个常见的值**

第一个值：false

- 打包后的文件不使用polyfill来进行适配； 

- 并且这个时候是不需要设置corejs属性的；

第二个值：usage

-  会根据源代码中出现的语言特性，自动检测所需要的polyfill； 
- 这样可以确保最终包里的polyfill数量的最小化，打包的包相对会小一些； 
- 可以设置corejs属性来确定使用的corejs的版本；

第三个值：entry

- 如果我们依赖的某一个库本身使用了某些polyfill的特性，但是因为我们使用的是usage，所以之后用户浏览器 可能会报错； 
- 所以，如果你担心出现这种情况，可以使用 entry； 
- 并且需要在入口文件中添加 `import 'core-js/stable'; import 'regenerator-runtime/runtime'; 
- 这样做会根据 browserslist 目标导入所有的polyfill，但是对应的包也会变大；

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // false 不使用polyfill
        // usage 代码需要哪些polyfill,就使用相关的polyfill
        // entry 根据 browserslist 目标浏览器导入所有的polyfill 需要在入口文件中导入相应的包
        useBuiltIns: 'usage',
        corejs: 3 // 使用指定的corejs的版本
      }
    ]
  ]
}
```

如果使用entry需要在index.js导入

```js
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

### 3.5 编译react

1. 安装

```
npm install @babel/preset-react -D
```

2. 在babel.config.js配置

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3 
      }
    ],
    ['@babel/preset-react']
  ]
}

```

index.js

```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: 'Hello React'
    }
  }

  render() {
    return (
      <div>
        <h2>{this.state.message}</h2>
      </div>
    )
  }
}
const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<App />)
```

### 3.6 编译TypeScript

#### 3.6.1使用ts-loader编译

1.安装

```
npm install ts-loader -D
tsc --init // 生成ts配置文件
```

2.webpack.config.js配置

```js
{
   test: /\.ts$/,
   use: 'ts-loader'
}
```

#### 3.6.2使用babel-loader编译

1. 安装

```
npm install @babel/preset-typescript -D
```

2. webpack.config.js配置

```
{
   test: /\.ts$/,
   use: 'babel-loader'
}
```

3. babel.config.js配置

```
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3 
      }
    ],
    ['@babel/preset-typescript']
  ]
}
```

#### 3.6.3 ts-loader和babel-loader选择

 那么我们在开发中应该选择ts-loader还是babel-loader呢?

**使用ts-loader（TypeScript Compiler）** 

- 来直接编译TypeScript，那么只能将ts转换成js； 
- 如果我们还希望在这个过程中添加对应的polyfill，那么ts-loader是无能为力的； 
- 我们需要借助于babel来完成polyfill的填充功能； 

**使用babel-loader（Babel）** 

- 来直接编译TypeScript，也可以将ts转换成js，并且可以实现polyfill的功能； 
- 但是babel-loader在编译的过程中，不会对类型错误进行检测；

**那么在开发中，我们如何可以同时保证两个情况都没有问题呢？**

- 我们使用Babel来完成代码的转换，使用tsc来进行类型的检查。

### 3.7 编译Vue

1.安装相关依赖

```shell
npm install vue-loader -D
npm install vue-template-compiler -D
```

## 4. 代码分离

Webpack中常用的代码分离有三种： 

- 多入口起点：使用entry配置手动分离代码； 
- 防止重复：使用Entry Dependencies或者SplitChunksPlugin去重和分离代码； 
- 动态导入：通过模块的内联函数调用来分离代码；

### 4.1 多入口起点

```js
const path = require('path')
module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    main: './src/main.js'
  },
  output: {
    filename: '[name].build.js',
    path: path.join(__dirname + './build')
  }
 }
```

**假如我们的index.js和main.js都依赖axios库,我们可以对他们进行共享**

```js
const path = require('path')
module.exports = {
  mode: 'development',
  entry: {
    index: { import: './src/index.js', dependOn: 'shared' },
    main: { import: './src/main.js', dependOn: 'shared' },
    shared: ['axios']
  },
  output: {
    filename: '[name].build.js',
    path: path.join(__dirname + './build')
  }
 }
```

### 4.2 动态导入

另外一个代码拆分的方式是动态导入时，webpack提供了两种实现动态导入的方式

- 第一种，使用ECMAScript中的 import() 语法来完成，也是目前推荐的方式； 
- 第二种，使用webpack遗留的 require.ensure，目前已经不推荐使用

**index.js**  使用动态导入, 点击按钮才会加载main.js, 可以加快首屏渲染速度

```
const btnEl = document.createElement('button')
btnEl.textContent = 'show'

btnEl.onclick = function () {
  import('./js/main')
}

document.body.appendChild(btnEl)
```

**动态导入的文件命名**

```js
//index.js
btnEl.onclick = function () {
 // 使用魔法注释来指定分包的name
  import(/*webpackChunkName: "main" */ './js/main')
}

// webpack.config.js
output: {
   filename: 'js/build.js',
   path: path.resolve(__dirname, './build'),
   // 针对分包的文件进行命名 name是动态导入时起的名字
   chunkFilename: '[name]_chunk.js'
 }
```

### 4.3 SplitChunks

```js
module.exports = {
// 优化配置
  optimization: {
    splitChunks: {
      // all表示对同步和异步代码都进行处理 默认是async
      chunks: 'all',
      // 当大于指定大小时,会继续进行分包
      maxSize: 20000,
      // 分包不小于minSize的值 默认20kb(200000)
      minSize: 10000,
      // 至少被引入的次数，默认是1
      // 如果我们写一个2，但是引入了一次，那么不会被单独拆分
      minChunks: 2,
      // 设置生成chunkId的算法 开发模式默认为named
      // deterministic为一个确定的数字
      chunkIds: 'deterministic',
      // 用于对拆分的包就行分组
      // 比如一个lodash在拆分之后，并不会立即打包，而是会等到有没有其他符合规则的包一起来打包
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          filename: '[id]_[hsah:6]_vendors.js'
        }
      }
    }
  }
};
```

### 4.4 Prefetch和Preload

 在声明 import 时，使用下面这些内置指令，来告知浏览器： 

- prefetch(预获取)：将来某些导航下可能需要的资源 
- preload(预加载)：当前导航下可能需要资源

与 prefetch 指令相比，preload 指令有许多不同之处

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开 始加载。 
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。 
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻

```js
btnEl.onclick = function () {
  import(
  /*webpackChunkName: "main" */ 
  /*webpackPrefetch: true */ 
  './js/main')
}
```

### 4.5. CDN

CDN称之为内容分发网络（Content Delivery Network或Content Distribution Network，缩写：CDN） 

- 它是指通过相互连接的网络系统，利用最靠近每个用户的服务器； 
- 更快、更可靠地将音乐、图片、视频、应用程序及其他文件发送给用户； 
- 来提供高性能、可扩展性及低成本的网络内容传递给用户
- [BootCDN - Bootstrap 中文网开源项目免费 CDN 加速服务](https://www.bootcdn.cn/)

**使用cdn**

1. 在webpack.config.js配置

```
module.exports = {
  // 排除不需要进行打包的包
  // key为框架的名字 value为cdn地址提供的名字
  externals: {
    react: 'React',
    axios: 'axios'
  }
};
```

2. 在index.html中引入

```
	<script src="https://cdn.bootcdn.net/ajax/libs/axios/1.2.2/axios.min.js"></script>
	<script src="https://cdn.bootcdn.net/ajax/libs/react/18.2.0/cjs/react-jsx-dev-runtime.development.js"></script>
```

### 4.6 分离css

安装css分离插件

```
npm install mini-css-extract-plugin -D
```

配置rules和plugins

```js
const miniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
   module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          miniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')]
              }
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new miniCssExtractPlugin({
      filename: 'css/[name].css',
      // 动态引入css的分包名
      chunkFilename: 'css/[name]_chunk.css'
    })
  ],
};
```

## 5. 代码压缩

### 5.1 手动压缩js文件

- 在webpack中有一个minimizer属性，在production模式下，默认就是使用TerserPlugin来处理我们的代码的； 
- 如果我们对默认的配置不满意，也可以自己来创建TerserPlugin的实例，并且覆盖相关的配置
- 不过一般不需要手动配置，因为在production模式下webacpk已经配置好了

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
   optimization: {
    minimize: true,
    minimizer: [
      // new TerserPlugin({
      //   // 默认值为true，表示会将注释抽取到一个单独的文件中
      //   // 在开发中，我们不希望保留这个注释时，可以设置为false
      //   extractComments: false,
      //   //设置我们的terser相关的配置
      //   terserOptions: {
      //     // 设置压缩相关的选项
      //     compress: {
      //       arguments: true,
      //       arrows: true
      //     },
      //     mangle: true, // 设置丑化相关的选项
      //     toplevel: true, // 底层变量是否进行转换
      //     keep_classnames: true, // 保留类的名称
      //     keep_fnames: true // 保留函数的名称
      //   }
      // })
      new cssMinimizerWebpackPlugin()
    ]
  }
}
```

### 5.2 CSS的压缩

- CSS压缩通常是去除无用的空格等，因为很难去修改选择器、属性的名称、值等；
- CSS的压缩我们可以使用另外一个插件：css-minimizer-webpack-plugin
- css-minimizer-webpack-plugin是使用cssnano工具来优化、压缩CSS（也可以单独使用）

安装

```
npm install css-minimizer-webpack-plugin -D
```

在webpack.config.js中配置

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin()
    ]
  }
}
```

### 5.3 压缩html

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
plugins: [
    new HtmlWebpackPlugin({
      minify: {
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 移除空格
        removeRedundantAttributes: true, // 移除默认属性
        removeEmptyAttributes: true, // 移除空的属性 比如id=''
        minifyCSS: true // 压缩内联css样式
      }
    }),
  ]
}
```

### 5.4 gzip压缩

webpack中相当于是实现了HTTP压缩的第一步操作，我们可以使用CompressionPlugin

安装

```shell
npm install compression-webpack-plugin -D
```



## 6. Tree Shaking

### 6.1 js实现Tree Shaking

#### 6.1.1 usedExports

**事实上webpack实现Tree Shaking采用了两种不同的方案：**

- usedExports：通过标记某些函数是否被使用，之后通过Terser来进行优化的； 
- sideEffects：跳过整个模块/文件，直接查看该文件是否有副作用

 **将mode设置为development模式：** 

- 为了可以看到 usedExports带来的效果，我们需要设置为 development 模式 
- 因为在 production 模式下，webpack默认的一些优化会带来很大额影响。 

 **设置usedExports为true和false对比打包后的代码：** 

- 在usedExports设置为true时，会有一段注释：unused harmony export mul； 
- 这段注释的意义是什么呢？告知Terser在优化时，可以删除掉这段代码； 

**这个时候，我们讲 minimize设置true：** 

- usedExports设置为false时，mul函数没有被移除掉； 
- usedExports设置为true时，mul函数有被移除掉； 

 **所以，usedExports实现Tree Shaking是结合Terser来完成的**

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
   optimization: {
   // 导入时分析哪些模块被使用，哪些模块没有被使用
    usedExports：true，
    minimize: true,
    minimizer: [
     new TerserPlugin()
    ]
  }
}
```

#### 6.1.2 sideEffects

**sideEffects用于告知webpack compiler哪些模块时有副作用的：** 

-  副作用的意思是这里面的代码有执行一些特殊的任务，不能仅仅通过export来判断这段代码的意义； 

**在package.json中设置sideEffects的值：** 

-  如果我们将sideEffects设置为false，就是告知webpack可以安全的删除未用到的exports； 
-  如果有一些我们希望保留，可以设置为数组；

package.json

```
{
  "name": "webpack_demo",
  "version": "1.0.0",
  "sideEffects": [
    "./src/format.js",
    "*.css"
  ],
 }
```

 **比如我们有一个format.js、style.css文件：** 

- 该文件在导入时没有使用任何的变量来接受； 
- 那么打包后的文件，不会保留format.js、style.css相关的任何代码

### 6.2 css实现Tree Shaking

安装

```
npm install purgecss-webpack-plugin -D
```

配置PurgeCss

```js
const path = require('path')
const glob = require('glob')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')

module.exports = {
  plugins: [
    new PurgeCSSPlugin({
			// 表示要检测哪些目录下的内容需要被分析，这里我们可以使用glob
      paths: glob.sync(`${path.resolve(__dirname, '../src')}/**/*`, { nodir: true }),
			// Purgecss会将我们的html标签的样式移除掉，如果我们希望保留，可以添加一个safelist的属性
      safelist() {
        return {
          standard: ['html']
        }
      }
    })
  ],
}
```

### 6.3 Scope Hoisting作用域提升

 **什么是Scope Hoisting呢？** 

- Scope Hoisting从webpack3开始增加的一个新功能； 
- 功能是对作用域进行提升，并且让webpack打包后的代码更小、运行更快； 

 **默认情况下webpack打包会有很多的函数作用域，包括一些（比如最外层的）IIFE：** 

- 无论是从最开始的代码运行，还是加载一个模块，都需要执行一系列的函数； 
- cope Hoisting可以将函数合并到一个模块中来运行； 

 **使用Scope Hoisting非常的简单，webpack已经内置了对应的模块：** 

- 在production模式下，默认这个模块就会启用； 
- 在development模式下，我们需要自己来打开该模块

## 7. 打包文件分析

安装

```
npm install webpack-bundle-analyzer -D
```

在webpack中配置

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ],
}
```

