import { parseHTMLtoAST } from '../ast/astparser'
import { compilerToRenderFunction } from '../render/index'
import { mountComponent } from '../lifecycle/lifecycle'
import { Watcher } from '../watcher/index'
// import Vue from '../index'
function initComponent(componentName, definition) {
  definition.name = componentName
  definition = this.extend(definition)
  this.options.components[componentName] = definition //返回集合
  return definition
}

export default initComponent
