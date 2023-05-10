---
title: node http模块
tags: node
categories: 后端
---
### http初体验

```js
const http = require('http')

const server = http.createServer((req, res) => {
  res.end('Hello Server') // 相当于先调用 write方法然后调用end方法
})

// 启动服务器并指定端口号和主机
// listen方法接收三个参数 第一个是端口号,不传为随机端口,第二个为主机地址默认为0.0.0.0,
// 第三个为服务器启动成功的回调
server.listen(3000, '0.0.0.0', () => {
  console.log('服务启动成功')
})
```



### 创建http服务的不同方式

```js
const http = require('http')
// 方式一
const server1 = http.createServer((req, res) => {
  res.end('Server1')
})
server1.listen(3000, () => {
  console.log('Server1启动成功')
})

// 方式二
const server2 = new http.Server((req, res) => {
  res.end('Server2')
})
server2.listen(3001, () => {
  console.log('Server1启动成功')
})

// 方式三
http.createServer((req, res) => {
    res.end('Server3')
}).listen(3002, () => {
    console.log('Server3启动成功')
})
```



### request对象分析

```js
const http = require('http')

const server = http.createServer((req, res) => {
  // request对象封装了客户端给服务器传递的所有信息
  console.log(req.url) // 获取请求的url
  console.log(req.method) // 获取请求的方法
  console.log(req.headers) // 获取请求头的信息
  res.end('Server')
})
server.listen(3000, () => {
  console.log('服务启动成功')
})
```



### request对象的url方法

```js
const http = require('http')

const server = http.createServer((req, res) => {
  // URL传入两个参数 第一个是需要解析的url对象 第二个要解析的baseURL
  // 例如传入的url为 http://localhost:3000/user?id=10
  const myUrl = new URL(req.url, 'http://localhost:3000')

  const path = myUrl.pathname // 获取url地址不带query参数和baseurl
  const { id } = myUrl.searchParams // 获取query参数

  console.log(path) // /user
  console.log(id) // 10

  res.end('Hello')
})
server.listen(3000, () => {
  console.log('服务启动成功')
})
```



### 获取post请求body参数

```js
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
		// 监听on方法获取body参数
    req.on('data', (data) => {
      console.log(data.toString()) // 获得的data是Buffer二进制数据
    })
  }
  res.end('Server')
})
server.listen(3000, () => {
  console.log('服务启动成功')
})
```



### response返回状态码

```js
const http = require('http')

const server = http.createServer((req, res) => {
  // 方式一 直接给属性赋值
  res.statusCode = 401

  // 方式二 和Head一起设置
  res.writeHead(401)
  res.end()
})
server.listen(3000, () => {
  console.log('服务启动成功')
})
```



### response设置响应头



```js
const http = require('http')

const server = http.createServer((req, res) => {
  // 方式一 键值对方式设置
  res.setHeader('Content-type', 'application/json;charset=utf-8')

  // 方式二, 对象方式设置, 第一个参数是状态码,
  res.writeHead(200, {
    'Content-type': 'application/json;charset=utf-8'
  })
  res.end()
})
server.listen(3000, () => {
  console.log('服务启动成功')
})
```



### http发送网络请求

```js
const http = require('http')

// 发送get请求
http.get('http://43.143.0.76:3000/banner', (res) => {
  // 正在获取数据
  res.on('data', (data) => {
    console.log(data.toString())
  })
  // 数据获取完成的回调
  res.on('end', () => {
    console.log('获取到了所有数据')
  })
})

// 发送post请求 需要手动调用end结束
const req = http.request({ method: 'POST', hostname: 'localhost', port: 3000 }, (res) => {
  // 正在获取数据
  res.on('data', (data) => {
    console.log(data.toString())
  })
  // 数据获取完成的回调
  res.on('end', () => {
    console.log('获取到了所有数据')
  })
})

req.end()
```

