import type { CustomRenderElementProps } from "../../../../types/utils"
import type { IList } from "./types"

// 对于有序列表有两种模式 (状态):
// 作为列表开头 - head
// 跟随前一个 list 的编号 - selfIncrement
//
// 其中  head 作为一组列表的开头, 决定一组列表 index 的下界
// 在接下来的表述中,
// head-list 表示 head 模式的 list,
// selfIncrement-list 表示 selfIncrement 模式的 list
//
// --------------------------------------------------
//
// 有三种切换行为:
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
  } else if (element.listType === "unordered") {
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
  } else {
    return (
      <div
        {...attributes}
        style={{
          margin: "8px 0",
          paddingLeft: "22px",
        }}
      >
        {children}
      </div>
    )
  }
}

export default List
