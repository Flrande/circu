import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { Editor, Transforms } from "slate"
import { useSlateStatic } from "slate-react"
import { SlateElement } from "../../../../../types/slate"
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
        className={
          "absolute min-w-[284px] h-14 flex items-center p-3 border border-solid border-zinc-700 shadow-lg rounded-md bg-neutral-900"
        }
        style={{
          left: orderedListModifyBarState.position.left,
          top: orderedListModifyBarState.position.top,
        }}
      >
        <span className={"text-stone-200 text-sm"}>新编号为</span>
        <div
          className={
            "w-[88px] border border-solid border-neutral-700 rounded relative mx-2 bg-transparent focus-within:border-blue-500 hover:border-blue-500"
          }
        >
          <div className={"w-[34px] h-full flex flex-col justify-between absolute right-0"}>
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
              className={
                "h-[18px] flex justify-center items-center mb-[-1px] border-solid border-b border-l border-b-black/0 border-l-zinc-600 rounded-tr text-zinc-500 cursor-pointer z-[5] hover:z-10 hover:border-blue-500 hover:text-blue-500"
              }
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
              className={
                "h-[18px] flex justify-center items-center border-solid border-t border-l border-t-zinc-600 border-l-zinc-600 rounded-br text-zinc-500 cursor-pointer z-[5] hover:z-10 hover:border-blue-500 hover:text-blue-500"
              }
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
              className={
                "w-full h-[30px] text-sm text-slate-50 bg-transparent rounded border-none py-[6px] pr-[44px] pl-[10px]"
              }
            />
          </div>
        </div>
        <div className={"flex justify-end ml-3"}>
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
            className={
              "h-8 text-center py-1 px-[11px] text-sm rounded-md box-border w-20 text-stone-200 bg-blue-500 border border-solid border-blue-500 hover:bg-blue-700 active:bg-blue-600"
            }
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
