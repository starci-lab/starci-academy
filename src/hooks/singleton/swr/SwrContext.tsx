"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import {
    useMutateCourseEnrollSwrCore,
    useMutateSubmitChallengeSubmissionSwrCore,
    useMutateSyncChallengeSubmissionSwrCore,
    usePostKeycloakLoginSwrCore,
    usePostKeycloakRegisterSwrCore,
    useQueryChallengeSwrCore,
    useQueryChallengesSwrCore,
    useQueryContentSwrCore,
    useQueryContentsSwrCore,
    useQueryCourseEnrollmentStatusSwrCore,
    useQueryCourseSwrCore,
    useQueryCoursesSwrCore,
    useQueryLessonVideoSwrCore,
    useQueryLessonVideosSwrCore,
    useQueryLivestreamSessionsSwrCore,
    useQueryUserSwrCore,
    useQueryModuleSwrCore,
    useQueryChallengeSubmissionsSwrCore,
    useQuerySystemConfigSwrCore,
    useQueryIncompleteJobsSwrCore,
    useQuerySubmissionAttemptsSwrCore,
    useQuerySubmissionFeedbacksSwrCore,
    useQueryUserCvSubmissionAttemptsSwrCore,
    useQueryCheckEmailExistsSwrCore,
    useMutateExchangeCodeForTokenSwrCore,
    useMutateSignOutSwrCore,
    useMutateSignInInitSwrCore,
    useMutateSignInVerifyOtpSwrCore,
    useMutateSignInResendOtpSwrCore,
    useMutateSignUpSwrCore,
    useMutateSignUpVerifyOtpSwrCore,
    useMutateSignUpResendOtpSwrCore,
    useMutateSubmitPersonalProjectIdealSwrCore,
    useMutateSubmitPersonalGithubUrlSwrCore,
    useMutateSyncIdealTextSwrCore,
    useMutateSyncPersonalProjectGithubSwrCore,
    useMutateSyncPersonalProjectGithubBranchSwrCore,
    useMutateReviewPersonalProjectTaskSwrCore,
    useMutateReviewCvSwrCore,
    useAutocompleteGlobalSearchSwrCore,
    usePostAdminPresignedUrlSwrCore,
    usePostAdminProcessVideoSwrCore,
    useQueryMilestonesSwrCore,
    useQueryMilestoneTaskSwrCore,
    useQueryModulesSwrCore,
    useQueryUserPersonalTaskAttemptsSwrCore,
    useQueryUserPersonalTaskAttemptFeedbacksSwrCore,
    useQueryMilestoneTaskProgressSwrCore,
    useQueryAiModelsSwrCore,
    useQueryMyAiSettingsSwrCore,
    useQueryMyAiQuotaSwrCore,
    useMutateUpdateMyAiSettingsSwrCore,
    useQueryAiSubscriptionTiersSwrCore,
    useMutatePurchaseAiSubscriptionSwrCore,
    useQueryContentStatusSwrCore,
    useQueryPublicContentSwrCore,
    useQuerySavedContentsSwrCore,
    useMutateToggleFavoriteSwrCore,
    useMutateGenerateSubmitCvPresignUrlSwrCore,
    useMutateVerifySubmitCvPresignUrlSwrCore,
    useQueryTemplateCvsSwrCore,
    useQueryCvUrlSwrCore,
    useQueryFoundationCategoriesSwrCore,
    useQueryFoundationsSwrCore,
    useQueryHeadhunterCompaniesSwrCore,
    useQueryHeadhuntersSwrCore,
} from "./core"

/**
 * Shape of the singleton SWR context; each field is a live SWR (query or mutation) handle
 * created once in {@link SwrProvider} and consumed via the accessor hooks.
 */
export interface SwrContextType {
    queryCourseSwr: ReturnType<typeof useQueryCourseSwrCore>;
    queryCourseEnrollmentStatusSwr: ReturnType<typeof useQueryCourseEnrollmentStatusSwrCore>;
    queryCoursesSwr: ReturnType<typeof useQueryCoursesSwrCore>;
    queryUserSwr: ReturnType<typeof useQueryUserSwrCore>;
    mutateCourseEnrollSwr: ReturnType<typeof useMutateCourseEnrollSwrCore>;
    mutateSyncChallengeSubmissionsSwr: ReturnType<typeof useMutateSyncChallengeSubmissionSwrCore>;
    mutateSubmitChallengeSubmissionSwr: ReturnType<typeof useMutateSubmitChallengeSubmissionSwrCore>;
    queryModuleSwr: ReturnType<typeof useQueryModuleSwrCore>;
    queryContentSwr: ReturnType<typeof useQueryContentSwrCore>;
    queryLessonVideo: ReturnType<typeof useQueryLessonVideoSwrCore>;
    queryChallengeSwr: ReturnType<typeof useQueryChallengeSwrCore>;
    queryContentsSwr: ReturnType<typeof useQueryContentsSwrCore>;
    queryLessonVideosSwr: ReturnType<typeof useQueryLessonVideosSwrCore>;
    queryLivestreamSessionsSwr: ReturnType<typeof useQueryLivestreamSessionsSwrCore>;
    queryChallengesSwr: ReturnType<typeof useQueryChallengesSwrCore>;
    queryChallengeSubmissionsSwr: ReturnType<typeof useQueryChallengeSubmissionsSwrCore>;
    querySystemConfigSwr: ReturnType<typeof useQuerySystemConfigSwrCore>;
    queryIncompleteJobsSwr: ReturnType<typeof useQueryIncompleteJobsSwrCore>;
    querySubmissionAttemptsSwr: ReturnType<typeof useQuerySubmissionAttemptsSwrCore>;
    querySubmissionFeedbacksSwr: ReturnType<typeof useQuerySubmissionFeedbacksSwrCore>;
    queryUserCvSubmissionAttemptsSwr: ReturnType<typeof useQueryUserCvSubmissionAttemptsSwrCore>;
    postKeycloakLoginSwr: ReturnType<typeof usePostKeycloakLoginSwrCore>;
    postKeycloakRegisterSwr: ReturnType<typeof usePostKeycloakRegisterSwrCore>;
    queryCheckEmailExistsSwr: ReturnType<typeof useQueryCheckEmailExistsSwrCore>;
    autocompleteGlobalSearchSwr: ReturnType<typeof useAutocompleteGlobalSearchSwrCore>;
    mutateExchangeCodeForTokenSwr: ReturnType<typeof useMutateExchangeCodeForTokenSwrCore>;
    mutateSignOutSwr: ReturnType<typeof useMutateSignOutSwrCore>;
    mutateSignInInitSwr: ReturnType<typeof useMutateSignInInitSwrCore>;
    mutateSignInVerifyOtpSwr: ReturnType<typeof useMutateSignInVerifyOtpSwrCore>;
    mutateSignInResendOtpSwr: ReturnType<typeof useMutateSignInResendOtpSwrCore>;
    mutateSignUpSwr: ReturnType<typeof useMutateSignUpSwrCore>;
    mutateSignUpVerifyOtpSwr: ReturnType<typeof useMutateSignUpVerifyOtpSwrCore>;
    mutateSignUpResendOtpSwr: ReturnType<typeof useMutateSignUpResendOtpSwrCore>;
    mutateSubmitPersonalProjectIdealSwr: ReturnType<typeof useMutateSubmitPersonalProjectIdealSwrCore>;
    mutateSubmitPersonalGithubUrlSwr: ReturnType<typeof useMutateSubmitPersonalGithubUrlSwrCore>;
    mutateSyncIdealTextSwr: ReturnType<typeof useMutateSyncIdealTextSwrCore>;
    mutateSyncPersonalProjectGithubSwr: ReturnType<typeof useMutateSyncPersonalProjectGithubSwrCore>;
    mutateSyncPersonalProjectGithubBranchSwr: ReturnType<typeof useMutateSyncPersonalProjectGithubBranchSwrCore>;
    mutateReviewPersonalProjectTaskSwr: ReturnType<typeof useMutateReviewPersonalProjectTaskSwrCore>;
    mutateReviewCvSwr: ReturnType<typeof useMutateReviewCvSwrCore>;
    postAdminPresignedUrlSwr: ReturnType<typeof usePostAdminPresignedUrlSwrCore>;
    postAdminProcessVideoSwr: ReturnType<typeof usePostAdminProcessVideoSwrCore>;
    queryMilestonesSwr: ReturnType<typeof useQueryMilestonesSwrCore>;
    queryMilestoneTaskSwr: ReturnType<typeof useQueryMilestoneTaskSwrCore>;
    queryModulesSwr: ReturnType<typeof useQueryModulesSwrCore>;
    queryUserPersonalTaskAttemptsSwr: ReturnType<typeof useQueryUserPersonalTaskAttemptsSwrCore>;
    queryUserPersonalTaskAttemptFeedbacksSwr: ReturnType<typeof useQueryUserPersonalTaskAttemptFeedbacksSwrCore>;
    queryMilestoneTaskProgressSwr: ReturnType<typeof useQueryMilestoneTaskProgressSwrCore>;
    queryAiModelsSwr: ReturnType<typeof useQueryAiModelsSwrCore>;
    queryMyAiSettingsSwr: ReturnType<typeof useQueryMyAiSettingsSwrCore>;
    queryMyAiQuotaSwr: ReturnType<typeof useQueryMyAiQuotaSwrCore>;
    mutateUpdateMyAiSettingsSwr: ReturnType<typeof useMutateUpdateMyAiSettingsSwrCore>;
    queryAiSubscriptionTiersSwr: ReturnType<typeof useQueryAiSubscriptionTiersSwrCore>;
    mutatePurchaseAiSubscriptionSwr: ReturnType<typeof useMutatePurchaseAiSubscriptionSwrCore>;
    queryContentStatusSwr: ReturnType<typeof useQueryContentStatusSwrCore>;
    queryPublicContentSwr: ReturnType<typeof useQueryPublicContentSwrCore>;
    querySavedContentsSwr: ReturnType<typeof useQuerySavedContentsSwrCore>;
    mutateToggleFavoriteSwr: ReturnType<typeof useMutateToggleFavoriteSwrCore>;
    mutateGenerateSubmitCvPresignUrlSwr: ReturnType<typeof useMutateGenerateSubmitCvPresignUrlSwrCore>;
    mutateVerifySubmitCvPresignUrlSwr: ReturnType<typeof useMutateVerifySubmitCvPresignUrlSwrCore>;
    queryTemplateCvsSwr: ReturnType<typeof useQueryTemplateCvsSwrCore>;
    queryCvUrlSwr: ReturnType<typeof useQueryCvUrlSwrCore>;
    queryFoundationCategoriesSwr: ReturnType<typeof useQueryFoundationCategoriesSwrCore>;
    queryFoundationsSwr: ReturnType<typeof useQueryFoundationsSwrCore>;
    queryHeadhunterCompaniesSwr: ReturnType<typeof useQueryHeadhunterCompaniesSwrCore>;
    queryHeadhuntersSwr: ReturnType<typeof useQueryHeadhuntersSwrCore>;
}

export const SwrContext = createContext<SwrContextType | null>(null)

/**
 * Mounts all singleton SWR query and mutation hooks once at the top of the app tree.
 * @param props.children - app content
 */
export const SwrProvider = ({ children }: PropsWithChildren) => {
    const queryCourseSwr = useQueryCourseSwrCore()
    const queryCourseEnrollmentStatusSwr = useQueryCourseEnrollmentStatusSwrCore()
    const queryCoursesSwr = useQueryCoursesSwrCore()
    const queryUserSwr = useQueryUserSwrCore()
    const mutateCourseEnrollSwr = useMutateCourseEnrollSwrCore()
    const mutateSyncChallengeSubmissionsSwr =
        useMutateSyncChallengeSubmissionSwrCore()
    const mutateSubmitChallengeSubmissionSwr =
        useMutateSubmitChallengeSubmissionSwrCore()
    const queryModuleSwr = useQueryModuleSwrCore()
    const queryContentSwr = useQueryContentSwrCore()
    const queryLessonVideo = useQueryLessonVideoSwrCore()
    const queryChallengeSwr = useQueryChallengeSwrCore()
    const queryContentsSwr = useQueryContentsSwrCore()
    const queryLessonVideosSwr = useQueryLessonVideosSwrCore()
    const queryLivestreamSessionsSwr = useQueryLivestreamSessionsSwrCore()
    const queryChallengesSwr = useQueryChallengesSwrCore()
    const queryChallengeSubmissionsSwr = useQueryChallengeSubmissionsSwrCore()
    const querySystemConfigSwr = useQuerySystemConfigSwrCore()
    const queryIncompleteJobsSwr = useQueryIncompleteJobsSwrCore()
    const querySubmissionAttemptsSwr = useQuerySubmissionAttemptsSwrCore()
    const querySubmissionFeedbacksSwr = useQuerySubmissionFeedbacksSwrCore()
    const queryUserCvSubmissionAttemptsSwr = useQueryUserCvSubmissionAttemptsSwrCore()
    const postKeycloakLoginSwr = usePostKeycloakLoginSwrCore()
    const postKeycloakRegisterSwr = usePostKeycloakRegisterSwrCore()
    const queryCheckEmailExistsSwr = useQueryCheckEmailExistsSwrCore()
    const autocompleteGlobalSearchSwr = useAutocompleteGlobalSearchSwrCore()
    const mutateExchangeCodeForTokenSwr = useMutateExchangeCodeForTokenSwrCore()
    const mutateSignOutSwr = useMutateSignOutSwrCore()
    const mutateSignInInitSwr = useMutateSignInInitSwrCore()
    const mutateSignInVerifyOtpSwr = useMutateSignInVerifyOtpSwrCore()
    const mutateSignInResendOtpSwr = useMutateSignInResendOtpSwrCore()
    const mutateSignUpSwr = useMutateSignUpSwrCore()
    const mutateSignUpVerifyOtpSwr = useMutateSignUpVerifyOtpSwrCore()
    const mutateSignUpResendOtpSwr = useMutateSignUpResendOtpSwrCore()
    const mutateSubmitPersonalProjectIdealSwr = useMutateSubmitPersonalProjectIdealSwrCore()
    const mutateSubmitPersonalGithubUrlSwr = useMutateSubmitPersonalGithubUrlSwrCore()
    const mutateSyncIdealTextSwr = useMutateSyncIdealTextSwrCore()
    const mutateSyncPersonalProjectGithubSwr = useMutateSyncPersonalProjectGithubSwrCore()
    const mutateSyncPersonalProjectGithubBranchSwr = useMutateSyncPersonalProjectGithubBranchSwrCore()
    const mutateReviewPersonalProjectTaskSwr = useMutateReviewPersonalProjectTaskSwrCore()
    const mutateReviewCvSwr = useMutateReviewCvSwrCore()
    const postAdminPresignedUrlSwr = usePostAdminPresignedUrlSwrCore()
    const postAdminProcessVideoSwr = usePostAdminProcessVideoSwrCore()
    const queryMilestonesSwr = useQueryMilestonesSwrCore()
    const queryMilestoneTaskSwr = useQueryMilestoneTaskSwrCore()
    const queryModulesSwr = useQueryModulesSwrCore()
    const queryUserPersonalTaskAttemptsSwr = useQueryUserPersonalTaskAttemptsSwrCore()
    const queryUserPersonalTaskAttemptFeedbacksSwr = useQueryUserPersonalTaskAttemptFeedbacksSwrCore()
    const queryMilestoneTaskProgressSwr = useQueryMilestoneTaskProgressSwrCore()
    const queryAiModelsSwr = useQueryAiModelsSwrCore()
    const queryMyAiSettingsSwr = useQueryMyAiSettingsSwrCore()
    const queryMyAiQuotaSwr = useQueryMyAiQuotaSwrCore()
    const mutateUpdateMyAiSettingsSwr = useMutateUpdateMyAiSettingsSwrCore()
    const queryAiSubscriptionTiersSwr = useQueryAiSubscriptionTiersSwrCore()
    const mutatePurchaseAiSubscriptionSwr = useMutatePurchaseAiSubscriptionSwrCore()
    const queryContentStatusSwr = useQueryContentStatusSwrCore()
    const queryPublicContentSwr = useQueryPublicContentSwrCore()
    const querySavedContentsSwr = useQuerySavedContentsSwrCore()
    const mutateToggleFavoriteSwr = useMutateToggleFavoriteSwrCore()
    const mutateGenerateSubmitCvPresignUrlSwr = useMutateGenerateSubmitCvPresignUrlSwrCore()
    const mutateVerifySubmitCvPresignUrlSwr = useMutateVerifySubmitCvPresignUrlSwrCore()
    const queryTemplateCvsSwr = useQueryTemplateCvsSwrCore()
    const queryCvUrlSwr = useQueryCvUrlSwrCore()
    const queryFoundationCategoriesSwr = useQueryFoundationCategoriesSwrCore()
    const queryFoundationsSwr = useQueryFoundationsSwrCore()
    const queryHeadhunterCompaniesSwr = useQueryHeadhunterCompaniesSwrCore()
    const queryHeadhuntersSwr = useQueryHeadhuntersSwrCore()
    return (
        <SwrContext.Provider value={
            {
                queryCourseSwr,
                queryCourseEnrollmentStatusSwr,
                queryCoursesSwr,
                queryUserSwr,
                mutateCourseEnrollSwr,
                mutateSyncChallengeSubmissionsSwr,
                mutateSubmitChallengeSubmissionSwr,
                queryModuleSwr,
                queryContentSwr,
                queryLessonVideo,
                queryChallengeSwr,
                queryContentsSwr,
                queryLessonVideosSwr,
                queryLivestreamSessionsSwr,
                queryChallengesSwr,
                queryChallengeSubmissionsSwr,
                querySystemConfigSwr,
                queryIncompleteJobsSwr,
                querySubmissionAttemptsSwr,
                querySubmissionFeedbacksSwr,
                queryUserCvSubmissionAttemptsSwr,
                postKeycloakLoginSwr,
                postKeycloakRegisterSwr,
                queryCheckEmailExistsSwr,
                autocompleteGlobalSearchSwr,
                mutateExchangeCodeForTokenSwr,
                mutateSignOutSwr,
                mutateSignInInitSwr,
                mutateSignInVerifyOtpSwr,
                mutateSignInResendOtpSwr,
                mutateSignUpSwr,
                mutateSignUpVerifyOtpSwr,
                mutateSignUpResendOtpSwr,
                mutateSubmitPersonalProjectIdealSwr,
                mutateSubmitPersonalGithubUrlSwr,
                mutateSyncIdealTextSwr,
                mutateSyncPersonalProjectGithubSwr,
                mutateSyncPersonalProjectGithubBranchSwr,
                mutateReviewPersonalProjectTaskSwr,
                mutateReviewCvSwr,
                postAdminPresignedUrlSwr,
                postAdminProcessVideoSwr,
                queryMilestonesSwr,
                queryMilestoneTaskSwr,
                queryModulesSwr,
                queryUserPersonalTaskAttemptsSwr,
                queryUserPersonalTaskAttemptFeedbacksSwr,
                queryMilestoneTaskProgressSwr,
                queryAiModelsSwr,
                queryMyAiSettingsSwr,
                queryMyAiQuotaSwr,
                mutateUpdateMyAiSettingsSwr,
                queryAiSubscriptionTiersSwr,
                mutatePurchaseAiSubscriptionSwr,
                queryContentStatusSwr,
                queryPublicContentSwr,
                querySavedContentsSwr,
                mutateToggleFavoriteSwr,
                mutateGenerateSubmitCvPresignUrlSwr,
                mutateVerifySubmitCvPresignUrlSwr,
                queryTemplateCvsSwr,
                queryCvUrlSwr,
                queryFoundationCategoriesSwr,
                queryFoundationsSwr,
                queryHeadhunterCompaniesSwr,
                queryHeadhuntersSwr,
            }
        }>
            {children}
        </SwrContext.Provider>
    )
}
