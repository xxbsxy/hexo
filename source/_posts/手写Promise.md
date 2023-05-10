---
title: 手写Promise
tags:  promise 
categories: 前端
---
### Promise基础版

```JS
class MyPromise {
    static PENDING = "pending"
    static FULFILLED = "fulfilled"
    static REJECTED = "rejected"

    constructor(fn) {
        this.PromiseState = MyPromise.PENDING
        this.PromiseResult = null
        this.onFulfilledCallback = [] // 保存成功回调
        this.onRejectedCallback = [] // 保存失败回调

        try {
            // 使this指向MyPromise
            fn(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }

    resolve(result) {
        this.PromiseState = MyPromise.FULFILLED
        this.PromiseResult = result
        this.onFulfilledCallback.forEach(callback => {
            callback(this.PromiseResult)
        })
    }

    reject(reason) {
        this.PromiseState = MyPromise.REJECTED
        this.PromiseResult = reason
        this.onRejectedCallback.forEach(callback => {
            callback(this.PromiseResult)
        })
    }

    then(onFulfilled, onRejected) {
        if (this.PromiseState === MyPromise.PENDING) {
            this.onFulfilledCallback.push(() => {
                setTimeout(() => {
                    onFulfilled(this.PromiseResult)
                })
            })
            this.onRejectedCallback.push(() => {
                setTimeout(() => {
                    onRejected(this.PromiseResult)
                })
            })
        }

        if (this.PromiseState === MyPromise.FULFILLED) {
            setTimeout(() => {
                onFulfilled(this.PromiseResult)
            })
        }

        if (this.PromiseState === MyPromise.REJECTED) {
            setTimeout(() => {
                onRejected(this.PromiseResult)
            })
        }
    }

    catch(onRejected) {
        if (this.PromiseState === MyPromise.PENDING) {
            this.onRejectedCallback.push(() => {
                setTimeout(() => {
                    onRejected(this.PromiseResult)
                })
            })
        }

        if (this.PromiseState === MyPromise.REJECTED) {
            setTimeout(() => {
                onRejected(this.PromiseResult)
            })
        }
    }
}
```

### 实现then链式回调