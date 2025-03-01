# MCP-ZenTao 禅道API集成包

这个包提供了与禅道项目管理系统的深度集成功能，让你可以在 Node.js 项目中轻松使用禅道的任务管理、Bug跟踪等功能，而无需直接操作数据库。

## 特点

- 完整的禅道API封装
- 简单易用的接口设计
- 类型安全（TypeScript支持）
- 完善的错误处理
- 自动化的认证管理

## 与其他项目的区别

不同于通用的数据库操作工具（如 mcp-mysql-server），本项目专注于提供：

1. 禅道系统特定的业务功能
2. 高级别的API抽象
3. 完整的禅道工作流支持
4. 开箱即用的禅道集成方案

## 安装

```bash
npm install @bigtian/mcp-zentao
```

## 本地开发

1. 克隆仓库
```bash
git clone https://github.com/bigtian/mcp-zentao.git
cd mcp-zentao
```

2. 安装依赖
```bash
npm install
```

3. 运行测试
```bash
npm test
```

4. 构建项目
```bash
npm run build
```

## Docker 使用

### 使用 docker-compose（推荐）

1. 复制环境变量模板并修改配置
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的禅道系统配置
```

2. 启动服务
```bash
docker-compose up -d
```

3. 查看日志
```bash
docker-compose logs -f
```

### 手动使用 Docker

1. 构建镜像
```bash
docker build -t mcp-zentao .
```

2. 运行容器
```bash
docker run -d \
  --name mcp-zentao \
  -p 3000:3000 \
  -e ZENTAO_URL=your-zentao-url \
  -e ZENTAO_USERNAME=your-username \
  -e ZENTAO_PASSWORD=your-password \
  -e ZENTAO_API_VERSION=v1 \
  -v $(pwd)/logs:/app/logs \
  mcp-zentao
```

### 在 Cursor IDE 中配置

在 Cursor IDE 的配置文件中添加以下配置：

```json
{
  "mcpServers": {
    "zentao": {
      "url": "http://localhost:3000"
    }
  }
}
```

## 基本使用

```typescript
import { ZentaoAPI } from '@bigtian/mcp-zentao';

// 创建API实例
const api = new ZentaoAPI({
    url: 'https://your-zentao-url',  // 你的禅道系统URL
    username: 'your-username',        // 用户名
    password: 'your-password',        // 密码
    apiVersion: 'v1'                 // API版本，默认为v1
});

// 获取我的任务列表
async function getMyTasks() {
    try {
        const tasks = await api.getMyTasks();
        console.log('我的任务:', tasks);
    } catch (error) {
        console.error('获取任务失败:', error);
    }
}

// 获取我的Bug列表
async function getMyBugs() {
    try {
        const bugs = await api.getMyBugs();
        console.log('我的Bug:', bugs);
    } catch (error) {
        console.error('获取Bug失败:', error);
    }
}

// 完成任务
async function finishTask(taskId: number) {
    try {
        await api.finishTask(taskId);
        console.log('任务已完成');
    } catch (error) {
        console.error('完成任务失败:', error);
    }
}

// 解决Bug
async function resolveBug(bugId: number) {
    try {
        await api.resolveBug(bugId, {
            resolution: 'fixed',
            resolvedBuild: 'trunk',
            comment: '问题已修复'
        });
        console.log('Bug已解决');
    } catch (error) {
        console.error('解决Bug失败:', error);
    }
}
```

## API文档

### ZentaoAPI 类

#### 构造函数

```typescript
constructor(config: {
    url: string;          // 禅道系统URL
    username: string;     // 用户名
    password: string;     // 密码
    apiVersion?: string;  // API版本，默认为v1
})
```

#### 方法

1. `getMyTasks(): Promise<Task[]>`
   - 获取当前用户的任务列表
   - 返回: Promise<Task[]>

2. `getMyBugs(): Promise<Bug[]>`
   - 获取当前用户的Bug列表
   - 返回: Promise<Bug[]>

3. `finishTask(taskId: number): Promise<void>`
   - 完成指定ID的任务
   - 参数: taskId - 任务ID
   - 返回: Promise<void>

4. `resolveBug(bugId: number, resolution: BugResolution): Promise<void>`
   - 解决指定ID的Bug
   - 参数: 
     - bugId - Bug ID
     - resolution - Bug解决方案
   - 返回: Promise<void>

### 类型定义

```typescript
interface Task {
    id: number;
    name: string;
    status: string;
    pri: number;
    // ... 其他任务属性
}

interface Bug {
    id: number;
    title: string;
    status: string;
    severity: number;
    // ... 其他Bug属性
}

interface BugResolution {
    resolution: string;      // 解决方案类型
    resolvedBuild?: string; // 解决版本
    duplicateBug?: number;  // 重复Bug ID
    comment?: string;       // 备注
}
```

## 注意事项

1. 确保提供正确的禅道系统URL和API版本
2. 用户名和密码需要有相应的API访问权限
3. 所有API调用都是异步的，需要使用async/await或Promise处理
4. 错误处理建议使用try/catch进行捕获

## 开发环境

- Node.js >= 14.0.0
- TypeScript >= 4.0.0

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request！
