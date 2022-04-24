import { Dep } from '../dep/index'
// import { Watcher } from '../watcher/index'
import { def } from '../utils/index'
import { arrayMethods } from './array'
// import { mountComponent } from '../lifecycle/lifecycle'
/**
 * 数据双向绑定
 * @param {*} data
 */
function observe(data) {
  // 两种判断是不是对象的方法(数组和对象两种类型)
  let isObj = typeof data === 'object' && data !== null
  // 如果不是对象直接结束
  if (!isObj) return
  return new Observe(data)
}
class Observe {
  constructor(value) {
    // 数组的处理方法
    if (Array.isArray(value)) {
      // 把当前的实例this绑定到当前的值value上面，在之后判断数组一些数据的时候使用
      // 在每一个监控的对象上面绑定一个实例属性
      def(value, '__ob__', this)
      // 如果数组的话，并不会对索引进行观测，this.observeArray(value)性能太差
      value.__proto__ = arrayMethods
      this.observeMethods(value)
    } else {
      // 对象或者其他变量的处理方式
      this.walk(value)
    }
  }
  // 非数组变量的的处理方法
  walk(data) {
    const keys = Object.entries(data)
    keys.map(([key, value]) => {
      defineReactive(data, key, value)
    })
  }
  // 数组的处理方法
  observeMethods(data) {
    data.map((item) => {
      // 数据里面的每一项再去做响应式处理
      observe(item)
    })
  }
}
/**
 * 让data里面的key变成响应式
 * @param {*} data Vue里面的data数据
 * @param {*} key data里面的key值
 * @param {*} value data里面的key对应的value值
 */
function defineReactive(data, key, value) {
  observe(value)
  let Deps = new Dep()
  Object.defineProperty(data, key, {
    configurable: true, // 是否可删除
    enumerable: true, // 是否可以枚举
    get: () => {
      // 首次获取变量把订阅事件存储到subs数组中
      Dep.target && Deps.addSubs(Dep.target)
      console.log(Dep.target, 'Dep.target')
      // 如果是数组，在获取的时候收集依赖
      if (Array.isArray(value)) {
        value.__proto__.deps = Deps
      }
      return value
    },
    // 改变值时触发
    set: (newValue) => {
      // 如果新旧值相等，直接结束
      if (Object.is(value, newValue)) return
      // 检查变量是不是对象，是对象就继续数据劫持
      observe(newValue)
      // 如果新旧值不相等，就进行赋值操作
      value = newValue
      // 触发变量的订阅函数（发布）
      Deps.notify()
    },
  })
}
export { observe }
