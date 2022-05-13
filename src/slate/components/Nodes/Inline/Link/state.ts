import { atom } from "jotai"
import type { Path } from "slate"

const isLinkBarActiveAtom = atom(false)
// isMouseEnterLinkBarOnceAtom 用于判断 500ms 后鼠标是否曾进入 linkBar 中
export const isMouseEnterLinkBarOnceAtom = atom(false)
export const isLinkBarActiveDerivedAtom = atom<
  boolean,
  {
    type: "delayed" | "instant"
    value: boolean
  }
>(
  (get) => get(isLinkBarActiveAtom),
  (get, set, action) => {
    if (action.type === "delayed") {
      setTimeout(() => {
        if (!get(isMouseEnterLinkBarOnceAtom)) {
          set(isLinkBarActiveAtom, action.value)
        }
      }, 500)
    } else {
      set(isLinkBarActiveAtom, action.value)
    }
  }
)

export const isLinkEditBarActiveAtom = atom(false)

/**
 *            linkStateAtom(不对外暴露)
 *                  ^
 *                  |
 * link ----> linkStateDerivedAtom <---- linkEditBarStateDerivedAtom ----> linkEditBarStateAtom(不对外暴露)
 *                  ^
 *                  |
 *                  +---- linkBarStateAtom
 * [箭头表示操作对象]
 * link 通过 linkStateDerivedAtom 更新 linkStateAtom
 * linkBarStateAtom 为 readonly, 自动转发, 实现自动同步
 * linkEditBarStateDerivedAtom 手动通过 linkStateDerivedAtom 与 linkStateAtom 同步
 *
 * 即 linkEditBar 的状态自己维持并手动同步,
 * 因为 linkEditBar 和 linkBar 并非一直对应同一个 link
 */
type linkState = {
  text: string
  url: string
  linkElementPath: Path
  position: {
    left: number
    top: number
  }
}
const linkStateAtom = atom<linkState | null>(null)
const linkEditBarStateAtom = atom<linkState | null>(null)
//TODO: 移除 linkStateDerivedAtom
export const linkStateDerivedAtom = atom(
  (get) => get(linkStateAtom),
  (_, set, update: linkState) => {
    set(linkStateAtom, update)
  }
)

export const linkBarStateAtom = atom((get) => {
  const linkState = get(linkStateDerivedAtom)
  if (linkState) {
    return {
      url: linkState.url,
      linkElementPath: linkState.linkElementPath,
      position: linkState.position,
    }
  }
  return linkState
})

export const linkEditBarStateDerivedAtom = atom(
  (get) => get(linkEditBarStateAtom),
  // 自动同步, 不用传参
  (get, set) => {
    const linkState = get(linkStateDerivedAtom)
    set(linkEditBarStateAtom, linkState)
  }
)
