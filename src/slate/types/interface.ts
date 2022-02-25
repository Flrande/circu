import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"

export type CustomText = {
  text: string
  bold?: boolean
  code?: boolean
}

export type ParagraphElement = {
  type: "paragraph"
  children: CustomText[]
}

export type CustomElement = ParagraphElement

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
