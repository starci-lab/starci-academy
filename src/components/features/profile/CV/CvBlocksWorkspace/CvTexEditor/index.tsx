"use client"

import React from "react"
import { cn } from "@heroui/react"
import CodeMirror from "@uiw/react-codemirror"
import { StreamLanguage } from "@codemirror/language"
import { stex } from "@codemirror/legacy-modes/mode/stex"
import { whiteLight } from "@uiw/codemirror-theme-white"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { useTheme } from "next-themes"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link CvTexEditor}. */
export interface CvTexEditorProps extends WithClassNames<undefined> {
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
 * @param props - {@link CvTexEditorProps}
 */
export const CvTexEditor = ({ className, value, onChange }: CvTexEditorProps) => {
    const { theme } = useTheme()
    return (
        <div className={cn("h-full min-h-0 overflow-hidden rounded-xl", className)}>
            <CodeMirror
                height="100%"
                theme={theme === "dark" ? vscodeDark : whiteLight}
                value={value}
                extensions={[StreamLanguage.define(stex)]}
                onChange={onChange}
                style={{ height: "100%", fontSize: 14 }}
            />
        </div>
    )
}
