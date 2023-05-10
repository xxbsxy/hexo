---
title: git基本使用
tags: git
categories: 其他
---
## 本地操作

### 配置用户名

```
git config --global user.name "小东"
git config --global user.email "se_XiaoDong@hetaozs.com"
```

### 查看配置

```
git config --list
```

### 初始化本地仓库

```
git init
```

### 将目录下所有文件加入到git暂存区

```
git add .
```

### 提交文件到本地仓库

```
git commit -m "初始化项目"
```

### 查看文件提交日志

```
git log
git log --pretty=oneline 显示更加简洁在一行显示
git log --pretty=oneline --graph 以图结构显示 多分支
```

### 查看文件状态

- Untracked: 未跟踪状态
- staged: 暂存区文件状态
- Unmodified 已经commit: 未修改状态
- Modified: 修改了某个文件文件

```
git status
git status -s 更加简洁
```

### 配置忽略文件.gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
.DS_Store
dist
dist-ssr
coverage
*.local

/cypress/videos/
/cypress/screenshots/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### 版本回退

- 回退上一个版本是Head^，上上个版本是Head^^
- 如果是上1000个版本是Head~1000
- 也可以指定一个commit id

```
git reset --hard Head^
git reset --hard Head~1000
git reset --hard cd4239d9b9
```

### 版本回退后再恢复

```
git reflog 查看回退前commit id
git reset --hard cd4239d 
```

## 服务器操作

### 访问远程的私有仓库

访问远程的私有仓库需要对身份进行验证，目前主要有两种方式

1. 基于HTTP的凭证存储

```
git clone http://152.136.185.210:7888/xxbsxy/demo.git 需要输入账号和密码 
```

2. 基于SSH的密钥

```
ssh-keygen -t ed25519 -C "2873336572@qq.com" --生成公钥和私钥
```

在远程仓库设置SHH公钥，然后可以在本地clone

### 与远程服务器建立连接

```
git remote add origin http://152.136.185.210:7888/xxbsxy/demo.git
```

### 查看连接远程仓库地址

```
git remote -v
```

