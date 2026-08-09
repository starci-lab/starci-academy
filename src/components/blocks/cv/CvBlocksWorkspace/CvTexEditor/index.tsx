"use client"

import React from "react"
import CodeMirror from "@uiw/react-codemirror"
import { StreamLanguage } from "@codemirror/language"
import { stex } from "@codemirror/legacy-modes/mode/stex"
import { whiteLight } from "@uiw/codemirror-theme-white"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { useTheme } from "next-themes"
import { Box } from "@/components/frames/Box"

/** Props for {@link CvTexEditor}. */
export interface CvTexEditorProps {
    /** Current `.tex` source (controlled). */
    value: string
    /** Fired with the next `.tex` source on every edit. */
    onChange: (next: string) => void
}

/**
 * The LaTeX (`.tex`) source editor — the "LaTeX" half of the block editor's
 * mode toggle. A CodeMirror instance with `stex` highlighting (same CM6 setup
 * the mock-interview code workspace uses), themed by the app's light/dark mode.
 * Editing hand-edits the `.tex` that the compiled-PDF preview then renders (and
 * that `renderCvBlocks` persists BE-side as `tex_source`).
 *
 * Root is {@link Box} — escape-hatch foreign mount for CodeMirror (third-party
 * surface no named frame can carry).
 *
 * @param props - {@link CvTexEditorProps}
 */
export const CvTexEditor = ({ value, onChange }: CvTexEditorProps) => {
    const { theme } = useTheme()
    return (
        <Box
            identity={{ tier: "block", component: "CvTexEditor" }}
            principle="flex-fill-base"
            explain="Foreign CodeMirror mount fills the editor pane so LaTeX source can scroll inside the workspace split without overflowing the shell."
            className={"h-full min-h-0 overflow-hidden rounded-xl"}
        >
            <CodeMirror
                height="100%"
                theme={theme === "dark" ? vscodeDark : whiteLight}
                value={value}
                extensions={[StreamLanguage.define(stex)]}
                onChange={onChange}
                style={{ height: "100%", fontSize: 14 }}
            />
        </Box>
    )
}
