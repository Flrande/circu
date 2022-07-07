import type { BaseRange, BaseText } from "slate"
import type { ReactEditor } from "./plugin/react-editor"

declare module "slate" {
  interface CustomTypes {
    Editor: ReactEditor
    Text: BaseText & {
      [sym: symbol]: boolean
      placeholder?: string
    }
    Range: BaseRange & {
      [sym: symbol]: boolean
      placeholder?: string
    }
  }
}
