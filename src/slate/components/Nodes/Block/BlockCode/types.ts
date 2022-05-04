import type { CustomText } from "../../../../types/interface"
import type { KeysUnion } from "../../../../types/utils"

// [显示格式] - [Prism 对应 key string] (PlainText 为特例)
export type ICodeAreaLangMap = {
  PlainText: "plainText"
  C: "c"
  "C++": "cpp"
  Dart: "dart"
  Docker: "docker"
  Git: "git"
  Go: "go"
  GraphQL: "graphql"
  Haskell: "haskell"
  HTTP: "http"
  Javascript: "javascript"
  Java: "java"
  JSON: "json"
  LaTeX: "latex"
  Perl: "perl"
  PHP: "php"
  "PL/SQL": "plsql"
  SQL: "sql"
  WebAssembly: "wasm"
}

//TODO: Tab 缩进 (表现为空格?)
export type IBlockCode_CodeLine = {
  type: "blockCode_codeLine"
  children: CustomText[]
}

export type IBlockCode_CodeArea = {
  type: "blockCode_codeArea"
  langKey: KeysUnion<ICodeAreaLangMap> // 显示格式
  children: IBlockCode_CodeLine[]
}

export type IBlockCode_VoidArea = {
  type: "blockCode_voidArea"
  children: CustomText[]
}

export type IBlockCode = {
  type: "blockCode"
  // 需遵循 VoidArea - CodeArea - VoidArea
  children: [IBlockCode_VoidArea, IBlockCode_CodeArea, IBlockCode_VoidArea]
}
