---
title: Grpc
tags: grpc
categories: 后端
---
## 在nodejs中使用grpc编写接口

### 1. 创建一个user.proto文件

```tsx
syntax = "proto3";

package user; // 包名称

// 请求参数
message LoginRequest {
	string username = 1;
  string password = 2;
}

// 响应结果
message LoginResponse {
	string access_token = 1;
  int32 expires = 2;
}

// 用户相关接口
service User {
	// 登录函数
	rpc login(LoginRequest) returns (LoginResponse);
}
```

### 2. 安装相关依赖

```
npm i @grpc/grpc-js google-protobuf grpc-tools grpc_tools_node_protoc_ts
```

### 3. 生成user_pb.js和user_grpc_pb.js文件

```
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./ --grpc_out=./ --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` ./src/user.proto
```

### 4. 生成user_pb.d.ts和user_grpc_pb.d.ts文件

```
grpc_tools_node_protoc --plugin=protoc-gen-ts=`which protoc-gen-ts` --ts_out=./src --proto_path=./src ./src/user.proto
```

### 5.编写server.ts

```
import * as grpc from "@grpc/grpc-js";
import { IUserServer, UserService } from "../proto/user_grpc_pb";
import messages from "../proto/user_pb";

// User Service 的实现
const userServiceImpl: IUserServer = {
  // 实现登录接口
  login(call: any, callback: any) {
    const { request } = call;
    const username = request.getUsername();
    const password = request.getPassword();

    const response = new messages.LoginResponse();
    response.setAccessToken(`username = ${username}; password = ${password}`);
    response.setExpires(7200);
    callback(null, response);
  }
}

function main() {
  const server = new grpc.Server();
  
  // UserService 是定义，UserImpl 是实现
  server.addService(UserService as any, userServiceImpl as any);
  server.bindAsync(
    "0.0.0.0:8081",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("grpc server started");
    }
  );
}

main();
```

### 6.编写client.ts

```
import * as grpc from "@grpc/grpc-js";
import { UserClient } from "../proto/user_grpc_pb";
import messages from "../proto/user_pb";

const client = new UserClient(
  "localhost:8081",
  grpc.credentials.createInsecure()
);

// 发起登录请求
const login = () => {
  return new Promise((resolve, reject) => {
    const request = new messages.LoginRequest();
    request.setUsername('zhang');
    request.setPassword("123456");

    client.login(request, function (err: any, response: any) {
      if (err) {
        reject(err);
      } else {
        resolve(response.toObject());
      }
    });
  })
}

async function main() {
  const data = await login()
  console.log(data)
}

main();
```

## 在React中调用grpc接口

### 1.在服务器端安装envoy开启反向代理

####  1.1 打开envoy.yaml配置文件

```
sudo nano /etc/envoy/envoy.yaml
```

####  1.2 编写envoy.yaml配置文件

```tsx
static_resources:
  listeners:
    - name: listener_0
      address:
        socket_address: { address: 0.0.0.0, port_value: 9091}
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                codec_type: auto
                stat_prefix: ingress_http
                route_config:
                  name: local_route
                  virtual_hosts:
                    - name: local_service
                      domains: ["*"]
                      routes:
                        - match: { prefix: "/" }
                          route:
                            cluster: greeter_service
                            max_stream_duration:
                              grpc_timeout_header_max: 0s
                      cors:
                        allow_origin_string_match:
                          - prefix: "*"
                        allow_methods: GET, PUT, DELETE, POST, OPTIONS
                        allow_headers: keep-alive,user-agent,cache-control,content-type,content-transfer-encoding,custom-header-1,x-accept-content-transfer-encoding,x-accept-response-streaming,x-user-agent,x-grpc-web,grpc-timeout
                        max_age: "1728000"
                        expose_headers: custom-header-1,grpc-status,grpc-message
                http_filters:
                  - name: envoy.filters.http.grpc_web
                  - name: envoy.filters.http.cors
                  - name: envoy.filters.http.router
  clusters:
    - name: greeter_service
      connect_timeout: 0.25s
      type: logical_dns
      http2_protocol_options: {}
      lb_policy: round_robin
      load_assignment:
        cluster_name: cluster_0
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      address: 0.0.0.0
                      port_value: 8081

```

####  1.3 开启envoy服务

```
sudo envoy -c /etc/envoy/envoy.yaml
```

### 2.在react中引入proto文件并生成相关代码

#### 2.1生成user_grpc_web_pb.js和user_grpc_web_pb.d.ts文件

```
protoc --grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:. user.proto
```

或者可以直接生成ts文件

```
protoc --grpc-web_out=import_style=typescript,mode=grpcwebtext:. user.proto
```

#### 2.2生成user_pb.js和user_pb.d.ts 安装相关依赖

具体代码在上方

3 编写App.jsx

```tsx
import React, { memo } from 'react'
import { UserClient } from '../proto/user_grpc_web_pb'
import { LoginRequest } from '../proto/user_pb'

const App = memo(() => {

const client = new UserClient('http://localhost:9091')

export const Login = () => {
  return new Promise((resolve, reject) => {
    const request = new LoginRequest()

    request.setUsername('zhang')
    request.setPassword('123456')

    client.login(request, {}, function (err, response) {
      if (err) {
        reject(err)
      } else {
        resolve(response.toObject())
      }
    })
  })
}
	return <div>App</div>
})
export default App

```

```tsx
module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin", "eslint-plugin-import"],
  extends: ["alloy", "alloy/typescript"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    quotes: "error",
    semi: "error",
    "max-params": "off",
    "guard-for-in": "off",
    "spaced-comment": "off",
    "object-curly-spacing": ["error", "always"],
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-invalid-void-type": "off"
  }
};
```

### 其他

```
git submodule init
git submodule update --remote --forck
export NODE_OPTIONS='--max-old-space-size=4096'

ssh mimikko@192.168.2.22

/home/mimikko/Server/envoy/yaml

nohup envoy -c aggregation.yaml &

C:\Windows\System32\drivers\etc

npm install --legacy-peer-deps
```

