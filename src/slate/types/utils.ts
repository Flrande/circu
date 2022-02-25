// 提取 object 的 property name
export type KeysUnion<T> = NonNullable<
  {
    [K in keyof T]: K
  }[keyof T]
>

// 提取 object 的 property value
export type KeysValueUnion<T> = NonNullable<
  {
    [K in keyof T]: T[K]
  }[keyof T]
>
