import useSWR from "swr"
import type { IDoc, IDocId } from "./interface"

//TODO: mock 数据, 联调时删去
const mockDocData: IDoc[] = [
  {
    id: "doc_1",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-1",
    value: [
      {
        type: "title",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: "Demo",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    parentId: null,
    childrenId: ["doc_2", "doc_3"],
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "doc_2",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-2",
    value: [
      {
        type: "title",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: "Demo",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    parentId: "doc_1",
    childrenId: [],
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "doc_3",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-3",
    value: [
      {
        type: "title",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: "Demo",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    parentId: "doc_1",
    childrenId: [],
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "doc_4",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-4",
    value: [
      {
        type: "title",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: "Demo",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    parentId: null,
    childrenId: ["doc_5"],
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "doc_5",
    lastModify: "2021-10-10T14:48:00",
    title: "测试文档-5",
    value: [
      {
        type: "title",
        children: [
          {
            type: "__block-element-content",
            children: [
              {
                type: "text-line",
                children: [
                  {
                    text: "Demo",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    parentId: "doc_4",
    childrenId: [],
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
]

const getDoc = async (url: string, docId: IDocId): Promise<IDoc> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockDocData.find((doc) => doc.id === docId)!
}

const getTopDocs = async (url: string): Promise<IDoc[]> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("foo")
    }, 1000)
  })

  return mockDocData.filter((doc) => !doc.parentId)
}

/**
 * 通过文档 id 拿到特定文档数据的钩子
 *
 * @param id 文档 id
 * @returns 文档数据
 *
 */
export const useDoc = (id: string) => {
  const { data, error } = useSWR(["/api/doc", id], getDoc)

  return {
    doc: data,
    errorGetDoc: error,
  }
}

/**
 * 用于获得最顶层文档的钩子
 *
 * @returns 一个数组, 包含顶层的文档
 *
 */
export const useTopDocs = () => {
  const { data, error } = useSWR(["/api/doc"], getTopDocs)

  return {
    topDocs: data,
    errorGetTopDocs: error,
  }
}
