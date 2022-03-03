import type { BaseEditor } from "slate"
import type { ReactEditor } from "slate-react"
import type { KeysValueUnion } from "./utils"

// Text
export type CustomText = {
  text: string
  bold?: boolean
}

// Block Element
export type ParagraphElement = {
  type: "paragraph"
  children: CustomText[]
}

// Inline Element
export type InlineCodeElement = {
  type: "inlineCode"
  children: CustomText[]
}

export type BlockElement = ParagraphElement
export type InlineElement = InlineCodeElement

export const inlineTypes: Array<Exclude<KeysValueUnion<InlineElement>, CustomText[]>> = ["inlineCode"]

export type CustomElement = BlockElement | InlineElement
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
