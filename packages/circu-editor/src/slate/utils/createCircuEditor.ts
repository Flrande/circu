import { createEditor } from "slate"
import { withReact } from "slate-react"
import { withDelete } from "../plugins/withDelete"
import { withInlines } from "../plugins/withInlines"
import { withLineBreak } from "../plugins/withLineBreak"
import { withNormalize } from "../plugins/withNormalize"
import { withShortcut } from "../plugins/withShortcut"
import { withVoid } from "../plugins/withVoid"

export const createCircuEditor = () =>
  withVoid(withShortcut(withLineBreak(withNormalize(withVoid(withDelete(withInlines(withReact(createEditor()))))))))
