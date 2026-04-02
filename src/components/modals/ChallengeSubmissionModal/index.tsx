"use client"

import React from "react"
import {
    StarCiButton,
    StarCiImage,
    StarCiInput,
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalFooter,
    StarCiModalHeader,
    StarCiScrollShadow,
    StarCiSpinner,
} from "../../atomic"
import { useChallengeSubmissionDisclosure, useEditSubmissionFormik } from "@/hooks/singleton"
import { useTranslations } from "next-intl"
import { Spacer } from "@heroui/react"
import { ChallengeSubmissionEntity, SubmissionType, UserChallengeSubmissionEntity } from "@/modules/types"
import { assetConfig } from "@/resources/assets"
import { FormikErrors, FormikTouched } from "formik"
import { useMutateSyncChallengeSubmissionUrlsSwr } from "@/hooks/singleton"

export const ChallengeSubmissionModal = () => {
    const { isOpen, onOpenChange } = useChallengeSubmissionDisclosure()
    const formik = useEditSubmissionFormik()
    const t = useTranslations()
    const iconMap = {
        [SubmissionType.GithubUrl]: assetConfig().icon().submissions().github,
        [SubmissionType.GoogleDocsUrl]: assetConfig().icon().submissions().google,
    }
    const swr = useMutateSyncChallengeSubmissionUrlsSwr()
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
                                {formik.values.submissions.sort((prev, next) => prev.orderIndex - next.orderIndex).map((submission, index) => (
                                    <div
                                        key={submission.id}
                                        className="border border-divider p-3 rounded-medium w-full"
                                    >
                                        <div>
                                            <div className="flex gap-2 items-center">
                                                <div className="text-sm">
                                                    {
                                                        submission.orderIndex + 1
                                                    }
                                                    {". "}{submission.name}
                                                </div>
                                                <StarCiImage
                                                    src={iconMap[submission.type]}
                                                    alt={submission.type}
                                                    className="size-5"
                                                />
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
                <StarCiModalFooter>
                    <StarCiButton
                        color="primary"
                        variant="solid"
                        size="lg"
                        fullWidth
                        onPress={onOpenChange}
                    >
                        {t("challenge.submissionModal.submit")}
                    </StarCiButton>
                </StarCiModalFooter>
            </StarCiModalContent>
        </StarCiModal>
    )
}
