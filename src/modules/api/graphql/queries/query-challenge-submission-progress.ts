import { gql } from "@apollo/client"

export const CHALLENGE_SUBMISSION_PROGRESS = gql`
    query ChallengeSubmissionProgress($request: ChallengeSubmissionProgressRequest!) {
        challengeSubmissionProgress(request: $request) {
            success
            message
            error
            data {
                completionTasks {
                    id
                    lastScore
                    maxScore
                    completed
                    numAttempts
                }
                currentTask {
                    id
                    lastScore
                    maxScore
                    completed
                    numAttempts
                }
            }
        }
    }
`
