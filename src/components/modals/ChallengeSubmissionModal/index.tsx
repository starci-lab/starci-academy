"use client"

import React from "react"
import {
    Button,
    FieldError,
    Input,
    Modal,
    ScrollShadow,
    Spinner,
    Surface,
    TextField,
} from "@heroui/react"
import {
    useChallengeSubmissionOverlayState,
    useEditSubmissionFormik,
    useMutateSyncChallengeSubmissionsSwr,
    useSubmissionAttemptsOverlayState,
} from "@/hooks/singleton"
import { useTranslations } from "next-intl"
import { ChallengeSubmissionEntity, SubmissionType, UserChallengeSubmissionEntity } from "@/modules/types"
import { FormikErrors, FormikTouched } from "formik"
import { SiGithub, SiGoogledrive } from "@icons-pack/react-simple-icons"
import { setChallengeSubmissionId } from "@/redux/slices"
import { useAppDispatch } from "@/redux"
import { AppModalHeader } from "../AppModalHeader"

/**
 * Challenge submission modal: lists each requirement with a Formik-bound URL field.
 */
export const ChallengeSubmissionModal = () => {
    const { isOpen, onOpenChange } = useChallengeSubmissionOverlayState()
    const formik = useEditSubmissionFormik()
    const { values, errors, touched, setFieldValue, setFieldTouched, isSubmitting } = formik
    const { onOpen: onOpenSubmissionAttempts } = useSubmissionAttemptsOverlayState()
    const t = useTranslations()
    const iconMap: Record<SubmissionType, React.ReactNode> = {
        [SubmissionType.GithubUrl]: <SiGithub size={16} />,
        [SubmissionType.GoogleDocsUrl]: <SiGoogledrive size={16} />,
    }
    const swr = useMutateSyncChallengeSubmissionsSwr()
    const dispatch = useAppDispatch()

    const sortedSubmissions = React.useMemo(() => {
        if (!values.submissions?.length) {
            return []
        }
        return [...values.submissions].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [values.submissions])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal.Backdrop>
                <Modal.Container className="modal__container--narrow" size="lg">
                    <Modal.Dialog>
                        <Modal.CloseTrigger />
                        <AppModalHeader title={t("challenge.submissionModal.title")} />
                        <Modal.Body>
                            <ScrollShadow hideScrollBar>
                                {!values.submissions?.length ? (
                                    <div className="text-sm text-foreground-600">
                                        {t("challenge.submissionModal.empty")}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {sortedSubmissions.map((submission) => {
                                            const index =
                                                values.submissions?.findIndex((s) => s.id === submission.id) ?? -1
                                            if (index < 0) {
                                                return null
                                            }
                                            const errorKey = (
                                                (errors.submissions?.[index] as unknown as FormikErrors<ChallengeSubmissionEntity>)
                                                    ?.userSubmission as unknown as FormikErrors<UserChallengeSubmissionEntity>
                                            )?.submissionUrl
                                            const isTouched = !!(
                                                (
                                                    touched.submissions?.[index] as unknown as FormikTouched<ChallengeSubmissionEntity>
                                                )?.userSubmission as unknown as FormikTouched<UserChallengeSubmissionEntity>
                                            )?.submissionUrl
                                            const fieldName =
                                                `submissions.${index}.userSubmission.submissionUrl` as const
                                            const inputId = `challenge-submission-url-${submission.id}`
                                            return (
                                                <Surface key={submission.id} className="w-full rounded-3xl p-3" variant="secondary">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-sm">
                                                                {submission.orderIndex + 1}
                                                                {". "}
                                                                {submission.title}
                                                            </div>
                                                            {iconMap[submission.type]}
                                                        </div>
                                                        <div className="h-1.5" />
                                                        <div className="text-xs text-muted">
                                                            {submission.description}
                                                        </div>
                                                        <div className="h-3" />
                                                        <TextField
                                                            className="w-full"
                                                            fullWidth
                                                            isInvalid={!!(isTouched && errorKey)}
                                                        >
                                                            <Input
                                                                id={inputId}
                                                                name={fieldName}
                                                                placeholder={t("challenge.submissionModal.urlPlaceholder")}
                                                                value={values.submissions?.[index]?.userSubmission?.submissionUrl ?? ""}
                                                                onBlur={() => setFieldTouched(fieldName, true)}
                                                                onChange={(e) => setFieldValue(fieldName, e.target.value)}
                                                            />
                                                            <FieldError>
                                                                {typeof errorKey === "string" && errorKey.startsWith("challenge.")
                                                                    ? t(errorKey)
                                                                    : errorKey}
                                                            </FieldError>
                                                        </TextField>
                                                        <div className="h-3" />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                isDisabled={isSubmitting}
                                                                size="lg"
                                                                variant="primary"
                                                                onPress={() => formik.submitForm()}
                                                            >
                                                                {t("challenge.submissionModal.submit")}
                                                            </Button>
                                                            <Button
                                                                size="lg"
                                                                variant="secondary"
                                                                onPress={() => {
                                                                    dispatch(setChallengeSubmissionId(submission.id))
                                                                    onOpenSubmissionAttempts()
                                                                }}
                                                            >
                                                                {t("challenge.submissionModal.viewAttempts")}
                                                            </Button>
                                                        </div>
                                                        {submission.userSubmission?.lastAttempt ? (
                                                            <>
                                                                <div className="h-3" />
                                                                <div className="flex gap-2 text-sm text-foreground-500">
                                                                    <span>
                                                                        {t("challenge.submissionModal.lastAttemptScore", {
                                                                            earned:
                                                                                submission.userSubmission.lastAttempt.score ?? 0,
                                                                            max: submission.score ?? 0,
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : null}
                                                    </div>
                                                </Surface>
                                            )
                                        })}
                                    </div>
                                )}
                                {swr.isMutating ? (
                                    <>
                                        <div className="h-3" />
                                        <div className="flex items-center gap-2">
                                            <Spinner size="sm" />
                                            <div className="text-sm text-foreground-500">
                                                {t("challenge.submissionModal.loading")}
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </ScrollShadow>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    )
}
