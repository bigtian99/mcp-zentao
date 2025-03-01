export interface ZentaoConfig {
    url: string;
    username: string;
    password: string;
    apiVersion: string;
}

export interface CreateTaskRequest {
    name: string;        // 任务名称
    desc?: string;       // 任务描述
    pri?: number;        // 优先级：1-4，1最高，4最低
    estimate?: number;   // 预计工时
    project?: number;    // 所属项目ID
    execution?: number;  // 所属执行ID
    module?: number;     // 所属模块ID
    story?: number;      // 相关需求ID
    type?: string;       // 任务类型
    assignedTo?: string; // 指派给
    estStarted?: string; // 预计开始日期
    deadline?: string;   // 截止日期
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
    consumed?: number;    // 已消耗工时
    left?: number;        // 剩余工时
    status?: TaskStatus;  // 任务状态
    finishedDate?: string; // 完成日期
    comment?: string;     // 备注
}

export interface BugResolution {
    resolution: 'fixed' | 'notrepro' | 'duplicate' | 'bydesign' | 'willnotfix' | 'tostory' | 'external'; // 解决方案
    resolvedBuild?: string;  // 解决版本
    duplicateBug?: number;   // 重复Bug ID
    comment?: string;        // 备注
}

export type TaskStatus = 'wait' | 'doing' | 'done' | 'all';
export type BugStatus = 'active' | 'resolved' | 'closed' | 'all'; 