import { Bug, BugStatus, Task, TaskStatus, ZentaoConfig } from '../types/zentao';
export interface Product {
    id: number;
    name: string;
    code: string;
    status: string;
    desc: string;
}
export interface TaskUpdate {
    consumed?: number;
    left?: number;
    status?: TaskStatus;
    finishedDate?: string;
    comment?: string;
}
export interface BugResolution {
    resolution: 'fixed' | 'notrepro' | 'duplicate' | 'bydesign' | 'willnotfix' | 'tostory' | 'external';
    resolvedBuild?: string;
    duplicateBug?: number;
    comment?: string;
}
export declare class ZentaoAPI {
    private config;
    private client;
    private token;
    constructor(config: ZentaoConfig);
    private getToken;
    private request;
    getMyTasks(status?: TaskStatus): Promise<Task[]>;
    getTaskDetail(taskId: number): Promise<Task>;
    getProducts(): Promise<Product[]>;
    getMyBugs(status?: BugStatus, productId?: number): Promise<Bug[]>;
    getBugDetail(bugId: number): Promise<Bug>;
    updateTask(taskId: number, update: TaskUpdate): Promise<Task>;
    finishTask(taskId: number, update?: TaskUpdate): Promise<Task>;
    resolveBug(bugId: number, resolution: BugResolution): Promise<Bug>;
}
