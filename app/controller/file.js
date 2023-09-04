const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
module.exports = app => {
    class FileController extends app.Controller {

        async upload() {
            const { ctx } = this;
            const stream = await ctx.getFileStream();
            // 指定上传路径
            const basePath = this.app.config.uploadLocalPath
            const baseUrl = this.app.config.uploadBaseUrl
            const dirName = 'upload_local/' + new Date().toLocaleDateString().replace(/\//g, '-');
            const randomStr = Math.random().toString(16).slice(2);
            // 文件重命名
            const filename = randomStr + path.extname(stream.filename).toLowerCase();

            const dir = path.join(basePath, dirName);
            const src = path.join(basePath, dirName, filename);

            console.log('dir, src :>> ', dir, src);

            // 判断是否存在该文件夹，不存在则创建。
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const result = await new Promise((resolve, reject) => {
                const remoteFileStream = fs.createWriteStream(src);
                stream.pipe(remoteFileStream);

                let errFlag;
                remoteFileStream.on('error', err => {
                    errFlag = true;
                    sendToWormhole(stream);
                    remoteFileStream.destroy();
                    reject(err);
                });

                remoteFileStream.on('finish', async () => {
                    if (errFlag) return;
                    resolve(filename);
                });
            });

            this.ctx.body = {
                url: `${baseUrl}/${dirName}/${result}`,
                name: stream.filename
            };
        }

        async uploadOss() {
            const ctx = this.ctx;
            const stream = await ctx.getFileStream();
            const name = 'mvp-service/' + path.basename(stream.filename);
            // 文件处理，上传到云存储等等
            let result;
            try {
                result = await ctx.oss.put(name, stream);
            } catch (err) {
                // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
                await sendToWormhole(stream);
                throw err;
            }

            ctx.body = {
                url: result.url,
                // 所有表单字段都能通过 `stream.fields` 获取到
                fields: stream.fields,
            };
        }
    }

    return FileController;
};
