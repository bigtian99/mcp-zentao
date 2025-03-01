import { ZentaoAPI } from '../api/zentaoApi';
import { Bug, BugStatus } from '../types/zentao';
import { calculateDaysDifference } from '../utils/dateUtils';

export class BugService {
    private api: ZentaoAPI;

    constructor(api: ZentaoAPI) {
        this.api = api;
    }

    async getMyBugs(status?: BugStatus): Promise<Bug[]> {
        const bugs = await this.api.getMyBugs(status);
        return bugs.map(bug => this.enrichBugData(bug));
    }

    async getBugDetail(bugId: number): Promise<Bug> {
        const bug = await this.api.getBugDetail(bugId);
        return this.enrichBugData(bug);
    }

    private enrichBugData(bug: Bug): Bug {
        const enrichedBug = { ...bug };

        // 添加严重程度标识
        const severity = bug.severity;
        if (severity >= 3) {
            enrichedBug.severity_level = '严重';
        } else if (severity >= 2) {
            enrichedBug.severity_level = '一般';
        } else {
            enrichedBug.severity_level = '轻微';
        }

        // 计算处理时间
        if (bug.openedDate) {
            const daysOpen = calculateDaysDifference(bug.openedDate);
            enrichedBug.days_open = daysOpen;

            if (daysOpen > 7) {
                enrichedBug.aging_status = '已超过7天';
                enrichedBug.aging_description = `已开启${daysOpen}天，请尽快处理`;
            } else if (daysOpen > 3) {
                enrichedBug.aging_status = '已超过3天';
                enrichedBug.aging_description = `已开启${daysOpen}天`;
            } else {
                enrichedBug.aging_status = '新建';
                enrichedBug.aging_description = '新建Bug';
            }
        }

        return enrichedBug;
    }
} 