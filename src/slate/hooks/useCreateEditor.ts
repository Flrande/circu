import { useState } from "react"
import { createEditor } from "slate"
import { withReact } from "slate-react"
import { withDelete } from "../plugins/withDelete"
import { withInlines } from "../plugins/withInlines"
import { withNormalize } from "../plugins/withNormalize"
import { withVoid } from "../plugins/withVoid"

export const useCreateEditor = () => {
  // 保证单一实例
  const [editor] = useState(() => withNormalize(withVoid(withDelete(withInlines(withReact(createEditor()))))))

  return editor
}
