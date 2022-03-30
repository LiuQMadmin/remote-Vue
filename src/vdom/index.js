import { createElement, createTextVnode } from './vnode'
/**
 * 这里方法必须要挂载到Vue上面，因为在执行with方法的时候
 * 传入的this就是Vue实例，这些方法就可以被读取到
 */
function vnodeMixin(Vue) {
  // Vue上面挂载商城dom元素的_c()方法
  Vue.prototype._c = function () {
    return createElement(...arguments)
  }
  // Vue上面挂载{{ name }} 的方法_s()
  Vue.prototype._s = function (value) {
    // 这里的value被data里面数据代理过
    if (value === null) return
    return typeof value === 'object' ? JSON.stringify(value) : value
  }
  // Vue上面挂载处理文本的函数_v()
  Vue.prototype._v = function (text) {
    return createTextVnode(text)
  }
  // 处理v-for的函数
  Vue.prototype._l = renderList
  // Vue上面挂载把render处理成vnode的方法_render
  Vue.prototype._render = function () {
    const vm = this
    const render = vm.$options.render
    // 改变函数调用的this指向，这样爱会调用到Vue原型上面的方法_c(),_s(),_v()
    // 如果不改变this指向，render函数里面的this会指向window
    const vnode = render.call(vm)
    return vnode
  }
}
// 处理v-for的函数
function renderList(val, renderFun) {
  let ret = []
  if (Array.isArray(val) || typeof val === 'string') {
    // val是数组或者字符串时
    val.map((item, index) => {
      //循环数组或者字符串
      ret[index] = renderFun(item, index)
    })
  }
  //返回一个空数组对象
  return ret
}
export { vnodeMixin }
