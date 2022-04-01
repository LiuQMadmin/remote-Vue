/**
 * 重写数组的这些方法：push、shift、unshift、pop、reverse、sort、splice这些会导致数据本身发生变化的方法
 */
let oldArrayMethods = Array.prototype
// arrayMethods.__proto__ = oldArrayMethods; 实现继承
let arrayMethods = Object.create(oldArrayMethods)
const methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice']
methods.map((method) => {
  arrayMethods[method] = function () {
    // 把arguments类数组变成真正的args数组，arguments是方法传过来的数组
    let args = Array.prototype.slice.call(arguments)
    // this => value；调用Array原型链上面的方法处理
    const result = oldArrayMethods[method].apply(this, args)
    // 定义用户改变的数据
    let inserted
    // 在上面定义在this.__ob__ == value.__ob__上面的数据
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        // 3个参数， splice有删除，新增， arr.splice(0, 1, { name: 1 })
        // 只需要拿出来新增的一项{name: 1}或者是其他，从第2个取到最后,
        // 如果没有第三个参数，那就是null
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted) {
      // inserted有可能不存在，splice的第三个参数可能会不存在
      // inserted肯定是一个数组
      // 判断inserted里面数据继续添加监控
      ob.observeMethods(inserted)
    }
    // 触发在get方法里面收集的依赖
    this.deps.notify()
    // 目前是没用
    return result
  }
})
export { arrayMethods }
