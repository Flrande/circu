import { atom } from "jotai"

// 标记折叠按钮是否显示, 用于让拖拽按钮判断是否需要调整位置
export const isFoldButtonActiveAtom = atom(false)
