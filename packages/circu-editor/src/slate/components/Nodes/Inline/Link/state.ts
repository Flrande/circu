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
 * link ----> linkStateAtom <---- linkEditBarStateDerivedAtom ----> linkEditBarStateAtom(不对外暴露)
 *                  ^
 *                  |
 *                  +---- linkBarStateAtom
 *
 * 每当光标移入 link 时, link 更新 linkStateAtom
 * linkBarStateAtom 为 readonly, 读取时自动转发到 linkStateAtom
 * linkEditBarStateDerivedAtom 需手动触发与 linkStateAtom 的同步 (状态在 linkEditBarStateAtom 中)
 *
 * 即 linkEditBar 的状态自己维持并手动同步,
 * 因为 linkEditBar 和 linkBar 不一定对应同一个 link
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

export const linkStateAtom = atom<linkState | null>(null)
export const linkBarStateAtom = atom((get) => {
  const linkState = get(linkStateAtom)
  if (linkState) {
    return {
      url: linkState.url,
      linkElementPath: linkState.linkElementPath,
      position: linkState.position,
    }
  }
  return linkState
})

const linkEditBarStateAtom = atom<linkState | null>(null)
export const linkEditBarStateDerivedAtom = atom(
  (get) => get(linkEditBarStateAtom),
  // 自动同步, 不用传参
  (get, set) => {
    const linkState = get(linkStateAtom)
    set(linkEditBarStateAtom, linkState)
  }
)
