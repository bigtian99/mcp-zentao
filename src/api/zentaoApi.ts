import axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';
import { Bug, BugStatus, CreateTaskRequest, Task, TaskStatus, ZentaoConfig } from '../types/zentao';

export interface Product {
    id: number;
    name: string;
    code: string;
    status: string;
    desc: string;
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

export class ZentaoAPI {
    private config: ZentaoConfig;
    private client: AxiosInstance;
    private token: string | null = null;

    constructor(config: ZentaoConfig) {
        this.config = config;
        this.client = axios.create({
            baseURL: `${this.config.url}/api.php/${this.config.apiVersion}`,
            timeout: 10000,
        });
    }

    private async getToken(): Promise<string> {
        if (this.token) return this.token;

        const password = createHash('md5')
            .update(this.config.password)
            .digest('hex');

        try {
            console.log('正在请求token...');
            console.log('请求URL:', `${this.config.url}/api.php/${this.config.apiVersion}/tokens`);

            const response = await this.client.post('/tokens', {
                account: this.config.username,
                password,
            });

            console.log('服务器响应:', response.data);

            if (response.status === 200 || response.status === 201) {
                if (typeof response.data === 'object' && response.data.token) {
                    this.token = response.data.token;
                    return this.token as string;
                }
                throw new Error(`获取token失败: 响应格式不正确 ${JSON.stringify(response.data)}`);
            }

            throw new Error(`获取token失败: 状态码 ${response.status}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response
                    ? `状态码: ${error.response.status}, 响应: ${JSON.stringify(error.response.data)}`
                    : error.message;
                throw new Error(`登录失败: ${errorMessage}`);
            }
            throw error;
        }
    }

    private async request<T>(method: string, url: string, params?: any, data?: any): Promise<T> {
        const token = await this.getToken();
        try {
            console.log(`正在请求 ${method} ${url}`, { params, data });
            const response = await this.client.request({
                method,
                url,
                params,
                data,
                headers: { Token: token },
            });

            console.log(`响应状态码: ${response.status}`);
            console.log('响应数据:', response.data);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('请求失败:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
                throw new Error(`请求失败: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }

    async getMyTasks(status?: TaskStatus): Promise<Task[]> {
        const params = {
            assignedTo: this.config.username,
            status: status || 'all',
        };

        const response = await this.request<{ tasks: Task[] }>('GET', '/tasks', params);
        return response.tasks;
    }

    async getTaskDetail(taskId: number): Promise<Task> {
        console.log(`正在获取任务 ${taskId} 的详情`);
        const response = await this.request<{ task: Task }>('GET', `/tasks/${taskId}`);
        console.log('任务详情响应:', response);

        if (!response) {
            throw new Error(`获取任务详情失败: 响应为空`);
        }

        // 检查响应格式
        if (response && typeof response === 'object') {
            if ('task' in response) {
                return response.task;
            } else {
                // 如果响应本身就是任务对象
                return response as unknown as Task;
            }
        }

        throw new Error(`获取任务详情失败: 响应格式不正确 ${JSON.stringify(response)}`);
    }

    async getProducts(): Promise<Product[]> {
        try {
            console.log('正在获取产品列表...');
            const response = await this.request<{ products?: Product[] }>('GET', '/products');
            console.log('产品列表响应:', response);

            if (Array.isArray(response)) {
                return response;
            } else if (response && typeof response === 'object') {
                if (Array.isArray(response.products)) {
                    return response.products;
                }
            }

            throw new Error(`获取产品列表失败: 响应格式不正确 ${JSON.stringify(response)}`);
        } catch (error) {
            console.error('获取产品列表失败:', error);
            throw error;
        }
    }

    async getMyBugs(status?: BugStatus, productId?: number): Promise<Bug[]> {
        if (!productId) {
            // 如果没有提供产品ID，获取第一个可用的产品
            const products = await this.getProducts();
            if (products.length === 0) {
                throw new Error('没有可用的产品');
            }
            productId = products[0].id;
            console.log(`使用第一个可用的产品ID: ${productId}`);
        }

        const params = {
            assignedTo: this.config.username,
            status: status || 'all',
            product: productId
        };

        try {
            console.log('正在获取Bug列表，参数:', params);
            const response = await this.request<{ bugs: Bug[] }>('GET', '/bugs', params);
            console.log('Bug列表响应:', response);

            if (Array.isArray(response)) {
                return response;
            } else if (response && typeof response === 'object' && Array.isArray(response.bugs)) {
                return response.bugs;
            }

            throw new Error(`获取Bug列表失败: 响应格式不正确 ${JSON.stringify(response)}`);
        } catch (error) {
            if (error instanceof Error && error.message.includes('Need product id')) {
                throw new Error('获取Bug列表失败: 请提供产品ID');
            }
            console.error('获取Bug列表失败:', error);
            throw error;
        }
    }

    async getBugDetail(bugId: number): Promise<Bug> {
        const response = await this.request<{ bug: Bug }>('GET', `/bugs/${bugId}`);
        return response.bug;
    }

    async updateTask(taskId: number, update: TaskUpdate): Promise<Task> {
        try {
            console.log(`正在更新任务 ${taskId}...`);
            const response = await this.request<Task>('PUT', `/tasks/${taskId}`, undefined, {
                ...update,
                assignedTo: this.config.username,
            });
            console.log('任务更新响应:', response);
            return response;
        } catch (error) {
            console.error('更新任务失败:', error);
            throw error;
        }
    }

    async finishTask(taskId: number, update: TaskUpdate = {}): Promise<Task> {
        try {
            console.log(`正在完成任务 ${taskId}...`);
            const finalUpdate: TaskUpdate = {
                status: 'done',
                finishedDate: new Date().toISOString(),
                ...update,
            };
            return await this.updateTask(taskId, finalUpdate);
        } catch (error) {
            console.error('完成任务失败:', error);
            throw error;
        }
    }

    async resolveBug(bugId: number, resolution: BugResolution): Promise<Bug> {
        try {
            console.log(`正在解决Bug ${bugId}...`);
            const response = await this.request<Bug>('PUT', `/bugs/${bugId}`, undefined, {
                status: 'resolved',
                assignedTo: this.config.username,
                ...resolution,
                resolvedDate: new Date().toISOString(),
            });
            console.log('Bug解决响应:', response);
            return response;
        } catch (error) {
            console.error('解决Bug失败:', error);
            throw error;
        }
    }

    async createTask(task: CreateTaskRequest): Promise<Task> {
        try {
            console.log('正在创建新任务...');
            if (!task.execution) {
                throw new Error('创建任务需要指定执行ID');
            }

            // 将数据转换为表单格式
            const formData = new URLSearchParams();
            Object.entries(task).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            // 在URL中添加执行ID
            const response = await this.request<Task>('POST', `/executions/${task.execution}/tasks`, undefined, formData);
            console.log('创建任务响应:', response);
            return response;
        } catch (error) {
            console.error('创建任务失败:', error);
            throw error;
        }
    }
} 