import fs from 'fs';
import os from 'os';
import path from 'path';
// 定义配置文件路径
const CONFIG_DIR = path.join(os.homedir(), '.zentao');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
// 保存配置
export function saveConfig(config) {
    // 确保配置目录存在
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    // 写入配置文件
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
// 读取配置
export function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
            return config;
        }
    }
    catch (error) {
        console.error('读取配置文件失败:', error);
    }
    return null;
}
// 检查是否已配置
export function isConfigured() {
    return fs.existsSync(CONFIG_FILE);
}
