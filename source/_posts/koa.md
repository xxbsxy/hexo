---
title: Koa
tags: koa
categories: 后端
---

### koa初体验

```js
const Koa = require('koa')

const app = new Koa()

// use注册中间件
app.use((ctx, next) => {
	// ctx为上下文 里面有response和request对象
	// 向客户端返回数据 相当于express的res.send
	ctx.response.body = 'Hello Koa'
})

app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### koa中间件

和express不同，koa注册中间件只能通过use方法

-  Koa并没有提供methods的方式来注册中间件

-  也没有提供path中间件来匹配路径

- 不能在一个use方法连续注册多个中间件

- **但是在koa的第三方路由中可以连续注册多个中间件**

  

### koa路由的使用

```shell
npm install koa-router
```



router文件夹新建 user.js

```js
const Router = require('koa-router')

const router = new Router()
// 统一前缀
router.prefix('/user')

router.get('/', (ctx) => {
  ctx.response.body = 'Get User List'
})
router.post('/', (ctx) => {
  ctx.response.body = 'Add User'
})
module.exports = router
```

 在index下导入并使用

```js
const Koa = require('koa')

const app = new Koa()
const userRouter = require('./router/user')

app.use(userRouter.routes())
// allowedMethods用于判断某一个method是否支持
// 没有实现这个method就自动报错
app.use(userRouter.allowedMethods())

app.listen(3000, () => {
  console.log('服务启动成功')
})

```



### koa解析params和query参数

```js
const Koa = require('koa')

const app = new Koa()
const Router = require('koa-router')
const userRouter = new Router()

userRouter.get('/user/:id', (ctx) => {
  console.log(ctx.request.query) // 获取query参数
  console.log(ctx.request.params) // 获取params参数
})

app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### koa解析json和urlencoded参数



```shell
npm install koa-bodyparser
```



```js
const Koa = require('koa')
const bodyparser = require('koa-bodyparser')
const app = new Koa()

app.use(bodyparser())

app.use((ctx, next) => {
  // 直接可以获取json和urlencoded参数
  console.log(ctx.request.body)
})

app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### koa解析form-data参数



```shell
npm install multer
```

```js
const Koa = require('koa')
const multer = require('koa-multer')

const app = new Koa()
const upload = multer()

app.use(upload.any())

app.use((ctx, next) => {
  // 获取form-data参数 注意要在req对象获取,req和request不是同一个对象
  console.log(ctx.req.body)
})

app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### koa文件上传

用法和express一样 

```js
const Koa = require('koa')
const path = require('path')
const multer = require('koa-multer')
const Router = require('koa-router')

const app = new Koa()
const userRouter = new Router()

// 自定义文件的名称和存放位置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './upload/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({
  storage
})

userRouter.post('/upload', upload.single('file'), (ctx) => {
  console.log(ctx.req.file)
  console.log('上传文件成功')
})

app.use(userRouter.routes())
app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### koa返回参数和设置状态码

```js
const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  // 设置状态码
  ctx.status = 200
  // 返回参数
  // ctx.response.body = ['111', '222', '333']

  // ctx.response.body的简写 也可以返回数据
  // ctx.request.body
  ctx.body = {
    name: 'aaa',
    age: 18
  }
})

app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### koa部署静态资源

```
npm install koa-static
```

```js
const Koa = require('koa')
const koaStatic = require('koa-static')
const app = new Koa()

app.use(koaStatic('./build'))

app.listen(3000, () => {
  console.log('服务启动成功')
})
```



### koa错误处理

```js
const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  const isLogin = false
  if (!isLogin) {
    ctx.app.emit('error', new Error('您还没有登录'), ctx)
  }
})

app.on('error', (err, ctx) => {
  ctx.status = 401
  ctx.body = err.message
})

app.listen(3000, () => {
  console.log('服务启动成功')
})
```

