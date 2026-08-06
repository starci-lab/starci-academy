"use client"

import React from "react"
import { FileTextIcon, PencilSimpleIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { useQueryPublicUserCvSwr } from "@/hooks/swr/api/graphql/queries/useQueryPublicUserCvSwr"
import { useProfileUsername } from "@/hooks/profile/useProfileUsername"

/**
 * A4 "paper" frame reused from the CV editor's live preview
 * (`CvBlocksWorkspace/CvPdfPreview`) — a scrollable, white, A4-proportioned card.
 * A page-proportioned sheet is not a shape any frame names, so it stays a literal
 * on `Box` — but ONE literal, shared by the resting and loaded states.
 */
const PAPER_FRAME =
    "relative mx-auto flex h-full max-w-[820px] flex-col overflow-hidden rounded-3xl bg-white shadow-surface"

/** Viewport-proportioned height of the resting sheet. */
const RESTING_HEIGHT = "h-[70vh] min-h-[480px]"

/** Viewport-proportioned height of the loaded sheet. */
const LOADED_HEIGHT = "h-[80vh] min-h-[520px]"

const PublicCvEditButton = ({ label, onPress }: PublicCvEditButtonProps) => (
    <Button
        label={label}
        variant="secondary"
        prefixIcon={PencilSimpleIcon}
        onPress={onPress}
    />
)

/**
 * Public CV tab (`/profile/<username>/cv`) — the read-only, PDF-only view of the
 * ONE CV a user has flagged public. Anyone (signed in or not) can view it. When
 * the viewer IS the owner (`isSelf`), an "Edit CV" button links to the private
 * editor gallery (`/profile/cv`). Branches:
 *
 *   - data + `pdfUrl`   → the compiled PDF embedded read-only in the paper frame
 *   - data, no `pdfUrl` → the public CV was never compiled (a note)
 *   - no data           → the user has no public CV
 *
 * Self-contained: reads the username from the route, derives `isSelf` from the
 * viewer (redux) + the profile owner (`userProfile`), and drives its own SWR.
 */
export const ProfilePublicCvPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useProfileUsername()
    const viewer = useAppSelector((state) => state.user.user)
    const { data: user } = useQueryUserProfileSwr(username)
    const isSelf = !!viewer && !!user?.id && viewer.id === user.id

    const cvSwr = useQueryPublicUserCvSwr(username)
    const cv = cvSwr.data
    const isSkeleton = cvSwr.isLoading && !cvSwr.data

    const editLabel = t("publicProfile.publicCv.editCta")
    const onEdit = () => router.push(pathConfig().locale(locale).profile().cv().build())

    // error beats a stale loading flag (BLOCK-8 order).
    if (cvSwr.error) {
        return (
            <AsyncContentError
                title={t("publicProfile.publicCv.errorTitle")}
                onRetry={() => cvSwr.mutate()}
                retryLabel={t("publicProfile.publicCv.retry")}
            />
        )
    }

    // the resting state IS the paper frame, shimmering — same literal, same proportions
    if (isSkeleton) {
        return (
            <Box className={RESTING_HEIGHT}>
                <Box principle="center-measure" className={PAPER_FRAME}
                    explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
                >
                    <Skeleton className="h-full w-full" />
                </Box>
            </Box>
        )
    }

    // no public CV at all, or flagged public but never compiled — same shape, different line
    if (!cv || !cv.pdfUrl) {
        return (
            <AsyncContentEmpty
                icon={FileTextIcon}
                title={cv
                    ? t("publicProfile.publicCv.notCompiled")
                    : t("publicProfile.publicCv.emptyTitle")}
                description={isSelf
                    ? (cv
                        ? t("publicProfile.publicCv.notCompiledSelfHint")
                        : t("publicProfile.publicCv.emptySelfHint"))
                    : undefined}
                action={isSelf ? () => <PublicCvEditButton label={editLabel} onPress={onEdit} /> : undefined}
            />
        )
    }

    // captured out of the guard: property narrowing does not survive into the slot closures
    const pdfUrl = cv.pdfUrl
    const pdfTitle = cv.label || t("publicProfile.publicCv.iframeTitle")

    return (
        <StackV
            identity={{ tier: "block", component: "ProfilePublicCvPage" }}
            gap={5}
            principle="group-boundary"
            explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
            items={[
                ...(isSelf ? [() => (
                    <div className="flex justify-end">
                        <PublicCvEditButton label={editLabel} onPress={onEdit} />
                    </div>
                )] : []),
                () => (
                    <Box className={LOADED_HEIGHT}>
                        <Box principle="center-measure" className={PAPER_FRAME}
                            explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
                        >
                            <iframe
                                title={pdfTitle}
                                src={pdfUrl}
                                className="h-full w-full flex-1 border-0"
                            />
                        </Box>
                    </Box>
                ),
            ]}
        />
    )
}

type PublicCvEditButtonProps = { label: string; onPress: () => void }
