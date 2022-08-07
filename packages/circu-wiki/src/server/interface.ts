import type { CustomElement, CustomText } from "circu-editor"

type IDOC_ID_PREFIX = "doc"
type IFOLDER_ID_PREFIX = "fld"
type IUSER_ID_PREFIX = "usr"
export const DOC_ID_PREFIX: IDOC_ID_PREFIX = "doc"
export const FOLDER_ID_PREFIX: IFOLDER_ID_PREFIX = "fld"
export const USER_ID_PREFIX: IUSER_ID_PREFIX = "usr"

export type IDocId = `${IDOC_ID_PREFIX}_${string}`
export type IFolderId = `${IFOLDER_ID_PREFIX}_${string}`
export type IUserId = `${IUSER_ID_PREFIX}_${string}`

export interface IDoc {
  id: IDocId
  parent: IFolderId | null
  lastModify: string
  title: string
  value: (CustomElement | CustomText)[]
  authorId: IUserId
  administratorsId: IUserId[]
  collaboratorsId: IUserId[]
  readersId: IUserId[]
}

export interface IFolder {
  id: IFolderId
  parent: IFolderId | null
  name: string
  description: string | null
  childrenId: (IFolderId | IDocId)[]
  authorId: IUserId
  administratorsId: IUserId[]
  collaboratorsId: IUserId[]
  readersId: IUserId[]
}
