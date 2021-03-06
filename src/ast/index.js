import { parseHTMLtoAST } from './astparser'
import { compilerToRenderFunction } from '../render/index'
import { mountComponent } from '../lifecycle/lifecycle'
import { Watcher } from '../watcher/index'
/**
 * 执行tempalte -> ast树 -> render函数 -> vnode -> 真实DOM
 */
function $mount(el) {
  const vm = this
  const options = vm.$options
  el = document.querySelector(el)
  // 把el挂载到vm的$el上面
  vm.$el = el
  /**
   * 先判断render函数存不存在
   */
  if (!options.render) {
    // 再判断存不存在template
    let template = options.template
    if (!template && el) {
      template = el.outerHTML
    }
    // 把template转成ast树
    const ast = parseHTMLtoAST(template)
    const render = compilerToRenderFunction(ast)
    options.render = render
  }
  /**
   * 思想：在这里创建Watcher实例，并且吧render函数变成虚拟节点的函数传递进去
   * 在Watcher内部去调用mountComponent函数，把render变成虚拟节点，并且把Wacther实例
   * 存储到dep.target变量中去，mountComponent函数执行时，可以进行收集依赖，在函数执行
   * 完毕之后再把dep.target变成null，从而实现收集变量依赖，实现双向绑定
   */
  new Watcher(vm, mountComponent)
}

export { $mount }
