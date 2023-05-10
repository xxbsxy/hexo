---
title: Koa项目搭建
tags: koa
categories: 后端
---
### 初始化

```shel
npm init -y
```

### 安装koa

```shell
npm install koa
```

### 划分目录结构



### 安装路由

```shell
npm install koa-router
```

### 安装koa-bodyparser

```shell
npm install koa-bodyparser
```

### 安装jsonwebtoken进行登录鉴权

```shell
npm install jsonwebtoken
```

### 安装mysql2连接数据库

```shell
npm install mysql2
```



```js
const mysql = require('mysql2')

const connections = mysql.createPool({
  host: '127.0.0.1',
  port: '3306',
  database: 'property',
  user: 'root',
  password: 'xxbsxy'
})

connections.getConnection((err, conn) => {
  conn.connect((err) => {
    if (!err) {
      console.log('连接数据库成功')
    } else {
      console.log('连接数据库失败')
    }
  })
})

module.exports = connections.promise()
```

