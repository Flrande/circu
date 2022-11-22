// import React from 'react'
import * as ReactDOMClient from "react-dom/client"
import App from "./App"

import "react-loading-skeleton/dist/skeleton.css"
import "circu-editor/src/styles/index.css"
import "lxgw-wenkai-webfont/style.css"
import "./styles/index.css"

document.body.setAttribute("arco-theme", "dark")

const container = document.getElementById("root")
if (!container) throw "Can't find root dom."

const root = ReactDOMClient.createRoot(container)

root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
)
