import Vue from '../index'
/**
 * 创建元素节点的函数
 * ...children将多余的参数放到children中
 */
function createElement(tag, attrs = {}, ...children) {
  if (tag == 'child' || tag == 'childtwo') {
    const that = new Vue.options.components[tag]()
    return that.$options.vnode
  }
  // 从这里做判断
  return vnode(tag, attrs, children.includes(undefined) ? [] : children)
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
