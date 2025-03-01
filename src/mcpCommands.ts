import { ZentaoAPI } from './api/zentaoApi';
import { BugService } from './services/bugService';
import { TaskService } from './services/taskService';
import { BugStatus, TaskStatus, ZentaoConfig } from './types/zentao';
import { formatBugDetail, formatBugsTable, formatTaskDetail, formatTasksTable } from './utils/displayUtils';

let api: ZentaoAPI | null = null;
let taskService: TaskService | null = null;
let bugService: BugService | null = null;

function initializeServices(config: ZentaoConfig) {
    api = new ZentaoAPI(config);
    taskService = new TaskService(api);
    bugService = new BugService(api);
}

export async function mcp_zentao_connect(config: ZentaoConfig): Promise<string> {
    try {
        initializeServices(config);
        await api?.getMyTasks();  // 测试连接
        return '禅道连接成功';
    } catch (error) {
        return `连接失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}

export async function mcp_zentao_tasks(status?: TaskStatus): Promise<string> {
    try {
        if (!taskService) throw new Error('请先连接禅道');
        const tasks = await taskService.getMyTasks(status);
        if (tasks.length === 0) return '没有找到任何任务';
        return formatTasksTable(tasks);
    } catch (error) {
        return `获取任务失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}

export async function mcp_zentao_task(taskId: number): Promise<string> {
    try {
        if (!taskService) throw new Error('请先连接禅道');
        const task = await taskService.getTaskDetail(taskId);
        return formatTaskDetail(task);
    } catch (error) {
        return `获取任务详情失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}

export async function mcp_zentao_bugs(status?: BugStatus): Promise<string> {
    try {
        if (!bugService) throw new Error('请先连接禅道');
        const bugs = await bugService.getMyBugs(status);
        if (bugs.length === 0) return '没有找到任何Bug';
        return formatBugsTable(bugs);
    } catch (error) {
        return `获取Bug失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
}

export async function mcp_zentao_bug(bugId: number): Promise<string> {
    try {
        if (!bugService) throw new Error('请先连接禅道');
        const bug = await bugService.getBugDetail(bugId);
        return formatBugDetail(bug);
    } catch (error) {
        return `获取Bug详情失败: ${error instanceof Error ? error.message : '未知错误'}`;
    }
} 