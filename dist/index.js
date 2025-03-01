import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ZentaoAPI } from './api/zentaoApi.js';
// Create an MCP server
const server = new McpServer({
    name: "Zentao API",
    version: "1.0.0"
});
// Initialize ZentaoAPI instance
let zentaoApi = null;
// Add Zentao configuration tool
server.tool("initZentao", {
    url: z.string(),
    username: z.string(),
    password: z.string(),
    apiVersion: z.string()
}, async ({ url, username, password, apiVersion }) => {
    zentaoApi = new ZentaoAPI({ url, username, password, apiVersion });
    return {
        content: [{ type: "text", text: "Zentao API initialized successfully" }]
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
