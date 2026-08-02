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
 * `SubmissionFindingsList` — "Feedback": the quality-gate findings for one
 * graded attempt, one finding per `SurfaceCard.Accordion` row. Owns the domain:
 * `SEVERITY_VISUAL` (severity -> icon, tone, sort rank), `sortFindings` (high ->
 * low then authored order), and `buildLocationHref` (`repositoryUrl` + relative
 * `location` -> a `blob/HEAD` deep link). One leaf; loading/empty/error/populated
 * are states. Loading and empty route through the accordion's own
 * `isSkeleton`/`emptyState` axes to keep one bounded frame alive; error reuses
 * `AsyncContent`'s message frames as `emptyState` and outranks a stale loading
 * flag. `isLoading` and `isSkeleton` fold into one branch.
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
    /**
     * Short summary shown (clamped to one line) in the accordion trigger — plain
     * text, at most `` `code` `` spans (never bold/italic/link: a trigger title
     * is tier 1, per the teacher's final call 2026-07-29, markdown-tier-rules.html). Full markdown
     * belongs in `detail`/`suggestion`, which render in the panel body instead.
     */
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
    /** Section label rendered above the card (e.g. `"Feedback"`). */
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
}

const EMPTY_LABEL_DEFAULT = "No feedback yet"
const ERROR_TITLE = "Could not load feedback"

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
 * Trigger icon: the severity glyph, its OWN tone colour independent of the
 * title text — rides `titleStart`, not composed into `title` itself (§ same
 * rule as `ChallengeDeliverableList`'s status icon).
 */
const findingIcon = (finding: SubmissionFinding): ReactNode => {
    const { icon: Icon, toneClassName } = SEVERITY_VISUAL[finding.severity]
    return (
        <Icon
            aria-hidden
            focusable="false"
            weight="bold"

            className={cn("size-3.5 shrink-0", toneClassName)}
        />
    )
}

/** Trailing trigger slot: the finding's file location, as a quiet chip. */
const findingLocationChip = (finding: SubmissionFinding): ReactNode | undefined =>
    finding.location ? (
        <Chip
            tone="default"
            text={finding.location}
            classNames={["shrink-0"]}

        />
    ) : undefined

/**
 * Panel content: the markdown detail, the linked file location, and the markdown
 * suggested fix — each optional, each its own row (`related`: independent facts
 * about one finding, not a single unit of meaning).
 */
const findingPanel = (finding: SubmissionFinding, repositoryUrl: string | undefined): ReactNode => {
    const locationHref = finding.location ? buildLocationHref(finding.location, repositoryUrl) : undefined
    const locationRow = finding.location ? (
        <StackH
            gap={2}
            align="center"

            body={
                <>
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

                        />
                    ) : (
                        <Typography size="xs" color="muted" text={finding.location} />
                    )}
                </>
            }
        />
    ) : null
    const suggestionRow = finding.suggestion ? (
        <StackH
            gap={2}
            align="start"

            body={
                <>
                    <LightbulbIcon aria-hidden focusable="false" weight="bold" className="size-3.5 shrink-0 text-muted" />
                    <div className="min-w-0 flex-1 text-muted [&_p]:m-0">
                        <MarkdownContent
                            source={finding.suggestion}
                            measure="compact"

                        />
                    </div>
                </>
            }
        />
    ) : null
    return (
        <StackV
            gap={3}

            body={
                <>
                    {finding.detail ? (
                        <div className="text-muted [&_p]:m-0">
                            <MarkdownContent
                                source={finding.detail}
                                measure="compact"

                            />
                        </div>
                    ) : null}
                    {locationRow}
                    {suggestionRow}
                </>
            }
        />
    )
}

/**
 * The "Feedback" findings card. See the file header for what this block owns
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
            titleStart: findingIcon(finding),
            title: finding.message,
            titleEnd: findingLocationChip(finding),
            body: findingPanel(finding, repositoryUrl),
        }))

    // Both branches render BOUNDED inside `SurfaceCard.Accordion`'s own `emptyState`
    // slot (see file header, judgement call 2–3) instead of swapping the whole card
    // for `AsyncContent`'s unbounded message. `emptyState` is now a component
    // reference (COMPOSITE-4), so each branch is wrapped as a zero-arg component.
    const ErrorEmptyState = () => (
        <AsyncContentError
            title={ERROR_TITLE}
            onRetry={onRetry}
            retryLabel={retryLabel}

        />
    )

    const PlainEmptyState = () => (
        <AsyncContentEmpty
            title={emptyLabel ?? EMPTY_LABEL_DEFAULT}

        />
    )

    const emptyState = error ? ErrorEmptyState : resolvedEmpty ? PlainEmptyState : undefined

    return (
        <div>
            <SurfaceCardAccordion
                label={label}
                items={items}
                isSkeleton={skeleton}
                emptyState={emptyState}


            />
        </div>
    )
}

export { SubmissionFindingsList }
