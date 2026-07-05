"use client"

import React, { useState } from "react"
import type { ReactNode } from "react"
import {
    Button,
    Label,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { useRouter } from "next/navigation"
import { PlusIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { CVPreview } from "../CVPreview"
import { CvScorecard, CV_SCORE_UNLOCK_THRESHOLD } from "../CvScorecard"
import { CvHistoryItemMenu } from "./CvHistoryItemMenu"
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
}

/**
 * The CV tool's REVIEW surface. When `breadcrumb` is provided (the standalone
 * `/profile/cv` page — no surrounding tab strip to establish context) it leads
 * with a full `PageHeader` (title + description). Embedded as `PublicProfile`'s
 * "CV" tab — where the tab strip already says "CV" — sibling tabs (Overview,
 * Projects, …) don't repeat their own name as a page title either, so this one
 * doesn't either: no title/description.
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
 * with "Sửa" (jump to `/profile/cv/edit` scoped to that CV) and "Xoá" (delete
 * it, behind a confirm dialog).
 *
 * Self-fetching (`myCvGenerations` + `cvGeneration`), shared between the
 * standalone `/profile/cv` page ({@link Cv}) and the public-profile "CV" tab
 * (owner-only), so both render the exact same tool instead of duplicating it.
 *
 * @param props - {@link CvWorkspaceProps}
 */
export const CvWorkspace = ({ className, breadcrumb }: CvWorkspaceProps) => {
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
    /** Shared across every item's menu so only one mutation instance backs the whole dial. */
    const { remove, isDeleting } = useCvGenerationForm()

    /** `/profile/cv/edit`, optionally scoped to a specific CV via `?cvId=`. */
    const editHref = (cvId?: string) => {
        const base = pathConfig().locale(locale).profile().cv().edit().build()
        return cvId ? `${base}?cvId=${cvId}` : base
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

    const addNewButton = (
        <Button
            size="sm"
            variant="secondary"
            onPress={() => router.push(editHref())}
        >
            <PlusIcon aria-hidden className="size-4" />
            {t("cv.workspace.addNew")}
        </Button>
    )

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
                                    onEdit={() => router.push(editHref(item.value))}
                                    onDelete={() => onDeleteCv(item.value)}
                                    isDeleting={isDeleting && deletingId === item.value}
                                />
                            )
                        }}
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
