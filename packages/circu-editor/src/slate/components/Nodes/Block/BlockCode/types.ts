import type { KeysUnion } from "../../../../types/utils"
import type { __IBlockElementChildren, __IBlockElementContent } from "../BlockWrapper/types"

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

export type IBlockCode = {
  type: "block-code"
  isHidden?: true
  langKey: KeysUnion<ICodeAreaLangMap> // langKey 是显示格式
  children: [__IBlockElementContent]
}
