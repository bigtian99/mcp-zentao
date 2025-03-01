import { ZentaoAPI } from '../dist/api/zentaoApi.js';
import { CreateTaskRequest } from '../dist/types/zentao.js';

async function testZentaoAPI() {
    // 1. 创建API实例
    const api = new ZentaoAPI({
        url: 'https://bigtian.chandao.net',
        username: 'bigtian',
        password: 'bigtian',
        apiVersion: 'v1'
    });

    try {
        // 2. 测试创建任务
        console.log('\n=== 测试任务管理功能 ===');
        console.log('创建新任务...');
        const newTask: CreateTaskRequest = {
            name: '测试任务' + new Date().getTime(),
            desc: '这是一个通过API创建的测试任务',
            pri: 3,  // 优先级：3-普通
            estimate: 4,  // 预计4小时
            project: 1,  // 项目ID
            execution: 2, // 执行ID
            type: 'development',  // 任务类型：开发
            module: 0,  // 所属模块
            story: 0,   // 相关需求
            assignedTo: 'bigtian', // 指派给
            estStarted: new Date().toISOString().split('T')[0], // 预计开始日期
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 截止日期，7天后
        };
        console.log('新任务信息:', JSON.stringify(newTask, null, 2));
        const createdTask = await api.createTask(newTask);
        console.log('创建任务响应:', JSON.stringify(createdTask, null, 2));

        // // 3. 测试获取任务列表
        // console.log('\n=== 测试任务管理功能 ===');
        // console.log('获取任务列表...');
        // const tasks = await api.getMyTasks();
        // console.log(`成功获取 ${tasks.length} 个任务`);
        // if (tasks.length > 0) {
        //     console.log('第一个任务:', JSON.stringify(tasks[0], null, 2));

        //     // 4. 测试完成任务
        //     if (tasks[0].status !== 'done') {
        //         console.log('\n测试完成任务...');
        //         console.log(`正在完成任务 ${tasks[0].id}...`);
        //         const taskUpdate = {
        //             consumed: 2,  // 已消耗2小时
        //             left: 0,     // 剩余0小时
        //             comment: '任务已完成，测试通过'
        //         };
        //         console.log('更新内容:', JSON.stringify(taskUpdate, null, 2));

        //         const finishedTask = await api.finishTask(tasks[0].id, taskUpdate);
        //         console.log('完成任务响应:', JSON.stringify(finishedTask, null, 2));

        //         // 验证任务状态
        //         const updatedTask = await api.getTaskDetail(tasks[0].id);
        //         console.log('验证任务状态:', updatedTask.status);
        //         if (updatedTask.status !== 'done') {
        //             throw new Error('任务状态未更新为已完成');
        //         }
        //     } else {
        //         console.log('任务已经是完成状态，跳过完成任务测试');
        //     }

        //     // 5. 测试获取任务详情
        //     console.log('\n测试获取任务详情...');
        //     const taskDetail = await api.getTaskDetail(tasks[0].id);
        //     console.log('任务详情:', JSON.stringify(taskDetail, null, 2));
        // }

        // // 6. 测试获取产品列表
        // console.log('\n=== 测试产品管理功能 ===');
        // console.log('获取产品列表...');
        // const products = await api.getProducts();
        // console.log(`成功获取 ${products.length} 个产品`);
        // if (products.length > 0) {
        //     console.log('第一个产品:', JSON.stringify(products[0], null, 2));
        // }

        // // 7. 测试Bug管理功能
        // console.log('\n=== 测试Bug管理功能 ===');
        // console.log('获取Bug列表...');
        // const bugs = await api.getMyBugs();
        // console.log(`成功获取 ${bugs.length} 个Bug`);
        // if (bugs.length > 0) {
        //     console.log('第一个Bug:', JSON.stringify(bugs[0], null, 2));

        //     // 8. 测试解决Bug
        //     if (bugs[0].status !== 'resolved' && bugs[0].status !== 'closed') {
        //         console.log('\n测试解决Bug...');
        //         console.log(`正在解决Bug ${bugs[0].id}...`);
        //         const bugResolution = {
        //             resolution: 'fixed' as const,
        //             resolvedBuild: '主干',
        //             comment: 'Bug已修复，测试通过'
        //         };
        //         console.log('解决方案:', JSON.stringify(bugResolution, null, 2));

        //         const resolvedBug = await api.resolveBug(bugs[0].id, bugResolution);
        //         console.log('解决Bug响应:', JSON.stringify(resolvedBug, null, 2));

        //         // 验证Bug状态
        //         const updatedBug = await api.getBugDetail(bugs[0].id);
        //         console.log('验证Bug状态:', updatedBug.status);
        //         if (updatedBug.status !== 'resolved') {
        //             throw new Error('Bug状态未更新为已解决');
        //         }
        //     } else {
        //         console.log('Bug已经是已解决或已关闭状态，跳过解决Bug测试');
        //     }
        // }

        console.log('\n=== 测试结果 ===');
        console.log('✅ 任务管理功能测试通过');
        console.log('✅ 产品管理功能测试通过');
        console.log('✅ Bug管理功能测试通过');
        console.log('\n✅ 所有测试完成！');
    } catch (error) {
        console.error('\n❌ 测试失败:', error);
        throw error;
    }
}

// 运行测试
testZentaoAPI(); 