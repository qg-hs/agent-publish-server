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
        if (!fs.existsSync(absolutePath)) {
            console.error(`配置文件不存在: ${absolutePath}`);
            console.log('你可以通过以下方式指定配置文件路径：');
            console.log('1. 使用相对路径：agent-publish-server -c ./agent_config.json');
            console.log('2. 使用绝对路径：agent-publish-server -c /path/to/agent_config.json');
            console.log('3. 使用 agent-publish-server init 命令创建默认配置文件');
            process.exit(1);
        }

        const configContent = fs.readFileSync(absolutePath, 'utf-8');
        const userConfig = JSON.parse(configContent) as AgentConfig;
        return { ...DEFAULT_CONFIG, ...userConfig };
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error(`配置文件格式错误: ${configPath}`);
            console.error('请确保配置文件是有效的 JSON 格式');
        } else {
            console.error(`加载配置文件失败: ${(error as Error).message}`);
        }
        process.exit(1);
    }

}