---
title: Webpack基础
tags: Webpack
categories: 前端
---
## 1. 安装

```shell
npm install webpack webpack-cli -D
```

webpack-cli不是必须的，是用来加载webpack.config.js的配置文件，你完全可以自己创建一个cli来加载，例如vue使用的就是vue-cli

## 2. 配置浏览器兼容性

### 2.1 默认配置

如果不配置Browserslist那么就会使用默认的配置( \> 0.5%, last 2 versions, Firefox ESR, not dead )

- \> 0.5% 为浏览器的市场占有率大于0.5%,在https://caniuse.com/usage-table可以查询
- last 2 versions 为每个浏览器的最后2个版本
- not dead 为24个月内官方支持更新的浏览器

### 2.2 手动配置

1.在package.json配置

```json
	"browserslistrc": [
		">1%",
		"last 2 version",
		"not dead"
	]
```

2.在.browserslistrc配置 

```json
>1%
last 2 version
not dead
```

## 3. webpack的配置文件的使用

### 3.1 修改打包的入口和出口文件

webpack打包时默认打包的是src下的index.js,打包完成在dist文件夹生成main.js为打包好的文件,如果需要修改打包的入口和出口文件,则需要在webpack.config.js配置

```js
const path = require('path')
module.exports = {
  entry: './src/main.js', // 需要打包的入口文件
  output: {
    filename: 'bundle.js', // 打包完的文件名称
    path: path.resolve(__dirname, './build') // 打包完成的路径 只能使用绝对路径
  }
}
```

### 3.2 修改配置文件的名称

webpack打包时默认寻找的是webpack.config.js的配置,如果需要更改配置文件的名称则需要修改执行webpack的命令

```json
  "scripts": {
    "build": "webpack --config hhh.config.js"
  }
```

### 3.3 加载css和less

1. 安装css-loader

```shell
npm install css-loader -D
```

2. 安装style-loader

```
npm install style-loader -D
```

3. 安装less以及less-loader

```shell
npm install less less-loader -D
```

4. 在配置文件中配置loader

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, //匹配规则 使用正则表达式
        // use: [{ loader: 'css-loader' }]  use可以传入loader以及options
        // 以下两种方式都是上面的简写
        // loader: 'css-loader'
        // use:['css-loader']
        use: ['style-loader', 'css-loader'] // loader的处理是从后往前的
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
}
```



### 3.4 使用PotsCss工具

- PostCSS是一个通过JavaScript来转换样式的工具； 
- 这个工具可以帮助我们进行一些CSS的转换和适配，比如自动添加浏览器前缀、css样式的重置； 
- 但是实现这些工具，我们需要借助于PostCSS对应的插件

安装postcss 和 postcss-loader

```
npm install postcss postcss-loader -D
```



#### 3.4.1 使用autoprefixer插件

1. 安装autoprefixer来添加浏览器前缀

```shell
npm install autoprefixer -D
```

2. 在webapck.config.js中配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('autoprefixer')]
              }
            }
          }
        ]
      },
    ]
  }
}
```

#### 3.4.2 使用postcss-preset-env插件

- postcss-preset-env也是一个postcss的插件；
-  它可以帮助我们将一些现代的CSS特性，转成大多数浏览器认识的CSS，并且会根据目标浏览器或者运行时环 境添加所需的polyfill；
-  也包括会自动帮助我们添加浏览器前缀（所以相当于已经内置了autoprefixer）；

1. 安装

```shell
npm install postcss-preset-env -D 
```

2.  方式一: 在webapck.config.js中配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
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
  }
}
```



方式二: 新建postcss.config.js

```js
module.exports = {
  plugins: [require('postcss-preset-env')]
}
```

在webapck.config.js中配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
    ]
  }
}
```



==注意==: 如果在一个css文件中使用@import引入另一个css那么引入的css不会通过postcss-loader的解析,需要添加css-loader的配置才行

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 //@import引入的css也需要postcss-loader的解析,后面有几个loder就写几
            }
          },
          'postcss-loader'
        ]
      }
    ]
  }
}

```



### 3.5 加载img图片

在webapck.config.js中配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        // 打包图片,将图片的地址设置到img的src中
        // 缺点: 多张图片会发送多次网络请求
        // type: 'asset/reslove'

        // 将图片进行base64编码 放入到打包的js文件中
        // 缺点: 造成js文件过大,使下载/解析js文件时间加长
        // type: 'asset/inline'

        // 合理的规范 使用type: 'asset'
        // 小的图片使用base64编码,大的图片直接打包
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 60 * 1024 // 小于60kb使用base64编码
          }
        },
        generator: {
          // 生成图片的名称
          // name: 原来图片的名称
          // ext图片后缀名
          // hash webpack生成的唯一hash值
          filename: 'img/[name]_[hash:6][ext]'
        }
      }
    ]
  }
}
```



## 4. Plugin的使用

### 4.1 CleanWebpackPlugin

 每次修改了一些配置，重新打包时，都需要手动删除dist文件夹

 我们可以借助于一个插件来帮助我们完成，这个插件就是CleanWebpackPlugin

1.安装

```shell
npm install clean-webpack-plugin -D
```

2.在webapck.config.js中配置

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  plugins: [new CleanWebpackPlugin()]
}
```



### 4.2 HtmlWebpackPlugin

- 我们的HTML文件是编写在根目录下的，而最终打包的dist文件夹中是没有index.html文件的。 
- 在进行项目部署的时，必然也是需要有对应的入口文件index.html； 
- 所以我们也需要对index.html进行打包处理
- 对HTML进行打包处理我们可以使用另外一个插件：HtmlWebpackPlugin；

1. 安装

```
npm install html-webpack-plugin -D
```

2. 在webapck.config.js中配置

```
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins: [new HtmlWebpackPlugin()]
}
```

3.自定义html模板

index.html

```html
<!DOCTYPE html>
<html lang="">

<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link rel="icon" href="<%= BASE_URL %>favicon.ico">
	<title>
		<%= htmlWebpackPlugin.options.title %>
	</title>
</head>

<body>
	<noscript>
		<strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without 
      JavaScript enabled.Please enable it to continue.
     </strong>
	</noscript>
	<div id="app"></div>
	<!-- built files will be auto injected -->
</body>

</html>
```

webapck.config.js

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins: [
   new HtmlWebpackPlugin({
      title: 'hello',
      template: './pubilc/index.html'
    })
  ]
}
```

上述代码在编译过程中还会报错，因为BASE_URL找不到，所以需要一个插件DefinePlugin来定义全局的BASE_URL。

### 4.3 DefinePlugin

 DefinePlugin允许在编译时创建配置的全局常量，是一个webpack内置的插件（不需要单独安装）

```js
const { DefinePlugin } = require('webpack')
module.exports = {
  plugins: [
    new DefinePlugin({
      BASE_URL: '"./"'
    })
  ]
}
```

这样全局就会有一个BASE_URL常量，但是favicon.ico因为没有在依赖图中，所以我们需要一个插件CopyWebpackPlugin将public中除了index.html之外的其他文件复制到dist文件夹中

### 4.4 CopyWebpackPlugin

1. 安装

```
npm install copy-webpack-plugin -D
```

2. 在webapck.config.js中配置

- 复制的规则在patterns中设置； 
- from：设置从哪一个源中开始复制； 
- to：复制到的位置，可以省略，会默认复制到打包的目录下； 
- globOptions：设置一些额外的选项，其中可以编写需要忽略的文件

```
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ]
}
```

## 5. resolve模块

### 5.1extensions

```js
module.exports = {
  //...
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.vue', '.jsx']
  },
};
```

能够使用户在引入模块时不带后缀名

```js
import File from '../path/to/file';
```

### 5.2 alias

配置路径别名

```
const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```





## 6. 搭建本地服务器

### 6.1 watch模式

**webpack给我们提供了watch模式**： 

- 在该模式下，webpack依赖图中的所有文件，只要有一个发生了更新，那么代码将被重新编译； 
- 我们不需要手动去运行 npm run build指令了

 **如何开启watch呢？两种方式：** 

- 方式一：在导出的配置中，添加 watch: true； 
- 方式二：在启动webpack的命令中，添加 --watch的标识；

方式一 webpack.config.js

```js
module.exports = {
  watch: true
}
```

方式二 package.json

```json
  "scripts": {
    "build": "webpack",
    "watch": "webpack --watch"
  }
```

### 6.2 webpack-dev-server

安装

```shell
npm install webpack-dev-server -D
```

在 package.json配置

```json
  "scripts": {
    "build": "webpack",
    "serve": "webpack serve"
  }
```

### 6.3 HMR

**什么是HMR呢？** 

- HMR的全称是Hot Module Replacement，翻译为模块热替换； 
- 模块热替换是指在 应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个页面； 

**HMR通过如下几种方式，来提高开发的速度：** 

- 不重新加载整个页面，这样可以保留某些应用程序的状态不丢失； 
- 只更新需要变化的内容，节省开发的时间； 
- 修改了css、js源代码，会立即在浏览器更新，相当于直接在浏览器的devtools中直接修改样式； 

 **如何使用HMR呢？** 

1. 默认情况下，webpack-dev-server已经支持HMR，我们只需要开启即可； 
2. 在不开启HMR的情况下，当我们修改了源代码之后，整个页面会自动刷新，使用的是live reloading；

**开启HMR**

修改webpack的配置：

```js
devServer: {
    hot: true
 }
```

在 入口文件指定哪一个模块开启HMR

```js
if (module.hot) {
	// 传入两个参数，第一个是需要开启HRM的模块，第二个是更新的回调函数
  module.hot.accept('./js/add.js', () => {
    console.log('add更新了')
  })
}

```

**devServer的其他常见配置**

```js
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    hot: true,
    // 该属性是指定本地服务所在的文件夹 默认为 '/'
    // 也就是我们直接访问端口即可访问其中的资源 http://localhost:8080
    // 如果我们将其设置为了 /abc，那么我们需要通过 http://localhost:8080/abc才能访问到对应的打包后的资源
    publicPath: '/',
    // 默认情况下当代码编译失败修复后，我们会重新刷新整个页面
    // 如果不希望重新刷新整个页面，可以设置hotOnly为true
    hotOnly: true,
    // 设置主机地址默认值是localhost也就是127.0.0.1
    host: 'localhost',
    // 设置监听的端口，默认情况下是8080
    port: 8080,
    // 是否为静态文件开启gzip 压缩 默认值是false
    compress: true,
    // 配置代理 可以解决跨域
    // '/api/banner' -> http://localhost:8888/banner
    proxy: {
      '/api': {
        target: 'http://localhost:8888', // 代理地址
        pathRewrite: {
          // 对路径进行重写
          '/api': ''
        },
        // 默认情况下不接收转发到https的服务器上，如果希望支持，可以设置为false
        secure: false,
        // 修改代理请求中的headers中的host属性
        changeOrigin: true
      }
    },
    // 它主要的作用是解决SPA页面在路由跳转之后，进行页面刷新时，返回404的错误
    // 如果设置为true，那么在刷新时，返回404错误时，会自动返回 index.html 的内容
    historyApiFallback: true
  },
}
```

































