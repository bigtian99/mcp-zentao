import { ZentaoAPI } from '../api/zentaoApi';
import { Task, TaskStatus } from '../types/zentao';
export declare class TaskService {
    private api;
    constructor(api: ZentaoAPI);
    getMyTasks(status?: TaskStatus): Promise<Task[]>;
    getTaskDetail(taskId: number): Promise<Task>;
    private enrichTaskData;
}
