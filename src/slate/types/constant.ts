import type { IndentTypeElement, InlineElement, ParagraphTypeElement, VoidElement } from "./interface"

export const INLINE_ELEMENTS: Array<InlineElement["type"]> = ["inlineCode", "link"]

export const VOID_ELEMENTS: Array<VoidElement["type"]> = ["blockCode_voidArea"]

export const PARAGRAPH_TYPE_ELEMENTS: Array<ParagraphTypeElement["type"]> = [
  "paragraph",
  "orderedList",
  "unorderedList",
  "blockCode_codeLine",
  "head",
  "quote_line",
]

export const INDENT_TYPE_ELEMENTS: Array<IndentTypeElement["type"]> = [
  "paragraph",
  "orderedList",
  "unorderedList",
  "head",
  "quote_line",
]
