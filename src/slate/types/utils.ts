import type { RenderElementProps } from "slate-react"
import type { CustomElement } from "./interface"

// interface a {
//   id: number
//   name: string
// }
// type b = KeysUnion<a> -> type b = "id" | "name"
// type c = KeysValueUnion<a> -> type c = string | number

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

// 为 CustomElement 的 component 提供类型
export type CustomRenderElementProps<T extends CustomElement> = Omit<RenderElementProps, "element"> & {
  element: T
}
