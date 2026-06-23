"use client"

import React, { useCallback, useState } from "react"
import { Button, Modal, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useQueryMyGithubTeamStatusSwr, useLinkGithubOverlayState } from "@/hooks"
import { mutateRequestToTeam } from "@/modules/api"
import { GithubIcon } from "@/components/svg"

/**
 * Hard gate that forces enrolled learners into their course GitHub team.
 *
 * Linking a GitHub identity and being a team member are SEPARATE states:
 * - not linked            → must link GitHub first (opens the link modal).
 * - linked but not in team → must request to join (enqueues the invite) and
 *   accept the invite on GitHub.
 *
 * While the viewer is enrolled in a course that maps to a team but is not yet a
 * member of every such team, a NON-DISMISSABLE modal blocks the app (no outside
 * click, no ESC, no close button). It clears itself the moment `allInTeam` flips
 * true (re-checked on focus / via the recheck button). Renders nothing otherwise.
 */
export const GithubTeamGate = () => {
    const t = useTranslations()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const { data, mutate, isLoading } = useQueryMyGithubTeamStatusSwr()
    const { setOpen: setLinkGithubOpen } = useLinkGithubOverlayState()
    const [requesting, setRequesting] = useState(false)

    // request to join every team the viewer has not been invited to yet
    const onRequest = useCallback(
        async () => {
            if (!data) {
                return
            }
            setRequesting(true)
            try {
                for (const team of data.teams.filter((entry) => entry.state === "none")) {
                    await mutateRequestToTeam({
                        request: {
                            courseId: team.courseId,
                        },
                    })
                }
                // refetch so freshly-pending invites show + the gate re-evaluates
                await mutate()
            } finally {
                setRequesting(false)
            }
        },
        [data, mutate],
    )

    // block only enrolled-with-team viewers who are not fully in their teams
    const open = Boolean(authenticated && data && data.teams.length > 0 && !data.allInTeam)
    if (!open || !data) {
        return null
    }

    const linked = data.linked
    const hasUninvited = data.teams.some((entry) => entry.state === "none")

    return (
        <Modal
            isOpen={open}
            onOpenChange={() => {
                // intentionally inert — the gate is dismissed only by joining the team
            }}>
            <Modal.Backdrop
                isDismissable={false}
                isKeyboardDismissDisabled>
                <Modal.Container size="sm">
                    <Modal.Dialog>
                        {/* no CloseTrigger → cannot be dismissed; the viewer must join the team */}
                        <Modal.Header>
                            <div className="flex items-center gap-2">
                                <GithubIcon className="size-5" />
                                <span>{t("githubTeamGate.title")}</span>
                            </div>
                        </Modal.Header>
                        <Modal.Body className="flex flex-col gap-4 pb-6">
                            {!linked ? (
                                <>
                                    <p className="text-sm text-default-500">
                                        {t("githubTeamGate.linkFirst")}
                                    </p>
                                    <Button
                                        variant="primary"
                                        onPress={() => setLinkGithubOpen(true)}>
                                        <GithubIcon className="size-4" />
                                        {t("githubTeamGate.linkCta")}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-default-500">
                                        {t("githubTeamGate.requestDescription")}
                                    </p>
                                    <ul className="flex flex-col gap-2">
                                        {data.teams.map((team) => (
                                            <li
                                                key={team.courseId}
                                                className="flex items-center justify-between rounded-medium border border-default p-3 text-sm">
                                                <span className="truncate">{team.courseTitle}</span>
                                                <span
                                                    className={cn(
                                                        "shrink-0 text-xs",
                                                        team.state === "active"
                                                            ? "text-success"
                                                            : team.state === "pending"
                                                                ? "text-warning"
                                                                : "text-default-500",
                                                    )}>
                                                    {t(`githubTeamGate.state.${team.state}`)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-col gap-2">
                                        {hasUninvited ? (
                                            <Button
                                                variant="primary"
                                                isDisabled={requesting}
                                                onPress={onRequest}>
                                                {t("githubTeamGate.requestCta")}
                                            </Button>
                                        ) : null}
                                        <Button
                                            variant="secondary"
                                            isDisabled={isLoading}
                                            onPress={() => mutate()}>
                                            {t("githubTeamGate.recheckCta")}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-default-500">
                                        {t("githubTeamGate.acceptHint")}
                                    </p>
                                </>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
