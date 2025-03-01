export interface ZentaoConfig {
    url: string;
    username: string;
    password: string;
    apiVersion: string;
}
export interface CreateTaskRequest {
    name: string;
    desc?: string;
    pri?: number;
    estimate?: number;
    project?: number;
    execution?: number;
    module?: number;
    story?: number;
    type?: string;
    assignedTo?: string;
    estStarted?: string;
    deadline?: string;
}
export interface Task {
    id: number;
    name: string;
    status: string;
    pri: number;
    deadline?: string;
    desc?: string;
    priority_level?: '高' | '中' | '低';
    remaining_days?: number;
    status_description?: string;
}
export interface Bug {
    id: number;
    title: string;
    status: string;
    severity: number;
    steps?: string;
    openedDate?: string;
    severity_level?: '严重' | '一般' | '轻微';
    days_open?: number;
    aging_status?: string;
    aging_description?: string;
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
export type TaskStatus = 'wait' | 'doing' | 'done' | 'all';
export type BugStatus = 'active' | 'resolved' | 'closed' | 'all';
