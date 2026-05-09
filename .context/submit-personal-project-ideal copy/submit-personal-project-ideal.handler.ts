import {
    ICQRSHandler,
} from "@modules/cqrs"
import {
    EnrollmentEntity,
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
import {
    UserNotFoundException
} from "@modules/exceptions"

@CommandHandler(SubmitPersonalProjectIdealCommand)
@Injectable()
export class SubmitPersonalProjectIdealHandler
    extends ICQRSHandler<SubmitPersonalProjectIdealCommand, EnrollmentEntity>
    implements ICommandHandler<SubmitPersonalProjectIdealCommand, EnrollmentEntity> {
    constructor(
        @InjectPrimaryPostgreSQLEntityManager()
        private readonly entityManager: EntityManager,
    ) {
        super()
    }

    protected override async process(
        command: SubmitPersonalProjectIdealCommand,
    ): Promise<EnrollmentEntity> {
        const { request, user } = command.params
        if (!user) {
            throw new UserNotFoundException({
            })
        }
        const enrollment = await this.entityManager.findOneOrFail(
            EnrollmentEntity,
            {
                where: {
                    userId: user.id,
                    courseId: request.courseId,
                },
            },
        )

        enrollment.ideaText = request.ideaText

        return this.entityManager.save(
            EnrollmentEntity,
            enrollment,
        )
    }
}
