import { CSSProperties, useEffect, useRef, useState } from "react"

const DocList: React.FC<{
  docs: {
    name: string
    author: string
    lastModify: string
  }[]
}> = () => {
  const [isHeadHover, setIsHeadHover] = useState(false)

  const headDom = useRef<HTMLDivElement>(null)
  const [firstCol, setFirstCol] = useState(350)
  const [secondCol, setSecondCol] = useState(600)
  const [thirdCol, setThirdCol] = useState(350)

  const [isFirstDrag, setIsFirstDrag] = useState(false)
  const [isSecondDrag, setIsSecondDrag] = useState(false)
  useEffect(() => {
    // 第一列不小于 140, 第二第三列不小于100
    if (isFirstDrag && headDom.current) {
      const controller = new AbortController()
      const head = headDom.current

      const headRect = head.getBoundingClientRect()

      document.addEventListener(
        "mousemove",
        (event) => {
          const xOffset = event.clientX - headRect.left
          if (isFirstDrag && xOffset >= 140 && head.clientWidth - thirdCol - xOffset >= 100) {
            setFirstCol(xOffset)
            setSecondCol(head.clientWidth - thirdCol - xOffset)
          }
        },
        {
          signal: controller.signal,
        }
      )
      document.addEventListener(
        "mouseup",
        () => {
          setIsFirstDrag(false)
        },
        {
          signal: controller.signal,
        }
      )

      return () => {
        controller.abort()
      }
    }

    if (isSecondDrag && headDom.current) {
      const controller = new AbortController()
      const head = headDom.current

      const headRect = head.getBoundingClientRect()

      document.addEventListener(
        "mousemove",
        (event) => {
          const xOffset = event.clientX - headRect.left
          if (isSecondDrag && head.clientWidth - xOffset >= 100 && xOffset - firstCol >= 100) {
            setSecondCol(xOffset - firstCol)
            setThirdCol(head.clientWidth - xOffset)
          }
        },
        {
          signal: controller.signal,
        }
      )
      document.addEventListener(
        "mouseup",
        () => {
          setIsSecondDrag(false)
        },
        {
          signal: controller.signal,
        }
      )

      return () => {
        controller.abort()
      }
    }
  }, [isFirstDrag, isSecondDrag])

  return (
    <div
      style={
        {
          "--first-col": `${firstCol}px`,
          "--second-col": `${secondCol}px`,
          "--third-col": `${thirdCol}px`,
          "--first-drag-border": isFirstDrag ? "1px solid #4c88ff" : "null",
          "--second-drag-border": isSecondDrag ? "1px solid #4c88ff" : "null",
        } as CSSProperties
      }
    >
      <div
        ref={headDom}
        onMouseEnter={() => {
          setIsHeadHover(true)
        }}
        onMouseLeave={() => {
          setIsHeadHover(false)
        }}
        className={"flex pb-2 text-[#a6a6a6]"}
      >
        <div className={"flex justify-between basis-[var(--first-col)] mr-2"}>
          <div>
            <span>名称</span>
          </div>
          <div
            onMouseDown={() => {
              setIsFirstDrag(true)
            }}
            className={"w-1 border-x border-[#505050] cursor-col-resize"}
            style={{
              display: isHeadHover || isFirstDrag || isSecondDrag ? undefined : "none",
            }}
          ></div>
        </div>
        <div className={"flex justify-between basis-[var(--second-col)] mr-2"}>
          <div>
            <span>所有者</span>
          </div>
          <div
            onMouseDown={() => {
              setIsSecondDrag(true)
            }}
            className={"w-1 border-x border-[#505050] cursor-col-resize"}
            style={{
              display: isHeadHover || isFirstDrag || isSecondDrag ? undefined : "none",
            }}
          ></div>
        </div>
        <div className={"flex justify-between basis-[var(--third-col)] mr-2"}>
          <div>
            <span>修改时间</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocList
