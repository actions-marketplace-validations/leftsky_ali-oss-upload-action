import fs from 'fs'
import client from './ossClient'
import * as core from '@actions/core'

export async function deployToOss(localPath: string, targetPath: string): Promise<any[]> {
  const docs = fs.readdirSync(localPath)
  for (const doc of docs) {
    const _src = `${localPath}/${doc}`
    const _dist = `${targetPath}/${doc}`
    const st = fs.statSync(_src)
    if (st.isFile()) {
      await putOSS(_dist, _src)
    } else if (st.isDirectory()) {
      await deployToOss(_src, _dist)
    } else {
      core.warning(`文件类型错误: ${_src}`)
    }
  }
  return []
}


/**
 * 上传文件到 OSS
 * @param {string} uploadPath 表示上传到 OSS 的 Object 名称
 * @param {string} localFilePath 本地文件夹或者文件路径
 * @param {number} tryTime 重试次数
 */
async function putOSS(uploadPath: string, localFilePath: string, tryTime: number = 1): Promise<string> {
  try {
    const result = await client.put(uploadPath, localFilePath)
    core.info(`${new Date().toLocaleString()}>>>${uploadPath} uploaded successfully`)
    return result
  } catch (err) {
    if (tryTime >= 3) {
      throw new Error(`${localFilePath} upload failed after ${tryTime} attempts`)
    }
    core.warning(`${localFilePath} upload attempt ${tryTime} failed, retrying...`)
    return putOSS(uploadPath, localFilePath, tryTime + 1)
  }
}
