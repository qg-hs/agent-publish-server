#!/usr/bin/env node

import { Command } from 'commander';
import { loadConfig } from './config';
import { startServer } from './server';
import { CommandOptions } from './types';

const program = new Command();

program
    .version('1.0.0')
    .option('-c, --config <path>', '配置文件路径')
    .option('--cf <path>', '配置文件路径')
    .option('--config-file <path>', '配置文件路径')
    .parse(process.argv);

const options = program.opts() as CommandOptions;
const config = loadConfig(options);

startServer(config).catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
});