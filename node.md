### rollup 配置过程

1. npm install rollup --global 全局安装 rollup
2. npm init -y 初始化 package.json
3. npm install -D @babel/core @babel/preset-env rollup-plugin-babel rollup-plugin-serve cross-env
   @babel/core + @babel/preset-env -> ES6 或更高转 ES5
   rollup-plugin-babel -> 在 rollup 里面使用 babel
   rollup-plugin-serve -> 启动一个本地静态服务
   cross-env -> 环境变量设置
