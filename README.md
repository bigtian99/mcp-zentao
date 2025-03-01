# MCP 禅道扩展

这是一个基于 MCP (My Coding Partner) 的禅道任务管理助手，帮助你快速获取和管理禅道中的个人任务和Bug。

## 安装

```bash
npm install @bigtian/mcp-zentao
```

## 配置

在使用之前，需要先连接到禅道：

```typescript
import { ZentaoAPI } from '@bigtian/mcp-zentao';

const api = new ZentaoAPI({
  baseURL: 'http://your-zentao-url',
  account: 'your-username',
  password: 'your-password',
  version: '18.12' // 禅道版本
});
```

## 使用方法

### 1. 查看任务列表

```typescript
const tasks = await api.getMyTasks();
console.log('我的任务列表:', tasks);
```

### 2. 查看任务详情

```typescript
const taskDetail = await api.getTaskDetail(taskId);
console.log('任务详情:', taskDetail);
```

### 3. 完成任务

```typescript
await api.finishTask(taskId, {
  consumed: 2, // 消耗工时
  left: 0,    // 剩余工时
  comment: '任务已完成' // 备注信息
});
```

### 4. 查看产品列表

```typescript
const products = await api.getProducts();
console.log('产品列表:', products);
```

### 5. 查看Bug列表

```typescript
const bugs = await api.getMyBugs();
console.log('我的Bug列表:', bugs);
```

### 6. 解决Bug

```typescript
await api.resolveBug(bugId, {
  resolution: 'fixed',           // 解决方案
  resolvedBuild: '主干',         // 解决版本
  comment: 'Bug已修复，测试通过'  // 备注信息
});
```

## 功能特性

1. 任务管理
   - 获取个人待处理任务列表
   - 查看任务详细信息
   - 完成任务
   - 更新任务状态
   - 记录工时

2. Bug管理
   - 获取个人待处理Bug列表
   - 查看Bug详细信息
   - 解决Bug
   - 更新Bug状态

3. 产品管理
   - 查看产品列表
   - 产品信息查询

## 注意事项

1. 请确保禅道API访问权限正确配置
2. 密码等敏感信息建议使用环境变量管理
3. 所有API调用都有错误处理和日志记录

## 开发计划

1. Phase 1: 基础功能 ✅
   - [x] 任务和Bug查看
   - [x] 完成任务
   - [x] 更新任务状态
   - [x] 记录工时
   - [x] 产品管理

2. Phase 2: 功能优化 🚀
   - [ ] 项目管理
   - [ ] 需求管理
   - [ ] 测试用例管理
   - [ ] 文档管理

3. Phase 3: 高级功能 🎯
   - [ ] 团队协作
   - [ ] 统计报表
   - [ ] 自动化工作流
   - [ ] 通知提醒

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可

MIT License
