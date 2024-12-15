# ali-oss-upload-action

阿里云OSS上传Action

## 使用方法

要使用 GitHub 操作，您只需在工作流文件中引用它即可

```yml
name: 'My Workflow'

on:
  release:
    types: [ published ]

jobs:
  deploy:
    name: '部署到阿里云OSS'
    steps:
      - uses: leftsky/ali-oss-upload-action@v1
        with:
          dir: 你的本地目录
          targetDir: 你的阿里云OSS目录
          region: ${{ secrets.region }}
          bucket: ${{ secrets.bucket }}
          accessKeyId: ${{ secrets.accessKeyId }}
          accessKeySecret: ${{ secrets.accessKeySecret }}
```

### 参数

YAML文件不应该有密钥等敏感信息，请将它们存储在github中 ([如何将密钥存储在github中](https://docs.github.com/zh/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets))

|       Name        | Required | Default |      Description       |
|:-----------------:|:--------:|:-------:|:----------------------:|
|   `accessKeyId`   |  `true`  |   N/A   |   阿里云OSS accessKeyId   |
| `accessKeySecret` |  `true`  |   N/A   | 阿里云OSS accessKeySecret | 
|     `region`      |  `true`  |   N/A   |          指定地域          |
|     `bucket`      |  `true`  |   N/A   |        指定bucket        |
|       `dir`       |  `true`  |   N/A   |         本地文件目录         |
|    `targetDir`    |  `true`  |   N/A   |        部署文件的目录         |

## 样例

```yml
name: 'ali-oss Deploy'

on:
  push:
    branches:
      - master
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

permissions:
  contents: write
  packages: write

jobs:
  deploy:
    name: 'Deploy'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: leftsky/ali-oss-upload-action@v1
        with:
          dir: your local static path
          targetDir: your expected ali-oss path
          region: ${{ secrets.region }}
          bucket: ${{ secrets.bucket }}
          accessKeyId: ${{ secrets.accessKeyId }}
          accessKeySecret: ${{ secrets.accessKeySecret }}
```
