import { patch } from '../patch/patch.js'
/**
 * 将render函数转成虚拟dom
 */
function mountComponent(vm) {
  if (vm.$options.template) {
    vm.$options.vnode = vm._render()
  } else {
    vm._update(vm._render())
  }
}
/**
 * Vue挂载生命周期
 */
function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    patch(vm, vnode)
  }
}
export { mountComponent, lifecycleMixin }
