"use client"

import { OverlayStateContext } from "../OverlayStateContext"
import { use } from "react"

/**
 * Access the link-GitHub overlay state from {@link OverlayStateContext}.
 * @returns the link-GitHub overlay state handle.
 */
export const useLinkGithubOverlayState = () => {
    const { linkGithub } = use(OverlayStateContext)!
    return linkGithub
}
