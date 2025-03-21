import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AgentConfig, ProxyConfig } from './types';

export function createServer(config: AgentConfig) {
  const app = express();

  // 配置静态文件服务
  app.use(express.static(config.dir || './'));

  // 配置代理
  if (config.proxy) {
    Object.entries(config.proxy).forEach(([path, proxyConfig]) => {
      app.use(path, createProxyMiddleware(proxyConfig));
    });
  }

  return app;
}

export function startServer(config: AgentConfig) {
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
}