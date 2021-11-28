简体中文 | [English](./README.md)

## 目录介绍

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

## 开发

```bash
# 克隆项目
git clone https://github.com/kevinchannn/NLP_Vue.git

# 进入项目目录
cd NLP_Vue

# 安装依赖
npm install

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

Copyright (c) 2020-present NJU_CK
