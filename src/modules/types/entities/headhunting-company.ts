import type { AbstractEntity } from "./abstract"

/** IT recruitment company (e.g. Pegasi). */
export interface HeadhuntingCompanyEntity extends AbstractEntity {
    displayId: string
    title: string
    description?: string | null
    websiteUrl?: string | null
    logoUrl?: string | null
    address?: string | null
    phone?: string | null
    email?: string | null
    facebookUrl?: string | null
    linkedinUrl?: string | null
    orderIndex: number
}
