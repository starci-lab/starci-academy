"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { GraduationCapIcon, GithubLogoIcon } from "@phosphor-icons/react"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyGithubTeamStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyGithubTeamStatusSwr"
import { useLinkGithubOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useJobNotificationsSocketIo } from "@/hooks/socketio/useJobNotificationsSocketIo"
import { PublicationEvent } from "@/hooks/socketio/enums/publication-event"
import { Callout } from "@/components/composites/feedback/Callout"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { Button } from "@/components/atoms/buttons/Button"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV, StackH } from "@/components/frames/Stack"
import { Cluster } from "@/components/frames/Cluster"
import { JobStatus } from "@/modules/types/enums/job-status"
import { mutateRequestToTeam } from "@/modules/api/graphql/mutations/mutation-request-to-team"

/**
 * Course GitHub-team join — NON-BLOCKING.
 *
 * A PAID-enrolled learner (the backend scopes teams to `is_enrolled = true`, so
 * trial viewers never see this) who is not yet in their course GitHub team gets a
 * persistent warning banner on the learn page (the learn page stays fully usable
 * — you just can't reach GitHub: challenges + the personal-project repo). The
 * banner opens an opt-in, DISMISSABLE modal with the step-by-step join flow:
 * link GitHub (if needed) → request to join → accept the invite on GitHub →
 * re-check. The banner clears the moment every required team flips to `active`.
 */
export const GithubTeamGate = () => {
    const t = useTranslations()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    // current course cover for the modal identity tile (mirrors the enroll modal summary)
    const coverImageUrl = useAppSelector((state) => state.course.entity?.coverImageUrl)
    const { data, mutate, isLoading } = useQueryMyGithubTeamStatusSwr()
    const { setOpen: setLinkGithubOpen } = useLinkGithubOverlayState()
    const [requesting, setRequesting] = useState(false)
    // the guided modal is opt-in (opened from the banner CTA) and dismissable
    const [modalOpen, setModalOpen] = useState(false)
    const locale = useLocale()
    const jobNotificationsSocket = useJobNotificationsSocketIo()
    const jobStatusByJobId = useAppSelector((state) => state.socketIo.jobStatusByJobId)
    // courseId -> id of the enqueued resolve-github invite job (for realtime status)
    const [jobByCourse, setJobByCourse] = useState<Record<string, string>>({})

    // scope to the COURSE CURRENTLY BEING STUDIED (route segment [courseId] = slug).
    const params = useParams()
    const courseSlug = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId
    const courseTeams = (data?.teams ?? []).filter((entry) => entry.courseSlug === courseSlug)
    const allInCourseTeams = courseTeams.every((entry) => entry.state === "active")

    // request to join THIS course's team if not invited yet (non-blocking enqueue +
    // realtime job status via socket — see the original gate's rationale).
    const onRequest = useCallback(
        async () => {
            setRequesting(true)
            try {
                const next: Record<string, string> = {}
                for (const team of courseTeams.filter((entry) => entry.state === "none")) {
                    const res = await mutateRequestToTeam({
                        request: {
                            courseId: team.courseId,
                        },
                    })
                    const jobId = res.data?.requestToTeam?.data?.jobId
                    if (jobId) {
                        next[team.courseId] = jobId
                        jobNotificationsSocket.emit(
                            PublicationEvent.SubscribeJobNotification,
                            {
                                data: {
                                    jobId,
                                },
                                locale,
                            },
                        )
                    }
                }
                setJobByCourse((prev) => ({ ...prev, ...next }))
            } finally {
                setRequesting(false)
            }
        },
        [courseTeams, jobNotificationsSocket, locale],
    )

    // when a tracked invite job settles, refetch team status once so the row flips.
    useEffect(() => {
        const settled = Object.entries(jobByCourse).filter(([, id]) => {
            const status = jobStatusByJobId[id]?.data?.status
            return status === JobStatus.Completed || status === JobStatus.Failed
        })
        if (settled.length === 0) {
            return
        }
        void mutate()
        setJobByCourse((prev) => {
            const remaining = { ...prev }
            for (const [courseId] of settled) {
                delete remaining[courseId]
            }
            return remaining
        })
    }, [jobStatusByJobId, jobByCourse, mutate])

    // show only for a viewer with a (paid) team for THIS course that isn't fully joined
    const open = Boolean(
        authenticated && data && courseTeams.length > 0 && !allInCourseTeams,
    )
    if (!open || !data) {
        return null
    }

    const linked = data.linked
    const hasUninvited = courseTeams.some((entry) => entry.state === "none")
    const anySending = Object.values(jobByCourse).some((id) => {
        const status = jobStatusByJobId[id]?.data?.status
        return status !== JobStatus.Completed && status !== JobStatus.Failed
    })

    // identity-tile state line (this course's team; gate is scoped to the current course)
    const primaryTeam = courseTeams[0]
    const primaryState = primaryTeam?.state ?? "none"
    const primaryStateLabel = anySending
        ? t("githubTeamGate.sending")
        : t(`githubTeamGate.state.${primaryState}`)
    const primaryStateTone = anySending || primaryState === "pending"
        ? "warning"
        : primaryState === "active"
            ? "success"
            : "muted"

    const linkBody = [
        () => (
            <Typography
                size="sm"
                color="muted"
                text={t("githubTeamGate.linkFirst")}
            />
        ),
        () => (
            <Button
                variant="primary"
                prefixIcon={GithubLogoIcon}
                label={t("githubTeamGate.linkCta")}
                onPress={() => {
                    // avoid stacking on the link modal it opens
                    setModalOpen(false)
                    setLinkGithubOpen(true)
                }}
            />
        ),
    ]

    const courseIdentity = [
        () => (
            <IconTile
                size="sm"
                src={coverImageUrl ?? undefined}
                icon={<GraduationCapIcon aria-hidden focusable="false" />}
            />
        ),
        () => (
            <StackV
                principle="title-subtitle"
                explain="Course title over team state — not label-field, because neither line is a form control label."
                items={[
                    () => (
                        <Typography
                            size="sm"
                            weight="semibold"
                            truncate
                            text={primaryTeam?.courseTitle ?? ""}
                        />
                    ),
                    () => (
                        <Typography
                            size="xs"
                            color={primaryStateTone === "muted" ? "muted" : primaryStateTone === "warning" ? "warning" : "success"}
                            text={primaryStateLabel}
                        />
                    ),
                ]}
            />
        ),
    ]

    const stepRow = (n: number, body: React.ComponentType) => () => (
        <Cluster
            principle="icon-text"
            explain="Step index beside its instruction — not name-handle, because this pairs a badge with procedural copy."
            items={[
                () => <Chip tone="accent" text={String(n)} />,
                body,
            ]}
        />
    )

    const joinSteps = [
        stepRow(1, () => (
            <StackV
                principle="sibling-stack"
                explain="Step copy over its CTA — not group-boundary, because these are peer pieces of one step."
                items={[
                    () => <Typography size="sm" text={t("githubTeamGate.step1")} />,
                    ...(hasUninvited
                        ? [() => (
                            <Button
                                variant="primary"
                                size="sm"
                                isDisabled={requesting || anySending}
                                label={anySending
                                    ? t("githubTeamGate.sending")
                                    : t("githubTeamGate.requestCta")}
                                onPress={onRequest}
                            />
                        )]
                        : []),
                ]}
            />
        )),
        stepRow(2, () => (
            <Typography size="sm" text={t("githubTeamGate.step2")} />
        )),
        stepRow(3, () => (
            <StackV
                principle="sibling-stack"
                explain="Step copy over recheck CTA — not group-boundary, because these are peer pieces of one step."
                items={[
                    () => <Typography size="sm" text={t("githubTeamGate.step3")} />,
                    () => (
                        <Button
                            variant="secondary"
                            size="sm"
                            isDisabled={isLoading}
                            label={t("githubTeamGate.recheckCta")}
                            onPress={() => mutate()}
                        />
                    ),
                ]}
            />
        )),
    ]

    const linkedBody = [
        () => (
            <StackH
                principle="identity"
                explain="Keeps course tile and title/state as one peer unit so the course identity stays beside its cover."
                items={courseIdentity}
            />
        ),
        () => (
            <StackV
                principle="sibling-stack"
                explain="Ordered join steps — not group-boundary, because these are repeating procedure rows."
                items={joinSteps}
            />
        ),
    ]

    return (
        <StackV
            principle="group-boundary"
            explain="Banner and guided modal share one feature surface — not sibling-stack, because the banner and the portal are not repeating peers, and not block-boundary, because this is not a page-scale section seam."
            identity={{ tier: "block", component: "GithubTeamGate" }}
            items={[
                () => (
                    <Callout
                        status="warning"
                        icon={GithubLogoIcon}
                        title={t("githubTeamGate.warningTitle")}
                        description={t("githubTeamGate.warningBody")}
                        actionLabel={t("githubTeamGate.openCta")}
                        onAction={() => setModalOpen(true)}
                    />
                ),
                () => (
                    <ModalShell
                        isOpen={modalOpen}
                        onOpenChange={setModalOpen}
                        title={t("githubTeamGate.title")}
                        size="sm"
                        body={() => (
                            <StackV
                                principle="content-row"
                                explain="Link prompt or join flow — not sibling-stack, because this is the modal body's content region."
                                items={linked ? linkedBody : linkBody}
                            />
                        )}
                    />
                ),
            ]}
        />
    )
}
