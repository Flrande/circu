import useSWR from "swr"

const mockGeneralDocData: {
  id: string
  lastModify: string
  title: string
  authorId: string
  parentFolderId: string | null
}[] = [
  {
    id: "doc_1",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-1",
    authorId: "usr_1",
    parentFolderId: null,
  },
  {
    id: "doc_2",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-2",
    authorId: "usr_1",
    parentFolderId: "fld_1",
  },
  {
    id: "doc_3",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-3",
    authorId: "usr_1",
    parentFolderId: "fld_1",
  },
  {
    id: "doc_4",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-4",
    authorId: "usr_1",
    parentFolderId: null,
  },
  {
    id: "doc_5",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-5",
    authorId: "usr_1",
    parentFolderId: "fld_2",
  },
]

const mockFolderData: {
  id: string
  lastModify: string
  title: string
  description: string | null
  authorId: string
  parentFolderId: string | null
  childrenDocsId: string[]
  childrenFoldersId: string[]
}[] = [
  {
    id: "fld_1",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文件夹-1",
    description: null,
    authorId: "usr_1",
    parentFolderId: null,
    childrenDocsId: ["doc_2", "doc_3"],
    childrenFoldersId: [],
  },
  {
    id: "fld_2",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文件夹-2",
    description: null,
    authorId: "usr_1",
    parentFolderId: null,
    childrenDocsId: ["doc_5"],
    childrenFoldersId: [],
  },
]

// GET api/doc?docid=${docId}
const getGeneralDoc = async (
  url: string,
  docId: string
): Promise<{
  id: string
  lastModify: string
  title: string
  authorId: string
  parentFolderId: string | null
}> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockGeneralDocData.find((doc) => doc.id === docId)!
}

// GET api/doc
const getTopGeneralDocs = async (
  url: string
): Promise<
  {
    id: string
    lastModify: string
    title: string
    authorId: string
    parentFolderId: string | null
  }[]
> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockGeneralDocData.filter((doc) => !doc.parentFolderId)
}

// GET api/folder?folderid=${folderId}
const getFolder = async (
  url: string,
  folderId: string
): Promise<{
  id: string
  lastModify: string
  title: string
  description: string | null
  authorId: string
  parentFolderId: string | null
  childrenDocsId: string[]
  childrenFoldersId: string[]
}> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockFolderData.find((folder) => folder.id === folderId)!
}

// GET api/folder
const getTopFolders = async (
  url: string
): Promise<
  {
    id: string
    lastModify: string
    title: string
    description: string | null
    authorId: string
    parentFolderId: string | null
    childrenDocsId: string[]
    childrenFoldersId: string[]
  }[]
> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockFolderData.filter((folder) => !folder.parentFolderId)!
}

export const useGeneralDoc = (id: string) => {
  return useSWR(["/api/doc", id], getGeneralDoc)
}

export const useTopGeneralDocs = () => {
  return useSWR(["/api/doc"], getTopGeneralDocs)
}

export const useFolder = (id: string) => {
  return useSWR(["/api/folder", id], getFolder)
}

export const useTopFolders = () => {
  return useSWR(["/api/folder"], getTopFolders)
}
