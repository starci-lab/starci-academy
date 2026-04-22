import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    type ProcessGitSubmissionPayload,
} from "@modules/bullmq"
import {
    ActionType,
    InjectPrimaryPostgreSQLEntityManager,
    JobEntity,
    JobStatus,
    UserChallengeSubmissionEntity,
} from "@modules/databases"
import {
    InjectSuperJson,
} from "@modules/mixin"
import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler,
    QueryHandler,
} from "@nestjs/cqrs"
import {
    In,
} from "typeorm"
import type {
    EntityManager,
} from "typeorm"
import SuperJSON from "superjson"
import {
    IncompleteChallengeSubmissionJobsQuery,
} from "./incomplete-challenge-submission-jobs.query"
import {
    IncompleteChallengeSubmissionJobsResponseData,
    UserChallengeSubmissionIncompleteJobsItem,
} from "./graphql-types"

@QueryHandler(IncompleteChallengeSubmissionJobsQuery)
@Injectable()
export class IncompleteChallengeSubmissionJobsHandler
    extends ICQRSHandler<IncompleteChallengeSubmissionJobsQuery, IncompleteChallengeSubmissionJobsResponseData>
    implements IQueryHandler<IncompleteChallengeSubmissionJobsQuery, IncompleteChallengeSubmissionJobsResponseData>
{
    constructor(
        @InjectPrimaryPostgreSQLEntityManager()
        private readonly entityManager: EntityManager,
        @InjectSuperJson()
        private readonly superjson: SuperJSON,
    ) {
        super()
    }
    /** Process the query. */
    protected override async process(
        query: IncompleteChallengeSubmissionJobsQuery,
    ): Promise<IncompleteChallengeSubmissionJobsResponseData> {
        const {
            user,
            request: {
                userId: requestedUserId,
                includeEmptySubmissions = true,
            },
        } = query.params

        // If the user is not authenticated, return an empty array.
        if (!user) {
            return {
                items: [],
            }
        }

        // If the requested user id is not the same as the authenticated user id, return an empty array.
        const resolved = requestedUserId?.trim()
        const userId = resolved && resolved.length > 0 ? resolved : user.id
        if (userId !== user.id) {
            return {
                items: [],
            }
        }

        // Get the user submissions.
        const userSubmissions = await this.entityManager.find(
            UserChallengeSubmissionEntity,
            {
                where: {
                    user: {
                        id: userId,
                    },
                },
                select: {
                    id: true,
                },
            },
        )
        // Get the submission id set.
        const submissionIdSet = new Set(
            userSubmissions.map((r) => r.id),
        )

        // If the submission id set is empty, return an empty array.
        if (submissionIdSet.size === 0) {
            return {
                items: [],
            }
        }

        // Get the processing jobs.
        const processingJobs = await this.entityManager.find(
            JobEntity,
            {
                where: {
                    status: JobStatus.Processing,
                    user: {
                        id: userId,
                    },
                    actionType: In(
                        [
                            ActionType.ProcessGitSubmission,
                            ActionType.ProcessGoogleDocsSubmission,
                        ],
                    ),
                },
                select: {
                    id: true,
                    status: true,
                },
                order: {
                    queueAt: "DESC",
                },
            },
        )
        // Get the latest job by submission.
        const latestJobBySubmission = new Map<string, JobEntity | null>()
        for (const subId of submissionIdSet) {
            latestJobBySubmission.set(
                subId,
                null,
            )
        }
        // Get the latest job by submission.
        for (const job of processingJobs) {
            const parsed = this.tryParsePayload(job.payload)
            if (!parsed) {
                continue
            }
            const subId = parsed.userChallengeSubmissionId
            if (!submissionIdSet.has(subId)) {
                continue
            }
            if (latestJobBySubmission.get(subId) != null) {
                continue
            }
            latestJobBySubmission.set(
                subId,
                job,
            )
        }
        // Get the items.
        const items: Array<UserChallengeSubmissionIncompleteJobsItem> = []
        for (const [
            userChallengeSubmissionId,
            job,
        ] of latestJobBySubmission) {
            if (!includeEmptySubmissions && job == null) {
                continue
            }
            const row: UserChallengeSubmissionIncompleteJobsItem = {
                userChallengeSubmissionId,
                job,
            }
            items.push(row)
        }
        
        return {
            items,
        }
    }

    /**
     * Try to parse the payload.
     * @param raw - The raw payload.
     * @returns The parsed payload.
     */
    private tryParsePayload(
        raw: string,
    ): ProcessGitSubmissionPayload | null {
        try {
            return this.superjson.parse<ProcessGitSubmissionPayload>(raw)
        } catch {
            return null
        }
    }
}
