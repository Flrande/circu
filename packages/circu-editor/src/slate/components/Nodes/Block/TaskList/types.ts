import type { __IBlockElementChildren, __IBlockElementContent } from "../BlockWrapper/types"

export type ITaskList = {
  type: "task-list"
  isFolded?: true
  isHidden?: true
  isCompleted?: true
  children: [__IBlockElementContent, __IBlockElementChildren] | [__IBlockElementContent]
}
