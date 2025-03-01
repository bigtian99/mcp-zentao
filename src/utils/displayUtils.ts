import chalk from 'chalk';
import { table } from 'table';
import { Bug, Task } from '../types/zentao';

const tableConfig = {
    border: {
        topBody: `─`,
        topJoin: `┬`,
        topLeft: `┌`,
        topRight: `┐`,
        bottomBody: `─`,
        bottomJoin: `┴`,
        bottomLeft: `└`,
        bottomRight: `┘`,
        bodyLeft: `│`,
        bodyRight: `│`,
        bodyJoin: `│`,
        joinBody: `─`,
        joinLeft: `├`,
        joinRight: `┤`,
        joinJoin: `┼`
    }
};

export function formatTasksTable(tasks: Task[]): string {
    const header = ['ID', '标题', '优先级', '状态', '剩余时间'];

    const rows = tasks.map(task => {
        const priorityColor = {
            '高': chalk.red,
            '中': chalk.yellow,
            '低': chalk.green
        }[task.priority_level || '低'];

        return [
            task.id.toString(),
            task.name,
            priorityColor(task.priority_level || '低'),
            task.status,
            `${task.remaining_days || '-'}天`
        ];
    });

    return table([header, ...rows], tableConfig);
}

export function formatBugsTable(bugs: Bug[]): string {
    const header = ['ID', '标题', '严重程度', '状态', '处理时间'];

    const rows = bugs.map(bug => {
        const severityColor = {
            '严重': chalk.red,
            '一般': chalk.yellow,
            '轻微': chalk.green
        }[bug.severity_level || '轻微'];

        return [
            bug.id.toString(),
            bug.title,
            severityColor(bug.severity_level || '轻微'),
            bug.status,
            bug.aging_status || '-'
        ];
    });

    return table([header, ...rows], tableConfig);
}

export function formatTaskDetail(task: Task): string {
    const lines = [
        chalk.blue.bold(`任务详情 #${task.id}`),
        `标题: ${task.name}`,
        `状态: ${task.status}`,
        `优先级: ${task.priority_level || '-'}`,
        task.status_description ? `时间状态: ${task.status_description}` : '',
        '',
        '描述:',
        task.desc || '无'
    ];

    return lines.filter(Boolean).join('\n');
}

export function formatBugDetail(bug: Bug): string {
    const lines = [
        chalk.red.bold(`Bug详情 #${bug.id}`),
        `标题: ${bug.title}`,
        `状态: ${bug.status}`,
        `严重程度: ${bug.severity_level || '-'}`,
        bug.aging_description ? `处理时间: ${bug.aging_description}` : '',
        '',
        '描述:',
        bug.steps || '无'
    ];

    return lines.filter(Boolean).join('\n');
} 