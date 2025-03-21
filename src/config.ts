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
        // 处理配置文件路径
        let absolutePath = '';
        if (path.isAbsolute(configPath)) {
            // 如果是绝对路径，直接使用
            absolutePath = configPath;
        } else {
            // 如果是相对路径，尝试多个可能的路径
            const possiblePaths = [
                path.resolve(process.cwd(), configPath), // 相对于当前工作目录
                path.resolve(__dirname, configPath), // 相对于脚本所在目录
            ];

            for (const p of possiblePaths) {
                if (fs.existsSync(p)) {
                    absolutePath = p;
                    break;
                }
            }
        }

        if (!absolutePath) {
            console.error(`配置文件不存在: ${configPath}`);
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