import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    EnrollmentMilestoneEntity,
    InjectPrimaryPostgreSQLEntityManager,
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
    SubmitPersonalProjectIdealCommand,
} from "./submit-personal-project-ideal.command"

@CommandHandler(SubmitPersonalProjectIdealCommand)
@Injectable()
export class SubmitPersonalProjectIdealHandler
    extends ICQRSHandler<SubmitPersonalProjectIdealCommand, EnrollmentMilestoneEntity>
    implements ICommandHandler<SubmitPersonalProjectIdealCommand, EnrollmentMilestoneEntity> {
    constructor(
        @InjectPrimaryPostgreSQLEntityManager()
        private readonly entityManager: EntityManager,
    ) {
        super()
    }

    protected override async process(
        command: SubmitPersonalProjectIdealCommand,
    ): Promise<EnrollmentMilestoneEntity> {
        const {
            enrollmentMilestoneId,
            ideaText,
        } = command.params

        const enrollmentMilestone = await this.entityManager.findOneOrFail(
            EnrollmentMilestoneEntity,
            {
                where: {
                    id: enrollmentMilestoneId,
                },
            },
        )

        enrollmentMilestone.ideaText = ideaText

        return this.entityManager.save(
            EnrollmentMilestoneEntity,
            enrollmentMilestone,
        )
    }
}
