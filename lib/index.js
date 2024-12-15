"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const ali_oss_1 = __importDefault(require("ali-oss"));
const fs_1 = __importDefault(require("fs"));
const config = {
    accessKeyId: (0, core_1.getInput)('accessKeyId'),
    accessKeySecret: (0, core_1.getInput)('accessKeySecret'),
    region: (0, core_1.getInput)('region'),
    bucket: (0, core_1.getInput)('bucket'),
};
if (!config.accessKeyId || !config.accessKeySecret || !config.region || !config.bucket) {
    throw new Error('请配置accessKeyId, accessKeySecret, region, bucket');
}
const dir = (0, core_1.getInput)('dir');
const targetOssDir = (0, core_1.getInput)('targetOssDir');
if (!dir || !targetOssDir) {
    throw new Error('请配置上传目录和目标目录');
}
const client = new ali_oss_1.default(Object.assign({}, config
// authorizationV4: true,
));
const uploadFiles = (dir, targetDir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = fs_1.default.readdirSync(dir);
        for (const file of files) {
            const filePath = dir + file;
            const stat = fs_1.default.statSync(filePath);
            if (stat.isDirectory()) {
                yield uploadFiles(filePath + '/', targetDir + file + '/');
            }
            else {
                yield client.put(targetDir + file, filePath);
            }
        }
    }
    catch (e) {
        console.log(e);
    }
});
uploadFiles(dir, targetOssDir);
