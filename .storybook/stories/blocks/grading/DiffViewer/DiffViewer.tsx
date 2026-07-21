import React from "react"
import { Typography, cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/grading/DiffViewer`. Authored in Storybook (not `src`);
 * synced to `src` later. NO `@/components` imports. In `src` the props type
 * extends `WithClassNames<undefined>`; the `className` field is INLINED here so
 * the local port stays self-contained.
 */

/** The kind of a diff line: an addition, a deletion, or unchanged context. */
export type DiffLineType = "add" | "del" | "ctx"

/** One pre-parsed line of a diff. The caller does the diffing; this block only renders. */
export interface DiffLine {
    /** Whether the line was added, removed, or is unchanged context. */
    type: DiffLineType
    /** The raw text content of the line (without the leading +/-/space marker). */
    content: string
    /** Line number in the OLD file. Omit for pure additions. */
    oldNumber?: number
    /** Line number in the NEW file. Omit for pure deletions. */
    newNumber?: number
}

/** A contiguous group of diff lines, optionally introduced by a hunk header. */
export interface DiffHunk {
    /** Optional hunk header (e.g. "@@ -1,4 +1,5 @@" or a section label). */
    header?: string
    /** The pre-parsed lines that make up this hunk. */
    lines: DiffLine[]
}

/** How the diff is laid out. */
export type DiffViewerVariant = "unified" | "split"

/**
 * Props for the {@link DiffViewer} block.
 *
 * Tier-3 presentational: props-only, no store/SWR/fetch, and no diff ALGORITHM —
 * the caller supplies already-parsed hunks. Used for grading feedback that
 * compares student code against a suggested fix.
 */
export interface DiffViewerProps {
    /** Optional filename shown in the header bar above the diff (e.g. "src/auth.ts"). */
    filename?: string
    /** The pre-parsed hunks to render, in order. */
    hunks: DiffHunk[]
    /**
     * Layout variant. `"unified"` (default) stacks all lines in a single column;
     * `"split"` places the old file on the left and the new file on the right.
     */
    variant?: DiffViewerVariant
    /** Extra classes on the outer frame. */
    className?: string
}

/** type → row background + text color classes (tokens only). */
const LINE_TONE: Record<DiffLineType, string> = {
    add: "bg-success-soft text-success-soft-foreground",
    del: "bg-danger-soft text-danger-soft-foreground",
    ctx: "text-foreground",
}

/** type → the leading marker glyph in the unified gutter. */
const LINE_MARKER: Record<DiffLineType, string> = {
    add: "+",
    del: "-",
    ctx: " ",
}

/** A monospace line-number cell in the gutter (right-aligned, non-selectable). */
const NumberCell = ({ value }: { value?: number }) => (
    <span className="w-10 shrink-0 select-none pr-2 text-right tabular-nums text-muted-foreground">
        {value ?? ""}
    </span>
)

/** One rendered line in the UNIFIED layout: [old #][new #][marker][content]. */
const UnifiedRow = ({ line }: { line: DiffLine }) => (
    <div className={cn("flex items-start", LINE_TONE[line.type])}>
        <NumberCell value={line.oldNumber} />
        <NumberCell value={line.newNumber} />
        <span className="w-4 shrink-0 select-none text-center">
            {LINE_MARKER[line.type]}
        </span>
        <span className="whitespace-pre pr-4">{line.content}</span>
    </div>
)

/** One side of the SPLIT layout: a single line number + content, or a blank filler row. */
const SplitCell = ({ line, side }: { line: DiffLine | null; side: "old" | "new" }) => (
    <div
        className={cn(
            "flex items-start",
            // A filler cell (no line on this side) stays neutral; a real line gets its tone.
            line ? LINE_TONE[line.type] : "text-foreground",
        )}
    >
        <NumberCell value={side === "old" ? line?.oldNumber : line?.newNumber} />
        <span className="whitespace-pre pr-4">{line ? line.content : ""}</span>
    </div>
)

/**
 * DiffViewer renders a code diff for grading feedback — student code versus a
 * suggested fix. It accepts PRE-PARSED hunks (no diff algorithm lives here) and
 * shows a filename header bar, a line-number gutter, and token-colored line
 * backgrounds: additions use `bg-success-soft`, deletions `bg-danger-soft`, and
 * context stays neutral. Long lines never break the page — the code area scrolls
 * horizontally inside its own `overflow-x-auto` container.
 *
 * `variant="unified"` (default) stacks every line in one column with +/-/space
 * markers. `variant="split"` places the old file on the left and the new file on
 * the right; each source line lands on its own side while context appears on both.
 *
 * Tier-3 presentational block: props-only, no store, no SWR, no side-effects.
 *
 * @param props - {@link DiffViewerProps}
 */
export const DiffViewer = ({
    filename,
    hunks,
    variant = "unified",
    className,
}: DiffViewerProps) => {
    return (
        <div
            className={cn(
                "overflow-hidden rounded-xl border border-default bg-surface",
                className,
            )}
        >
            {/* Filename header bar — sits above the scrollable code area */}
            {filename ? (
                <div className="border-b border-default bg-default px-4 py-2">
                    <Typography type="body-sm" weight="medium" className="font-mono">
                        {filename}
                    </Typography>
                </div>
            ) : null}

            {/* Horizontal-scroll container so long lines never break the page */}
            <div className="overflow-x-auto">
                <div className="min-w-fit py-1 font-mono text-xs leading-relaxed">
                    {hunks.map((hunk, hunkIndex) => (
                        <div key={hunkIndex}>
                            {/* Optional hunk header — muted separator row */}
                            {hunk.header ? (
                                <div className="whitespace-pre bg-default px-4 py-1 text-muted-foreground">
                                    {hunk.header}
                                </div>
                            ) : null}

                            {variant === "split"
                                ? hunk.lines.map((line, lineIndex) => (
                                    <div
                                        key={lineIndex}
                                        className="grid grid-cols-2 divide-x divide-default"
                                    >
                                        {/* Old side hides pure additions; new side hides pure deletions */}
                                        <SplitCell
                                            line={line.type === "add" ? null : line}
                                            side="old"
                                        />
                                        <SplitCell
                                            line={line.type === "del" ? null : line}
                                            side="new"
                                        />
                                    </div>
                                ))
                                : hunk.lines.map((line, lineIndex) => (
                                    <UnifiedRow key={lineIndex} line={line} />
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
