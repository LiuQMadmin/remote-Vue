import { initMixin } from './init/index'
import { lifecycleMixin } from './lifecycle/lifecycle'
import { vnodeMixin } from './vdom/index'
import { proxyMixin } from './proxy/proxy'
/**
 * 创建Vue函数
 * @param {} options
 */
function Vue(options) {
  // 初始化
  this._init(options)
}
// 通过引入文件的方式 给vue原型上面添加方法,也算是一种全局混入的写法
initMixin(Vue)
// 挂在Vue的生命周期
lifecycleMixin(Vue)
// 把redner函数处理成虚拟dom的方法挂在到Vue上
vnodeMixin(Vue)
// 在Vue中挂在data中的数据代理到this上面
proxyMixin(Vue)
export default Vue
