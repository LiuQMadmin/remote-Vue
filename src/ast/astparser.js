/**
 * vue源码解析AST树的主要正则表达式
 */
// /^\s*   ([^\s"'<>\/=]+)   (?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// (1)          (2)                               (3)
// (1)第一部分   ^\s*
//   先来看标注的第 (1) 部分，也是最简单的部分：^ 表示匹配输入的开始，\s表示空格，* 表示可无可有可多个。
//   那么整个第一部分的意思就很清楚了：输入的字符的开头可无、可有、可多个空格。如果单独这块儿作为一个表达式来匹配的话：
//   const part1 = /^\s*/;
//  'abc'.match(part1); // 匹配到空字符串
// ' abc'.match(part1); // 匹配到一个空格
// '  abc'.match(part1); // 匹配到两个空格
// (2)接下来看第二部分：([^\s"'<>\/=]+)：首先，第二部分被一个 () 包裹着。在正则里面这叫做捕获分组。什么意思呢？
//     “捕获”和“分组”，就是说会把这部分匹配到的结果当作一个分组捕获出来。捕获出来就是在满足整个大的正则表达式的基础上，
//     会将满足这个分组表达式的字符串当作一个小的分组结果放进大的结果数组中。比如：
//     const group = /a(.*)a/;
//    `a1232a`.match(group); // => ['a1232a', '1232'];
//     结果[0]是满足整个表达式的匹配结果，结果[1]是在大结果中的一个满足()内表达式的一个小的结果分组
// (3) 第三部分    (?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?
//   (?:  \s*(=)\s*  (?:  "([^"]*)"+  |  '([^']*)'+  |  ([^\s"'=<>`]+  )))?
//          (1)             (2)             (3)             (4)
//   第一部分：可有可无可多个的空格后面跟着一个必须的等号，等候后面可无可有可多个空格。
//   第二部分：双引号之间有随便多少个由非双引号构成的字符串。所以"abc"可以， """不可以。
//   第三部分：和第二部分类似，把双引号换成单引号
//   第四部分：非 空格、双引号、单引号、等号、小于号、大于号、反单引号(`) 组成的非空字符串。
// 百度地址：https://blog.csdn.net/weixin_33851604/article/details/91418686

// id="app" id='app' id=app
var attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 标签名 <my-header></my-header>
var ncname = '[a-zA-Z_][\\w\\-\\.]*'
// <my:header></my:header>
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')' //  ((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)
// <div
var startTagOpen = new RegExp('^<' + qnameCapture) // 匹配开头必需是< 后面可以忽略是任何字符串  ^<((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)
// >   />
var startTagClose = /^\s*(\/?)>/ //     匹配 > 标签 或者/> 闭合标签
// </div>
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>') //匹配开头必需是</ 后面可以忽略是任何字符串  ^<\\/((?:[a-zA-Z_][\\w\\-\\.]*\\:)?[a-zA-Z_][\\w\\-\\.]*)[^>]*>
var forAliasRE = /([^]*?)\s+(?:in|of)\s+([^]*)/ //匹配 含有   字符串 in  字符串   或者  字符串 of  字符串
// /([^]*?)\s+(?:in|of)\s+([^]*)/.exec('(item,index) in data')
// 0: "(item,index) in data"
// 1: "(item,index)"
// 2: "data"
// groups: undefined
// index: 0
// input: "(item,index) in data"
// length: 3
var stripParensRE = /^\(|\)$/g //匹配括号 ()
// 把html转成ast树
const parseHTMLtoAST = function (html) {
  let text
  let root
  let currentParent
  let stack = []
  while (html) {
    let textEnd = html.indexOf('<')
    // 匹配元素开始标签
    if (textEnd === 0) {
      // 完成一个元素的遍历 例如：<div id="app"> 一个元素的前半部分
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch)
        // 结束本次循环，就因为continue了，才会把所有的<div>标签遍历完
        continue
      }
      // 匹配元素结束标签</div>
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    // 匹配文本节点，这时候 < 不在0的位置上面
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  /**
   * 匹配开始标签
   */
  function parseStartTag() {
    let end // 标签后面有没有匹配到 > 闭合标签
    let attr // 元素的属性
    // 通过正则匹配出来元素的开始标签<div
    const start = html.match(startTagOpen)
    // debugger
    // 0: "<div"
    // 1: "div"
    // groups: undefined
    // index: 0
    // input: "<div id=\"app\" style=\"color: red; font-size: 20px\">\n      你好，{{ name }}\n      <span style=\"color: blue\">{{ age }} </span>\n      <p style=\"color: blue\">{{ age }}</p>\n    </div>"
    // length: 2
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      }
      // 去掉匹配出来字符串长度，继续往下匹配
      advance(start[0].length)
      // html.match(startTagClose) 匹配元素的闭合标签 >
      // html.match(attribute)看看有没有属性，后面直接能匹配到 > 就是表示没有属性值，反之则表示有属性值
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          // 'app' --> attr[3]  "app"--> attr[4]  app --> attr[5]
          value: attr[3] || attr[4] || attr[5],
        })
        // 过滤v-for
        if (attr[1] === 'v-for') {
          let forAttr = forAliasRE.exec(attr[3] || attr[4] || attr[5])
          var alias = forAttr[1].trim().replace(stripParensRE, '') //去除括号 比如(value, key, index) in data 变成 value, key, index
          let forItem = alias.split(',') // 根据","分割成多个数组元素
          match['for'] = forAttr[2]
          match.alias = forItem[0]
          match.iterator1 = forItem[1].trim()
        }
        advance(attr[0].length)
      }
      // 没有attr属性，后面就是结束标签，把这个元素的ast返回
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function start(startTagMatch) {
    // 创建ast树的基本结构
    const element = createASTElement(startTagMatch)
    // 判断是不是头元素
    if (!root) {
      root = element
    }
    // 标记谁是谁的子元素，在执行end方法的时候能后取到currentParent
    // 是给匹配到文本节点的时候标记父元素用的（chars()里面用到的）
    currentParent = element
    // console.log(currentParent, 'currentParent')
    // 把当前元素放入到栈里面
    stack.push(element)
  }
  /**
   * 遇到结束标签的时候，删除栈里面最后一个元素
   * 现在栈最后一个元素就是这个元素的父节点
   * 栈里面的最后元素的子节点就是当前元素的节点，所以需要pop()一下
   */
  function end() {
    // 执行这里的时候就是当前闭合标签，例如：</div>
    const element = stack.pop() // 取出来当前元素
    currentParent = stack.at(-1) // 取出去最后一个元素
    if (currentParent) {
      // 设置当前元素的父元素
      element.parent = currentParent
      // 把当前元素设置成父元素的子元素
      currentParent.children.push(element)
    }
  }
  function chars(text) {
    text = text.trim()
    // 当text存在时
    if (text.length > 0) {
      // currentParent是在start=匹配出口开始标签存储的,为当前父元素添加文本标签
      currentParent.children.push({
        type: 3,
        text,
      })
    }
  }
  function createASTElement(startTagMatch) {
    // 处理v-for的ast结构
    if (startTagMatch.for) {
      const { tagName, attrs, alias, iterator1 } = startTagMatch
      return {
        tag: tagName,
        type: 1, //元素节点
        children: [],
        attrs,
        parent,
        alias,
        for: startTagMatch.for,
        iterator1,
      }
    } else {
      return {
        tag: startTagMatch.tagName,
        type: 1, //元素节点
        children: [],
        attrs: startTagMatch.attrs,
        parent,
      }
    }
  }
  return root
}

export { parseHTMLtoAST }
