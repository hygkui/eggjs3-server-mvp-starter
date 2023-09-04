module.exports = {
    schedule: {
        interval: '3s', // 1 分钟间隔
        type: 'worker', // 指定所有的 worker 都需要执行
    },
    async task(ctx) {
        const time = new Date()
        console.log('[当前时间] :>> ', time);
    },
};