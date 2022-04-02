/**
 * hasOwnProperty() 方法会返回一个布尔值，指示对象自身
 * 属性中是否具有指定的属性（也就是，是否有指定的键）。
 */
function hasOwn(obj, key) {
  // 下面两种写法都可以
  // return obj.hasOwnProperty(key)
  return Object.prototype.hasOwnProperty.call(obj, key)
}
/**
 * 定义一个空函数
 */
function noop() {}
/**
 * 改变this指向
 */
function bind(fn, ctx) {
  return fn.bind(ctx)
}
/**
 * 初始化methods
 */
function initMethods(vm) {
  var props = vm.$options.props
  var methods = vm.$options.methods
  //循环 methods 事件对象
  for (var key in methods) {
    //判断key是否是改对象实例化的
    //如果属性中定义了key，则在methods中不能定义同样的key
    if (props && hasOwn(props, key)) {
      warn('Method "' + key + '" has already been defined as a prop.', vm)
    }
    //isReserved 检查一个字符串是否以$或者_开头的字母
    if (key in vm && isReserved(key)) {
      //事件不能以$或者_开头的字母
      warn(
        'Method "' +
          key +
          '" conflicts with an existing Vue instance method. ' +
          'Avoid defining component methods that start with _ or $.'
      )
    }
    //把事件放在最外层对象中，如果是函数为空则给一个空函数，如果是有函数则执行改函数
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm)
  }
}

export { initMethods }
