English | [简体中文](./README.zh-CN.md)

## Content introduction

```

- src/views
  - admin  管理员页面
  - community  社区交流页面
  - data-manage 数据管理页面
  - error-log  错误日志页面
  - error-page 404页面
  - gui  图形化界面
  - guide  使用指南页面
  - home  系统主页
  - login  登录页面
  - process-manage 过程管理页面


```
## Getting started

```bash
# clone the project
git clone https://github.com/kevinchannn/NLP_Vue.git

# enter the project directory
cd NLP_Vue

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9527

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```



Copyright (c) 2020-present NJU_CK

