import { initState } from '../state/index'
import { $mount } from '../ast/index'
/**
 * 初始化
 * @param {*} options
 */
function _init(options) {
  const vm = this
  vm.$options = options
  // 初始化状态
  initState(vm)
  if (vm.$options.el) {
    vm.$mount(vm.$options.el)
  }
}
// 把_init函数挂载到Vue原型上面
function initMixin(Vue) {
  Vue.prototype._init = _init
  Vue.prototype.$mount = $mount
}

export { initMixin }
