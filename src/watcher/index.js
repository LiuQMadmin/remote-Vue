import { Dep } from '../dep/index'
/**
 * 用来存储订阅函数
 */
class Watcher {
  /**
   * @param {*} vm 数据响应的母体
   * @param {*} exprFun 回调render函数
   */
  constructor(vm, exprFun) {
    this.vm = vm
    this.exprFun = exprFun
    this.get()
  }
  get() {
    // 给target赋值，保存当前的Watch对象,并且把全局的Watcher存入进去
    Dep.target = this
    this.exprFun(this.vm)
    Dep.target = null
  }
  // 更新值
  update() {
    this.exprFun(this.vm)
  }
}

export { Watcher }
