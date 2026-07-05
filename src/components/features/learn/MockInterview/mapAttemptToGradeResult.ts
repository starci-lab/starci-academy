import type { MockInterviewAttemptItem } from "@/modules/api/graphql/queries/types/my-mock-interview-attempts"
import type { MockInterviewGradeResult, MockInterviewPhaseKey } from "./types"

/** Narrows a loose wire-format verdict string to the local union, defaulting to "borderline". */
export const normalizeMockInterviewVerdict = (verdict: string): MockInterviewGradeResult["verdict"] =>
    (verdict === "pass" || verdict === "fail") ? verdict : "borderline"

/**
 * Maps a persisted mock-interview attempt (as returned by
 * `myMockInterviewAttempts`) into the same {@link MockInterviewGradeResult}
 * shape the live grading mutation returns — so
 * {@link import("./MockInterviewScorecard").MockInterviewScorecard} renders
 * both a just-finished session and a past attempt re-opened from history
 * through the SAME component (single source of render).
 *
 * @param attempt - one past attempt from `myMockInterviewAttempts`.
 * @returns the equivalent {@link MockInterviewGradeResult}.
 */
export const mapMockInterviewAttemptToGradeResult = (
    attempt: MockInterviewAttemptItem,
): MockInterviewGradeResult => ({
    overallScore: attempt.overallScore,
    verdict: normalizeMockInterviewVerdict(attempt.verdict),
    phaseScores: attempt.phaseScores.map((phaseScore) => ({
        phase: phaseScore.phase as MockInterviewPhaseKey,
        score: phaseScore.score,
        max: phaseScore.max,
    })),
    attributeScores: attempt.attributeScores,
    strengths: attempt.strengths,
    gaps: attempt.gaps,
    followUpQuestion: attempt.followUpQuestion,
    matchedContentIds: attempt.matchedContentIds,
})
