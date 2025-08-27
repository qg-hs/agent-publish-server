#!/usr/bin/env node

import { Command } from 'commander';
import { loadConfig } from './config';
import { startServer } from './server';
import { CommandOptions, AgentConfig } from './types';
import { writeFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

// 交互式配置函数
async function interactiveWriteProxyConfig(): Promise<AgentConfig> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const question = (prompt: string): Promise<string> => {
        return new Promise((resolve) => {
            rl.question(prompt, resolve);
        });
    };

    try {
        // 询问端口号
        const portInput = await question('请输入端口号: ');
        const port = parseInt(portInput.trim(), 10);
        if (isNaN(port) || port <= 0 || port > 65535) {
            throw new Error('无效的端口号，请输入1-65535之间的数字');
        }

        // 询问项目地址
        const dirInput = await question('请输入项目地址（打包后）: ');
        const dir = dirInput.trim() || './';

        const config: AgentConfig = {
            port,
            dir,
            proxy: {},
            log: true // 默认启用日志
        };

        // 循环添加代理配置
        while (true) {
            const proxyInput = await question('请输入代理接口（格式例如：/api:http://localhost:3000）: ');
            const proxyStr = proxyInput.trim();

            if (proxyStr) {
                const parts = proxyStr.split(':');
                if (parts.length < 2) {
                    console.log('格式错误，请按照 /api:http://localhost:3000 的格式输入');
                    continue;
                }

                const path = parts[0].trim();
                const target = parts.slice(1).join(':'); // 处理URL中的冒号

                if (!path.startsWith('/')) {
                    console.log('代理路径必须以 / 开头');
                    continue;
                }

                if (!target.startsWith('http://') && !target.startsWith('https://')) {
                    console.log('代理目标地址必须是完整的URL（以http://或https://开头）');
                    continue;
                }

                config.proxy![path] = {
                    target: target,
                    changeOrigin: true,
                    pathRewrite: {
                        [`^${path}`]: ''
                    }
                };

                console.log(`✓ 已添加代理：${path} -> ${target}`);
            }

            const continueInput = await question('是否继续添加代理接口：1：继续，0：结束: ');
            if (continueInput.trim() === '0') {
                break;
            } else if (continueInput.trim() !== '1') {
                console.log('请输入 1 继续或 0 结束');
                continue;
            }
        }

        return config;
    } finally {
        rl.close();
    }
}

const program = new Command();
const packageJson = require('../package.json');

program
    .version(packageJson.version, '-v, --version')
    .option('-c, --config <path>', '配置文件路径')
    .option('--cf <path>', '配置文件路径')
    .option('--config-file <path>', '配置文件路径')
    .option('-p, --port <number>', '服务器端口号')
    .option('-d, --dir <path>', '静态文件目录路径')
    .option('-wp, --write-proxy', '交互式配置代理服务')
    .option('--log <boolean>', '是否显示访问日志 (true/false)，默认为true');

// 添加一个默认命令，用于处理没有指定任何子命令的情况
program
    .action(async () => {
        const options = program.opts() as CommandOptions;

        // 检查是否使用 -wp 选项
        if (options.writeProxy) {
            try {
                console.log('✨ 欢迎使用交互式代理配置\n');

                // 交互式配置
                const config = await interactiveWriteProxyConfig();

                const configPath = join(process.cwd(), 'agent_config.json');
                writeFileSync(configPath, JSON.stringify(config, null, 2));

                console.log('\n✓ 已配置完成，请运行：agent-publish-server -c ./agent_config.json');
                process.exit(0);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error('\n✗ 配置失败:', errorMessage);
                process.exit(1);
            }
        }

        // 加载配置
        const config = loadConfig(options);

        // 命令行参数优先级高于配置文件
        if (options.port) {
            const port = parseInt(options.port as string, 10);
            if (isNaN(port)) {
                console.error('端口号必须是有效的数字');
                process.exit(1);
            }
            config.port = port;
        }

        if (options.dir) {
            config.dir = options.dir as string;
        }

        // 处理日志参数
        if (options.log !== undefined) {
            const logValue = options.log.toLowerCase();
            if (logValue === 'true') {
                config.log = true;
            } else if (logValue === 'false') {
                config.log = false;
            } else {
                console.error('日志参数必须是 true 或 false');
                process.exit(1);
            }
        }

        // 启动服务器
        startServer(config).catch((error) => {
            console.error('Server failed to start:', error);
            process.exit(1);
        });
    });

program
    .command('init')
    .description('初始化配置文件')
    .action(() => {
        const defaultConfig = {
            port: 8080,
            dir: './',
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': ''
                    }
                }
            }
        };

        const configPath = join(process.cwd(), 'agent_config.json');
        writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        console.log('配置文件已创建：agent_config.json');
        process.exit(0);
    });

program.parse(process.argv);