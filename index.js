import {getInput} from "@actions/core";
import OSS from "ali-oss";
import fs from "fs";

const config = {
  accessKeyId: getInput('accessKeyId'),
  accessKeySecret: getInput('accessKeySecret'),
  region: getInput('region'),
  bucket: getInput('bucket'),
}

if (!config.accessKeyId || !config.accessKeySecret || !config.region || !config.bucket) {
  throw new Error('请配置accessKeyId, accessKeySecret, region, bucket');
}

const dir = getInput('dir');
const targetOssDir = getInput('targetOssDir');
if (!dir || !targetOssDir) {
  throw new Error('请配置上传目录和目标目录');
}

const client = new OSS({
  ...config
  // authorizationV4: true,
})


const uploadFiles = async (dir, targetDir) => {
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = dir + file;
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        await uploadFiles(filePath + '/', targetDir + file + '/');
      } else {
        await client.put(targetDir + file, filePath);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

await uploadFiles(dir, targetOssDir)

