"use client"

import React, { useState } from "react"
import type { ReactNode } from "react"
import {
    Button,
    Label,
    Typography,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { CVPreview } from "../CVPreview"
import { CvScorecard, CV_SCORE_UNLOCK_THRESHOLD } from "../CvScorecard"
import { CvHistoryItemMenu } from "./CvHistoryItemMenu"
import { CVUpload } from "../CVUpload"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { FlexWrapButtonRadio } from "@/components/blocks/navigation/FlexWrapButtonRadio"
import { VerdictIcon } from "@/components/blocks/grading/GradingByline"
import { pathConfig } from "@/resources/path"
import { useQueryMyCvGenerationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCvGenerationsSwr"
import { useCvGenerationForm } from "@/hooks/zustand/cvGeneration/useCvGenerationForm"

/** Render up to this many CV chips inline (small scale — no overflow drawer needed yet). */
const CV_CHIPS_MAX = 6

/** Which pane of the workspace is showing. */
type CvWorkspaceTab = "result" | "preview"

/** Props for {@link CvWorkspace}. */
export interface CvWorkspaceProps extends WithClassNames<undefined> {
    /**
     * Breadcrumb row rendered above the title — omit when this workspace is
     * embedded somewhere that already carries its own context (e.g.
     * `PublicProfile`'s "CV" tab).
     */
    breadcrumb?: ReactNode
    /**
     * Which mode this surface is in — a query-param MODE of the same shell, not
     * a separate route: `false` (default) renders the REVIEW body (history dial
     * + Kết quả/Xem trước tabs, unchanged); `true` renders the COMPOSE body
     * (`CVUpload`, two hierarchical cards — generate primary, upload secondary).
     * Callers (`/profile/cv` and the profile "CV" tab) derive this from
     * `?edit=true` in the URL so the mode is deep-linkable and back/forward-safe.
     */
    edit?: boolean
    /**
     * Toggle the URL between review (`?edit` stripped) and compose (`?edit=true`)
     * without leaving this surface — the caller owns navigation so both the
     * standalone page and the profile tab can each build the right href for
     * their own route (`/profile/cv` vs `/profile/[u]?tab=cv`).
     */
    onEditChange?: (edit: boolean) => void
}

/**
 * The CV tool — ONE surface, TWO modes (`edit` prop), both sharing the same
 * shell/breadcrumb/header pattern instead of jumping between a tabbed review
 * page and an unrelated flat form page:
 *
 * - **Review** (`edit=false`, default): the surface described below.
 * - **Compose** (`edit=true`): renders {@link CVUpload} — two hierarchical
 *   cards (generate from achievements, primary; upload existing, secondary) —
 *   with a "← Xem kết quả" action back to review. This REPLACES the old
 *   `/profile/cv/edit` route, which now just redirects to `?edit=true` here.
 *
 * **Review mode.** When `breadcrumb` is provided (the standalone `/profile/cv`
 * page — no surrounding tab strip to establish context) it leads with a full
 * `PageHeader` (title + description). Embedded as `PublicProfile`'s "CV" tab —
 * where the tab strip already says "CV" — sibling tabs (Overview, Projects, …)
 * don't repeat their own name as a page title either, so this one doesn't
 * either: no title/description.
 *
 * Below that: a "Các CV của bạn" header row — label LEFT, a "+ Thêm CV mới"
 * action RIGHT (mirrors the "Khóa học … Xem thêm" row pattern used elsewhere
 * on the profile) — ALWAYS rendered (even with zero CVs, where it's the entry
 * point to create the first one), so the action never floats alone with
 * nothing paired to it. The CV-history dial (when the caller has more than
 * one CV) sits under that row, shared across BOTH tabs below it — then a
 * `TabsCard` switching between "Kết quả" ({@link CvScorecard}) and "Xem trước"
 * ({@link CVPreview}), each rendered full-width. Picking a CV in the dial
 * updates the score/feedback AND the PDF preview together (one shared
 * `selectedCvId`), regardless of which tab is open. Each chip also carries a
 * `CvHistoryItemMenu` (kebab, a SIBLING of the chip — never nested inside it)
 * with "Sửa" (switches to compose mode, scoped to that CV via `?cvId=`) and
 * "Xoá" (delete it, behind a confirm dialog).
 *
 * Self-fetching (`myCvGenerations` + `cvGeneration`), shared between the
 * standalone `/profile/cv` page ({@link Cv}) and the public-profile "CV" tab
 * (owner-only), so both render the exact same tool instead of duplicating it.
 *
 * @param props - {@link CvWorkspaceProps}
 */
export const CvWorkspace = ({ className, breadcrumb, edit = false, onEditChange }: CvWorkspaceProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    /** CV currently shown in the scorecard + preview — shared between both so they never desync. */
    const [selectedCvId, setSelectedCvId] = useState<string | undefined>(undefined)
    const [activeTab, setActiveTab] = useState<CvWorkspaceTab>("result")
    /** `cv_generations.id` currently being deleted (drives that one item's spinner/disabled state). */
    const [deletingId, setDeletingId] = useState<string | undefined>(undefined)
    const myCvGenerationsSwr = useQueryMyCvGenerationsSwr()
    const list = myCvGenerationsSwr.data ?? []
    /** Falls back to the newest CV when the caller hasn't explicitly picked one. */
    const effectiveCvId = selectedCvId ?? list[0]?.id
    const visibleCvs = list.slice(0, CV_CHIPS_MAX)
    const overflowCount = list.length - visibleCvs.length
    /**
     * Best score across EVERY CV (not just the visible chips) — mirrors the BE
     * recruiter-unlock gate (`MAX(score)`, `CV_SCORE_UNLOCK_THRESHOLD=70`), so
     * this line always agrees with whether the viewer is actually unlocked.
     */
    const bestScore = list.reduce<number | null>((best, cv) => {
        if (cv.score === null || cv.score === undefined) return best
        return best === null ? cv.score : Math.max(best, cv.score)
    }, null)
    const recruiterUnlocked = bestScore !== null && bestScore >= CV_SCORE_UNLOCK_THRESHOLD
    /** Shared across every item's menu so only one mutation instance backs the whole dial. */
    const { remove, isDeleting } = useCvGenerationForm()

    /** Edit mode (`?tab=cv&edit=true`-equivalent — `?edit=true` on this surface),
     *  optionally scoped to a specific CV via `&cvId=`. */
    const editHref = (cvId?: string) => {
        const base = pathConfig().locale(locale).profile().cv().edit().build()
        return cvId ? `${base}&cvId=${cvId}` : base
    }

    /** Delete a CV; if it was the one selected/showing, fall back to whatever remains. */
    const onDeleteCv = async (cvId: string) => {
        setDeletingId(cvId)
        try {
            await remove(cvId)
            await myCvGenerationsSwr.mutate()
            if (selectedCvId === cvId) {
                setSelectedCvId(undefined)
            }
        } finally {
            setDeletingId(undefined)
        }
    }

    /** "+ Thêm CV mới" / "Chỉnh sửa CV" — toggle to edit mode IN PLACE
     *  (`onEditChange`) when the caller wired it; otherwise fall back to a route
     *  push (still lands on `/profile/cv?edit=true`, just leaves the current
     *  surface — safe default for any caller that hasn't wired the toggle yet). */
    const goToEdit = () => {
        if (onEditChange) {
            onEditChange(true)
            return
        }
        router.push(editHref())
    }

    const addNewButton = (
        <Button
            size="sm"
            variant="secondary"
            onPress={goToEdit}
        >
            <PlusIcon aria-hidden className="size-4" />
            {t("cv.workspace.addNew")}
        </Button>
    )

    /** Edit-mode compose surface — two hierarchical cards ({@link CVUpload}), not
     *  the review body below. Once a run finishes, drop back to review via
     *  `onEditChange`/route so the fresh score/feedback/preview show up. */
    if (edit) {
        const goToResults = () => {
            if (onEditChange) {
                onEditChange(false)
                return
            }
            router.push(pathConfig().locale(locale).profile().cv().build())
        }

        return (
            <div className={cn("flex flex-col gap-10", className)}>
                {breadcrumb ? (
                    <PageHeader
                        breadcrumb={breadcrumb}
                        title={t("cv.workspace.editModeTitle")}
                        description={t("cv.editDescription")}
                        actions={(
                            <Button variant="tertiary" onPress={goToResults}>
                                <ArrowLeftIcon aria-hidden focusable="false" className="size-4" />
                                {t("cv.workspace.backToResults")}
                            </Button>
                        )}
                    />
                ) : (
                    <div className="flex items-center justify-between gap-3">
                        <Label>{t("cv.workspace.editModeTitle")}</Label>
                        <Button variant="tertiary" size="sm" onPress={goToResults}>
                            <ArrowLeftIcon aria-hidden focusable="false" className="size-4" />
                            {t("cv.workspace.backToResults")}
                        </Button>
                    </div>
                )}

                <CVUpload onDone={goToResults} />
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-10", className)}>
            {breadcrumb ? (
                <PageHeader
                    breadcrumb={breadcrumb}
                    title={t("cv.title")}
                    description={t("cv.description")}
                />
            ) : null}

            <div className="flex flex-col gap-6">
                {/* Stable header row for the CV collection — ALWAYS present (even at
                    zero CVs) so "+ Thêm CV mới" is never an orphan action floating
                    alone above everything else. */}
                <div className="flex items-center justify-between gap-3">
                    <Label>{t("cv.scorecard.history")}</Label>
                    {addNewButton}
                </div>

                {/* Recruiter-unlock line — the outcome + funnel anchor, ALWAYS present
                    (even at zero CVs) so every visit re-anchors "recruiter reach ⇐ best
                    CV score ⇐ real work in a course". Best score is source-blind (matches
                    the BE gate) — an uploaded CV can unlock it too, which is exactly why
                    the demand-bridge callout in `CvScorecard` nudges toward a generated
                    (verified) one instead. */}
                {bestScore !== null ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Typography type="body-sm" className={recruiterUnlocked ? "text-success" : "text-muted"}>
                            {recruiterUnlocked
                                ? t("cv.workspace.recruiterUnlocked", { score: bestScore })
                                : t("cv.workspace.recruiterNeedMore", {
                                    score: bestScore,
                                    remaining: CV_SCORE_UNLOCK_THRESHOLD - bestScore,
                                })}
                        </Typography>
                        {!recruiterUnlocked ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0"
                                onPress={() => router.push(pathConfig().locale(locale).course().build())}
                            >
                                {t("cv.workspace.recruiterLearnMore")}
                                <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                            </Button>
                        ) : null}
                    </div>
                ) : null}

                {/* CV-history dial — OUTSIDE the tabs, applies to BOTH "Kết quả" and "Xem trước" */}
                {visibleCvs.length > 1 ? (
                    <FlexWrapButtonRadio
                        insideCard={false}
                        ariaLabel={t("cv.scorecard.history")}
                        value={effectiveCvId ?? ""}
                        onChange={setSelectedCvId}
                        items={visibleCvs.map((cv, index) => ({
                            value: cv.id,
                            content: (
                                <>
                                    <VerdictIcon pass={(cv.score ?? 0) >= CV_SCORE_UNLOCK_THRESHOLD} />
                                    <span>{cv.label || t("cv.scorecard.untitled", { number: index + 1 })}</span>
                                    <span className="text-xs opacity-70">
                                        {cv.score !== null && cv.score !== undefined ? `${cv.score}/100` : t("cv.scorecard.noScoreYet")}
                                    </span>
                                </>
                            ),
                        }))}
                        itemAction={(item) => {
                            const cv = visibleCvs.find((entry) => entry.id === item.value)
                            const index = visibleCvs.findIndex((entry) => entry.id === item.value)
                            const cvLabel = cv?.label || t("cv.scorecard.untitled", { number: index + 1 })
                            return (
                                <CvHistoryItemMenu
                                    cvLabel={cvLabel}
                                    onEdit={() => (onEditChange ? onEditChange(true) : router.push(editHref(item.value)))}
                                    onDelete={() => onDeleteCv(item.value)}
                                    isDeleting={isDeleting && deletingId === item.value}
                                />
                            )
                        }}
                        trailing={overflowCount > 0 ? (
                            // TODO(cv-history-overflow): beyond CV_CHIPS_MAX this should open a
                            // drawer listing the rest (see attempt-history-selector pattern) —
                            // for now it's just a non-interactive count so nothing is silently
                            // dropped from the dial.
                            <span className="rounded-large px-3 py-1.5 text-xs text-muted">
                                {t("cv.scorecard.overflowMore", { count: overflowCount })}
                            </span>
                        ) : undefined}
                    />
                ) : null}

                <TabsCard
                    leftTabs={{
                        items: [
                            { key: "result", label: t("cv.workspace.resultTab") },
                            { key: "preview", label: t("cv.workspace.previewTab") },
                        ],
                        selectedKey: activeTab,
                        ariaLabel: t("cv.workspace.tabsAria"),
                        onSelectionChange: (key) => setActiveTab(key as CvWorkspaceTab),
                    }}
                />

                {activeTab === "result" ? (
                    <CvScorecard selectedId={effectiveCvId} />
                ) : (
                    <CVPreview cvId={effectiveCvId} />
                )}
            </div>
        </div>
    )
}
