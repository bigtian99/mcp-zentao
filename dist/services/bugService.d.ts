import { ZentaoAPI } from '../api/zentaoApi';
import { Bug, BugStatus } from '../types/zentao';
export declare class BugService {
    private api;
    constructor(api: ZentaoAPI);
    getMyBugs(status?: BugStatus): Promise<Bug[]>;
    getBugDetail(bugId: number): Promise<Bug>;
    private enrichBugData;
}
