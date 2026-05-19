/** One breadcrumb row for headhunting company detail. */
export type HeadhuntingCompanyBreadcrumbItem = {
    /** Stable React key. */
    key: string
    /** Visible label. */
    label: string
    /** Optional navigation handler. */
    onPress?: () => void
}

/** Optional contact link row on company detail. */
export type HeadhuntingCompanyContactLink = {
    /** Translation key label. */
    labelKey:
        | "headhuntings.website"
        | "headhuntings.address"
        | "headhuntings.phone"
        | "headhuntings.email"
        | "headhuntings.linkedin"
    /** Display or href value. */
    value: string
    /** External href when applicable. */
    href?: string
}
