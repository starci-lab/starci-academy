"use client"

import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

export const useLinkGithubOverlayState = () => {
    const { linkGithub } = use(OverlayStateContext)!
    return linkGithub
}
