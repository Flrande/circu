interface ShadowRoot {
  // https://caniuse.com/?search=ShadowRoot.getSelection
  // https://github.com/microsoft/TypeScript/issues/45047
  // ShadowRoot.getSelection 为非标准, 该类型定义目的在于兼容历史代码
  getSelection(): Selection | null
}
