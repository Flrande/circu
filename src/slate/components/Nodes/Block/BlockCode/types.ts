import type { KeysUnion } from "../../../../types/utils"
import type { CustomTextType } from "../../Text/types"

// [显示格式] - [Prism 对应 key string] (PlainText 为特例)
export type CodeAreaLangMap = {
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

export type BlockCode_CodeLineType = {
  type: "blockCode_codeLine"
  children: CustomTextType[]
}

export type BlockCode_CodeAreaType = {
  type: "blockCode_codeArea"
  lang: KeysUnion<CodeAreaLangMap> // 显示格式
  children: BlockCode_CodeLineType[]
}

export type BlockCode_VoidAreaType = {
  type: "blockCode_voidArea"
  children: CustomTextType[]
}

export type BlockCodeType = {
  type: "blockCode"
  //TODO: 用元组添加类型约束
  // 需遵循 VoidArea - CodeArea - VoidArea
  children: (BlockCode_CodeAreaType | BlockCode_VoidAreaType)[]
}
