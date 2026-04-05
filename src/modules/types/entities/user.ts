import type { AbstractEntity } from "./abstract"
import type { EnrollmentEntity } from "./enrollment"
import type { SubmissionEntity } from "./submission"

/**
 * Application user; identity comes from Keycloak (keycloakId = JWT sub).
 */
export interface UserEntity extends AbstractEntity {
    /** The username of the user. */
    username: string
    /** The email of the user. */
    email?: string
    /** The Keycloak ID of the user. */
    keycloakId: string
    /** Whether the user is deleted. */
    isDeleted: boolean
    /** The avatar of the user. */
    avatar?: string
    /** The submissions of the user. */
    submissions?: Array<SubmissionEntity>
    /** The enrollments of the user. */
    enrollments?: Array<EnrollmentEntity>
}
