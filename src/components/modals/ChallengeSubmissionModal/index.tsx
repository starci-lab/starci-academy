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
import { useChallengeSubmissionDisclosure, useEditSubmissionFormik, useSubmissionAttemptsDisclosure } from "@/hooks/singleton"
import { useTranslations } from "next-intl"
import { Spacer } from "@heroui/react"
import { ChallengeSubmissionEntity, SubmissionType, UserChallengeSubmissionEntity } from "@/modules/types"
import { FormikErrors, FormikTouched } from "formik"
import { useMutateSyncChallengeSubmissionsSwr } from "@/hooks/singleton"
import { SiGithub, SiGoogledrive } from "@icons-pack/react-simple-icons"
import { setChallengeSubmissionId } from "@/redux/slices"
import { useAppDispatch } from "@/redux"

export const ChallengeSubmissionModal = () => {
    const { isOpen, onOpenChange } = useChallengeSubmissionDisclosure()
    const formik = useEditSubmissionFormik()
    const { onOpen: onOpenSubmissionAttempts } = useSubmissionAttemptsDisclosure()
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
            size="lg"
            onOpenChange={onOpenChange}
            classNames={{
                header: "max-w-[640px] mx-auto",
                body: "max-w-[640px] mx-auto",
            }}
            scrollBehavior="inside"
        >
            <StarCiModalContent>
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
                                    ) => (
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
                                                    <StarCiInput
                                                        labelPlacement="outside"
                                                        label={""}
                                                        placeholder={t("challenge.submissionModal.urlPlaceholder")}
                                                        value={submission.userSubmission?.submissionUrl}
                                                        onValueChange={(
                                                            (value) => {
                                                                formik.setFieldValue(`submissions.${index}.userSubmission.submissionUrl`, value)
                                                            }
                                                        )}
                                                        onBlur={() => {
                                                            formik.setFieldTouched(`submissions.${index}.userSubmission.submissionUrl`, true)
                                                        }}
                                                        errorMessage={
                                                            ((formik.errors.submissions?.[index] as unknown as FormikErrors<ChallengeSubmissionEntity>)
                                                                ?.userSubmission as unknown as FormikErrors<UserChallengeSubmissionEntity>)?.submissionUrl}
                                                        isInvalid={!!(
                                                            ((formik.errors.submissions?.[index] as unknown as FormikErrors<ChallengeSubmissionEntity>)
                                                                ?.userSubmission as unknown as FormikErrors<UserChallengeSubmissionEntity>)?.submissionUrl
                                                            && ((formik.touched.submissions?.[index] as unknown as FormikTouched<ChallengeSubmissionEntity>)
                                                                ?.userSubmission as unknown as FormikTouched<UserChallengeSubmissionEntity>)?.submissionUrl)}
                                                    />
                                                </div>
                                            </div>
                                            <Spacer y={3} />
                                            <div className="flex gap-2">
                                                <StarCiButton
                                                    color="primary"
                                                    variant="solid"
                                                    size="lg"
                                                    isLoading={formik.isSubmitting}
                                                    onPress={formik.submitForm}
                                                >
                                                    {t("challenge.submissionModal.submit")}
                                                </StarCiButton>
                                                <StarCiButton
                                                    color="primary"
                                                    variant="flat"
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
                                    ))}
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
