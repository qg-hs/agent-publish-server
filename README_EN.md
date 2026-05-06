# Agent Publish Server

[![npm version](https://badge.fury.io/js/agent-publish-server.svg)](https://badge.fury.io/js/agent-publish-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A frontend service startup plugin based on Node.js + Express + http-proxy-middleware, providing powerful proxy and static file serving capabilities.

English | [中文](./README.md)

## Features

- 🚀 **Quick Start**: One-click startup with interactive configuration
- 🔄 **API Proxy**: Flexible API request proxying with CORS support
- 📁 **Static Proxy**: Support for both static file serving and HTTP service proxying
- 🌐 **Dual Mode**: Static file proxy and HTTP service proxy can be used simultaneously
- 📝 **Access Logging**: Real-time request logging and monitoring
- ⚡ **Path Validation**: Automatic path existence checking and validation
- 🛠️ **CLI Support**: Command-line interface for easy integration
- 📋 **Configuration Files**: Support for JSON configuration files

## Installation

```bash
npm install -g agent-publish-server
```

## Quick Start

### Interactive Mode

```bash
agent-publish-server
```

Follow the interactive prompts to configure your server.

### Configuration File Mode

```bash
agent-publish-server -c config.json
```

## Configuration

### Basic Configuration Example

```json
{
  "port": 3000,
  "dir": "./dist",
  "proxy": {
    "/api": {
      "target": "http://localhost:8080",
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": ""
      }
    }
  },
  "staticProxy": {
    "/assets": {
      "target": "./static",
      "type": "static"
    },
    "/app": {
      "target": "http://localhost:4000",
      "type": "http",
      "changeOrigin": true
    }
  }
}
```

### Configuration Options

#### Server Configuration

- **port**: Server port (default: 3000)
- **dir**: Static file directory (default: current directory)
- **redirect**: Root path redirect, e.g. "/app" redirects / to /app
- **proxy**: API proxy configuration
- **staticProxy**: Static proxy configuration

### Root Path Redirect

Use `redirect` to automatically redirect root path to a specified path:

```json
{
  "port": 3000,
  "redirect": "/app",
  "staticProxy": {
    "/app": {
      "target": "./dist",
      "type": "static"
    }
  }
}
```

With this config, accessing `http://localhost:3000/` will redirect to `http://localhost:3000/app`.

#### API Proxy Configuration (ProxyConfig)

```typescript
interface ProxyConfig {
  target: string; // Target server URL
  changeOrigin?: boolean; // Change origin header
  ws?: boolean; // Enable WebSocket proxy
  pathRewrite?: Record<string, string>; // Path rewriting rules
}
```

#### Static Proxy Configuration (StaticProxyConfig)

```typescript
interface StaticProxyConfig {
  target: string; // Target URL or local file path
  type?: "http" | "static"; // Proxy type: http service or static files
  changeOrigin?: boolean; // Change origin header (only effective for http type)
}
```

## Static Proxy

The static proxy feature supports two modes:

### 1. Static File Proxy

Proxy requests to local file system directories:

```json
{
  "staticProxy": {
    "/assets": {
      "target": "./dist",
      "type": "static"
    }
  }
}
```

**Access**: `http://localhost:3000/assets/index.html` → `./dist/index.html`

### 2. HTTP Service Proxy

Proxy requests to remote HTTP services:

```json
{
  "staticProxy": {
    "/app": {
      "target": "http://localhost:4000",
      "type": "http",
      "changeOrigin": true
    }
  }
}
```

**Access**: `http://localhost:3000/app/page` → `http://localhost:4000/page`

### Features

- **Dual Proxy Mode**: Static file proxy + HTTP service proxy
- **Path Validation**: Automatic checking of static file path existence
- **Automatic Path Rewriting**: Smart path processing and forwarding
- **Priority Handling**: Static proxy takes precedence over default static file serving
- **Backward Compatibility**: Fully compatible with previous versions

## Combined Usage with API Proxy

```json
{
  "port": 3000,
  "dir": "./public",
  "proxy": {
    "/api": {
      "target": "http://localhost:8080",
      "changeOrigin": true,
      "pathRewrite": {
        "^/api": ""
      }
    }
  },
  "staticProxy": {
    "/admin": {
      "target": "./admin-dist",
      "type": "static"
    },
    "/mobile": {
      "target": "http://localhost:4000",
      "type": "http",
      "changeOrigin": true
    }
  }
}
```

**Access Examples**:

- API requests: `http://localhost:3000/api/users` → `http://localhost:8080/users`
- Admin panel: `http://localhost:3000/admin/index.html` → `./admin-dist/index.html`
- Mobile app: `http://localhost:3000/mobile/page` → `http://localhost:4000/page`
- Default static: `http://localhost:3000/index.html` → `./public/index.html`

## Use Cases

- **Single Page Applications**: Serve SPA with API proxy configuration
- **Micro-frontend Architecture**: Integrate multiple frontend applications through static proxy
- **Development Environment Integration**: Unify access to multiple local services through one port
- **Static Resource Management**: Flexible static file serving and routing
- **Cross-origin Request Handling**: Solve CORS issues in development
- **Multi-service Integration**: Combine different backend services and frontend applications

## Command Line Options

```bash
agent-publish-server [options]

Options:
  -c, --config <file>    Configuration file path
  -p, --port <port>      Server port
  -d, --dir <directory>  Static file directory
  -h, --help            Display help information
  -V, --version         Display version number
```

## API

### Programmatic Usage

```javascript
const { createServer, startServer } = require("agent-publish-server");

const config = {
  port: 3000,
  dir: "./dist",
  proxy: {
    "/api": {
      target: "http://localhost:8080",
      changeOrigin: true,
    },
  },
};

const app = createServer(config);
startServer(app, config.port);
```

## Version History

- **v1.0.28**: Added proxy.ws configuration to support WebSocket upgrade proxy forwarding
- **v1.0.27**: Added 404 fallback redirect configuration (fallbackRedirect), automatically redirects unmatched routes to the specified path
- **v1.0.26**: Added root path redirect configuration (redirect), supports automatic redirect when accessing /
- **v1.0.25**: Fixed staticProxy static type not supporting SPA History route refresh, added automatic fallback to index.html
- **v1.0.24**: Fixed mobile compatibility issues, optimized HTTP response headers for consistent iOS and Android display
- **v1.0.23**: Enhanced bilingual documentation support, optimized package.json keywords for better npm exposure
- **v1.0.22**: Optimized and improved staticProxy functionality, enhanced stability
- **v1.0.18**: Enhanced staticProxy functionality, supporting both static file proxy and HTTP service proxy modes
- **v1.0.17**: Added static web proxy functionality (staticProxy), supports simultaneous use with API proxy
- **v1.0.16**: Added interactive configuration, access logging, and path validation features
- **v1.0.15**: Basic proxy and static file serving functionality

## License

MIT © [qghs](https://github.com/qg-hs)

## Contributing

Welcome to submit Issues and Pull Requests!

## Support

If you encounter any problems during use, please submit an Issue on [GitHub](https://github.com/qg-hs/agent-publish-server/issues).
