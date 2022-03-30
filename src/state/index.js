import { observe } from '../observe/index'
function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}
// 初始化data里面的数据
function initData(vm) {
  let data = vm.$options.data
  // data.call(vm)是可以在data函数里面使用this
  data = typeof data === 'function' ? data.call(vm) : data
  // 让用户方便使用使用，把data挂载到vm的$data上面
  vm.$data = data
  // 进行数据双向绑定
  // Object.definedProtoType()给属性增加get和set方法
  observe(data)
  // 把data里面的key->value代理到this上面去，通过this[key]可以直接访问到
  vm.proxy(data)
}
export { initState }
