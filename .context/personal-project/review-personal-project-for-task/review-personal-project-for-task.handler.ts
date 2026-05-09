import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    BullQueueName,
    bullData,
} from "@modules/bullmq"
import type {
    ProcessPersonalProjectPayload,
} from "@modules/bullmq"
import {
    ActionType,
    EnrollmentMilestoneEntity,
    InjectPrimaryPostgreSQLEntityManager,
    PersonalProjectAttemptEntity,
} from "@modules/databases"
import {
    Injectable,
} from "@nestjs/common"
import {
    CommandHandler,
    ICommandHandler,
} from "@nestjs/cqrs"
import type {
    EntityManager,
} from "typeorm"
import {
    InjectQueue,
} from "@nestjs/bullmq"
import type {
    Queue,
} from "bullmq"
import {
    InjectSuperJson,
} from "@modules/mixin"
import SuperJSON from "superjson"
import {
    JobActionService,
} from "@modules/bussiness"
import {
    ReviewPersonalProjectForTaskCommand,
} from "./review-personal-project-for-task.command"
import type {
    ReviewPersonalProjectForTaskResponseData,
} from "./graphql-types"
import {
    v4 as uuidv4,
} from "uuid"

@CommandHandler(ReviewPersonalProjectForTaskCommand)
@Injectable()
export class ReviewPersonalProjectForTaskHandler
    extends ICQRSHandler<ReviewPersonalProjectForTaskCommand, ReviewPersonalProjectForTaskResponseData>
    implements ICommandHandler<ReviewPersonalProjectForTaskCommand, ReviewPersonalProjectForTaskResponseData> {
    constructor(
        @InjectPrimaryPostgreSQLEntityManager()
        private readonly entityManager: EntityManager,
        @InjectQueue(bullData[BullQueueName.ProcessPersonalProject].name)
        private readonly queue: Queue,
        @InjectSuperJson()
        private readonly superJson: SuperJSON,
        private readonly jobActionService: JobActionService,
    ) {
        super()
    }

    protected override async process(
        command: ReviewPersonalProjectForTaskCommand,
    ): Promise<ReviewPersonalProjectForTaskResponseData> {
        const {
            enrollmentMilestoneId,
            githubUrl,
            branch,
            userId,
        } = command.params

        /** Update githubUrl on enrollment milestone */
        const enrollmentMilestone = await this.entityManager.findOneOrFail(
            EnrollmentMilestoneEntity,
            {
                where: {
                    id: enrollmentMilestoneId,
                },
            },
        )
        enrollmentMilestone.githubUrl = githubUrl
        await this.entityManager.save(EnrollmentMilestoneEntity, enrollmentMilestone)

        /** Count existing attempts to determine attempt number */
        const existingAttempts = await this.entityManager.count(
            PersonalProjectAttemptEntity,
            {
                where: {
                    enrollmentMilestoneId,
                },
            },
        )

        /** Create new attempt */
        const attempt = await this.entityManager.save(
            PersonalProjectAttemptEntity,
            {
                enrollmentMilestoneId,
                attemptNumber: existingAttempts + 1,
                submissionUrl: githubUrl,
            } as Partial<PersonalProjectAttemptEntity>,
        )

        /** Enqueue grading job */
        const payload: ProcessPersonalProjectPayload = {
            attemptId: attempt.id,
            branch: branch ?? "main",
        }

        const jobId = uuidv4()
        const job = await this.jobActionService.createJob({
            id: jobId,
            actionType: ActionType.ProcessPersonalProject,
            payload: this.superJson.stringify(payload),
            maxSteps: 2,
            userId,
        })

        await this.queue.add(
            job.id,
            this.superJson.stringify(payload),
            {
                jobId: job.id,
            },
        )

        return {
            attemptId: attempt.id,
            jobId: job.id,
        }
    }
}
