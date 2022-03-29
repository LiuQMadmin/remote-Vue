/**
 * 数据代理，在render函数中可以直接访问到
 * @param {} data
 */
function proxy(data) {
  for (const key in data) {
    Object.defineProperty(this, key, {
      get() {
        return data[key]
      },
      set(newVal) {
        data[key] = newVal
      },
    })
  }
}
function proxyMixin(Vue) {
  Vue.prototype.proxy = proxy
}
export { proxyMixin }
