"use client"

import React from "react"
import {
    ListBox,
    Select,
    cn,
} from "@heroui/react"
import CodeMirror from "@uiw/react-codemirror"
import { java } from "@codemirror/lang-java"
import { javascript } from "@codemirror/lang-javascript"
import { StreamLanguage } from "@codemirror/language"
import type { Extension } from "@codemirror/state"
import { csharp } from "@codemirror/legacy-modes/mode/clike"
import { dockerFile } from "@codemirror/legacy-modes/mode/dockerfile"
import { go } from "@codemirror/legacy-modes/mode/go"
import { whiteLight } from "@uiw/codemirror-theme-white"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { ProgrammingLanguage } from "@/modules/types/enums/programming-language"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { MockInterviewDiagram } from "../MockInterviewDiagram"
import type {
    MockInterviewDiagramEdgeSnapshot,
    MockInterviewDiagramNodeSnapshot,
} from "../MockInterviewDiagram"

/** Every language {@link ProgrammingLanguage} covers — used to tell an implementation-track
 *  language apart from an arbitrary content language (`dockerfile`, `yaml`, …) below. */
const KNOWN_PROGRAMMING_LANGS: ReadonlySet<string> = new Set(Object.values(ProgrammingLanguage))

/**
 * CodeMirror language extension for the workspace's given code — NOT restricted to
 * {@link ProgrammingLanguage} (a debug/review/optimize question can ship ANY content language
 * authored in `.mount`, e.g. `dockerfile`). TypeScript/Java use official `@codemirror/lang-*`
 * packages; Csharp/Go/Dockerfile have no first-party CM6 package, so they fall back to
 * `@codemirror/legacy-modes`' ported CM5 grammars (still solid token-level highlighting).
 * Anything else falls back to NO language extension (plain, still fully editable) rather than
 * silently mislabeling it as TypeScript (2026-07-17 fix — the prior default did exactly that).
 */
const languageExtensionFor = (lang: string): Array<Extension> => {
    switch (lang) {
    case ProgrammingLanguage.Java:
        return [java()]
    case ProgrammingLanguage.Csharp:
        return [StreamLanguage.define(csharp)]
    case ProgrammingLanguage.Go:
        return [StreamLanguage.define(go)]
    case "dockerfile":
        return [StreamLanguage.define(dockerFile)]
    case ProgrammingLanguage.TypeScript:
        return [javascript({ typescript: true })]
    default:
        return []
    }
}

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
    /**
     * Language the given code is authored in — a raw content-language string, NOT narrowed to
     * {@link ProgrammingLanguage} (that enum is the 4 CANDIDATE-CHOSEN implementation tracks;
     * a debug/review/optimize question's given code can be any authored language, e.g. `dockerfile`).
     */
    lang: string
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
 * CodeMirror code editor for a debug/review/optimize question's given code.
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

    // display label for a language — translated for the 4 real implementation tracks,
    // capitalized-as-authored for anything else (`dockerfile`, `yaml`, …) so an
    // uncommon content language reads as a normal label instead of a raw i18n key
    // (2026-07-17 fix — see `languageExtensionFor`'s doc for the same root cause).
    const displayLangLabel = (lang: string): string =>
        KNOWN_PROGRAMMING_LANGS.has(lang) ? t(`programmingLanguage.${lang}`) : lang.charAt(0).toUpperCase() + lang.slice(1)

    // only offer languages actually AUTHORED for this question (mirrors
    // ChallengeView only showing tabs for languages that exist).
    const availableLangs = givenCodeVariants.map((variant) => variant.lang)
    const languageItems = availableLangs.map((lang) => ({
        id: lang,
        title: displayLangLabel(lang),
    }))
    const selectedLanguageTitle = languageItems.find((item) => item.id === codeState.lang)?.title

    return (
        <div className={cn("flex h-full flex-col gap-3", className)}>
            <div className={cn("min-h-0 flex-1", tool !== "whiteboard" && "hidden")}>
                <MockInterviewDiagram className="h-full" onChange={onDiagramChange} />
            </div>

            {/* a REAL editor (CodeMirror) — a debug/review/optimize question seeds its given
                code here for the candidate to FIX in place (not a plain textarea): line numbers +
                syntax highlighting = editing, not narrating. Switched from Monaco (2026-07-17,
                thầy: "code terminal này hơi xấu" + pointed at react-codemirror's theme gallery) —
                CM6 ships a clean, tunable theme system (no VS-Code-IDE chrome to fight) and its
                content DOM disables the browser's native spellcheck by default, so the red
                squiggly-underline bug Monaco had doesn't exist here at all. Toolbar + editor now
                share ONE bordered card (was: a floating `Select` + a separately-boxed editor with
                a gap between them, reading as 2 unrelated pieces) — same aesthetic pass. */}
            <div className={cn("flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-default", tool !== "code" && "hidden")}>
                <div className="flex items-center border-b border-default bg-default/40 px-3 py-2">
                    {languageItems.length > 1 ? (
                        <Select.Root<{ id: string }, "single">
                            aria-label={t("mockInterview.workspace.languageLabel")}
                            selectedKey={codeState.lang}
                            onSelectionChange={(key) => {
                                if (!key) {
                                    return
                                }
                                const nextLang = String(key)
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
                    ) : (
                        // exactly 1 authored variant — nothing to SWITCH between, so a picker
                        // would be pure chrome (and, before this fix, the very control that
                        // rendered an untranslated raw i18n key for a non-{ts,java,csharp,go}
                        // language like `dockerfile`). A plain label is honest about there
                        // being one fixed language for this question's given code.
                        <span className="text-sm font-medium text-muted">{displayLangLabel(codeState.lang)}</span>
                    )}
                </div>
                <div className="min-h-0 flex-1">
                    <CodeMirror
                        height="100%"
                        theme={theme === "dark" ? vscodeDark : whiteLight}
                        value={codeState.code}
                        extensions={languageExtensionFor(codeState.lang)}
                        onChange={(value) => onCodeStateChange({ ...codeState, code: value })}
                        style={{ height: "100%", fontSize: 14 }}
                    />
                </div>
            </div>
        </div>
    )
}
