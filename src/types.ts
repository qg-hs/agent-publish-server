export interface ProxyConfig {
    target: string;
    changeOrigin?: boolean;
    pathRewrite?: Record<string, string>;
}

export interface AgentConfig {
    port?: number;
    dir?: string;
    proxy?: Record<string, ProxyConfig>;
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