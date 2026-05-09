import {
    ICQRSHandler
} from "@modules/cqrs"
import {
    CourseEntity,
    InjectPrimaryPostgreSQLEntityManager,
    Locale,
    MilestoneEntity,
    MilestoneResolverService,
} from "@modules/databases"
import {
    Injectable,
} from "@nestjs/common"
import {
    IQueryHandler,
    QueryHandler,
} from "@nestjs/cqrs"
import type {
    EntityManager,
} from "typeorm"
import {
    MilestonesQuery,
} from "./milestones.query"

@QueryHandler(MilestonesQuery)
@Injectable()
export class MilestonesHandler
    extends ICQRSHandler<MilestonesQuery, Array<MilestoneEntity>>
    implements IQueryHandler<MilestonesQuery, Array<MilestoneEntity>> {
    constructor(
        @InjectPrimaryPostgreSQLEntityManager()
        private readonly entityManager: EntityManager,
        private readonly milestoneResolver: MilestoneResolverService,
    ) {
        super()
    }

    protected override async process(query: MilestonesQuery): Promise<Array<MilestoneEntity>> {
        const {
            request,
            locale,
        } = query.params

        /** Resolve course id from courseId or courseDisplayId */
        let courseId = request.courseId
        if (!courseId && request.courseDisplayId) {
            const course = await this.entityManager.findOne(
                CourseEntity,
                {
                    where: {
                        displayId: request.courseDisplayId,
                    },
                    select: ["id"],
                },
            )
            if (course) {
                courseId = course.id
            }
        }
        if (!courseId) {
            return []
        }

        /** Load milestones with full nested graph */
        const milestones = await this.entityManager.find(
            MilestoneEntity,
            {
                where: {
                    course: {
                        id: courseId,
                    },
                },
                relations: {
                    translations: true,
                    tasks: {
                        translations: true,
                        passCriteria: {
                            translations: true,
                        },
                    },
                },
                order: {
                    orderIndex: "ASC",
                    tasks: {
                        orderIndex: "ASC",
                        passCriteria: {
                            orderIndex: "ASC",
                        },
                    },
                },
            },
        )

        /** Apply locale-specific translations */
        const resolvedLocale = locale ?? Locale.En
        return milestones.map(
            (milestone) => {
                const plain = milestone.toPlain<MilestoneEntity>()
                this.milestoneResolver.transform(
                    plain,
                    resolvedLocale,
                )
                return plain
            },
        )
    }
}
