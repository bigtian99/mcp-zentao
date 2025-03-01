"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jest" />
const axios_1 = __importDefault(require("axios"));
const zentaoApi_1 = require("../../api/zentaoApi");
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('ZentaoAPI', () => {
    const config = {
        url: 'https://bigtian.chandao.net',
        username: 'bigtian',
        password: 'bigtian',
        apiVersion: 'v1'
    };
    let api;
    let mockAxiosInstance;
    beforeEach(() => {
        mockAxiosInstance = {
            post: jest.fn(),
            request: jest.fn(),
        };
        mockedAxios.create.mockReturnValue(mockAxiosInstance);
        api = new zentaoApi_1.ZentaoAPI(config);
    });
    describe('getMyTasks', () => {
        it('should fetch tasks successfully', async () => {
            const mockTasks = {
                tasks: [
                    { id: 1, name: 'Task 1', status: 'doing', pri: 1 },
                    { id: 2, name: 'Task 2', status: 'wait', pri: 2 }
                ]
            };
            mockAxiosInstance.post.mockResolvedValueOnce({
                status: 200,
                data: { token: 'test-token' }
            });
            mockAxiosInstance.request.mockResolvedValueOnce({
                data: mockTasks
            });
            const tasks = await api.getMyTasks();
            expect(tasks).toEqual(mockTasks.tasks);
        });
        it('should handle error when fetching tasks', async () => {
            mockAxiosInstance.post.mockResolvedValueOnce({
                status: 200,
                data: { token: 'test-token' }
            });
            mockAxiosInstance.request.mockRejectedValueOnce(new Error('Network error'));
            await expect(api.getMyTasks()).rejects.toThrow('Network error');
        });
    });
    describe('getMyBugs', () => {
        it('should fetch bugs successfully', async () => {
            const mockBugs = {
                bugs: [
                    { id: 1, title: 'Bug 1', status: 'active', severity: 1 },
                    { id: 2, title: 'Bug 2', status: 'resolved', severity: 2 }
                ]
            };
            mockAxiosInstance.post.mockResolvedValueOnce({
                status: 200,
                data: { token: 'test-token' }
            });
            mockAxiosInstance.request.mockResolvedValueOnce({
                data: mockBugs
            });
            const bugs = await api.getMyBugs();
            expect(bugs).toEqual(mockBugs.bugs);
        });
    });
});
