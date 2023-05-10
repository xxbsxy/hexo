---
title: promise基本使用
tags:  promise 
categories: 前端
---
### 1. promise的基本使用


```js
// Promise传入一个回调函数接收两个参数，第一个参数是成功的回调，第二个是失败的回调
// Promise对象有三种状态pending(进行中)、fulfilled（已成功）和rejected（已失败）状态
// Promise刚开始是pending(进行中)状态，调用resolve则从pending变为fulfilled
// 调用reject从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了

const p = new Promise((resolve, reject) => {
  // pending
  console.log('111')
  console.log('222')

  // fulfilled
  resolve('成功的回调')
})

const p1 = new Promise((resolve, reject) => {
  // pending
  console.log('111')
  console.log('222')

  // rejected
  reject('失败的回调')
})

// Promise的状态变为fulfilled时会自动回调then方法并携带成功的参数
p.then((res) => {
  console.log(res)
})

// Promise的状态变为rejected时会自动回调catch方法并携带失败的参数
p1.catch((err) => {
  console.log(err)
})
```



### 2. resolve的参数



#### 没有参数

```js
const p = new Promise((resolve, reject) => {
  resolve()
})

p.then((res) => {
  console.log(res) // undefind
})
```



#### 参数是一个普通的值

```js
const p = new Promise((resolve, reject) => {
  resolve('Hello')
})

p.then((res) => {
  console.log(res) // Hello
})
```



#### 参数是一个Promise

```js
const p = new Promise((resolve, reject) => {
  // 如果resolve返回的值是一个promise,那么返回的值由返回的promise的状态决定
  resolve(
    new Promise((resolve, reject) => {
      reject('失败啦')
    })
  )
})

p.then((res) => {
  console.log(res) // 没有打印结果因为返回的promise是失败状态
}).catch((err) => {
  console.log(err) // 失败啦
})

```



#### 参数是一个thenable对象

```js
const p = new Promise((resolve, reject) => {
  // thenable对象指的是具有then方法的对象
  // resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法
  
  resolve({
    name: 'aaa',
    then(resolve) {
      resolve(100)
    }
  })
})

p.then((res) => {
  console.log(res) //100
})
```



### 3. then方法的链式调用

```js
const p = new Promise((resolve, reject) => {
  resolve('111')
})
// then方法的返回值是一个新的promise,这个promise等到then方法有返回值时进行决议
// 第一个then方法的参数是p的resolve函数传入的参数
// 后面then方法的参数是上一个then方法的返回值,没有返回值则为undefind

p.then((res) => {
  console.log(res) // 111
  return '222'
})
  .then((res) => {
    console.log(res) // 222
    return '333'
  })
  .then((res) => {
    console.log(res) // 333
  })
  .then((res) => {
    console.log(res) // undefind
    throw new Error('失败啦') // rejected状态需要手动抛出异常
  })
  .catch((err) => {
    console.log(err) // error:失败啦
  })

// p的状态变为fulfilled时会回调所有的p的then方法
p.then((res) => {
  console.log(res) // 111
})
p.then((res) => {
  console.log(res) // 111
})
```



### 4.finally方法



```js
const p = new Promise((resolve, reject) => {
  resolve()
})
// promise只要有了最终的状态，fulfilled或者rejected都会调用finally方法
p.then((res) => {
  console.log(res)
})
  .catch((err) => {
    console.log(err)
  })
  .finally(() => {
    console.log('哈哈哈')
  })
```



### 5.Promise的类方法



#### resolve和reject方法

```js
// resolve方法
Promise.resolve('Hello').then((res) => {
  console.log(res)
})
// 相当于
new Promise((resolve, reject) => {
  resolve('Hello')
}).then((res) => {
  console.log(res)
})

// reject方法
Promise.reject('失败啦').catch((err) => {
  console.log(err)
})
// 相当于
new Promise((resolve, reject) => {
  reject('失败啦')
}).catch((err) => {
  console.log(err)
})
```



#### all方法



```js
const p1 = new Promise((resolve, reject) => {
  resolve('111')
})
const p2 = new Promise((resolve, reject) => {
  resolve('222')
})
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('333')
  }, 2000)
})
const p4 = new Promise((resolve, reject) => {
  reject('失败啦')
})
// all方法传入多个Promise，将多个Promise包裹在一起形成一个新的Promise，
// 新的Promise的状态由所有包裹的Promise决定
// 所有包裹的Promise的状态都为fulfilled时，新的Promise的状态为fulfilled
// 并且将所有包裹的Promise的返回值形成一个数组
// 包裹的Promise的状态有一个为rejected时，新的Promise的状态为rejected

Promise.all([p1, p2, p3]).then((res) => {
  console.log(res) // 2秒后打印 ['111', '222', '333']
})

Promise.all([p1, p2, p3, p4])
  .then((res) => {
    console.log(res) 
  })
  .catch((err) => {
    console.log(err) // 失败啦
  })

```



#### allSettled方法



```js
const p1 = new Promise((resolve, reject) => {
  resolve('111')
})
const p2 = new Promise((resolve, reject) => {
  resolve('222')
})
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('333')
  }, 2000)
})
const p4 = new Promise((resolve, reject) => {
  reject('失败啦')
})

// allSettled方法传入多个Promise会等到所有的promise有结果,将结果保存在数组中
// allSettled方法一定是成功的，只会回调then方法

Promise.allSettled([p1, p2, p3, p4]).then((res) => {
  console.log(res)
  /*
			2秒后打印
			[
				{status: 'fulfilled', value: '111'},
				{status: 'fulfilled', value: '222'},
				{status: 'fulfilled', value: '333'},
				{status: 'rejected', reason: '失败啦'}
			]
	*/
})
```



#### race方法



```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('111')
  }, 0)
})
const p2 = new Promise((resolve, reject) => {
  reject('失败啦')
})

// race方法传入多个Promise哪一个promise先有结果就返回谁的结果

Promise.race([p1, p2])
  .then((res) => {
    console.log(res)
  })
  .catch((err) => {
    console.log(err) //失败啦
  })
```



#### any方法



```js
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('111')
  }, 0)
})
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('222')
  }, 100)
})
const p3 = new Promise((resolve, reject) => {
  reject('失败啦')
})

// any方法和race方法类似，但any方法只会返回第一个成功的结果，race方法不论成功和失败都会返回第一个结果。

Promise.any([p1, p2, p3]).then((res) => {
  console.log(res) // 111
})
```

