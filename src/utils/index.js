/**
 * 使用reduce进行递归取出来相应的值
 */
function getVal(vm, key) {
  return key.split('.').reduce((data, currentKey) => {
    return data[currentKey]
  }, vm)
}
/**
 * 绑定数据到Object母体上
 */
function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false,
    configurable: false,
    value,
  })
}
export { getVal, def }
