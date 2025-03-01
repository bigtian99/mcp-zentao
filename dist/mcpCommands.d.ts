import { BugStatus, TaskStatus, ZentaoConfig } from './types/zentao';
export declare function mcp_zentao_connect(config: ZentaoConfig): Promise<string>;
export declare function mcp_zentao_tasks(status?: TaskStatus): Promise<string>;
export declare function mcp_zentao_task(taskId: number): Promise<string>;
export declare function mcp_zentao_bugs(status?: BugStatus): Promise<string>;
export declare function mcp_zentao_bug(bugId: number): Promise<string>;
