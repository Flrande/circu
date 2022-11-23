// import React from "react"
import * as ReactDOMClient from "react-dom/client"
import App from "./App"

import "overlayscrollbars/overlayscrollbars.css"
import "lxgw-wenkai-webfont/style.css"
import "./normalize.css"
import "@icon-park/react/styles/index.css"
import "./styles/index.css"
import "./editor.css"

document.body.setAttribute("arco-theme", "dark")

const container = document.getElementById("root")
if (!container) throw "Can't find root dom."

const root = ReactDOMClient.createRoot(container)

root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
