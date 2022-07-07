import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { Editor, Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import { SlateElement } from "../../../../../types/slate"
import {
  orderedListModifyBarButton,
  orderedListModifyBarButtonContainer,
  orderedListModifyBarContainer,
  orderedListModifyBarInput,
  orderedListModifyBarInputBottomButton,
  orderedListModifyBarInputButtonContainer,
  orderedListModifyBarInputContainer,
  orderedListModifyBarInputTopButton,
  orderedListModifyBarSpan,
} from "../List.css"
import { orderedListModifyBarStateAtom } from "../state"

const OrderedListModifyBar: React.FC = () => {
  const editor = useSlateStatic()

  const [orderedListModifyBarState, setOrderedListModifyBarState] = useAtom(orderedListModifyBarStateAtom)

  const [inputValue, setInputValue] = useState("")
  const inputDom = useRef<HTMLInputElement | null>(null)
  const inputInitialFlag = useRef(true)

  useEffect(() => {
    if (inputDom.current) {
      inputDom.current.select()
    }
  }, [orderedListModifyBarState])

  if (orderedListModifyBarState) {
    if (
      inputValue !== orderedListModifyBarState.orderedListEntry[0].indexState.index.toString() &&
      inputInitialFlag.current
    ) {
      setInputValue(orderedListModifyBarState.orderedListEntry[0].indexState.index.toString())
      inputInitialFlag.current = false
    }

    return (
      <div
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setOrderedListModifyBarState(null)
          }
        }}
        tabIndex={-1}
        className={orderedListModifyBarContainer}
        style={{
          left: orderedListModifyBarState.position.left,
          top: orderedListModifyBarState.position.top,
        }}
      >
        <span className={orderedListModifyBarSpan}>新编号为</span>
        <div className={orderedListModifyBarInputContainer}>
          <div className={orderedListModifyBarInputButtonContainer}>
            <button
              onClick={() => {
                let num = parseInt(inputValue)

                if (!Number.isNaN(num)) {
                  num += 1
                  setInputValue(num.toString())
                } else {
                  setInputValue("1")
                }

                if (inputDom.current) {
                  inputDom.current.focus()
                }
              }}
              className={orderedListModifyBarInputTopButton}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentcolor">
                <path
                  clipRule="evenodd"
                  d="M6 3.86L1.93 7.93c-.1.1-.25.1-.35 0l-.35-.36a.25.25 0 010-.35L5.65 2.8c.2-.2.5-.2.7 0l4.42 4.42c.1.1.1.26 0 .35l-.35.36c-.1.1-.26.1-.35 0L6 3.86z"
                ></path>
              </svg>
            </button>
            <button
              onClick={() => {
                let num = parseInt(inputValue)

                if (num > 1) {
                  num -= 1
                  setInputValue(num.toString())
                } else {
                  setInputValue("1")
                }

                if (inputDom.current) {
                  inputDom.current.focus()
                }
              }}
              className={orderedListModifyBarInputBottomButton}
              style={
                inputValue === "1"
                  ? {
                      border: "none",
                      background: "#343434",
                      color: "#494949",
                      cursor: "not-allowed",
                    }
                  : {}
              }
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentcolor"
                style={{
                  transform: "rotate(180deg)",
                }}
              >
                <path
                  clipRule="evenodd"
                  d="M6 3.86L1.93 7.93c-.1.1-.25.1-.35 0l-.35-.36a.25.25 0 010-.35L5.65 2.8c.2-.2.5-.2.7 0l4.42 4.42c.1.1.1.26 0 .35l-.35.36c-.1.1-.26.1-.35 0L6 3.86z"
                ></path>
              </svg>
            </button>
          </div>
          <div>
            <input
              ref={inputDom}
              value={inputValue}
              onChange={(event) => {
                if (event.target.value === "") {
                  setInputValue("")
                  return
                }
                const num = parseInt(event.target.value)
                if (!Number.isNaN(num)) {
                  setInputValue(num.toString())
                  return
                }
              }}
              className={orderedListModifyBarInput}
            />
          </div>
        </div>
        <div className={orderedListModifyBarButtonContainer}>
          <button
            onClick={() => {
              const num = parseInt(inputValue)
              if (num >= 1) {
                // 若新编号与前一个同级列表的编号连续, 则当前列表模式为 selfIncrement, 否则为 head
                const currentPath = orderedListModifyBarState.orderedListEntry[1]
                let newHead: "head" | "selfIncrement" = "head"
                if (currentPath[0] > 0) {
                  const [node] = Editor.node(editor, [currentPath[0] - 1])
                  if (
                    SlateElement.isElement(node) &&
                    node.type === "ordered-list" &&
                    node.indexState.index === num - 1
                  ) {
                    newHead = "selfIncrement"
                  }
                }
                Transforms.setNodes(
                  editor,
                  {
                    indexState: {
                      type: newHead,
                      index: num,
                    },
                  },
                  {
                    at: currentPath,
                  }
                )
              }
              setOrderedListModifyBarState(null)
            }}
            className={orderedListModifyBarButton}
          >
            确定
          </button>
        </div>
      </div>
    )
  } else {
    inputInitialFlag.current = true
    return <div></div>
  }
}

export default OrderedListModifyBar
