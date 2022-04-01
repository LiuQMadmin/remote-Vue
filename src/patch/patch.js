/**
 * 处理元素上面的属性
 */
function updateProps(vnode) {
  const el = vnode.el
  const newProps = vnode.props || {}
  Object.entries(newProps).map(([key, value]) => {
    if (key === 'style') {
      Object.entries(value).map(([k, v]) => {
        el.style[k] = v
      })
    } else if (key === 'class') {
      el.className = value
    } else {
      el.setAttribute(key, value)
    }
  })
}
/**
 * 虚拟节点转成真正的dom
 */
function createElement(vnode) {
  const { tag, children, text } = vnode
  // 元素节点
  if (typeof tag === 'string') {
    // 在vnode添加一个key值，充当一个全局变量，没啥别的意思
    vnode.el = document.createElement(tag)
    // 处理元素上面的属性
    updateProps(vnode)
    // 递归处理子节点
    children &&
      children.map((child) => {
        // v-for添加的vnode元素是一个数组，要把这个数组铺平展开
        if (Array.isArray(child)) {
          child.map((it) => {
            vnode.el.appendChild(createElement(it))
          })
        } else {
          vnode.el.appendChild(createElement(child))
        }
      })
  } else {
    // 文本节点
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
/**
 * 把vnode转成dom挂载到页面中
 */
function patch(vm, vnode) {
  const oldNode = vm.$el
  // 返回的el已经是真实的dom了
  let el = createElement(vnode)
  let parentElement = oldNode.parentNode
  // 把el插入到oldNode的后面(1:dom节点，2：位置)
  parentElement.insertBefore(el, oldNode.nextibling)
  // 从父节点把oldNode移除掉
  parentElement.removeChild(oldNode)
  // 把新节点放到$el上面
  vm.$el = el
}

export { patch }
