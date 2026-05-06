export interface ProxyConfig {
  target: string;
  changeOrigin?: boolean;
  pathRewrite?: Record<string, string>;
  ws?: boolean; // 启用 WebSocket 代理
}

export interface StaticProxyConfig {
  target: string; // 可以是HTTP URL或本地文件路径
  type?: "http" | "static"; // 代理类型：http服务或静态文件
  changeOrigin?: boolean; // 仅在type为http时有效
}

export interface AgentConfig {
  port?: number;
  dir?: string;
  redirect?: string; // 根路径重定向，如 "/app" 表示访问 / 时重定向到 /app
  fallbackRedirect?: string; // 404兜底重定向，当路由匹配不上时重定向到指定路径
  proxy?: Record<string, ProxyConfig>;
  staticProxy?: Record<string, StaticProxyConfig>;
  log?: boolean;
}

export interface CommandOptions {
  config?: string;
  c?: string;
  cf?: string;
  configFile?: string;
  port?: string;
  dir?: string;
  writeProxy?: boolean;
  log?: string;
}
