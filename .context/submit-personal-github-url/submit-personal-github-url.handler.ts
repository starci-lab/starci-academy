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
    SubmitPersonalGithubUrlCommand,
} from "./submit-personal-github-url.command"

@CommandHandler(SubmitPersonalGithubUrlCommand)
@Injectable()
export class SubmitPersonalGithubUrlHandler
    extends ICQRSHandler<SubmitPersonalGithubUrlCommand, EnrollmentEntity>
    implements ICommandHandler<SubmitPersonalGithubUrlCommand, EnrollmentEntity> {
    constructor(
        @InjectPrimaryPostgreSQLEntityManager()
        private readonly entityManager: EntityManager,
    ) {
        super()
    }

    protected override async process(
        command: SubmitPersonalGithubUrlCommand,
    ): Promise<EnrollmentEntity> {
        const {
            enrollmentId,
            githubUrl,
        } = command.params

        const enrollment = await this.entityManager.findOneOrFail(
            EnrollmentEntity,
            {
                where: {
                    id: enrollmentId,
                },
            },
        )

        enrollment.personalProjectGithubUrl = githubUrl

        return this.entityManager.save(
            EnrollmentEntity,
            enrollment,
        )
    }
}
