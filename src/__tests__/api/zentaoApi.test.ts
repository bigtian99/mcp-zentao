/// <reference types="jest" />
import axios from 'axios';
import { ZentaoAPI } from '../../api/zentaoApi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ZentaoAPI', () => {
    const config = {
        url: 'https://bigtian.chandao.net',
        username: 'bigtian',
        password: 'bigtian',
        apiVersion: 'v1'
    };

    let api: ZentaoAPI;
    let mockAxiosInstance: any;

    beforeEach(() => {
        mockAxiosInstance = {
            post: jest.fn(),
            request: jest.fn(),
        };
        mockedAxios.create.mockReturnValue(mockAxiosInstance);
        api = new ZentaoAPI(config);
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
            mockAxiosInstance.request.mockRejectedValueOnce(
                new Error('Network error')
            );

            await expect(api.getMyTasks()).rejects.toThrow('Network error');
        });
    });

    describe('getMyBugs', () => {
        it('should fetch bugs successfully', async () => {
            // Mock products response
            const mockProducts = {
                products: [
                    { id: 1, name: 'Product 1' }
                ]
            };

            // Mock bugs response
            const mockBugs = {
                bugs: [
                    { id: 1, title: 'Bug 1', status: 'active', severity: 1 },
                    { id: 2, title: 'Bug 2', status: 'resolved', severity: 2 }
                ]
            };

            // Mock token response
            mockAxiosInstance.post.mockResolvedValueOnce({
                status: 200,
                data: { token: 'test-token' }
            });

            // Mock products request
            mockAxiosInstance.request.mockResolvedValueOnce({
                data: mockProducts
            });

            // Mock bugs request
            mockAxiosInstance.request.mockResolvedValueOnce({
                data: mockBugs
            });

            const bugs = await api.getMyBugs();
            expect(bugs).toEqual(mockBugs.bugs);
        });
    });
}); 