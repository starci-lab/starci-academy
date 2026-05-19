import type { AbstractEntity } from "./abstract"
import type { HeadhuntingCompanyEntity } from "./headhunting-company"

/** IT recruitment consultant profile. */
export interface ConsultantEntity extends AbstractEntity {
    displayId: string
    fullName: string
    jobTitle?: string | null
    description?: string | null
    linkedinUrl?: string | null
    email?: string | null
    phoneNumber?: string | null
    zaloNumber?: string | null
    avatarUrl?: string | null
    orderIndex: number
    companyId: string
    company?: HeadhuntingCompanyEntity
}
