import React from "react"

import { createRoot } from "react-dom/client"

// The app's real Tailwind v4 + HeroUI stylesheet — same import Storybook's preview uses.
import "@/app/globals.css"

import { App } from "./App"

const container = document.getElementById("root")
if (!container) throw new Error("Flowbook: #root not found")

createRoot(container).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
