"use client"

import React, { useEffect } from "react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { Link, Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { useAppDispatch } from "@/redux"
import { setChallengeId } from "@/redux/slices"
import { useChallengeOverlayState } from "@/hooks"
import { ChallengeView } from "../ChallengeView"

/**
 * Full-page host for a single challenge — route
 * `…/contents/[contentId]/challenges/[challengeId]`. Replaces the former full-screen ChallengeModal
 * so the solving surface is deep-linkable, back- and refresh-safe.
 *
 * On mount it sets the active challenge id (the singleton SWR in `SwrSideEffects` then loads the
 * challenge + submissions) and flips the shared `challenge` overlay flag on — `useEditSubmissionForm`
 * keys its auto-save gate off that flag — clearing it on unmount. Course context (`course.entity` /
 * `enrolled`) is bootstrapped by the parent learn layout, so the global query is satisfied here.
 */
export const ChallengePage = () => {
    const t = useTranslations()
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { setOpen } = useChallengeOverlayState()
    const challengeId = params.challengeId as string | undefined
    const courseId = params.courseId as string | undefined
    const moduleId = params.moduleId as string | undefined
    const contentId = params.contentId as string | undefined

    useEffect(() => {
        if (!challengeId) return undefined
        dispatch(setChallengeId(challengeId))
        // Reuse the `challenge` overlay flag as an "active" signal so the submission auto-save gate
        // (useEditSubmissionForm) keeps firing while this page is mounted.
        setOpen(true)
        return () => setOpen(false)
    }, [challengeId, dispatch, setOpen])

    /** Back to the owning lesson (falls back to history when params are missing). */
    const onBack = () => {
        if (courseId && moduleId && contentId) {
            router.push(`/courses/${courseId}/learn/modules/${moduleId}/contents/${contentId}`)
            return
        }
        router.back()
    }

    return (
        <div className="flex h-[calc(100dvh-4rem)] min-h-0 w-full flex-col">
            <div className="flex items-center gap-2 border-b px-4 py-2">
                <Link
                    onPress={onBack}
                    className="inline-flex items-center gap-2 font-medium text-accent"
                >
                    <ArrowLeftIcon aria-hidden className="size-5" />
                    <Typography type="body-sm" className="font-medium">{t("challenge.back")}</Typography>
                </Link>
            </div>
            <ChallengeView className="min-h-0 flex-1" />
        </div>
    )
}
