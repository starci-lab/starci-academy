"use client"

import React from "react"
import {
    StarCiButton,
    StarCiInput,
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalHeader,
    StarCiScrollShadow,
    StarCiSpinner,
} from "../../atomic"
import { useChallengeSubmissionOverlayState, useEditSubmissionFormik, useSubmissionAttemptsOverlayState } from "@/hooks/singleton"
import { useTranslations } from "next-intl"
import { Spacer } from "@/components/reuseable"
import { ChallengeSubmissionEntity, SubmissionType, UserChallengeSubmissionEntity } from "@/modules/types"
import { FormikErrors, FormikTouched } from "formik"
import { useMutateSyncChallengeSubmissionsSwr } from "@/hooks/singleton"
import { SiGithub, SiGoogledrive } from "@icons-pack/react-simple-icons"
import { setChallengeSubmissionId } from "@/redux/slices"
import { useAppDispatch } from "@/redux"

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
        <StarCiModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiModalContent size="lg" className="[&_header]:max-w-[640px] [&_header]:mx-auto [&_.modal-body]:max-w-[640px] [&_.modal-body]:mx-auto">
                <StarCiModalHeader
                    title={t("challenge.submissionModal.title")}
                />
                <StarCiModalBody>
                    <StarCiScrollShadow hideScrollBar>
                        {!formik.values.submissions?.length ? (
                            <div className="text-sm text-foreground-600">
                                {t("challenge.submissionModal.empty")}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                {
                                    formik.values.submissions.sort((prev, next) => prev.orderIndex - next.orderIndex).map((
                                        submission,
                                        index
                                    ) => {
                                        const errorMsg = ((formik.errors.submissions?.[index] as unknown as FormikErrors<ChallengeSubmissionEntity>)
                                            ?.userSubmission as unknown as FormikErrors<UserChallengeSubmissionEntity>)?.submissionUrl
                                        const isTouched = !!((formik.touched.submissions?.[index] as unknown as FormikTouched<ChallengeSubmissionEntity>)
                                            ?.userSubmission as unknown as FormikTouched<UserChallengeSubmissionEntity>)?.submissionUrl
                                        return (
                                            <div key={submission.id} className="border border-divider p-3 rounded-medium w-full">
                                                <div>
                                                    <div>
                                                        <div className="flex gap-2 items-center">
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
                                                            <StarCiInput
                                                                placeholder={t("challenge.submissionModal.urlPlaceholder")}
                                                                value={submission.userSubmission?.submissionUrl}
                                                                onChange={(e) => {
                                                                    formik.setFieldValue(`submissions.${index}.userSubmission.submissionUrl`, e.target.value)
                                                                }}
                                                                onBlur={() => {
                                                                    formik.setFieldTouched(`submissions.${index}.userSubmission.submissionUrl`, true)
                                                                }}
                                                                className={isTouched && errorMsg ? "border-danger" : ""}
                                                            />
                                                            {isTouched && errorMsg ? (
                                                                <p className="text-xs text-danger">{errorMsg}</p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Spacer y={3} />
                                                <div className="flex gap-2">
                                                    <StarCiButton
                                                        variant="primary"
                                                        size="lg"
                                                        isDisabled={formik.isSubmitting}
                                                        onPress={formik.submitForm}
                                                    >
                                                        {t("challenge.submissionModal.submit")}
                                                    </StarCiButton>
                                                    <StarCiButton
                                                        variant="tertiary"
                                                        size="lg"
                                                        onPress={() => {
                                                            dispatch(setChallengeSubmissionId(submission.id))
                                                            onOpenSubmissionAttempts()
                                                        }}
                                                    >
                                                        {t("challenge.submissionModal.viewAttempts")}
                                                    </StarCiButton>
                                                </div>
                                                {
                                                    submission.userSubmission?.lastAttempt && (
                                                        <>
                                                            <Spacer y={3} />
                                                            <div className="flex gap-2">
                                                                <div className="text-sm text-foreground-500">Your last attempt score is </div>
                                                                <div className="text-sm text-foreground-500">{submission.userSubmission.lastAttempt.score}/{submission.score}</div>
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
                                        <StarCiSpinner size="sm" />
                                        <div className="text-sm text-foreground-500">{t("challenge.submissionModal.loading")}</div>
                                    </div>
                                </>
                            )
                        }
                    </StarCiScrollShadow>
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}
