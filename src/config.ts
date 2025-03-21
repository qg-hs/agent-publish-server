import fs from 'fs';
import path from 'path';
import { AgentConfig, CommandOptions } from './types';

const DEFAULT_CONFIG: AgentConfig = {
    port: 8080,
    dir: './',
    proxy: {}
};

export function loadConfig(options: CommandOptions): AgentConfig {
    const configPath = options.config ||
        options.c ||
        options.cf ||
        options.configFile ||
        'agent_config.json';

    try {
        const absolutePath = path.resolve(process.cwd(), configPath);
        if (fs.existsSync(absolutePath)) {
            const configContent = fs.readFileSync(absolutePath, 'utf-8');
            const userConfig = JSON.parse(configContent) as AgentConfig;
            return { ...DEFAULT_CONFIG, ...userConfig };
        }
    } catch (error) {
        console.warn(`Failed to load config file: ${error}`);
    }

    return DEFAULT_CONFIG;
}