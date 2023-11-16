# webpack4_UI

webpack4 搭建多页面 UI 组件

### 目录结构

```
    |
    |-- build webpack 配置文件
    |--dist  文件打包出来的对应的 html, css, js
    |
    |-- src  开发文件
    |   |   |-- css
    |   |   |   |-- common.scss   全局公共样式
    |   |   |   |-- helper.scss   辅助样式
    |   |   |   |-- reset.scss    全局注释样式
    |   |   |   |-- var.scss      sass 变量
    |   |   |-- js                todo .....
    |   |-- components            公共组件ui,
    |   |-- theme
    |   |       |--  index        当前站点入口文件
    |   |       | -- 组件文件夹    组件文件开发目录

```

### 写文档

1. 如果写代码片段需要转义，否则会报错 https://www.sojson.com/rehtml

```bash
npm run dev # 启动本地开发环境 http://localhost:8090
npm run build:pro # 构建生产环境
```
