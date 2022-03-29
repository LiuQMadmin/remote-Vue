/**
 * 创建元素节点的函数
 * ...children将多余的参数放到children中
 */
function createElement(tag, attrs = {}, ...children) {
  return vnode(tag, attrs, children)
}
/**
 * 创建文本节点函数
 */
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, text)
}
/**
 * 返回节点的结构
 */
function vnode(tag, props, children, text) {
  return {
    tag,
    props,
    children,
    text,
  }
}

export { createElement, createTextVnode }
