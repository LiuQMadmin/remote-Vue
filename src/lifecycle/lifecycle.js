import { patch } from '../patch/patch'
/**
 * 将render函数转成虚拟dom
 */
function mountComponent(vm) {
  vm._update(vm._render())
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
