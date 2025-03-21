#!/usr/bin/env node

import { Command } from 'commander';
import { loadConfig } from './config';
import { startServer } from './server';
import { CommandOptions } from './types';
import { writeFileSync } from 'fs';
import { join } from 'path';

const program = new Command();
const packageJson = require('../package.json');

program
    .version(packageJson.version, '-v, --version')
    .option('-c, --config <path>', '配置文件路径')
    .option('--cf <path>', '配置文件路径')
    .option('--config-file <path>', '配置文件路径')
    .option('-p, --port <number>', '服务器端口号')
    .option('-d, --dir <path>', '静态文件目录路径');

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

const options = program.opts() as CommandOptions;
const config = loadConfig(options);

if (options.port) {
    config.port = parseInt(options.port as string, 10);
}

if (options.dir) {
    config.dir = options.dir as string;
}

startServer(config).catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
});