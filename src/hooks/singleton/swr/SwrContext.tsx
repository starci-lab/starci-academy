"use client"
import React, { PropsWithChildren } from "react"
import { createContext } from "react"
import {
    useMutateCourseEnrollSwrCore,
    useMutateSubmitChallengeSubmissionSwrCore,
    useMutateSyncChallengeSubmissionSwrCore,
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
    useQueryIncompleteChallengeSubmissionJobsSwrCore,
    useQuerySubmissionAttemptsSwrCore,
    useQuerySubmissionFeedbacksSwrCore,
    useQueryCvReviewHistorySwrCore,
} from "./core"

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
    queryIncompleteChallengeSubmissionJobsSwr: ReturnType<typeof useQueryIncompleteChallengeSubmissionJobsSwrCore>;
    querySubmissionAttemptsSwr: ReturnType<typeof useQuerySubmissionAttemptsSwrCore>;
    querySubmissionFeedbacksSwr: ReturnType<typeof useQuerySubmissionFeedbacksSwrCore>;
    queryCvReviewHistorySwr: ReturnType<typeof useQueryCvReviewHistorySwrCore>;
}

export const SwrContext = createContext<SwrContextType | null>(null)

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
    const queryIncompleteChallengeSubmissionJobsSwr =
        useQueryIncompleteChallengeSubmissionJobsSwrCore()
    const querySubmissionAttemptsSwr = useQuerySubmissionAttemptsSwrCore()
    const querySubmissionFeedbacksSwr = useQuerySubmissionFeedbacksSwrCore()
    const queryCvReviewHistorySwr = useQueryCvReviewHistorySwrCore()
    return (
        <SwrContext.Provider value={{
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
            queryIncompleteChallengeSubmissionJobsSwr,
            querySubmissionAttemptsSwr,
            querySubmissionFeedbacksSwr,
            queryCvReviewHistorySwr,
        }}>
            {children}
        </SwrContext.Provider>
    )
}
