import fs from 'fs';
import path from 'path';
import { AgentConfig, CommandOptions } from './types';

const DEFAULT_CONFIG: AgentConfig = {
    port: 8080,
    dir: './',
    proxy: {}
};

export function loadConfig(options: CommandOptions): AgentConfig {
    // 尝试多个可能的配置文件路径
    const configPaths = [
        options.config || '',
        options.c || '',
        options.cf || '',
        options.configFile || '',
        'agent_config.json',
        '.agent_config.json',
        'agent.config.json'
    ].filter(Boolean);

    let configPath = '';
    let absolutePath = '';

    try {
        // 遍历所有可能的配置文件路径
        for (const cfgPath of configPaths) {
            if (path.isAbsolute(cfgPath)) {
                // 如果是绝对路径，直接检查文件是否存在
                if (fs.existsSync(cfgPath)) {
                    absolutePath = cfgPath;
                    configPath = cfgPath;
                    break;
                }
            } else if (cfgPath) {
                // 如果是相对路径，尝试多个可能的路径
                const possiblePaths = [
                    path.resolve(process.cwd(), cfgPath),
                    path.resolve(__dirname, cfgPath)
                ];

                for (const p of possiblePaths) {
                    if (fs.existsSync(p)) {
                        absolutePath = p;
                        configPath = cfgPath;
                        break;
                    }
                }

                if (absolutePath) break;
            }
        }

        if (!absolutePath) {
            console.error('未找到配置文件');
            console.log('你可以通过以下方式指定配置文件：');
            console.log('1. 使用相对路径：agent-publish-server -c ./agent_config.json');
            console.log('2. 使用绝对路径：agent-publish-server -c /path/to/agent_config.json');
            console.log('3. 使用 agent-publish-server init 命令创建默认配置文件');
            console.log('4. 在当前目录创建以下任一文件：');
            console.log('   - agent_config.json');
            console.log('   - .agent_config.json');
            console.log('   - agent.config.json');
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