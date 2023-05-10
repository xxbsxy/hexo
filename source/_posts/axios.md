---
title: axios的封装
tags: axios
categories: 前端
---
**index.ts**

```
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { MyAxiosRequestConfig } from './type'

class Request {
  instance: AxiosInstance

  constructor(config: MyAxiosRequestConfig) {
    // 创建一个aioxs的实例
    this.instance = axios.create(config)

    // 每一个实例都会经过 全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (err) => {
        return err
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (res) => {
        return res.data
      },
      (err) => {
        return err
      }
    )

    // 针对某一个实例来添加拦截器 局部的拦截器
    if (config.interceptors) {
      this.instance.interceptors.request.use(
        config.interceptors.requestSuccessFn as any,
        config.interceptors.requestFailureFn
      )
      this.instance.interceptors.response.use(
        config.interceptors.responseSuccessFn,
        config.interceptors.responseFailuresFn
      )
    }
  }

  // 封装网络请求方法
  request<T = any>(config: MyAxiosRequestConfig<T>) {
    // 单次请求的成功拦截处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config)
    }

    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单次响应成功的拦截
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors.responseSuccessFn(res)
          }

          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  get<T = any>(config: MyAxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }
  post<T = any>(config: MyAxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }
  put<T = any>(config: MyAxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'PUT' })
  }
  delete<T = any>(config: MyAxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }
}

export default Request
```

**type.ts**

```
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface MyAxiosRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: {
    requestSuccessFn: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestFailureFn: (err: any) => any
    responseSuccessFn: (res: T) => T
    responseFailuresFn: (err: any) => any
  }
}
```

