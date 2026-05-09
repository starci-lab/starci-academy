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
        const {
            enrollmentId,
            ideaText,
        } = command.params

        const enrollment = await this.entityManager.findOneOrFail(
            EnrollmentEntity,
            {
                where: {
                    id: enrollmentId,
                },
            },
        )

        /** Only allow submitting once — reject if already set */
        if (enrollment.ideaText) {
            throw new Error("Project idea has already been submitted and cannot be changed.")
        }

        enrollment.ideaText = ideaText

        return this.entityManager.save(
            EnrollmentEntity,
            enrollment,
        )
    }
}
