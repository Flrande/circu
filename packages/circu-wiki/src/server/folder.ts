import useSWR from "swr"
import type { IFolder, IFolderId } from "./interface"

//TODO: mock 数据, 联调时删去
const mockFoldersData: IFolder[] = [
  {
    id: "fld_1",
    parent: null,
    name: "测试文件夹-1",
    description: null,
    childrenId: ["fld_2", "doc_1", "doc_2", "doc_3"],
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "fld_2",
    parent: "fld_1",
    name: "测试文件夹-2",
    description: null,
    childrenId: ["doc_4", "doc_5"],
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "fld_3",
    parent: null,
    name: "测试文件夹-3",
    description: null,
    childrenId: [],
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
]

const getFoldersId = async (url: string): Promise<IFolderId[]> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockFoldersData.filter((folder) => !folder.parent).map((folder) => folder.id)
}

const getFolder = async (url: string, folderId: IFolderId): Promise<IFolder> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockFoldersData.find((folder) => folder.id === folderId)!
}

export const useFoldersId = () => {
  const { data, error } = useSWR("/api/folder", getFoldersId)

  return {
    foldersId: data,
    errorGetFolders: error,
  }
}

export const useFolder = (folderId: IFolderId) => {
  const { data, error } = useSWR(["/api/folder", folderId], getFolder)

  return {
    folder: data,
    errorGetFolder: error,
  }
}
