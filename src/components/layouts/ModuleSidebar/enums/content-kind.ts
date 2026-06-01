/**
 * Kind of a module content row in the sidebar, driving its leading icon. Premium
 * content stays readable (short teaser) — it is badged, not locked.
 */
export enum ContentKind {
    /** Free content → article glyph. */
    Normal = "normal",
    /** Premium content → star badge. */
    Premium = "premium",
}
