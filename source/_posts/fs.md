---
title: node fs模块
tags: node
categories: 后端
---
## fs模块

### fs模块的三种读取方式

```js
const fs = require('fs')

// 1.同步读取 获取到结果才会执行后续代码
// 第一个参数是需要读取的文件路径 第二参数是配置options
const res1 = fs.readFileSync('./a.txt', {
  encoding: 'utf-8' // 编码格式 默认是输出Buffer数据
})
console.log(res1)

// 2.异步读取 回调函数方式
// 第三个参数传入函数,等到有结果会回调
fs.readFile(
  './a.txt',
  {
    encoding: 'utf-8'
  },
  (error, data) => {
    if (error) {
      return
    }
    console.log(data)
  }
)
// 3.异步读取 Promise方式
fs.promises
  .readFile('./a.txt', { encoding: 'utf-8' })
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err)
  })
```

### 文件描述符

```js
// 手动打开一个文件
fs.open('./a.txt', (err, fd) => {
  if (err) return

  // 1.获取文件描述符
  console.log(fd)

  // 2.读取文件的信息 比如文件的大小、创建时间等
  fs.fstat(fd, (err, stats) => {
    if (err) return
    console.log(stats)

    // 3.手动关闭文件
    fs.close(fd)
  })
})
```

### 文件写入

```js
const content = 'hello world'
// 写入文件 第一个参数是写入文件的路径没有则会创建，第二个参数的写入内容
// 第三个参数是配置options，第四个参数是回调函数
fs.writeFile(
  './a.txt',
  content,
  {
    encoding: 'utf-8', //编码格式 默认utf-8
    flag: 'a' // 写入方式 默认为w会覆盖原文件 a则为向文件末尾追加
  },
  (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('写入成功')
    }
  }
)
```

### 文件夹的操作

```js
//创建文件夹
fs.mkdir('./a', (err) => {
  console.log(err)
})

//  读取文件夹内容 获取文件夹中文件的字符串
fs.readdir('./a', (err, files) => {
  console.log(files) // ['a.txt','b.txt'，'bbb']
})

// 读取文件夹内容 获取文件夹中文件的信息 Symbol(type)]: 2则为文件夹 1为文件
fs.readdir('./a', { withFileTypes: true }, (err, files) => {
  console.log(files) // { name: 'bbb', [Symbol(type)]: 2 }
})

// 递归读取文件夹的所有文件
function readDirectory(path) {
  fs.readdir(path, { withFileTypes: true }, (err, files) => {
    files.forEach((item) => {
      if (item.isDirectory()) {
        readDirectory(`${path}/${item.name}`)
      } else {
        console.log(item.name)
      }
    })
  })
}
// 对文件进行重命名
fs.rename('./a.txt', './b.txt', (err) => {
  console.log(err)
})
// 对文件夹进行重命名
fs.rename('./a', './b', (err) => {
  console.log(err)
})
```

## event模块

### event模块基本使用

```js
const EventEmitter = require('events')

// 创建EventEmitter实例
const emitter = new EventEmitter()

// 监听事件
emitter.on('data', (name, age) => {
  console.log('监听data事件')
  console.log('获得参数', name ,age)
})

// 发射事件
setTimeout(() => {
  emitter.emit('data','aaa', 18)
}, 1000)

```

### 取消监听

```js
const EventEmitter = require('events')

const emitter = new EventEmitter()

function fn() {
  console.log('监听data事件')
}

// 监听事件
emitter.on('data', fn)

//取消监听
emitter.off('data', fn)

// 发射事件
setTimeout(() => {
  emitter.emit('data')
}, 1000)
```

### 其他方法

```js
const EventEmitter = require('events')

// 创建EventEmitter实例
const emitter = new EventEmitter()

// 监听事件
emitter.on('data', () => {})
emitter.on('data', () => {})
emitter.on('data', () => {})

emitter.on('name', () => {})
emitter.on('name', () => {})

// 1.获取所有监听事件的名称
console.log(emitter.eventNames()) // ['data','name']

// 2.获取监听的最大监听个数 默认为10
console.log(emitter.getMaxListeners()) // 10

// 3.获取某一个监听事件的个数
console.log(emitter.listenerCount('data')) // 3

// 4.修改最大监听个数
emitter.setMaxListeners(5)

// 5.移除指定监听器
emitter.removeListener('data')

// 6.移除所有监听器
emitter.removeAllListeners()
```

## Stream

### 可读流

```js
// 创建可读流 是EventEmitter的实例
const readStream = fs.createReadStream('./a.txt', {
  start: 5, // 从什么位置开始读取
  end: 10, // 结束读取的位置
  highWaterMark: 2 // 每一次读取几个字节 默认为64kb
})

// 监听打开文件事件 获得文件描述符
readStream.on('open', (fd) => {
  console.log('文件被打开', fd)
})

// 监听读取的数据事件
readStream.on('data', (data) => {
  console.log(data)
})

readStream.on('end', () => {
  console.log('文件被读取完')
})

readStream.on('close', () => {
  console.log('文件读取结束,并且被关闭')
})
```

### 可写流

```js
// 创建写入流
const writeStream = fs.createWriteStream('./a.txt', {
  flags: 'a+'
})

// 写入内容
writeStream.write('hello', (err) => {
  if (err) return
  console.log('写入成功')
})

// 写入完成时,需要手动调用close方法来关闭文件
// writeStream.close()

// end方法写入完成会自动关闭文件 会发出finish事件
writeStream.end('world')

writeStream.on('open', (fd) => {
  console.log('文件被打开')
})

writeStream.on('finish', () => {
  console.log('写入完成')
})

writeStream.on('close', () => {
  console.log('文件被关闭')
})
```

