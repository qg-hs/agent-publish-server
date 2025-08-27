import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AgentConfig, ProxyConfig } from './types';
import path from 'path';
import fs from 'fs';

export function createServer(config: AgentConfig) {
  const app = express();
  const staticDir = config.dir || './';
  const enableLog = config.log !== false; // 默认为true

  // 检查项目路径是否存在
  const absoluteStaticDir = path.resolve(process.cwd(), staticDir);
  if (!fs.existsSync(absoluteStaticDir)) {
    throw new Error('项目路径错误');
  }

  // 添加日志中间件
  if (enableLog) {
    app.use((req, res, next) => {
      const timestamp = new Date().toISOString();
      const method = req.method;
      const url = req.url;
      const userAgent = req.get('User-Agent') || '-';
      const ip = req.ip || req.connection.remoteAddress || '-';

      console.log(`[${timestamp}] ${ip} "${method} ${url}" "${userAgent}"`);
      next();
    });
  }

  // 配置代理
  if (config.proxy) {
    Object.entries(config.proxy).forEach(([path, proxyConfig]) => {
      app.use(path, createProxyMiddleware(proxyConfig));
    });
  }

  // 配置静态文件服务
  app.use(express.static(staticDir));

  // 添加SPA应用的回退路由处理
  // 只有当实际文件不存在时才回退到index.html
  app.use((req, res, next) => {
    // 排除API和已处理的代理请求
    if (req.path.startsWith('/api/')) {
      return next();
    }

    const filePath = path.join(process.cwd(), staticDir, req.path);

    // 检查是否为目录
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      // 检查目录中是否有index.html
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }

    // 检查完整路径（如果是文件）
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }

    // 如果路径不存在，回退到index.html
    res.sendFile(path.join(process.cwd(), staticDir, 'index.html'));
  });

  return app;
}

export function startServer(config: AgentConfig) {
  try {
    const app = createServer(config);
    const port = config.port || 8080;

    return new Promise<void>((resolve, reject) => {
      try {
        app.listen(port, () => {
          console.log(`Server is running at http://localhost:${port}`);
          resolve();
        });
      } catch (error) {
        console.error('Failed to start server:', error);
        reject(error);
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(errorMessage);
    process.exit(1);
  }
}