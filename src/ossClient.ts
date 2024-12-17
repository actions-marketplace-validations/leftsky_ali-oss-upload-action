import * as core from '@actions/core'
import OSS from 'ali-oss'
import {getInput} from '@actions/core'

const config = {
  accessKeyId: getInput('accessKeyId'),
  accessKeySecret: getInput('accessKeySecret'),
  region: getInput('region'),
  bucket: getInput('bucket')
}

if (
  !config.accessKeyId ||
  !config.accessKeySecret ||
  !config.region ||
  !config.bucket
) {
  throw new Error('请配置accessKeyId, accessKeySecret, region, bucket')
}

const client = new OSS(config)

// 判断密钥是否正确，链接是否成功
client.listBuckets().then((res) => {
  core.info('OSS client connected successfully')
  core.info(`Bucket: ${res.buckets.map((bucket) => bucket.name).join(', ')}`)
}).catch((err) => {
  core.error('OSS client connection failed')
  throw err
})

export default client