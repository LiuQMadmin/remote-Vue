import initComponent from './component'
import extend from './extend'
function initGlobalAPI(Vue) {
  Vue.component = initComponent
  Vue.extend = extend
}

export default initGlobalAPI
