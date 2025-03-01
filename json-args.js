#!/usr/bin/env node

// 获取命令行参数中的 JSON 字符串
const jsonArg = process.argv[2];

if (!jsonArg) {
    console.error('请提供 JSON 参数');
    process.exit(1);
}

try {
    // 解析 JSON 字符串
    const params = JSON.parse(jsonArg);

    // 导入并执行主程序
    import('./dist/index.js')
        .then(module => {
            module.default(params);
        })
        .catch(error => {
            console.error('执行失败:', error);
            process.exit(1);
        });
} catch (error) {
    console.error('JSON 解析失败:', error);
    process.exit(1);
} 