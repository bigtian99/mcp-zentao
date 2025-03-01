#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ZentaoAPI } from './api/zentaoApi.js';
import { loadConfig, saveConfig } from './config.js';
// 解析命令行参数
const args = process.argv.slice(2);
let configData = null;
// 查找 --config 参数
const configIndex = args.indexOf('--config');
if (configIndex !== -1 && configIndex + 1 < args.length) {
    try {
        // 获取 --config 后面的 JSON 字符串并解析
        const jsonStr = args[configIndex + 1];
        configData = JSON.parse(jsonStr);
        console.log('成功解析配置数据:', configData);
        // 如果配置数据中包含 config 对象，则保存配置
        if (configData.config) {
            console.log('正在保存配置...');
            saveConfig(configData.config);
        }
    }
    catch (error) {
        console.error('配置解析失败:', error);
        process.exit(1);
    }
}
// Create an MCP server
const server = new McpServer({
    name: "Zentao API",
    version: "1.0.0"
});
// Initialize ZentaoAPI instance
let zentaoApi = null;
export default async function main(params) {
    console.log('接收到的参数:', params);
    // 如果传入了配置信息，就保存它
    if (params.config) {
        console.log('保存新的配置信息...');
        saveConfig(params.config);
    }
}
// Add Zentao configuration tool
server.tool("initZentao", {}, async ({}) => {
    let config;
    // 尝试从配置文件加载配置
    const savedConfig = loadConfig();
    if (!savedConfig) {
        throw new Error("No configuration found. Please provide complete Zentao configuration.");
    }
    config = savedConfig;
    zentaoApi = new ZentaoAPI(config);
    return {
        content: [{ type: "text", text: JSON.stringify(config, null, 2) }]
    };
});
// Add getMyTasks tool
server.tool("getMyTasks", {
    status: z.enum(['wait', 'doing', 'done', 'all']).optional()
}, async ({ status }) => {
    if (!zentaoApi)
        throw new Error("Please initialize Zentao API first");
    const tasks = await zentaoApi.getMyTasks(status);
    return {
        content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }]
    };
});
// Add getTaskDetail tool
server.tool("getTaskDetail", {
    taskId: z.number()
}, async ({ taskId }) => {
    if (!zentaoApi)
        throw new Error("Please initialize Zentao API first");
    const task = await zentaoApi.getTaskDetail(taskId);
    return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }]
    };
});
// Add getProducts tool
server.tool("getProducts", {}, async () => {
    if (!zentaoApi)
        throw new Error("Please initialize Zentao API first");
    const products = await zentaoApi.getProducts();
    return {
        content: [{ type: "text", text: JSON.stringify(products, null, 2) }]
    };
});
// Add getMyBugs tool
server.tool("getMyBugs", {
    status: z.enum(['active', 'resolved', 'closed', 'all']).optional(),
    productId: z.number().optional()
}, async ({ status, productId }) => {
    if (!zentaoApi)
        throw new Error("Please initialize Zentao API first");
    const bugs = await zentaoApi.getMyBugs(status, productId);
    return {
        content: [{ type: "text", text: JSON.stringify(bugs, null, 2) }]
    };
});
// Add getBugDetail tool
server.tool("getBugDetail", {
    bugId: z.number()
}, async ({ bugId }) => {
    if (!zentaoApi)
        throw new Error("Please initialize Zentao API first");
    const bug = await zentaoApi.getBugDetail(bugId);
    return {
        content: [{ type: "text", text: JSON.stringify(bug, null, 2) }]
    };
});
// Add updateTask tool
server.tool("updateTask", {
    taskId: z.number(),
    update: z.object({
        consumed: z.number().optional(),
        left: z.number().optional(),
        status: z.enum(['wait', 'doing', 'done']).optional(),
        finishedDate: z.string().optional(),
        comment: z.string().optional()
    })
}, async ({ taskId, update }) => {
    if (!zentaoApi)
        throw new Error("Please initialize Zentao API first");
    const task = await zentaoApi.updateTask(taskId, update);
    return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }]
    };
});
// Add finishTask tool
server.tool("finishTask", {
    taskId: z.number(),
    update: z.object({
        consumed: z.number().optional(),
        left: z.number().optional(),
        comment: z.string().optional()
    }).optional()
}, async ({ taskId, update }) => {
    if (!zentaoApi)
        throw new Error("Please initialize Zentao API first");
    const task = await zentaoApi.finishTask(taskId, update);
    return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }]
    };
});
// Add resolveBug tool
server.tool("resolveBug", {
    bugId: z.number(),
    resolution: z.object({
        resolution: z.enum(['fixed', 'notrepro', 'duplicate', 'bydesign', 'willnotfix', 'tostory', 'external']),
        resolvedBuild: z.string().optional(),
        duplicateBug: z.number().optional(),
        comment: z.string().optional()
    })
}, async ({ bugId, resolution }) => {
    if (!zentaoApi)
        throw new Error("Please initialize Zentao API first");
    const bug = await zentaoApi.resolveBug(bugId, resolution);
    return {
        content: [{ type: "text", text: JSON.stringify(bug, null, 2) }]
    };
});
// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport).catch(console.error);
