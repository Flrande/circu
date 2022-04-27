import { useState } from "react"
import { ReactEditor, useSlate } from "slate-react"
import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IList } from "./types"

//TODO: index
// 对于有序列表有两种模式 (mode):
// 作为列表开头 - head
// 跟随前一个 list 的编号 - selfIncrement
// 在接下来的表述中
// head-list 表示 head 模式的 list
// selfIncrement-list 表示 selfIncrement 模式的 list
//
// head:
// 1. head 作为一组列表的开头, 决定一组列表 index 的下界
// 2. head-list 的 index 不一定为 1,
//    当在 head-list 前 (相邻) 添加一个新 list 时,
//    该 head-list 模式切换为 selfIncrement,
//    新添加的 list 模式为 head
// 3. 在 head-list 中换行后新添加的 list 为 selfIncrement-list
//
// --------------------------------------------------
//
// 有三种切换行为 (method):
// 继续之前的编号 - continue
// 开始新列表 - reStart
// 切换编号 - change
// 切换行为的触发有条件限制
//
// head-list:
// 1. 当且仅当当前 head-list 前有另外的 head-list 时才可触发
//    continue, 触发相当于当前 head-list 的模式转为 selfIncrement
// 2. 当且仅当当前 head-list 的 index 不为 1 时才可触发 reStart,
//    触发相当于将当前 head-list 的 index 设为 1
// 3. 任何时候均可触发 change
//
// selfIncrement-list:
// 1. 任何时候均不可触发 continue
// 2. 任何时候均可触发 reStart, 相当于将当前 selfIncrement-list
//    的模式转为 head, 并设 index 为 1
// 3. 任何时候均可触发 change, 相当于将当前 selfIncrement-list
//    的模式转为 head
const List: React.FC<CustomRenderElementProps<IList>> = ({ attributes, children, element }) => {
  if (element.listType === "ordered") {
    return (
      <div
        {...attributes}
        style={{
          margin: "8px 0",
        }}
      >
        <span
          contentEditable={false}
          style={{
            display: "inline-block",
            userSelect: "none",
            minWidth: "22px",
            color: "#5a87f7",
          }}
        >
          {element.index}.
        </span>
        {children}
      </div>
    )
  } else {
    return (
      <div
        {...attributes}
        style={{
          margin: "8px 0",
        }}
      >
        <span
          contentEditable={false}
          style={{
            display: "inline-block",
            userSelect: "none",
            width: "22px",
            color: "#5a87f7",
          }}
        >
          {"\u2022"}
        </span>
        {children}
      </div>
    )
  }
}

export default List
