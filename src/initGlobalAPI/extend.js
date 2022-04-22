function extend(extendOptions) {
  let Super = this
  let SuperId = Super.cid
  //组件构造函数
  var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
  //获取组件的name
  var name = extendOptions.name
  //实例化 组件 对象
  var Sub = function VueComponent() {
    // vue中的_init 函数   Vue.prototype._init
    this._init(extendOptions)
  }
  //创建一个对象 继承 超类的原型
  Sub.prototype = Object.create(Super.prototype) // {}.__proto__ = Super.prototype
  //让他的构造函数指向回来，防止继承扰乱。
  Sub.prototype.constructor = Sub
  //id 加加。标志 不同的组件
  Sub.cid = SuperId++
  //合并参数
  // Sub.options = mergeOptions(Super.options, extendOptions)
  Sub.options = {
    components: {},
  }
  //记录父类
  Sub['super'] = Super
  if (name) {
    //如果组件含有名称 则 把这个对象存到 组件名称中, 在options拓展参数的原型中能获取到该数据
    Sub.options.components[name] = Sub
  }
  return Sub
}
export default extend
