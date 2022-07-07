import { useAtom, useSetAtom } from "jotai"
import { ReactElement, useEffect, useRef } from "react"
import type React from "react"
import { Editor, NodeEntry, Path, Transforms } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { orderedListBarContainer, orderedListBarItemContainer } from "../List.css"
import { orderedListBarStateAtom, orderedListModifyBarStateAtom } from "../state"
import OrderedListBarContinueIcon from "./OrderedListBarContinueIcon"
import OrderedListBarModifyIcon from "./OrderedListBarModifyIcon"
import OrderedListBarRestartIcon from "./OrderedListBarRestartIcon"
import type { IOrderedList } from "../types"
import { SlateElement } from "../../../../../types/slate"

const OrderedListBarItem: React.FC<{
  isActive: boolean
  icon: ReactElement
  message: string
  handler: React.MouseEventHandler<HTMLDivElement>
}> = ({ isActive, icon, message, handler }) => {
  return (
    <div
      onClick={handler}
      style={{
        color: isActive ? "#ffffff" : "#5f5f5f",
        cursor: isActive ? "pointer" : "not-allowed",
      }}
      className={orderedListBarItemContainer}
    >
      {icon}
      <span>{message}</span>
    </div>
  )
}

const OrderedListBar: React.FC = () => {
  const editor = useSlateStatic()

  const [orderedListBarState, setOrderedListBarState] = useAtom(orderedListBarStateAtom)
  const setOrderedListModifyBarState = useSetAtom(orderedListModifyBarStateAtom)

  const barDom = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (barDom.current && orderedListBarState) {
      barDom.current.focus()
    }
  }, [orderedListBarState])

  if (orderedListBarState) {
    const orderedListEntryArr = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: (n) => SlateElement.isElement(n) && n.type === "ordered-list",
      })
    ) as NodeEntry<IOrderedList>[]
    const currentList = orderedListBarState.orderedListEntry[0]
    const currentListPath = ReactEditor.findPath(editor, currentList)

    const items: ReactElement[] = []

    if (currentList.indexState.type === "head") {
      const isContinueActive = orderedListEntryArr.some(([_, path]) => Path.isBefore(path, currentListPath))
      const isRestartActive = currentList.indexState.index !== 1
      const isModifyActive = true

      const continueHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        Transforms.setNodes(
          editor,
          {
            indexState: {
              type: "selfIncrement",
              index: 1,
            },
          },
          {
            at: currentListPath,
          }
        )
        setOrderedListBarState(null)
      }
      const restartHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        Transforms.setNodes(
          editor,
          {
            indexState: {
              type: "head",
              index: 1,
            },
          },
          {
            at: currentListPath,
          }
        )
        setOrderedListBarState(null)
      }
      const modifyHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        setOrderedListModifyBarState(orderedListBarState)
        setOrderedListBarState(null)
      }

      items.push(
        <OrderedListBarItem
          key={1}
          isActive={isContinueActive}
          handler={continueHandler}
          message={"继续之前的编号"}
          icon={<OrderedListBarContinueIcon></OrderedListBarContinueIcon>}
        ></OrderedListBarItem>
      )
      items.push(
        <OrderedListBarItem
          key={2}
          isActive={isRestartActive}
          handler={restartHandler}
          message={"开始新列表"}
          icon={<OrderedListBarRestartIcon></OrderedListBarRestartIcon>}
        ></OrderedListBarItem>
      )
      items.push(
        <OrderedListBarItem
          key={3}
          isActive={isModifyActive}
          handler={modifyHandler}
          message={"修改编号值"}
          icon={<OrderedListBarModifyIcon></OrderedListBarModifyIcon>}
        ></OrderedListBarItem>
      )
    } else {
      const isContinueActive = false
      const isRestartActive = true
      const isModifyActive = true

      const continueHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        setOrderedListBarState(null)
      }
      const restartHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        Transforms.setNodes(
          editor,
          {
            indexState: {
              type: "head",
              index: 1,
            },
          },
          {
            at: currentListPath,
          }
        )
        setOrderedListBarState(null)
      }
      const modifyHandler: React.MouseEventHandler<HTMLDivElement> = () => {
        setOrderedListModifyBarState(orderedListBarState)
        setOrderedListBarState(null)
      }

      items.push(
        <OrderedListBarItem
          key={1}
          isActive={isContinueActive}
          handler={continueHandler}
          message={"继续之前的编号"}
          icon={<OrderedListBarContinueIcon></OrderedListBarContinueIcon>}
        ></OrderedListBarItem>
      )
      items.push(
        <OrderedListBarItem
          key={2}
          isActive={isRestartActive}
          handler={restartHandler}
          message={"开始新列表"}
          icon={<OrderedListBarRestartIcon></OrderedListBarRestartIcon>}
        ></OrderedListBarItem>
      )
      items.push(
        <OrderedListBarItem
          key={3}
          isActive={isModifyActive}
          handler={modifyHandler}
          message={"修改编号值"}
          icon={<OrderedListBarModifyIcon></OrderedListBarModifyIcon>}
        ></OrderedListBarItem>
      )
    }
    return (
      <div
        ref={barDom}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setOrderedListBarState(null)
          }
        }}
        tabIndex={-1}
        className={orderedListBarContainer}
        style={{
          left: orderedListBarState.position.left,
          top: orderedListBarState.position.top,
        }}
      >
        {items}
      </div>
    )
  } else {
    return <div></div>
  }
}

export default OrderedListBar
