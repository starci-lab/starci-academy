"use client"

import React from "react"
import {
    ListBox,
    Select,
    TextArea,
    TextField,
    cn,
} from "@heroui/react"
import Editor from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { ProgrammingLanguage } from "@/modules/types/enums/programming-language"
import { DEFAULT_PROGRAMMING_LANGUAGES } from "@/modules/types/utils/programming-language"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { MockInterviewDiagram } from "../MockInterviewDiagram"
import type {
    MockInterviewDiagramEdgeSnapshot,
    MockInterviewDiagramNodeSnapshot,
} from "../MockInterviewDiagram"

/** One tool tab of the {@link MockInterviewWorkspace} — "y như phỏng vấn thật". */
type MockInterviewTool = "whiteboard" | "code" | "notes"

/** Controlled code-tab state (language + source), lifted so switching tabs never loses it. */
export interface MockInterviewCodeState {
    /** Language the candidate is writing in. */
    lang: ProgrammingLanguage
    /** Code buffer. */
    code: string
}

/** Props for {@link MockInterviewWorkspace}. */
export interface MockInterviewWorkspaceProps extends WithClassNames<undefined> {
    /** Which tool tab is active. */
    tool: MockInterviewTool
    /** Fired when the candidate switches tools. */
    onToolChange: (tool: MockInterviewTool) => void
    /** Whiteboard change callback — mirrors {@link MockInterviewDiagram}'s `onChange` (read at grade time). */
    onDiagramChange: (
        nodes: Array<MockInterviewDiagramNodeSnapshot>,
        edges: Array<MockInterviewDiagramEdgeSnapshot>,
    ) => void
    /** Whether the whiteboard currently has any box on it (drives its tab dot). */
    hasDiagramContent: boolean
    /** Controlled code-tab state. */
    codeState: MockInterviewCodeState
    /** Fired with the next code-tab state. */
    onCodeStateChange: (next: MockInterviewCodeState) => void
    /** Controlled notes-tab text. */
    notes: string
    /** Fired with the next notes text. */
    onNotesChange: (next: string) => void
}

/** Default code-tab state — TypeScript, empty buffer. */
export const MOCK_INTERVIEW_CODE_STATE_DEFAULT: MockInterviewCodeState = {
    lang: ProgrammingLanguage.TypeScript,
    code: "",
}

/** A small filled dot marking a tool tab whose artifact is non-empty. */
const ArtifactDot = () => (
    <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
)

/**
 * The mock interview's right-pane WORKSPACE — a `TabsCard` switching between three
 * candidate tools, "y như phỏng vấn thật" (CoderPad-style: whiteboard ⇆ code ⇆ notes
 * in one pad): the existing {@link MockInterviewDiagram} xyflow canvas, a plain code
 * textarea (with a language picker), and a plain notes textarea.
 *
 * All three tools stay MOUNTED at once (toggled with `hidden`, not conditionally
 * rendered) so switching tabs never destroys an artifact — the diagram keeps its own
 * xyflow state internally, and the code/notes buffers are controlled by the parent.
 * A tab whose artifact is non-empty shows a small dot in its label.
 *
 * @param props - {@link MockInterviewWorkspaceProps}
 */
export const MockInterviewWorkspace = ({
    tool,
    onToolChange,
    onDiagramChange,
    hasDiagramContent,
    codeState,
    onCodeStateChange,
    notes,
    onNotesChange,
    className,
}: MockInterviewWorkspaceProps) => {
    const t = useTranslations()
    const { theme } = useTheme()

    const languageItems = DEFAULT_PROGRAMMING_LANGUAGES.map((lang) => ({
        id: lang,
        title: t(`programmingLanguage.${lang}`),
    }))
    const selectedLanguageTitle = languageItems.find((item) => item.id === codeState.lang)?.title

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <TabsCard
                leftTabs={{
                    items: [
                        {
                            key: "whiteboard",
                            label: (
                                <span className="flex items-center gap-1.5">
                                    {t("mockInterview.workspace.whiteboard")}
                                    {hasDiagramContent ? <ArtifactDot /> : null}
                                </span>
                            ),
                        },
                        {
                            key: "code",
                            label: (
                                <span className="flex items-center gap-1.5">
                                    {t("mockInterview.workspace.code")}
                                    {codeState.code.trim().length > 0 ? <ArtifactDot /> : null}
                                </span>
                            ),
                        },
                        {
                            key: "notes",
                            label: (
                                <span className="flex items-center gap-1.5">
                                    {t("mockInterview.workspace.notes")}
                                    {notes.trim().length > 0 ? <ArtifactDot /> : null}
                                </span>
                            ),
                        },
                    ],
                    selectedKey: tool,
                    ariaLabel: t("mockInterview.workspace.ariaLabel"),
                    onSelectionChange: (key) => onToolChange(String(key) as MockInterviewTool),
                }}
            />

            {/* all three tools stay mounted — only visibility toggles, so an in-progress
                sketch/code/notes buffer is never lost when the candidate switches tabs */}
            <div className={cn(tool !== "whiteboard" && "hidden")}>
                <MockInterviewDiagram onChange={onDiagramChange} />
            </div>

            <div className={cn("flex flex-col gap-2", tool !== "code" && "hidden")}>
                <Select.Root<{ id: string }, "single">
                    aria-label={t("mockInterview.workspace.languageLabel")}
                    selectedKey={codeState.lang}
                    onSelectionChange={(key) => {
                        if (key) {
                            onCodeStateChange({ ...codeState, lang: String(key) as ProgrammingLanguage })
                        }
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

            <div className={cn(tool !== "notes" && "hidden")}>
                <TextField variant="secondary" className="w-full">
                    <TextArea
                        rows={12}
                        value={notes}
                        onChange={(event) => onNotesChange(event.target.value)}
                        placeholder={t("mockInterview.workspace.notesPlaceholder")}
                        className="resize-none"
                        aria-label={t("mockInterview.workspace.notes")}
                    />
                </TextField>
            </div>
        </div>
    )
}
