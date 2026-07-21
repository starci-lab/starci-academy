"use client"

import React from "react"
import { Button, cn } from "@heroui/react"
import { FileTextIcon, PencilSimpleIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryPublicUserCvSwr } from "@/hooks/swr/api/graphql/queries/useQueryPublicUserCvSwr"
import { useProfileUsername } from "../hooks/useProfileUsername"

/** Props for {@link ProfilePublicCv}. */
export type ProfilePublicCvProps = WithClassNames<undefined>

/**
 * A4 "paper" frame reused from the CV editor's live preview
 * (`CvBlocksWorkspace/CvPdfPreview`) — a scrollable, white, A4-proportioned card.
 */
const PAPER_FRAME =
    "relative mx-auto flex h-full max-w-[820px] flex-col overflow-hidden rounded-3xl bg-white shadow-surface"

/**
 * Public CV tab (`/profile/<username>/cv`) — the read-only, PDF-only view of the
 * ONE CV a user has flagged public. Anyone (signed in or not) can view it. When
 * the viewer IS the owner (`isSelf`), a "Chỉnh sửa CV" button links to the
 * private editor gallery (`/profile/cv`). Branches:
 *
 *   - data + `pdfUrl`  → the compiled PDF embedded read-only in the paper frame
 *   - data, no `pdfUrl` → the public CV was never compiled (a note)
 *   - no data          → the user has no public CV (an {@link EmptyState})
 *
 * Self-contained: reads the username from the route, derives `isSelf` from the
 * viewer (redux) + the profile owner (`userProfile`), and drives its own SWR.
 *
 * @param props - optional className for the root element.
 */
export const ProfilePublicCv = ({ className }: ProfilePublicCvProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useProfileUsername()
    const viewer = useAppSelector((state) => state.user.user)
    const { data: user } = useQueryUserProfileSwr(username)
    const isSelf = !!viewer && !!user?.id && viewer.id === user.id

    const cvSwr = useQueryPublicUserCvSwr(username)
    const cv = cvSwr.data
    const isLoading = cvSwr.isLoading && !cvSwr.data

    // "Chỉnh sửa CV" → the owner's private editor gallery (always-own /profile/cv).
    const editButton = isSelf ? (
        <Button
            variant="secondary"
            onPress={() => router.push(pathConfig().locale(locale).profile().cv().build())}
        >
            <span className="flex items-center gap-2">
                <PencilSimpleIcon aria-hidden className="size-4" />
                {t("publicProfile.publicCv.editCta")}
            </span>
        </Button>
    ) : null

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={(
                    // MIRRORING skeleton — the same A4 paper frame, shimmering.
                    <div className="h-[70vh] min-h-[480px]">
                        <Skeleton className={cn(PAPER_FRAME, "h-full w-full")} />
                    </div>
                )}
                error={cvSwr.error}
                errorContent={{
                    title: t("publicProfile.publicCv.errorTitle"),
                    onRetry: () => cvSwr.mutate(),
                    retryLabel: t("publicProfile.publicCv.retry"),
                }}
            >
                {!cv ? (
                    // No public CV at all (null) — or not yet resolved.
                    <EmptyState
                        icon={<FileTextIcon aria-hidden weight="duotone" />}
                        title={t("publicProfile.publicCv.emptyTitle")}
                        description={
                            isSelf ? t("publicProfile.publicCv.emptySelfHint") : undefined
                        }
                        action={editButton}
                    />
                ) : cv.pdfUrl ? (
                    // The compiled public CV — read-only PDF in the paper frame.
                    <>
                        {editButton ? (
                            <div className="flex justify-end">{editButton}</div>
                        ) : null}
                        <div className="h-[80vh] min-h-[520px]">
                            <div className={cn(PAPER_FRAME, "h-full")}>
                                <iframe
                                    title={cv.label ?? t("publicProfile.publicCv.iframeTitle")}
                                    src={cv.pdfUrl}
                                    className="h-full w-full flex-1 border-0"
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    // Flagged public but never compiled → a plain note.
                    <EmptyState
                        icon={<FileTextIcon aria-hidden weight="duotone" />}
                        title={t("publicProfile.publicCv.notCompiled")}
                        description={
                            isSelf ? t("publicProfile.publicCv.notCompiledSelfHint") : undefined
                        }
                        action={editButton}
                    />
                )}
            </AsyncContent>
        </div>
    )
}
