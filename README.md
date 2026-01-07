# Agent Publish Server

[![npm version](https://badge.fury.io/js/agent-publish-server.svg)](https://badge.fury.io/js/agent-publish-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于 Node.js + Express + http-proxy-middleware 的前端服务启动插件，提供强大的代理和静态文件服务能力。

[English](./README_EN.md) | 中文

## 功能特性

- 🚀 **快速启动**：一键启动，支持交互式配置
- 🔄 **API 代理**：灵活的 API 请求代理，支持跨域处理
- 📁 **静态代理**：支持静态文件服务和 HTTP 服务代理两种模式
- 🌐 **双重模式**：静态文件代理和 HTTP 服务代理可同时使用
- 📝 **访问日志**：实时请求日志记录和监控
- ⚡ **路径验证**：自动路径存在性检查和验证
- 🛠️ **CLI 支持**：命令行工具，易于集成到构建流程
- 📋 **配置文件**：支持 JSON 配置文件，灵活配置各种代理规则

### 安装

```bash
npm install agent-publish-server -g
```

### 快速开始

#### 方式一：交互式配置（推荐）

```bash
agent-publish-server -wp
```

这将引导您完成交互式设置：

1. 输入端口号
2. 输入项目地址（打包后）
3. 输入代理接口配置（格式：`/api:http://localhost:3000`）
4. 选择是否继续添加代理（1：继续，0：结束）
5. 生成 `agent_config.json` 并获得启动命令提示

#### 方式二：手动配置

1. **初始化配置文件：**

```bash
agent-publish-server init
```

2. **编辑生成的 `agent_config.json`：**

```json
{
  "port": 8080,
  "dir": "./",
  "log": true,
  "proxy": {
    "/api": {
      "target": "http://localhost:3000",
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": ""
      }
    }
  }
}
```

3. **启动服务：**

```bash
agent-publish-server -c ./agent_config.json
```

### 命令行选项

| 选项                  | 说明              | 示例                                    |
| --------------------- | ----------------- | --------------------------------------- |
| `-wp, --write-proxy`  | 交互式代理配置    | `agent-publish-server -wp`              |
| `-c, --config <路径>` | 指定配置文件路径  | `agent-publish-server -c ./config.json` |
| `-p, --port <端口>`   | 覆盖端口号        | `agent-publish-server -p 3000`          |
| `-d, --dir <目录>`    | 覆盖静态文件目录  | `agent-publish-server -d ./dist`        |
| `--log <布尔值>`      | 启用/禁用访问日志 | `agent-publish-server --log false`      |
| `-v, --version`       | 显示版本          | `agent-publish-server -v`               |
| `init`                | 初始化配置文件    | `agent-publish-server init`             |

### 配置文件格式

```typescript
interface AgentConfig {
  port?: number; // 服务器端口（默认：8080）
  dir?: string; // 静态文件目录（默认："./"）
  log?: boolean; // 启用访问日志（默认：true）
  proxy?: {
    // API代理配置
    [path: string]: {
      target: string; // 目标URL
      changeOrigin?: boolean; // 更改源头
      pathRewrite?: {
        // 路径重写规则
        [pattern: string]: string;
      };
    };
  };
  staticProxy?: {
    // 静态网页代理配置
    [path: string]: {
      target: string; // 目标URL或本地文件路径
      type?: "http" | "static"; // 代理类型（默认：http）
      changeOrigin?: boolean; // 更改源头，仅http类型有效（默认：true）
    };
  };
}
```

### 静态网页代理

除了 API 代理外，还支持静态网页代理功能，用于代理整个网站或应用。

#### 配置示例

**静态文件代理：**

```json
{
  "staticProxy": {
    "/sub_page": {
      "target": "./dist",
      "type": "static"
    }
  }
}
```

**HTTP 服务代理：**

```json
{
  "staticProxy": {
    "/app": {
      "target": "http://localhost:3000",
      "type": "http",
      "changeOrigin": true
    }
  }
}
```

#### 功能特性

- **双重代理模式**：支持静态文件代理和 HTTP 服务代理
- **静态文件代理**：直接代理到本地文件系统目录
- **HTTP 服务代理**：代理到远程 HTTP 服务，支持路径重写
- **自动路径处理**：自动处理代理路径前缀
- **优先级处理**：静态代理优先于默认静态文件服务
- **路径验证**：自动检查静态文件路径是否存在

#### 与 API 代理组合使用

`staticProxy` 可以与 `proxy` 配置同时使用：

```json
{
  "proxy": {
    "/api": {
      "target": "http://localhost:3000",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  },
  "staticProxy": {
    "/dist_files": {
      "target": "./dist",
      "type": "static"
    },
    "/remote_app": {
      "target": "http://localhost:3001",
      "type": "http",
      "changeOrigin": true
    }
  }
}
```

这样配置后：

- 访问 `/api/*` 会代理到 `http://localhost:3000/*`（API 服务）
- 访问 `/dist_files/*` 会访问本地 `./dist` 目录下的静态文件
- 访问 `/remote_app/*` 会代理到 `http://localhost:3001/*`（远程应用）
- 其他路径会访问默认静态文件目录

### 访问日志

访问日志默认启用，显示内容包括：

- 时间戳（ISO 格式）
- 客户端 IP 地址
- HTTP 方法和 URL
- 用户代理字符串

日志输出示例：

```
[2025-08-27T11:02:48.854Z] ::1 "GET /" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
```

禁用日志：

```bash
agent-publish-server --log false
```

### 错误处理

- **项目路径无效**：显示"项目路径错误"并退出
- **端口号无效**：验证端口号范围（1-65535）
- **配置缺失**：使用默认配置

### 使用场景

- **React/Vue 开发**：为构建后的应用提供服务并代理 API
- **前端测试**：快速静态文件服务，处理跨域问题
- **本地开发**：代理 API 调用到后端服务
- **SPA 部署**：为单页应用提供正确的路由支持
- **微前端架构**：通过静态代理整合多个前端应用
- **开发环境整合**：将多个本地服务统一到一个端口访问

### 版本历史

- **v1.0.25**: 修复 staticProxy static 类型不支持 SPA History 路由刷新的问题，添加自动 fallback 到 index.html 支持
- **v1.0.24**: 修复移动端兼容性问题，优化 HTTP 响应头设置，确保 iOS 和 Android 显示一致性
- **v1.0.23**: 完善双语文档支持，优化 package.json 关键词，提升 npm 包曝光度
- **v1.0.22**: 优化和完善 staticProxy 功能，提升稳定性
- **v1.0.18**: 增强 staticProxy 功能，支持静态文件代理和 HTTP 服务代理两种模式
- **v1.0.17**: 新增静态网页代理功能（staticProxy），支持与 API 代理同时使用
- **v1.0.16**: 新增交互式配置、访问日志、路径验证功能
- **v1.0.15**: 基础代理和静态文件服务功能

### 许可证

MIT License

### 贡献

欢迎提交 Issue 和 Pull Request！
