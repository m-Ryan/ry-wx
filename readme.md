# 基于gulp构建微信小程序

> 基本原理：
  - ts => js
  - sass => wxss
  - 其他资源拷贝过去
  - node_modules中的依赖打包到 npm目录，并处理好依赖的路径
  - 增量更新，只修改改变的文件
