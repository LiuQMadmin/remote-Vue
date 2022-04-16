import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
// import RollupPluginVue from 'rollup-plugin-vue'
export default {
  input: './main.js', // 以那个文件作为打包的入口
  output: {
    // 出口文件路径
    file: 'dist/umd/vue.js',
    name: 'Vue', // 指定打包后全局变量的名字
    format: 'umd', // 统一模块规范
    sourcemap: true, // ES6 -> ES5 开启源码调试， 可以找到源代码位置
  },
  plugins: [
    babel({
      exclude: 'node_modules/**', // 忽略这个文件下面的所有文件
    }),
    // RollupPluginVue(),
    livereload(), // 热更新 默认监听根文件夹
    process.env.ENV === 'development' // 开发环境配置这个服务
      ? serve({
          open: true,
          openPage: '/public/index.html', // 打开那个文件
          port: 3000,
          contentBase: '', // 入口html的文件位置
        })
      : null,
  ],
}
