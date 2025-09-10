import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AgentConfig, ProxyConfig, StaticProxyConfig } from './types';
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

  // 配置API代理
  if (config.proxy) {
    Object.entries(config.proxy).forEach(([path, proxyConfig]) => {
      app.use(path, createProxyMiddleware(proxyConfig));
    });
  }

  // 配置静态网页代理
  if (config.staticProxy) {
    Object.entries(config.staticProxy).forEach(([proxyPath, staticProxyConfig]) => {
      const proxyType = staticProxyConfig.type || 'http'; // 默认为http类型
      
      if (proxyType === 'static') {
        // 静态文件代理
        const staticPath = path.resolve(process.cwd(), staticProxyConfig.target);
        if (!fs.existsSync(staticPath)) {
          console.warn(`Warning: Static proxy path does not exist: ${staticPath}`);
          return;
        }
        app.use(proxyPath, express.static(staticPath, {
          setHeaders: (res, filePath, stat) => {
            // 设置通用响应头，提升移动端兼容性
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            
            // 针对HTML文件设置移动端优化响应头
            if (filePath.endsWith('.html')) {
              res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
              res.setHeader('Pragma', 'no-cache');
              res.setHeader('Expires', '0');
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
            }
            
            // 针对CSS文件确保正确的Content-Type
            if (filePath.endsWith('.css')) {
              res.setHeader('Content-Type', 'text/css; charset=utf-8');
            }
            
            // 针对JS文件确保正确的Content-Type
            if (filePath.endsWith('.js')) {
              res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            }
            
            // 针对图片文件设置适当的缓存
            if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
              res.setHeader('Cache-Control', 'public, max-age=31536000');
            }
          }
        }));
      } else {
        // HTTP服务代理
        app.use(proxyPath, createProxyMiddleware({
          target: staticProxyConfig.target,
          changeOrigin: staticProxyConfig.changeOrigin !== false, // 默认为true
          pathRewrite: {
            [`^${proxyPath}`]: '' // 移除代理路径前缀
          }
        }));
      }
    });
  }

  // 配置静态文件服务，添加移动端兼容性响应头
  app.use(express.static(staticDir, {
    setHeaders: (res, filePath, stat) => {
      // 设置通用响应头，提升移动端兼容性
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      
      // 针对HTML文件设置移动端优化响应头
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        // 确保正确的Content-Type
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
      }
      
      // 针对CSS文件确保正确的Content-Type
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
      
      // 针对JS文件确保正确的Content-Type
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      }
      
      // 针对图片文件设置适当的缓存
      if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  }));
  
  // 添加移动端兼容性中间件
  app.use((req, res, next) => {
    // 检测移动端User-Agent并设置相应响应头
    const userAgent = req.get('User-Agent') || '';
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    if (isMobile) {
      // 为移动端设置额外的响应头
      res.setHeader('Vary', 'User-Agent');
    }
    
    next();
  });

  // 添加SPA应用的回退路由处理
  // 只有当实际文件不存在时才回退到index.html
  app.use((req, res, next) => {
    // 排除API和已处理的代理请求
    if (req.path.startsWith('/api/')) {
      return next();
    }

    // 排除静态代理路径
    if (config.staticProxy) {
      for (const proxyPath of Object.keys(config.staticProxy)) {
        if (req.path.startsWith(proxyPath)) {
          return next();
        }
      }
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