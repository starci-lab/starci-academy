/**
 * Localized row for {@link LessonVideoEntity} fields (`title`, `description`, `caption`, etc.).
 *
 * Mirrors Nest `LessonVideoTranslationEntity` / table `lesson_video_translations`.
 */
export interface LessonVideoTranslationEntity {
    /** Owning lesson video id. */
    lessonVideoId: string
    /** Locale (Nest `Locale` / GraphQL `GraphQLTypeLocale`). */
    locale: string
    /** Field name being translated. */
    field: string
    /** Translated value. */
    value: string
    /** The duration of the exclusive lesson video in milliseconds. */
    createdAt?: Date
    /** The updated at date of the exclusive lesson video. */
    updatedAt?: Date
}
