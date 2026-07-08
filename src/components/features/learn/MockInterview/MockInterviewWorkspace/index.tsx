"use client"

import React from "react"
import {
    ListBox,
    Select,
    cn,
} from "@heroui/react"
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { ProgrammingLanguage } from "@/modules/types/enums/programming-language"
import { DEFAULT_PROGRAMMING_LANGUAGES } from "@/modules/types/utils/programming-language"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { MockInterviewDiagram } from "../MockInterviewDiagram"
import type {
    MockInterviewDiagramEdgeSnapshot,
    MockInterviewDiagramNodeSnapshot,
} from "../MockInterviewDiagram"

/**
 * Which tool the {@link MockInterviewWorkspace} shows — driven ENTIRELY by the
 * current question, never by a candidate-facing switcher (2026-07-09 feedback:
 * a manual Whiteboard/Code/Notes tab bar read as "xàm" busywork). A
 * debug/review/optimize question (given code) renders straight to `"code"`; a
 * `mode="design"` phase renders straight to `"whiteboard"`.
 */
type MockInterviewTool = "whiteboard" | "code"

/** Controlled code-tab state (language + source), lifted so switching tabs never loses it. */
export interface MockInterviewCodeState {
    /** Language the candidate is writing in. */
    lang: ProgrammingLanguage
    /** Code buffer. */
    code: string
}

/** Props for {@link MockInterviewWorkspace}. */
export interface MockInterviewWorkspaceProps extends WithClassNames<undefined> {
    /** Which tool renders — set by the caller from the current question, not by the candidate. */
    tool: MockInterviewTool
    /** Whiteboard change callback — mirrors {@link MockInterviewDiagram}'s `onChange` (read at grade time). */
    onDiagramChange: (
        nodes: Array<MockInterviewDiagramNodeSnapshot>,
        edges: Array<MockInterviewDiagramEdgeSnapshot>,
    ) => void
    /** Controlled code-tab state. */
    codeState: MockInterviewCodeState
    /** Fired with the next code-tab state. */
    onCodeStateChange: (next: MockInterviewCodeState) => void
    /**
     * Every authored language variant of the CURRENT question's given code —
     * switching the language `Select` looks up the matching variant here and
     * swaps `codeState.code` to it, client-side, no refetch (mirrors
     * `ChallengeView`'s own per-language step content). Empty when the
     * current question has no given code (`tool !== "code"`).
     */
    givenCodeVariants?: Array<{ lang: string, code: string }>
}

/** Default code-tab state — TypeScript, empty buffer. */
export const MOCK_INTERVIEW_CODE_STATE_DEFAULT: MockInterviewCodeState = {
    lang: ProgrammingLanguage.TypeScript,
    code: "",
}

/**
 * The mock interview's right-pane WORKSPACE — renders straight to the ONE tool
 * the current question needs (no candidate-facing switcher): the
 * {@link MockInterviewDiagram} xyflow canvas for a `mode="design"` phase, or a
 * Monaco code editor for a debug/review/optimize question's given code.
 *
 * Both stay MOUNTED (toggled with `hidden`, not conditionally rendered) so an
 * in-progress sketch survives a `qna` session moving between a code question
 * and a plain one.
 *
 * @param props - {@link MockInterviewWorkspaceProps}
 */
export const MockInterviewWorkspace = ({
    tool,
    onDiagramChange,
    codeState,
    onCodeStateChange,
    givenCodeVariants = [],
    className,
}: MockInterviewWorkspaceProps) => {
    const t = useTranslations()
    const { theme } = useTheme()

    // only offer languages actually AUTHORED for this question (mirrors
    // ChallengeView only showing tabs for languages that exist) — falls back to
    // the full default list if variants are somehow empty while the tool is
    // still "code" (shouldn't happen, but never leaves the picker blank).
    const availableLangs = givenCodeVariants.length > 0
        ? givenCodeVariants.map((variant) => variant.lang)
        : DEFAULT_PROGRAMMING_LANGUAGES
    const languageItems = availableLangs.map((lang) => ({
        id: lang,
        title: t(`programmingLanguage.${lang}`),
    }))
    const selectedLanguageTitle = languageItems.find((item) => item.id === codeState.lang)?.title

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className={cn(tool !== "whiteboard" && "hidden")}>
                <MockInterviewDiagram onChange={onDiagramChange} />
            </div>

            <div className={cn("flex flex-col gap-2", tool !== "code" && "hidden")}>
                <Select.Root<{ id: string }, "single">
                    aria-label={t("mockInterview.workspace.languageLabel")}
                    selectedKey={codeState.lang}
                    onSelectionChange={(key) => {
                        if (!key) {
                            return
                        }
                        const nextLang = String(key) as ProgrammingLanguage
                        // switching language swaps in that variant's OWN given code
                        // (client-side lookup, no refetch) — not just a re-label of
                        // the same buffer under a different syntax highlighter
                        const variant = givenCodeVariants.find((candidate) => candidate.lang === nextLang)
                        onCodeStateChange({ lang: nextLang, code: variant?.code ?? codeState.code })
                    }}
                >
                    <Select.Trigger aria-label={t("mockInterview.workspace.languageLabel")} className="w-40">
                        <Select.Value>
                            {() => <span>{selectedLanguageTitle}</span>}
                        </Select.Value>
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox.Root aria-label={t("mockInterview.workspace.languageLabel")} items={languageItems}>
                            {(item) => (
                                <ListBox.Item key={item.id} id={item.id} textValue={item.title}>
                                    <span>{item.title}</span>
                                </ListBox.Item>
                            )}
                        </ListBox.Root>
                    </Select.Popover>
                </Select.Root>
                {/* a REAL editor (Monaco) — a debug/review/optimize question seeds its
                    given code here for the candidate to FIX in place (not a plain
                    textarea): line numbers + syntax highlighting = editing, not narrating */}
                <div className="h-72 overflow-hidden rounded-xl border border-default">
                    <Editor
                        height="100%"
                        language={codeState.lang}
                        theme={theme === "dark" ? "vs-dark" : "light"}
                        value={codeState.code}
                        onChange={(value) => onCodeStateChange({ ...codeState, code: value ?? "" })}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            scrollBeyondLastLine: false,
                            padding: { top: 12, bottom: 12 },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
