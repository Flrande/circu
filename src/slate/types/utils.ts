import type { RenderElementProps } from "slate-react"
import type { CustomElement } from "./interface"

export type KeysUnion<T> = keyof T

// 为 CustomElement 的 component 提供类型
export type CustomRenderElementProps<T extends CustomElement> = Omit<RenderElementProps, "element"> & {
  element: T
}
