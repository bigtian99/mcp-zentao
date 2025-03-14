import { ZentaoAPI } from '../api/zentaoApi';
import { Task, TaskStatus } from '../types/zentao';
import { calculateRemainingDays } from '../utils/dateUtils';

export class TaskService {
    private api: ZentaoAPI;

    constructor(api: ZentaoAPI) {
        this.api = api;
    }

    async getMyTasks(status?: TaskStatus): Promise<Task[]> {
        const tasks = await this.api.getMyTasks(status);
        return tasks.map(task => this.enrichTaskData(task));
    }

    async getTaskDetail(taskId: number): Promise<Task> {
        const task = await this.api.getTaskDetail(taskId);
        return this.enrichTaskData(task);
    }

    private enrichTaskData(task: Task): Task {
        const enrichedTask = { ...task };

        // 添加优先级标识
        const priority = task.pri;
        if (priority >= 4) {
            enrichedTask.priority_level = '高';
        } else if (priority >= 2) {
            enrichedTask.priority_level = '中';
        } else {
            enrichedTask.priority_level = '低';
        }

        // 计算剩余时间
        if (task.deadline) {
            const remainingDays = calculateRemainingDays(task.deadline);
            enrichedTask.remaining_days = remainingDays;

            if (remainingDays < 0) {
                enrichedTask.status_description = '已逾期';
            } else if (remainingDays === 0) {
                enrichedTask.status_description = '今日到期';
            } else {
                enrichedTask.status_description = `还剩${remainingDays}天`;
            }
        }

        return enrichedTask;
    }
} 