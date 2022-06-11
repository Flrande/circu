import type React from "react"
import type { RenderElementProps } from "slate-react"
import type { CustomElement } from "./interface"

// 直接使用 keyof 时不支持 T 为 union 的情况
export type KeysUnion<T> = T extends any ? keyof T : T

// 为 CustomElement 的 component 提供类型
export type CustomRenderElementProps<T extends CustomElement> = React.PropsWithChildren<
  Omit<RenderElementProps, "element" | "children"> & {
    element: T
  }
>
