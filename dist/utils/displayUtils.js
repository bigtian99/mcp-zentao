"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTasksTable = formatTasksTable;
exports.formatBugsTable = formatBugsTable;
exports.formatTaskDetail = formatTaskDetail;
exports.formatBugDetail = formatBugDetail;
const chalk_1 = __importDefault(require("chalk"));
const table_1 = require("table");
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
function formatTasksTable(tasks) {
    const header = ['ID', '标题', '优先级', '状态', '剩余时间'];
    const rows = tasks.map(task => {
        const priorityColor = {
            '高': chalk_1.default.red,
            '中': chalk_1.default.yellow,
            '低': chalk_1.default.green
        }[task.priority_level || '低'];
        return [
            task.id.toString(),
            task.name,
            priorityColor(task.priority_level || '低'),
            task.status,
            `${task.remaining_days || '-'}天`
        ];
    });
    return (0, table_1.table)([header, ...rows], tableConfig);
}
function formatBugsTable(bugs) {
    const header = ['ID', '标题', '严重程度', '状态', '处理时间'];
    const rows = bugs.map(bug => {
        const severityColor = {
            '严重': chalk_1.default.red,
            '一般': chalk_1.default.yellow,
            '轻微': chalk_1.default.green
        }[bug.severity_level || '轻微'];
        return [
            bug.id.toString(),
            bug.title,
            severityColor(bug.severity_level || '轻微'),
            bug.status,
            bug.aging_status || '-'
        ];
    });
    return (0, table_1.table)([header, ...rows], tableConfig);
}
function formatTaskDetail(task) {
    const lines = [
        chalk_1.default.blue.bold(`任务详情 #${task.id}`),
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
function formatBugDetail(bug) {
    const lines = [
        chalk_1.default.red.bold(`Bug详情 #${bug.id}`),
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
