"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcp_zentao_connect = mcp_zentao_connect;
exports.mcp_zentao_tasks = mcp_zentao_tasks;
exports.mcp_zentao_task = mcp_zentao_task;
exports.mcp_zentao_bugs = mcp_zentao_bugs;
exports.mcp_zentao_bug = mcp_zentao_bug;
const zentaoApi_1 = require("./api/zentaoApi");
const bugService_1 = require("./services/bugService");
const taskService_1 = require("./services/taskService");
const displayUtils_1 = require("./utils/displayUtils");
let api = null;
let taskService = null;
let bugService = null;
function initializeServices(config) {
    api = new zentaoApi_1.ZentaoAPI(config);
    taskService = new taskService_1.TaskService(api);
    bugService = new bugService_1.BugService(api);
}
async function mcp_zentao_connect(config) {
    try {
        initializeServices(config);
        await (api === null || api === void 0 ? void 0 : api.getMyTasks()); // 测试连接
        return '禅道连接成功';
    }
    catch (error) {
        return `连接失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}
async function mcp_zentao_tasks(status) {
    try {
        if (!taskService)
            throw new Error('请先连接禅道');
        const tasks = await taskService.getMyTasks(status);
        if (tasks.length === 0)
            return '没有找到任何任务';
        return (0, displayUtils_1.formatTasksTable)(tasks);
    }
    catch (error) {
        return `获取任务失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}
async function mcp_zentao_task(taskId) {
    try {
        if (!taskService)
            throw new Error('请先连接禅道');
        const task = await taskService.getTaskDetail(taskId);
        return (0, displayUtils_1.formatTaskDetail)(task);
    }
    catch (error) {
        return `获取任务详情失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}
async function mcp_zentao_bugs(status) {
    try {
        if (!bugService)
            throw new Error('请先连接禅道');
        const bugs = await bugService.getMyBugs(status);
        if (bugs.length === 0)
            return '没有找到任何Bug';
        return (0, displayUtils_1.formatBugsTable)(bugs);
    }
    catch (error) {
        return `获取Bug失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}
async function mcp_zentao_bug(bugId) {
    try {
        if (!bugService)
            throw new Error('请先连接禅道');
        const bug = await bugService.getBugDetail(bugId);
        return (0, displayUtils_1.formatBugDetail)(bug);
    }
    catch (error) {
        return `获取Bug详情失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}
