import {
    InjectPrimaryPostgreSQLEntityManager,
    Locale,
    ModuleEntity,
    TranslationResolverService,
} from "@modules/databases"
import {
    ModuleNotFoundException,
} from "@modules/exceptions"
import {
    Injectable,
} from "@nestjs/common"
import type {
    EntityManager,
} from "typeorm"
import type {
    ModuleRequest,
} from "./graphql-types"
import type {
    ExecuteParams,
} from "../../../../types"

/**
 * Loads a single module from primary PostgreSQL for GraphQL.
 */
@Injectable()
export class ModuleService {
    constructor(
        @InjectPrimaryPostgreSQLEntityManager()
        private readonly entityManager: EntityManager,
        private readonly translationResolver: TranslationResolverService,
    ) { }

    /**
     * Executes the module service.
     * @param request - The request object.
     * @param locale - The locale object.
     * @returns The module object.
     */
    async execute(
        {
            request,
            locale,
        }: ExecuteParams<ModuleRequest>,
    ): Promise<ModuleEntity> {
        const {
            id,
        } = request

        const moduleEntity = await this.entityManager.findOne(
            ModuleEntity,
            {
                where: {
                    id,
                },
                relations: {
                    translations: true,
                    contents: {
                        translations: true,
                    },
                    previewContents: {
                        translations: true,
                    },
                    lessonVideos: {
                        translations: true,
                    },
                    submissions: true,
                },
            },
        )

        if (!moduleEntity) {
            throw new ModuleNotFoundException(
                {
                    id,
                },
            )
        }

        // Apply translations onto base fields (same pattern as CourseTransformerService)
        const fallbackLocale = moduleEntity.defaultLocale ?? Locale.En

        moduleEntity.title = this.translationResolver.resolve(
            {
                translations: moduleEntity.translations,
                field: "title",
                locale,
                fallbackLocale,
            },
        )
        moduleEntity.description = this.translationResolver.resolve(
            {
                translations: moduleEntity.translations,
                field: "description",
                locale,
                fallbackLocale,
            },
        )

        if (moduleEntity.contents?.length) {
            moduleEntity.contents = moduleEntity.contents.map((content) => {
                content.title = this.translationResolver.resolve(
                    {
                        translations: content.translations,
                        field: "title",
                        locale,
                        fallbackLocale,
                    },
                )
                content.body = this.translationResolver.resolve(
                    {
                        translations: content.translations,
                        field: "body",
                        locale,
                        fallbackLocale,
                    },
                )
                return content
            })
        }

        if (moduleEntity.previewContents?.length) {
            moduleEntity.previewContents = moduleEntity.previewContents.map((previewContent) => {
                previewContent.data = this.translationResolver.resolve(
                    {
                        translations: previewContent.translations,
                        field: "data",
                        locale,
                        fallbackLocale,
                    },
                )
                return previewContent
            })
        }

        if (moduleEntity.lessonVideos?.length) {
            moduleEntity.lessonVideos = moduleEntity.lessonVideos.map((lessonVideo) => {
                lessonVideo.title = this.translationResolver.resolve(
                    {
                        translations: lessonVideo.translations,
                        field: "title",
                        locale,
                        fallbackLocale,
                    },
                )
                lessonVideo.description = this.translationResolver.resolve(
                    {
                        translations: lessonVideo.translations,
                        field: "description",
                        locale,
                        fallbackLocale,
                    },
                )
                return lessonVideo
            })
        }

        return moduleEntity
    }
}

