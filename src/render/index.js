import { generate } from './generate'
/**
 * 把ast树转成render函数
 */
function compilerToRenderFunction(ast) {
  const code = generate(ast)
  const render = new Function(`
    with(this) { return ${code} }
  `)
  return render
}

export { compilerToRenderFunction }
