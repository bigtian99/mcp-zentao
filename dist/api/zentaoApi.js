"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZentaoAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
class ZentaoAPI {
    constructor(config) {
        this.token = null;
        this.config = config;
        this.client = axios_1.default.create({
            baseURL: `${this.config.url}/api.php/${this.config.apiVersion}`,
            timeout: 10000,
        });
    }
    async getToken() {
        if (this.token)
            return this.token;
        const password = (0, crypto_1.createHash)('md5')
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
                    return this.token;
                }
                throw new Error(`获取token失败: 响应格式不正确 ${JSON.stringify(response.data)}`);
            }
            throw new Error(`获取token失败: 状态码 ${response.status}`);
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                const errorMessage = error.response
                    ? `状态码: ${error.response.status}, 响应: ${JSON.stringify(error.response.data)}`
                    : error.message;
                throw new Error(`登录失败: ${errorMessage}`);
            }
            throw error;
        }
    }
    async request(method, url, params, data) {
        var _a, _b, _c, _d;
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
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error('请求失败:', {
                    status: (_a = error.response) === null || _a === void 0 ? void 0 : _a.status,
                    data: (_b = error.response) === null || _b === void 0 ? void 0 : _b.data,
                    message: error.message
                });
                throw new Error(`请求失败: ${((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || error.message}`);
            }
            throw error;
        }
    }
    async getMyTasks(status) {
        const params = {
            assignedTo: this.config.username,
            status: status || 'all',
        };
        const response = await this.request('GET', '/tasks', params);
        return response.tasks;
    }
    async getTaskDetail(taskId) {
        console.log(`正在获取任务 ${taskId} 的详情`);
        const response = await this.request('GET', `/tasks/${taskId}`);
        console.log('任务详情响应:', response);
        if (!response) {
            throw new Error(`获取任务详情失败: 响应为空`);
        }
        // 检查响应格式
        if (response && typeof response === 'object') {
            if ('task' in response) {
                return response.task;
            }
            else {
                // 如果响应本身就是任务对象
                return response;
            }
        }
        throw new Error(`获取任务详情失败: 响应格式不正确 ${JSON.stringify(response)}`);
    }
    async getProducts() {
        try {
            console.log('正在获取产品列表...');
            const response = await this.request('GET', '/products');
            console.log('产品列表响应:', response);
            if (Array.isArray(response)) {
                return response;
            }
            else if (response && typeof response === 'object') {
                if (Array.isArray(response.products)) {
                    return response.products;
                }
            }
            throw new Error(`获取产品列表失败: 响应格式不正确 ${JSON.stringify(response)}`);
        }
        catch (error) {
            console.error('获取产品列表失败:', error);
            throw error;
        }
    }
    async getMyBugs(status, productId) {
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
            const response = await this.request('GET', '/bugs', params);
            console.log('Bug列表响应:', response);
            if (Array.isArray(response)) {
                return response;
            }
            else if (response && typeof response === 'object' && Array.isArray(response.bugs)) {
                return response.bugs;
            }
            throw new Error(`获取Bug列表失败: 响应格式不正确 ${JSON.stringify(response)}`);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('Need product id')) {
                throw new Error('获取Bug列表失败: 请提供产品ID');
            }
            console.error('获取Bug列表失败:', error);
            throw error;
        }
    }
    async getBugDetail(bugId) {
        const response = await this.request('GET', `/bugs/${bugId}`);
        return response.bug;
    }
    async updateTask(taskId, update) {
        try {
            console.log(`正在更新任务 ${taskId}...`);
            const response = await this.request('PUT', `/tasks/${taskId}`, undefined, {
                ...update,
                assignedTo: this.config.username,
            });
            console.log('任务更新响应:', response);
            return response;
        }
        catch (error) {
            console.error('更新任务失败:', error);
            throw error;
        }
    }
    async finishTask(taskId, update = {}) {
        try {
            console.log(`正在完成任务 ${taskId}...`);
            const finalUpdate = {
                status: 'done',
                finishedDate: new Date().toISOString(),
                ...update,
            };
            return await this.updateTask(taskId, finalUpdate);
        }
        catch (error) {
            console.error('完成任务失败:', error);
            throw error;
        }
    }
    async resolveBug(bugId, resolution) {
        try {
            console.log(`正在解决Bug ${bugId}...`);
            const response = await this.request('PUT', `/bugs/${bugId}`, undefined, {
                status: 'resolved',
                assignedTo: this.config.username,
                ...resolution,
                resolvedDate: new Date().toISOString(),
            });
            console.log('Bug解决响应:', response);
            return response;
        }
        catch (error) {
            console.error('解决Bug失败:', error);
            throw error;
        }
    }
}
exports.ZentaoAPI = ZentaoAPI;
