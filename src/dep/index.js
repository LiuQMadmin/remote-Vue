class Dep {
  constructor() {
    this.subs = []
    this.target = null // 标志是不是需要收集订阅函数
  }
  // 添加观察者
  addSubs(watcher) {
    this.subs.push(watcher)
  }
  // 发布函数
  notify() {
    this.subs.map((watcher) => {
      // 这里的watcher就是在Object.defineProperty时new watcher实例
      watcher.update()
    })
  }
}

export { Dep }
