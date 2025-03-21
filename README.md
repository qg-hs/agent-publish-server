## agent-publish-server

> 这是一个基于 nodejs+express+http-proxy-middleware 的一款可支持代理的前端服务启动插件

## 安装

```bash
npm install agent-publish-server -g
```

## 使用

```bash
agent-publish-server
```

## 配置

```bash
# 配置文件路径
agent-publish-server -c ./agent_config.json
```

```json
{
  "port": 8080, // 端口号
  "dir": "./", // 静态文件目录
  "proxy": {
    "/api": {
      // 代理路径
      "target": "URL_ADDRESS", // 代理地址
      "changeOrigin": true, // 是否改变域名
      "pathRewrite": {
        // 路径重写
        "^/api": "" // 重写后路径
      }
    }
  }
}
```

## 说明

> 1. 配置文件路径为 agent_config.json
> 2. 配置文件路径可以通过 -c 来指定
> 3. 配置文件路径可以通过 --config 来指定
> 4. 配置文件路径可以通过 --cf 来指定
> 5. 配置文件路径可以通过 --config-file 来指定
> 6. 适配 react vue 等前端框架
