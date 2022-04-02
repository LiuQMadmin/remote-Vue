/**
 * 根据ast树生成render函数
 * _c() => createElement()   创建元素节点
 * _v() => createTextNode()  创建文本节点
 * _s() => {{ name }} => _s(name)  读取变量值
 */
// render函数的格式数据
function vrender() {
  return `_c(
    'div',
    {
      'id': 'app',
      'style': {
        'color': 'red',
        'font-size': '20px'
      }
    },
    _v('你好，' + _s(name)),
    _c(
      'span',
      {
        'class': 'styleClass',
        'style': {
          'color': 'green',
          'font-size': '20px'
        }
      },
      _s(age)
    )
  )`
}
var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g //匹配viwe 视图中的{{指令}}
// genProps和源码处理函数一致，把attr变成key:value的格式
function genProps(attrs) {
  let attrStr = ''
  attrs.map((attr) => {
    let styleAttrs = {}
    if (attr.name === 'style') {
      attr.value.split(';').map((styleAttr) => {
        let [key, value] = styleAttr.split(':')
        styleAttrs[key.trim()] = value.trim()
      })
      // 取出来的是字符串，赋值进去的是对象
      attr.value = styleAttrs
    }
    // 把attr里面的v-for排除掉
    if (attr.name !== 'v-for') {
      if (attr.name === '@click') {
        const fnstr = `{click:function($event){return ${attr.value}}}`
        attrStr += `on:${fnstr},`
      } else {
        attrStr += `${attr.name}:${JSON.stringify(attr.value)},`
      }
    }
  })
  // 去掉字符串最后一位的‘逗号’，使用slice(0, -1)
  return `{${attrStr.slice(0, -1)}}`
}
/**
 * 处理v-for的方法
 */
function genFor(childrenNode) {
  let children = getChildren(childrenNode)
  return `_l(
      (${childrenNode.for}),
      function(${childrenNode.alias},${childrenNode.iterator1}){
        return _c(
          '${childrenNode.tag}',
          ${
            childrenNode.attrs && childrenNode.attrs.length > 0
              ? genProps(childrenNode.attrs)
              : undefined
          },
          ${children ? children : undefined},
        )
      }
    )
  `
}
// 判断子节点是元素节点还是文本节点
function generateChildren(childrenNode) {
  if (childrenNode.type === 1) {
    if (childrenNode.for) {
      // v-for处理成ast树
      return genFor(childrenNode)
    } else {
      // 元素节点
      return generate(childrenNode)
    }
  } else if (childrenNode.type === 3) {
    // 文本节点
    let text = childrenNode.text
    if (!defaultTagRE.test(text)) {
      // 文本中不包含{{}} 的时候
      return `_v(${JSON.stringify(text)})`
    }
    let match,
      index,
      lastIndex = (defaultTagRE.lastIndex = 0)
    let textArr = []
    while ((match = defaultTagRE.exec(text))) {
      index = match.index
      // 根据lastIndex 和 index 截取出来对应的字符串
      // lastIndex是正则表达式defaultTagRE匹配出来的最后一位，
      // 例如：defaultTagRE.exec("你好啊，{{ name }}欢迎")
      // lastIndex就在"你好啊，{{ name }}|欢迎"，等于14
      // index就等于开始匹配的位置  "你好啊，|{{ name }}|欢迎"，等于4
      // index > lastIndex 的时候表示没有匹配到 {{name}} 变量
      if (index > lastIndex) {
        // 取出来最后不包含{{name}}的文本
        textArr.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      // 匹配到{{ name }} 放入到数组中
      textArr.push(`_s(${match[1].trim()})`)
      // 这两种写法都可以，就是为了拿到下表截取字符串
      lastIndex = defaultTagRE.lastIndex
    }
    // 表示后面还剩下纯文本没有匹配出来
    if (lastIndex < text.length) {
      // 把最后的纯文本再放到数组中去
      textArr.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${textArr.join('+')})`
  }
}

function getChildren(ast) {
  const children = ast.children
  if (children) {
    return children.map((c) => generateChildren(c)).join(',')
  }
}
function generate(ast) {
  let children = getChildren(ast)
  let code = `_c(
    '${ast.tag}',
    ${ast.attrs && ast.attrs.length > 0 ? genProps(ast.attrs) : undefined},
    ${children ? children : undefined}
  )`
  return code
}

export { generate }
