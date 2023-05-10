---
title: express
tags: express
categories: 后端
---
### express初体验

```js
const express = require('express')

// express是一个函数 返回一个app
const app = express()

// 监听默认路径
app.get('/', (req, res, next) => {
  // send方法接收两个参数,第一个是状态码 第二个是响应参数
  res.send(200, 'Hello Express')
})
// 监听post请求
app.post('/', (req, res, next) => {
  res.send('Hello Express')
})

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### express中间件

####  中间件是什么呢？

 中间件的本质是传递给express的一个回调函数，这个回调函数接受三个参数：

1.  请求对象（request对象）

2.  响应对象（response对象）

3.  next函数（在express中定义的用于执行下一个中间件的函数）

   

#### 中间件中可以执行哪些任务呢

1.  执行任何代码 
2.  更改请求（request）和响应（response）对象 
3.  结束请求-响应周期（返回数据）
4.  调用栈中的下一个中间件



#### 如何使用中间件

- express主要提供了两种方式：app/router.use和app/router.methods
-  可以是 app，也可以是router
-  methods指的是常用的请求方式，比如： app.get或app.post等



### 中间件的基本使用

```js
const express = require('express')

const app = express()
// 注册多个中间件
app.use((req, res, next) => {
  console.log('注册了第一个中间件')
  next()
})
app.use('/home',(req,res , next)=> {
  console.log('注册了第二个中间件')
	next()
})
app.get('/home',(req,res , next)=> {
  console.log('注册了第三个中间件')
})
app.post('/home',(req,res , next)=> {
  console.log('注册了第四个中间件')
	next()
})
app.use((req, res, next) => {
  console.log('注册了第五个中间件')
  next()
})
app.use((req, res, next) => {
  console.log('注册了第六个中间件')
  res.send('结束')
})

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```

==刚开始匹配第一个符合的中间件，如果调用了next方法会继续向下匹配符合条件的中间件，没有next方法则只会匹配第一个符合的中间件==

例如：

-  http://localhost:3000 发送了get请求 则会匹配 第 1，5，6位的中间件
-  http://localhost:3000/home 发送了get请求 则会匹配 第 2，3位的中间件
-  http://localhost:3000/home 发送了post请求 则会匹配 第 2，4， 5，6位的中间件



### 中间件的连续调用

```js
const express = require('express')

const app = express()

app.get(
  '/home',
  (req, res, next) => {
    console.log('111')
    next()
  },
  (req, res, next) => {
    console.log('222')
    next()
  },
  (req, res, next) => {
    console.log('333')
    next()
  },
  (req, res, next) => {
    res.send('结束')
  }
)

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### 中间件解析json和urlencoded

```js
const express = require('express')

const app = express()

// 自己编写中间件解析body的json数据
app.use((req, res, next) => {
  console.log(req.headers['content-type'])
  if (req.headers['content-type'] === 'application/json') {
    req.on('data', (data) => {
      req.body = JSON.parse(data.toString())
    })
    req.on('end', () => {
      next()
    })
  } else {
    next()
  }
})

// express内置中间件
app.use(express.json())
// extended为true对urlencoded解析时使用第三方库，false时使用node内置模块解析
app.use(express.urlencoded({ extended: true }))

app.post('/login', (req, res, next) => {
  console.log(req.body)
  res.send('结束')
})

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### 中间件解析form-data

```shell
npm install multer
```



```js
const express = require('express')
const multer = require('multer')

const app = express()
const upload = multer()

// 解析form-data参数 全局解析不推荐
app.use(upload.any
        
// 推荐在需要的中间件中添加
app.post('/login',upload.any(), (req, res, next) => {
  console.log(req.body)
  res.send('结束')
})

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})

```



### 中间件处理文件上传



#### 上传单个文件

```js
const express = require('express')
const multer = require('multer')

const app = express()
const upload = multer({
  dest: './uploads' // 文件存放位置
})

app.post('/upload', upload.single('file'), (req, res, next) => {
  // 文件上传成功会在req对象上添加一个file对象存放文件的信息
  console.log(req.file)
  res.send('文件上传成功')
})

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```

#### 上传多个文件

```js
const express = require('express')
const multer = require('multer')

const app = express()
const upload = multer({
  dest: './uploads' // 文件存放位置
})

app.post('/upload', upload.array('file'), (req, res, next) => {
  // 文件上传成功会在req对象上添加一个files对象存放文件的信息
  console.log(req.files)
  res.send('文件上传成功')
})

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



#### 指定文件名字和后缀名

```js
const path = require('path')

const express = require('express')
const multer = require('multer')

const app = express()

// 自定义文件的名称和存放位置
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // 第一个参数是error， 第二个是文件存放路径
    callback(null, './uploads/')
  },
  filename: (req, file, callback) => {
    // 第一个参数是error， 第二个是文件名称
    callback(null, Date.now() + path.extname(file.originalname)) // path模块获取文件后缀名
  }
})

const upload = multer({
  storage
})

app.post('/upload', upload.single('file'), (req, res, next) => {
  res.send('文件上传成功')
})

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### 部署静态资源

```js
const express = require('express')

const app = express()

app.use(express.static('./build'))

// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### 中间件保存日志信息

```shell
npm install morgan
```



```js
const fs = require('fs')
const express = require('express')
const morgan = require('morgan')

const app = express()
const writeStream = fs.createWriteStream('./logs', {
  flags: 'a+'
})
app.use(morgan('combined', { stream: writeStream }))
app.get('/', (req, res, next) => {
  res.send('Hello')
})
// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### 获取query和params参数

```js
const express = require('express')

const app = express()

app.get('/user/:id', (req, res, next) => {
	// 获取params参数
  console.log(req.params)
  const { id } = req.params
  res.send('Hello')
})
app.get('/login', (req, res, next) => {
	// 获取query参数
  console.log(req.query)
  const { username, password } = req.query
  res.send('Hello')
})
// 开启监听
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### express路由的使用

在router文件夹新建user.js

```js
const express = require('express')

const router = express.Router()

router.get('/', (req, res, next) => {
  res.send('获取用户列表成功')
})
router.post('/', (req, res, next) => {
  res.send('添加用户列表成功')
})
router.delete('/:id', (req, res, next) => {
  res.send('删除用户成功')
})

module.exports = router
```

在index中使用路由中间件

```js
const express = require('express')

const userRouter = require('./router/users')
const app = express()

app.use('/user', userRouter)

app.listen(3000, () => {
  console.log('服务启动成功')
})
```

