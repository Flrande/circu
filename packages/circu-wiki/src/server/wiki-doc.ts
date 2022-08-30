import useSWR from "swr"

//TODO: mock 数据, 联调时删去
const mockWikiDocData: {
  id: string
  lastModify: string
  title: string
  authorId: string
  parentDocId: string | null
  childrenDocsId: string[]
}[] = [
  {
    id: "doc_1",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-1",
    authorId: "usr_1",
    parentDocId: null,
    childrenDocsId: ["doc_2", "doc_3"],
  },
  {
    id: "doc_2",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-2",
    authorId: "usr_1",
    parentDocId: "doc_1",
    childrenDocsId: [],
  },
  {
    id: "doc_3",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-3",
    authorId: "usr_1",
    parentDocId: "doc_1",
    childrenDocsId: [],
  },
  {
    id: "doc_4",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-4",
    authorId: "usr_1",
    parentDocId: null,
    childrenDocsId: ["doc_5"],
  },
  {
    id: "doc_5",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-5",
    authorId: "usr_1",
    parentDocId: "doc_4",
    childrenDocsId: [],
  },
]

// GET /api/doc/wiki?docid=${docId}
const getWikiDoc = async (
  url: string,
  docId: string
): Promise<{
  id: string
  lastModify: string
  title: string
  authorId: string
  parentDocId: string | null
  childrenDocsId: string[]
}> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockWikiDocData.find((doc) => doc.id === docId)!
}

// GET /api/doc/wiki
const getTopWikiDocs = async (
  url: string
): Promise<
  {
    id: string
    lastModify: string
    title: string
    authorId: string
    parentDocId: string | null
    childrenDocsId: string[]
  }[]
> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockWikiDocData.filter((doc) => !doc.parentDocId)
}

export const useWikiDoc = (id: string) => {
  return useSWR(["/api/doc/wiki", id], getWikiDoc)
}

export const useTopWikiDocs = () => {
  return useSWR(["/api/doc/wiki"], getTopWikiDocs)
}
