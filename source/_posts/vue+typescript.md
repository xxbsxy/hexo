---
title: vue3 + TypeScript项目搭建
tags: vue3
categories: 前端
---
### 创建vue应用

```shell
npm create vite@latest my-vue-app -- --template vue-ts
```

### 添加.vue文件的类型声明

在env.d.ts下新增如下代码

```js
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent;
  export default component;
}
```



###  集成editorconfig配置

EditorConfig 有助于为不同 IDE 编辑器上处理同一项目的多个开发人员维护一致的编码风格。

```yaml
# http://editorconfig.org

root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行尾的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

### 使用prettier工具

Prettier 是一款强大的代码格式化工具，支持 JavaScript、TypeScript、CSS、SCSS、Less、JSX、Angular、Vue、GraphQL、JSON、Markdown 等语言，基本上前端能用到的文件格式它都可以搞定，是当下最流行的代码格式化工具。



#### 配置.prettierrc文件

- useTabs：使用tab缩进还是空格缩进，选择false；
- tabWidth：tab是空格的情况下，是几个空格，选择2个；
- printWidth：当行字符的长度，推荐80，也有人喜欢100或者120；
- singleQuote：使用单引号还是双引号，选择true，使用单引号；
- trailingComma：在多行输入的尾逗号是否添加，设置为 `none`，比如对象类型的最后一个属性后面是否加一个，；
- semi：语句末尾是否要加分号，默认值true，选择false表示不加；

```
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "none",
  "semi": false
}
```



#### 配置.prettierignore忽略文件

```
/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

### 使用ESLint检测

#### 安装插件：

（vue在创建项目时，如果选择prettier，那么这两个插件会自动安装）

```shell
npm install eslint-plugin-prettier eslint-config-prettier -D
```

#### 添加prettier插件：

```json
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
    'plugin:prettier/recommended'
  ],
```



### css样式重置

#### 安装normalize.css

```shell
npm install normalize.css
```



#### 配置reset.css

```
/* reset.css样式重置文件 */
/* margin/padding重置 */
body, h1, h2, h3, ul, ol, li, p, dl, dt, dd {
 padding: 0;
 margin: 0;
}

/* a元素重置 */
a {
 text-decoration: none;
 color: #333;
}

/* img的vertical-align重置 */
img {
 vertical-align: top;
}

/* ul, ol, li重置 */
ul, ol, li {
 list-style: none;
}

/* 对斜体元素重置 */
i, em {
 font-style: normal;
}
```

### 安装element-plus

```
npm install element-plus --save
```

**配置按需导入**

```
npm install -D unplugin-vue-components unplugin-auto-import
```

**然后把下列代码插入到你的 Vite的配置文件中**

```js
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```



### 安装axios

```shell
npm install axios
```



### 安装less

```shell
npm i less-loader less --save-dev
```

