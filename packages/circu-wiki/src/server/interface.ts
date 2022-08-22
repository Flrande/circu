import type { CustomElement, CustomText } from "circu-editor"

type IDOC_ID_PREFIX = "doc"
type IUSER_ID_PREFIX = "usr"
export const DOC_ID_PREFIX: IDOC_ID_PREFIX = "doc"
export const USER_ID_PREFIX: IUSER_ID_PREFIX = "usr"

export type IDocId = `${IDOC_ID_PREFIX}_${string}`
export type IUserId = `${IUSER_ID_PREFIX}_${string}`

export interface IDoc {
  id: IDocId
  lastModify: string
  title: string
  value: (CustomElement | CustomText)[]
  parentId: IDocId | null
  childrenId: IDocId[]
  authorId: IUserId
  administratorsId: IUserId[]
  collaboratorsId: IUserId[]
  readersId: IUserId[]
}
