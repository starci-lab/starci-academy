"use client"

import React from "react"
import { Button, Input, Modal, ScrollShadow, Spinner } from "@heroui/react"
import { useChallengeSubmissionOverlayState, useEditSubmissionFormik, useSubmissionAttemptsOverlayState } from "@/hooks/singleton"
import { useTranslations } from "next-intl"
import { Spacer } from "@/components/reuseable"
import { ChallengeSubmissionEntity, SubmissionType, UserChallengeSubmissionEntity } from "@/modules/types"
import { FormikErrors, FormikTouched } from "formik"
import { useMutateSyncChallengeSubmissionsSwr } from "@/hooks/singleton"
import { SiGithub, SiGoogledrive } from "@icons-pack/react-simple-icons"
import { setChallengeSubmissionId } from "@/redux/slices"
import { useAppDispatch } from "@/redux"
import { AppModalHeader } from "../AppModalHeader"
import _ from "lodash"

export const ChallengeSubmissionModal = () => {
    const { isOpen, onOpenChange } = useChallengeSubmissionOverlayState()
    const formik = useEditSubmissionFormik()
    const { onOpen: onOpenSubmissionAttempts } = useSubmissionAttemptsOverlayState()
    const t = useTranslations()
    const iconMap = {
        [SubmissionType.GithubUrl]: <SiGithub size={16} />,
        [SubmissionType.GoogleDocsUrl]: <SiGoogledrive size={16} />,
    }
    const swr = useMutateSyncChallengeSubmissionsSwr()
    const dispatch = useAppDispatch()
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container className="modal__container--narrow" size="lg">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AppModalHeader title={t("challenge.submissionModal.title")} />
                        <Modal.Body className="gap-0 p-4">
                            <ScrollShadow hideScrollBar>
                                {!formik.values.submissions?.length ? (
                                    <div className="text-sm text-foreground-600">
                                        {t("challenge.submissionModal.empty")}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6">
                                        {
                                            _.cloneDeep(formik.values.submissions).sort((prev, next) => prev.orderIndex - next.orderIndex).map((
                                                submission,
                                                index
                                            ) => {
                                                const errorMsg = ((formik.errors.submissions?.[index] as unknown as FormikErrors<ChallengeSubmissionEntity>)
                                                    ?.userSubmission as unknown as FormikErrors<UserChallengeSubmissionEntity>)?.submissionUrl
                                                const isTouched = !!((formik.touched.submissions?.[index] as unknown as FormikTouched<ChallengeSubmissionEntity>)
                                                    ?.userSubmission as unknown as FormikTouched<UserChallengeSubmissionEntity>)?.submissionUrl
                                                return (
                                                    <div key={submission.id} className="w-full rounded-medium border border-divider p-3">
                                                        <div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-sm">
                                                                        {
                                                                            submission.orderIndex + 1
                                                                        }
                                                                        {". "}{submission.title}
                                                                    </div>
                                                                    {iconMap[submission.type]}
                                                                </div>
                                                                <Spacer y={1.5} />
                                                                <div className="text-xs text-foreground-500">
                                                                    {submission.description}
                                                                </div>
                                                                <Spacer y={3} />
                                                                <div className="flex flex-col gap-1">
                                                                    <Input
                                                                        className={isTouched && errorMsg ? "border-danger" : ""}
                                                                        onBlur={() => {
                                                                            formik.setFieldTouched(`submissions.${index}.userSubmission.submissionUrl`, true)
                                                                        }}
                                                                        onChange={(e) => {
                                                                            formik.setFieldValue(`submissions.${index}.userSubmission.submissionUrl`, e.target.value)
                                                                        }}
                                                                        placeholder={t("challenge.submissionModal.urlPlaceholder")}
                                                                        value={submission.userSubmission?.submissionUrl}
                                                                        variant="secondary"
                                                                    />
                                                                    {isTouched && errorMsg ? (
                                                                        <p className="text-xs text-danger">{errorMsg}</p>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Spacer y={3} />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                isDisabled={formik.isSubmitting}
                                                                onPress={formik.submitForm}
                                                                size="lg"
                                                                variant="primary"
                                                            >
                                                                {t("challenge.submissionModal.submit")}
                                                            </Button>
                                                            <Button
                                                                onPress={() => {
                                                                    dispatch(setChallengeSubmissionId(submission.id))
                                                                    onOpenSubmissionAttempts()
                                                                }}
                                                                size="lg"
                                                                variant="tertiary"
                                                            >
                                                                {t("challenge.submissionModal.viewAttempts")}
                                                            </Button>
                                                        </div>
                                                        {
                                                            submission.userSubmission?.lastAttempt && (
                                                                <>
                                                                    <Spacer y={3} />
                                                                    <div className="flex gap-2 text-sm text-foreground-500">
                                                                        <span>
                                                                            {t("challenge.submissionModal.lastAttemptScore", {
                                                                                earned: submission.userSubmission.lastAttempt.score ?? 0,
                                                                                max: submission.score ?? 0,
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                )
                                            })}
                                    </div>
                                )}
                                {
                                    swr.isMutating && (
                                        <>
                                            <Spacer y={3} />
                                            <div className="flex items-center gap-2">
                                                <Spinner size="sm" />
                                                <div className="text-sm text-foreground-500">{t("challenge.submissionModal.loading")}</div>
                                            </div>
                                        </>
                                    )
                                }
                            </ScrollShadow>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
