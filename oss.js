import OSS from 'ali-oss';
import fs from 'fs';

// 初始化OSS客户端。请将以下参数替换为您自己的配置信息。
export class ossClient {
  client = null;
  init = (config) => {
    this.client = new OSS({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      region: config.region,
      bucket: config.bucket,
      // authorizationV4: true,
      // bucket: 'easyapi-codes', // 示例：'my-bucket-name'，填写存储空间名称。
    });
  };
  // 枚举穿透目录下所有文件，包含目录，返回一个数组
  listAllFiles = async (dir) => {
    const result = await this.client.listV2({
      prefix: dir,
      maxKeys: 1000,
    });
    console.log(result.objects);
    return result.objects;
  };
  dirExists = async (dir) => {
    const result = await this.client.listV2({
      prefix: dir,
      maxKeys: 1,
    });
    return result.objects.length;
  };
  downloadFiles = async (dir, targetDir) => {
    const objs = await this.listAllFiles(dir);
    try {
      // 填写Object完整路径和本地文件的完整路径。Object完整路径中不能包含Bucket名称。
      // 如果指定的本地文件存在会覆盖，不存在则新建。
      // 如果未指定本地路径，则下载后的文件默认保存到示例程序所属项目对应本地路径中。
      for (const obj of objs) {
        // 判断是否是目录
        if (obj.size === 0) {
          continue;
        }
        // 如果目录不存在则创建目录
        if (!fs.existsSync(obj.name.replace(dir, targetDir).replace(/[^/]*$/, ''))) {
          fs.mkdirSync(obj.name.replace(dir, targetDir).replace(/[^/]*$/, ''), {recursive: true});
        }
        // console.log('下载文件：', obj.name, '到', obj.name.replace(dir, targetDir));
        await this.client.get(obj.name, obj.name.replace(dir, targetDir));
      }
    } catch (e) {
      console.log(e);
    }
  };
  uploadFiles = async (dir, targetDir) => {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = dir + file;
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          await this.uploadFiles(filePath + '/', targetDir + file + '/');
        } else {
          // console.log('上传文件：', filePath, '到', targetDir + file);
          await this.client.put(targetDir + file, filePath);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
}

