import React from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { InfoIcon, LightbulbIcon, MapPinIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import {
    AsyncContentEmpty,
    AsyncContentError,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCardAccordion, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SubmissionFindingsList`: "Góp ý" — the quality-gate findings for one
 * graded attempt, one finding per accordion row.
 *
 * REUSE, NOT A NEW ACCORDION (the exact mistake this task exists to avoid — see
 * `ContentModeNav`'s file header). The `src` original (`FindingAccordionItem`
 * inside `SubmissionResult`) hand-rolled its own `Accordion.Item`/`Accordion.Trigger`
 * tree straight from raw HeroUI. This port goes through `SurfaceCard.Accordion`
 * instead — the composite ALREADY owns the bounded `bg-surface` frame, the
 * trigger row's icon+title+titleEnd+caret layout, its OWN `isSkeleton` mirror
 * (row-for-row, matching `items.length`), and its OWN `emptyState` slot (bounded
 * inside the same frame, never a bare/broken card). This block supplies none of
 * that shape — it only supplies the DOMAIN: which severity means which icon,
 * which findings sort first, and how a `location` string becomes a file link.
 *
 * WHAT THIS BLOCK OWNS (§14d.1 — domain vocabulary the caller must not hand in):
 *   • `SEVERITY_VISUAL` — severity → trigger icon, text tone, sort rank. Ported
 *     from `SubmissionResult`'s local table of the same name.
 *   • `sortFindings` — high → low, then by the findings' own authored order
 *     (`sortIndex`). Ported from `SubmissionResult`'s `sortedFeedbacks` memo.
 *   • `buildLocationHref` — `repositoryUrl` + a repo-relative `location` string
 *     become a `blob/HEAD` deep-link. Ported from `FindingAccordionItem`
 *     unchanged (strip a trailing `.git`, strip a leading `/`).
 *
 * JUDGEMENT CALLS:
 *
 *   1. ONE LEAF (`FindingsAccordion`). Loading / empty / error / populated never
 *      change the STRUCTURE — it is always one bounded accordion card, only what
 *      sits inside it changes — so all four are STATES of one leaf (§11f), never
 *      four leaves.
 *
 *   2. LOADING AND EMPTY ROUTE THROUGH `SurfaceCard.Accordion`'S OWN AXES
 *      (`isSkeleton` / `emptyState`), NOT THROUGH `AsyncContent`'s state-switch
 *      wrapper — the one deliberate DEPARTURE from the sibling block built for
 *      this same screen (`SubmissionAttemptSelector`, which DOES wrap itself in
 *      `AsyncContent`). The reason is structural, not stylistic: a chip strip has
 *      no bounded frame of its own to protect, so swapping it for `AsyncContent`'s
 *      centered message on every non-content branch costs nothing. An accordion
 *      CARD does have a frame worth protecting — the "Góp ý" section should read
 *      as the same bounded surface whether it is shimmering, empty, erroring, or
 *      full, never as a card that vanishes and a loose message appearing in its
 *      place. `SurfaceCard.Accordion` already built exactly that bounded
 *      loading/empty behaviour (see its own file header, "owner of the shape is
 *      the owner of the skeleton"), so reusing its two axes keeps ONE frame alive
 *      across every state instead of a second frame fighting it for the job.
 *
 *   3. ERROR STILL REUSES `AsyncContent` — just its MESSAGE frames
 *      (`AsyncContentError`), not its switch. Passed as the accordion's
 *      `emptyState` (with `items=[]` so the card has nothing else to show
 *      alongside it), so the retry message renders BOUNDED inside the same card
 *      face rather than breaking out to its own unbounded region. Error still
 *      outranks a stale `isLoading`/`isSkeleton` (mirrors `AsyncContent`'s own
 *      "error beats even loading" priority), in case a caller hands both at once.
 *
 *   4. `isLoading` (this list's own in-flight fetch) and `isSkeleton` (a
 *      parent-forced skeleton paint) fold into the SAME branch — same reasoning
 *      `SubmissionAttemptSelector` documents: the card exposes only one shimmer
 *      shape, so there is nothing for two separate flags to disagree about.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Severity a finding carries — drives the trigger icon/tone and the sort rank (high sorts first). */
export type SubmissionFeedbackSeverity = "high" | "medium" | "low"

/** An icon passed as a COMPONENT, rendered by this block at the size the text beside it uses. */
type SeverityIconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** One severity's trigger icon + text tone + sort rank — see {@link SEVERITY_VISUAL}. */
interface SeverityVisual {
    /** Trigger icon for this severity. */
    icon: SeverityIconComponent
    /** Tailwind text-color class for the icon (matches the severity's weight). */
    toneClassName: string
    /** Sort rank — lower sorts first (high = 0). */
    rank: number
}

/**
 * Severity → trigger icon + text tone + sort rank. Ported from `SubmissionResult`'s
 * `SEVERITY_VISUAL` table — this is the block's own domain vocabulary (§14d.1),
 * never something a caller hands in.
 */
const SEVERITY_VISUAL: Record<SubmissionFeedbackSeverity, SeverityVisual> = {
    high: { icon: WarningCircleIcon, toneClassName: "text-danger", rank: 0 },
    medium: { icon: WarningCircleIcon, toneClassName: "text-warning", rank: 1 },
    low: { icon: InfoIcon, toneClassName: "text-muted", rank: 2 },
}

/** One quality-gate finding for a graded attempt. */
export interface SubmissionFinding {
    /** Stable id — also the accordion row's expand key. */
    id: string
    /** Short summary, authored as markdown, shown (clamped to one line) in the trigger. */
    message: string
    /** Longer explanation, authored as markdown, shown in the panel. */
    detail?: string
    /** Suggested fix, authored as markdown, shown in the panel. */
    suggestion?: string
    /** Repo-relative file path this finding points at, e.g. `src/app/page.tsx`. */
    location?: string
    /** High/medium/low — decides the trigger icon/tone and the sort order. */
    severity: SubmissionFeedbackSeverity
    /** Author-authored order among findings that share a severity. Defaults to `0`. */
    sortIndex?: number
}

/** Props for {@link SubmissionFindingsList}. */
export interface SubmissionFindingsListProps {
    /** The findings, in ANY order — the block re-sorts them itself (severity, then `sortIndex`). */
    findings: Array<SubmissionFinding>
    /**
     * Repo URL the attempt was submitted from — turns each `location` into a
     * `blob/HEAD` deep-link. Omit → `location` still shows, as plain text.
     */
    repositoryUrl?: string
    /** Section label rendered above the card (e.g. `"Góp ý"`). */
    label: string
    /** `true` → this list's own fetch is in flight; the card falls to its self-mirror. */
    isLoading?: boolean
    /** `true` (once loading has finished) → the card falls to its empty message. */
    isEmpty?: boolean
    /** Empty-state title. Defaults to a standard "no findings yet" line. */
    emptyLabel?: string
    /** Truthy → the card falls to its error message (beats loading/empty — see file header). */
    error?: unknown
    /** Retry handler — paired with `retryLabel` to show a retry button on the error branch. */
    onRetry?: () => void
    /** Label of the retry button — required alongside `onRetry` for it to appear. */
    retryLabel?: string
    /** `true` → a parent-forced skeleton paint, same branch as `isLoading` (see file header). */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

const EMPTY_LABEL_DEFAULT = "Chưa có góp ý nào"
const ERROR_TITLE = "Không tải được góp ý"

/**
 * High → low, then by each finding's own authored order. Ported from
 * `SubmissionResult`'s `sortedFeedbacks` memo — the block's own vocabulary, so a
 * caller never has to pre-sort what it hands in.
 */
const sortFindings = (findings: ReadonlyArray<SubmissionFinding>): Array<SubmissionFinding> =>
    [...findings].sort((a, b) => {
        const rankDiff = SEVERITY_VISUAL[a.severity].rank - SEVERITY_VISUAL[b.severity].rank
        return rankDiff !== 0 ? rankDiff : (a.sortIndex ?? 0) - (b.sortIndex ?? 0)
    })

/**
 * `repositoryUrl` + a repo-relative `location` → a `blob/HEAD` deep-link. Ported
 * from `FindingAccordionItem` unchanged.
 */
const buildLocationHref = (location: string, repositoryUrl?: string): string | undefined =>
    repositoryUrl ? `${repositoryUrl.replace(/\.git$/, "")}/blob/HEAD/${location.replace(/^\//, "")}` : undefined

/**
 * Trigger content: the severity icon (a MARK attached to the message, `tight`)
 * beside the markdown message, clamped to one line so a long finding never
 * pushes the location chip or the caret out of the row.
 */
const findingTrigger = (finding: SubmissionFinding, showAnatomy: boolean): ReactNode => {
    const { icon: Icon, toneClassName } = SEVERITY_VISUAL[finding.severity]
    return (
        <StackH gap="tight" align="center" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackH" : undefined}>
            <Icon aria-hidden focusable="false" weight="bold" className={cn("size-3.5 shrink-0", toneClassName)} />
            <MarkdownContent
                source={finding.message}
                measure="compact"
                className="min-w-0 flex-1 [&_p]:m-0 [&_p]:truncate"
                anatPart={showAnatomy ? "MarkdownContent" : undefined}
            />
        </StackH>
    )
}

/** Trailing trigger slot: the finding's file location, as a quiet chip. */
const findingLocationChip = (finding: SubmissionFinding, showAnatomy: boolean): ReactNode | undefined =>
    finding.location ? (
        <Chip
            tone="neutral"
            text={finding.location}
            className="max-w-40 shrink-0"
            anatPart={showAnatomy ? "Chip" : undefined}
        />
    ) : undefined

/**
 * Panel content: the markdown detail, the linked file location, and the markdown
 * suggested fix — each optional, each its own row (`related`: independent facts
 * about one finding, not a single unit of meaning).
 */
const findingPanel = (finding: SubmissionFinding, repositoryUrl: string | undefined, showAnatomy: boolean): ReactNode => {
    const locationHref = finding.location ? buildLocationHref(finding.location, repositoryUrl) : undefined
    return (
        <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
            {finding.detail ? (
                <MarkdownContent
                    source={finding.detail}
                    measure="compact"
                    className="text-muted [&_p]:m-0"
                    anatPart={showAnatomy ? "MarkdownContent" : undefined}
                />
            ) : null}
            {finding.location ? (
                <StackH gap="tight" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                    <MapPinIcon aria-hidden focusable="false" weight="bold" className="size-3 shrink-0 text-muted" />
                    {locationHref ? (
                        <Typography
                            size="xs"
                            color="muted"
                            isLink
                            underlineOnHover
                            href={locationHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            text={finding.location}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    ) : (
                        <Typography size="xs" color="muted" text={finding.location} anatPart={showAnatomy ? "Typography" : undefined} />
                    )}
                </StackH>
            ) : null}
            {finding.suggestion ? (
                <StackH gap="tight" align="start" anatPart={showAnatomy ? "StackH" : undefined}>
                    <LightbulbIcon aria-hidden focusable="false" weight="bold" className="size-3.5 shrink-0 text-muted" />
                    <MarkdownContent
                        source={finding.suggestion}
                        measure="compact"
                        className="min-w-0 flex-1 text-muted [&_p]:m-0"
                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                    />
                </StackH>
            ) : null}
        </StackV>
    )
}

/**
 * The "Góp ý" findings card. See the file header for what this block owns
 * (severity vocabulary, sort order, the repo-URL→file-link builder) and why
 * loading/empty/error all stay bounded inside the one `SurfaceCard.Accordion`
 * frame instead of swapping it out for `AsyncContent`'s own switch.
 *
 * @param props - {@link SubmissionFindingsListProps}
 */
const SubmissionFindingsList = ({
    findings,
    repositoryUrl,
    label,
    isLoading = false,
    isEmpty,
    emptyLabel,
    error,
    onRetry,
    retryLabel,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: SubmissionFindingsListProps) => {
    // Error outranks even a stale loading/skeleton flag — same priority order
    // `AsyncContent` itself documents ("error → loading → empty → content") — so a
    // caller handing both `error` and `isLoading` still sees the error, not a
    // skeleton pretending the fetch is still running.
    const skeleton = !error && (isLoading || isSkeleton)
    const resolvedEmpty = !error && (isEmpty ?? findings.length === 0)

    const items: Array<SurfaceCardAccordionItem> = error
        ? []
        : sortFindings(findings).map((finding) => ({
            id: finding.id,
            title: findingTrigger(finding, showAnatomy),
            titleEnd: findingLocationChip(finding, showAnatomy),
            body: findingPanel(finding, repositoryUrl, showAnatomy),
        }))

    // Both branches render BOUNDED inside `SurfaceCard.Accordion`'s own `emptyState`
    // slot (see file header, judgement call 2–3) instead of swapping the whole card
    // for `AsyncContent`'s unbounded message.
    const emptyState = error ? (
        <AsyncContentError
            title={ERROR_TITLE}
            onRetry={onRetry}
            retryLabel={retryLabel}
            anatPart={showAnatomy ? "AsyncContentError" : undefined}
        />
    ) : resolvedEmpty ? (
        <AsyncContentEmpty
            title={emptyLabel ?? EMPTY_LABEL_DEFAULT}
            anatPart={showAnatomy ? "AsyncContentEmpty" : undefined}
        />
    ) : undefined

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCardAccordion
                label={label}
                items={items}
                isSkeleton={skeleton}
                emptyState={emptyState}
                anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
                showAnatomy={showAnatomy}
            />
        </div>
    )
}

export { SubmissionFindingsList }
