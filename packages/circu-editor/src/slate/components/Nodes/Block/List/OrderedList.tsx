import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { Path } from "slate"
import { ReactEditor, useSlateStatic } from "slate-react"
import { DOC_WIDTH } from "../../../../types/constant"
import type { CustomRenderElementProps } from "../../../../types/utils"
import { calculateIndentLevel } from "../BlockWrapper/indentHelper"
import { orderedListBarStateAtom, orderedListModifyBarStateAtom } from "./state"
import type { IOrderedList } from "./types"

// 对于有序列表有两种模式 (状态):
// 作为列表开头 - head
// 跟随前一个 list 的编号 - selfIncrement
//
// 列表头决定一组列表 index 的下界
// 在接下来的表述中,
// head-list 表示 head 模式的 list,
// selfIncrement-list 表示 selfIncrement 模式的 list
//
// --------------------------------------------------
//
// 有三种切换行为:
// 继续之前的编号 - continue
// 开始新列表 - restart
// 切换编号 - modify
// 切换行为的触发有条件限制
//
// head-list:
// 1. 当且仅当当前 head-list 前有另外的 head-list 时才可触发
//    continue, 触发相当于当前 head-list 的模式转为 selfIncrement
// 2. 当且仅当当前 head-list 的 index 不为 1 时才可触发 restart,
//    触发相当于将当前 head-list 的 index 设为 1
// 3. 任何时候均可触发 modify, 若新编号与前一个列表连续, 则当前列表
//    模式转为 selfIncrement, 否则仍为 head
//
// selfIncrement-list:
// 1. 任何时候均不可触发 continue
// 2. 任何时候均可触发 restart, 相当于将当前 selfIncrement-list
//    的模式转为 head, 并设 index 为 1
// 3. 任何时候均可触发 modify, 相当于将当前 selfIncrement-list
//    的模式转为 head

// 阿拉伯数字转罗马数字
const arabicToRomanNumber = (num: number) => {
  let result = ""
  const map: {
    [i: number]: string
  } = {
    1: "i",
    4: "iv",
    5: "v",
    9: "ix",
    10: "x",
    40: "xl",
    50: "l",
    90: "xc",
    100: "c",
    400: "cd",
    500: "d",
    900: "cm",
    1000: "m",
  }
  const nums = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000]

  for (let i = nums.length - 1; i >= 0; i--) {
    const cache = num
    const tmp = num % nums[i]
    if (tmp === cache && i !== 0) continue
    result += map[nums[i]].repeat(Math.floor((num - tmp) / nums[i]))
    num = tmp
  }
  return result
}

// 将数字型 index 转化成 字母型 index
const numberToLetter = (num: number) => {
  let result = ""
  const map: {
    [i: number]: string
  } = {
    1: "a",
    2: "b",
    3: "c",
    4: "d",
    5: "e",
    6: "f",
    7: "g",
    8: "h",
    9: "i",
    10: "j",
    11: "k",
    12: "l",
    13: "m",
    14: "n",
    15: "o",
    16: "p",
    17: "q",
    18: "r",
    19: "s",
    20: "t",
    21: "u",
    22: "v",
    23: "w",
    24: "x",
    25: "y",
    26: "z",
  }

  let resultLen = 1 // 结果长度
  let boundary = 26
  let boundaryArr = [] // [26, 26+26^2, 26+26^2+26^3...], 对应 z, zz, zzz...
  let sumArr = [] // [1, 1+26, 1+26+26^2...], 对应 a, aa, aaa...
  boundaryArr.push(boundary)
  sumArr.push(1)
  while (true) {
    if (num <= boundary) {
      break
    } else {
      resultLen += 1
      boundary += Math.pow(26, resultLen)
      boundaryArr.push(boundary)
      sumArr.push(26 * (resultLen - 1))
    }
  }

  let tmpNum = num
  for (let i = resultLen; i >= 1; i--) {
    let index = 1
    for (let j = 1; j <= 25; j++) {
      if (
        tmpNum >= Math.pow(26, i - 1) * j + (i - 1 === 0 ? 0 : sumArr[i - 1 - 1]) &&
        tmpNum < Math.pow(26, i - 1) * (j + 1) + (i - 1 === 0 ? 0 : boundaryArr[i - 1 - 1])
      ) {
        index = j
      }
      if (tmpNum === Math.pow(26, i - 1) * (j + 1) + (i - 1 === 0 ? 0 : boundaryArr[i - 1 - 1])) {
        index = j + 1
      }
    }
    result += map[index]
    tmpNum -= Math.pow(26, i - 1) * index
  }
  return result
}

const OrderedList: React.FC<CustomRenderElementProps<IOrderedList>> = ({ attributes, children, element }) => {
  const editor = useSlateStatic()

  //TODO: 可能的优化方式:
  // worker 异步建表
  // proxy 劫持
  const indentLevel = calculateIndentLevel(editor, ReactEditor.findPath(editor, element))
  const indexSymbol =
    indentLevel % 3 === 0
      ? element.indexState.index
      : indentLevel % 3 === 1
      ? numberToLetter(element.indexState.index)
      : arabicToRomanNumber(element.indexState.index)

  const setOrderedListBarState = useSetAtom(orderedListBarStateAtom)
  const orderedListModifyBarState = useAtomValue(orderedListModifyBarStateAtom)
  const spanDom = useRef<HTMLSpanElement | null>(null)
  const [spanWidth, setSpanWidth] = useState(20)

  const currentListPath = ReactEditor.findPath(editor, element)

  const onClickSpan: React.MouseEventHandler<HTMLSpanElement> = () => {
    if (spanDom.current) {
      // 文档左右两边到视口的距离
      const docXPadding = (document.documentElement.clientWidth - DOC_WIDTH) / 2
      const top = window.scrollY + spanDom.current.getBoundingClientRect().top + 24
      const left =
        window.scrollX + spanDom.current.getBoundingClientRect().left - docXPadding + spanDom.current.clientWidth
      setOrderedListBarState({
        orderedListEntry: [element, currentListPath],
        position: {
          left,
          top,
        },
      })
    }
  }

  useEffect(() => {
    if (spanDom.current) {
      setSpanWidth(spanDom.current.offsetWidth + 2)
    }
  })

  return (
    <div
      data-circu-node="block"
      {...attributes}
      className={"my-2 relative"}
      style={{
        display: element.isHidden ? "none" : undefined,
      }}
    >
      <div data-circu-node="block-space" contentEditable={false} className={"absolute left-0 -top-2 w-full h-2"}></div>
      <div>
        <span contentEditable={false} className={"select-none text-blue-500 pl-[2px] absolute"}>
          <span
            ref={spanDom}
            onClick={onClickSpan}
            className={"hover:bg-blue-800/50 hover:rounded active:bg-blue-600/50 active:rounded"}
            style={
              orderedListModifyBarState && Path.equals(orderedListModifyBarState.orderedListEntry[1], currentListPath)
                ? {
                    backgroundColor: "#272f45",
                    borderRadius: "4px",
                  }
                : {}
            }
          >{`${indexSymbol}.`}</span>
        </span>
        <div
          style={{
            paddingLeft: `${spanWidth}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default OrderedList
