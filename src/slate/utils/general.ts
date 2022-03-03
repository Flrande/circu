// 用于避免 Array.includes 的类型收窄
export const includes = <T extends U, U>(arr: ReadonlyArray<T>, el: U): el is T => {
  return arr.includes(el as T)
}
