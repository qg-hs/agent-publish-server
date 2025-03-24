## agent-publish-server

> 这是一个基于 nodejs+express+http-proxy-middleware 的一款可支持代理的前端服务启动插件

## 安装

```bash
npm install agent-publish-server -g
```

## 使用步骤

### 步骤 1：初始化配置文件

首先，初始化配置文件：

```bash
agent-publish-server init
```

这将在当前目录生成默认配置文件 `agent_config.json`。

### 步骤 2：自定义配置（可选）

根据需要修改生成的 `agent_config.json` 配置文件。配置格式如下：

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

### 步骤 3：启动服务

```bash
agent-publish-server
```

## 配置选项

### 指定配置文件

你可以通过以下方式指定自定义配置文件路径：

1. 使用相对路径（相对于当前工作目录）：

```bash
agent-publish-server -c ./agent_config.json
```

2. 使用绝对路径：

```bash
agent-publish-server -c /path/to/agent_config.json
```

支持的配置文件参数：

- `-c`
- `--config`
- `--cf`
- `--config-file`

## 其他说明

- 适配 React、Vue 等前端框架
- 使用 `-v` 或 `--version` 查看当前版本
- 默认配置文件名为 `agent_config.json`
