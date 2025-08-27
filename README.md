# agent-publish-server

[English](#english) | [中文](#chinese)

---

## <a id="english"></a>English

> A frontend service startup plugin based on nodejs+express+http-proxy-middleware with proxy support

### Features

- 🚀 **Quick Start**: One-command startup for development server
- 🔄 **Proxy Support**: Built-in proxy middleware for API forwarding
- 📁 **Static File Serving**: Serve static files from any directory
- ⚙️ **Interactive Configuration**: Easy setup with interactive CLI
- 📝 **Access Logging**: Optional request logging with timestamps
- 🛡️ **Path Validation**: Automatic project path validation
- 🎯 **SPA Support**: Single Page Application routing support

### Installation

```bash
npm install agent-publish-server -g
```

### Quick Start

#### Method 1: Interactive Configuration (Recommended)

```bash
agent-publish-server -wp
```

This will guide you through an interactive setup:

1. Enter port number
2. Enter project directory (after build)
3. Enter proxy configuration (format: `/api:http://localhost:3000`)
4. Choose to continue adding proxies (1: continue, 0: finish)
5. Generate `agent_config.json` and get startup command

#### Method 2: Manual Configuration

1. **Initialize configuration file:**

```bash
agent-publish-server init
```

2. **Edit the generated `agent_config.json`:**

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

3. **Start the server:**

```bash
agent-publish-server -c ./agent_config.json
```

### Command Line Options

| Option                | Description                     | Example                                 |
| --------------------- | ------------------------------- | --------------------------------------- |
| `-wp, --write-proxy`  | Interactive proxy configuration | `agent-publish-server -wp`              |
| `-c, --config <path>` | Specify configuration file path | `agent-publish-server -c ./config.json` |
| `-p, --port <number>` | Override port number            | `agent-publish-server -p 3000`          |
| `-d, --dir <path>`    | Override static directory       | `agent-publish-server -d ./dist`        |
| `--log <boolean>`     | Enable/disable access logging   | `agent-publish-server --log false`      |
| `-v, --version`       | Show version                    | `agent-publish-server -v`               |
| `init`                | Initialize configuration file   | `agent-publish-server init`             |

### Configuration Schema

```typescript
interface AgentConfig {
  port?: number; // Server port (default: 8080)
  dir?: string; // Static files directory (default: "./")
  log?: boolean; // Enable access logging (default: true)
  proxy?: {
    // Proxy configurations
    [path: string]: {
      target: string; // Target URL
      changeOrigin?: boolean; // Change origin header
      pathRewrite?: {
        // Path rewrite rules
        [pattern: string]: string;
      };
    };
  };
}
```

### Access Logging

Access logging is enabled by default and shows:

- Timestamp (ISO format)
- Client IP address
- HTTP method and URL
- User agent string

Example log output:

```
[2025-08-27T11:02:48.854Z] ::1 "GET /" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
```

To disable logging:

```bash
agent-publish-server --log false
```

### Error Handling

- **Invalid project path**: Shows "项目路径错误" (Project path error) and exits
- **Invalid port**: Validates port numbers (1-65535)
- **Missing configuration**: Falls back to defaults

### Use Cases

- **React/Vue Development**: Serve built applications with API proxying
- **Frontend Testing**: Quick static file serving with CORS handling
- **Local Development**: Proxy API calls to backend services
- **SPA Deployment**: Proper routing support for single-page applications

---

## <a id="chinese"></a>中文

> 这是一个基于 nodejs+express+http-proxy-middleware 的一款可支持代理的前端服务启动插件

### 功能特性

- 🚀 **快速启动**: 一键启动开发服务器
- 🔄 **代理支持**: 内置代理中间件，支持 API 转发
- 📁 **静态文件服务**: 支持任意目录的静态文件托管
- ⚙️ **交互式配置**: 通过问答方式轻松配置
- 📝 **访问日志**: 可选的请求日志记录功能
- 🛡️ **路径验证**: 自动验证项目路径有效性
- 🎯 **SPA 支持**: 单页应用路由支持

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
    // 代理配置
    [path: string]: {
      target: string; // 目标URL
      changeOrigin?: boolean; // 更改源头
      pathRewrite?: {
        // 路径重写规则
        [pattern: string]: string;
      };
    };
  };
}
```

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

### 版本历史

- **v1.0.16**: 新增交互式配置、访问日志、路径验证功能
- **v1.0.15**: 基础代理和静态文件服务功能

### 许可证

MIT License

### 贡献

欢迎提交 Issue 和 Pull Request！
