export type CustomTextType = {
  text: string
  bold?: boolean // 加粗
  strike?: boolean // 删除线
  tokenTypes?: {
    [x: string]: boolean
  }
}
