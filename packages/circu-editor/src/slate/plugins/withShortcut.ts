import { Editor, Transforms } from "slate"
import { toggleHead } from "../components/Nodes/Block/Head/headHelper"
import { toggleOrderedList, toggleUnorderedList } from "../components/Nodes/Block/List/listHelper"
import { toggleMark } from "../components/Nodes/Text/textHelper"
import { SlateElement, SlateRange, SlateText } from "../types/slate"

const singleBlockShortcuts = ["#", "##", "###", "####", "#####", "######", "1.", "-", "*"]
const inlineShortcuts = ["**", "*", "~", "~~"]

export const withShortcut = (editor: Editor) => {
  const { insertText } = editor

  editor.insertText = (text) => {
    Editor.withoutNormalizing(editor, () => {
      const { selection } = editor
      if (text === " " && selection && SlateRange.isCollapsed(selection)) {
        const paragraphs = Array.from(
          Editor.nodes(editor, {
            at: selection.anchor,
            match: (n) => SlateElement.isElement(n) && n.type === "paragraph",
          })
        )

        if (paragraphs.length > 0) {
          const [, paragraphPath] = paragraphs[0]

          const startPoint = Editor.start(editor, paragraphPath)
          const beforeString = Editor.string(editor, {
            anchor: startPoint,
            focus: selection.anchor,
          })

          if (singleBlockShortcuts.includes(beforeString)) {
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

        const texts = Array.from(
          Editor.nodes(editor, {
            at: selection.anchor,
            match: (n) => SlateText.isText(n),
          })
        )

        if (texts.length > 0) {
          const [, textPath] = texts[0]

          const startPoint = Editor.start(editor, textPath)
          const beforeTextString = Editor.string(editor, {
            anchor: startPoint,
            focus: selection.anchor,
          })

          const reverseString = [...beforeTextString].reverse().join("")
          for (const inlineShortcut of inlineShortcuts) {
            if (reverseString.startsWith(inlineShortcut)) {
              const found = reverseString
                .slice(inlineShortcut.length)
                .match(inlineShortcut === "**" ? /\*\*/ : inlineShortcut === "*" ? /\*/ : inlineShortcut)
              if (found && found.index) {
                // beforeTextString = aaa**bbb**
                // 计算 bbb 的位置
                // found.index = 3
                // 10 - 2 - 3
                const matchStartIndex = beforeTextString.length - inlineShortcut.length - found.index
                // 删去 **bbb**
                Transforms.delete(editor, {
                  at: {
                    anchor: {
                      path: textPath,
                      offset: matchStartIndex - inlineShortcut.length,
                    },
                    focus: selection.anchor,
                  },
                })
                // 插入 bbb
                Transforms.insertText(editor, beforeTextString.slice(matchStartIndex, -inlineShortcut.length), {
                  at: {
                    path: textPath,
                    offset: matchStartIndex - inlineShortcut.length,
                  },
                })

                Transforms.select(editor, {
                  anchor: {
                    path: textPath,
                    offset: matchStartIndex - inlineShortcut.length,
                  },
                  focus: {
                    path: textPath,
                    offset:
                      matchStartIndex -
                      inlineShortcut.length +
                      beforeTextString.slice(matchStartIndex, -inlineShortcut.length).length,
                  },
                })
                switch (inlineShortcut) {
                  case "**":
                    toggleMark(editor, "bold", true)
                    break
                  case "*":
                    toggleMark(editor, "italic", true)
                    break
                  case "~":
                    toggleMark(editor, "underline", true)
                    break
                  case "~~":
                    toggleMark(editor, "strike", true)
                    break
                  default:
                    break
                }
                if (editor.selection) {
                  Transforms.select(editor, Editor.end(editor, editor.selection))
                }

                return
              }
            }
          }
        }
      }

      insertText(text)
    })
  }

  return editor
}
