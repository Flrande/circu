import { Editor, Transforms } from "slate"
import { toggleHead } from "../components/Nodes/Block/Head/headHelper"
import { toggleOrderedList, toggleUnorderedList } from "../components/Nodes/Block/List/listHelper"
import { SlateRange, SlateText } from "../types/slate"

const shortcuts = ["#", "##", "###", "####", "#####", "######", "1.", "-", "*"]

export const withShortcut = (editor: Editor) => {
  const { insertText } = editor

  editor.insertText = (text) => {
    const { selection } = editor
    if (text === " " && selection && SlateRange.isCollapsed(selection)) {
      const textNodes = Array.from(
        Editor.nodes(editor, {
          at: selection.anchor,
          match: (n) => SlateText.isText(n),
        })
      )

      if (textNodes.length > 0) {
        const [, textNodePath] = textNodes[0]

        const startPoint = Editor.start(editor, textNodePath)
        const beforeString = Editor.string(editor, {
          anchor: startPoint,
          focus: selection.anchor,
        })

        if (shortcuts.includes(beforeString)) {
          Transforms.delete(editor, {
            at: {
              anchor: startPoint,
              focus: selection.anchor,
            },
          })

          switch (beforeString) {
            case "#":
              toggleHead(editor, "1")
              break
            case "##":
              toggleHead(editor, "2")
              break
            case "###":
              toggleHead(editor, "3")
              break
            case "####":
              toggleHead(editor, "4")
              break
            case "#####":
              toggleHead(editor, "5")
              break
            case "######":
              toggleHead(editor, "6")
              break
            case "1.":
              toggleOrderedList(editor)
              break
            case "-":
            case "*":
              toggleUnorderedList(editor)
              break
            default:
              break
          }

          return
        }
      }
    }

    insertText(text)
  }

  return editor
}
