import useSWR from "swr"
import type { IDoc, IDocId } from "./interface"

//TODO: mock 数据, 联调时删去
const mockDocData: IDoc[] = [
  {
    id: "doc_1",
    parent: "fld_1",
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
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "doc_2",
    parent: "fld_1",
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
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "doc_3",
    parent: "fld_1",
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
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "doc_4",
    parent: "fld_2",
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
    authorId: "usr_1",
    administratorsId: ["usr_1"],
    collaboratorsId: ["usr_1"],
    readersId: ["usr_1"],
  },
  {
    id: "doc_5",
    parent: "fld_2",
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

export const useDoc = (id: string) => {
  const { data, error } = useSWR(["/api/doc", id], getDoc)

  return {
    doc: data,
    errorGetDoc: error,
  }
}
