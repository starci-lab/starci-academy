/**
 * PrincipleToken - the closed set of layout/seam tokens a node may declare via
 * `principle="token"`. MUST stay in sync with `.storybook/test-runner/patterns.mjs`
 * (the registry that maps each token to the CSS value it must compute to). A typed
 * union so `tsc` rejects a token that is not in the registry - a compile-time guard
 * on top of the runtime `check-pattern-coverage` gate.
 *
 * One public frame instance carries exactly one token. Multiple tokens on one node
 * means the seams belong to different owners: split the node or keep the one
 * correct seam owner. Do not join tokens.
 */
export type PrincipleToken =
    // gap - seam intent
    | "name-handle" | "icon-text" | "separator-dot" | "title-subtitle"
    | "flex-action" | "flex-action-center" | "flex-action-end" | "flex-action-start" | "flex-action-between"
    | "identity" | "identity-end" | "value-row" | "chip-row" | "sibling-stack"
    | "label-field" | "content-row" | "card-caption"
    | "group-boundary" | "block-boundary" | "layout-split" | "marketing-beat"
    // padding
    | "cell-pad" | "card-padding" | "page-pad" | "control-pad" | "row-pad" | "pill-pad"
    // margin / alignment
    | "push-end" | "pin-bottom" | "center-measure" | "page-measure"
    // structural (frame-emitted)
    | "reel" | "sticky-top" | "fixed-bar" | "stack-below" | "flex-fill" | "flex-fill-base"

/**
 * Build the `data-principle` attribute value from one token. Undefined omits the
 * attribute entirely (never an empty string). Query as `[data-principle="token"]`.
 */
export const principleAttr = (principle?: PrincipleToken): string | undefined =>
    principle || undefined

/**
 * Why THIS layer exists - one plain sentence, emitted as `data-explain` beside the
 * token it justifies.
 *
 * `principle` says WHAT a node claims to be. On its own that is a label, and a label
 * outlives every change that quietly invalidates it. `explain` says WHY there is a node
 * here at all - the part nobody can reconstruct from the markup afterwards, and the part
 * that decides whether the next layer belongs beside this one or inside it.
 *
 * It lands in the DOM, not only in source, so the reason is readable exactly where the
 * problem is being looked at: open the element, read why it is there.
 *
 * Write a REASON, not a restatement. "row of chips" only repeats the token; "the tags
 * wrap onto their own line before the title does" is the fact that made this node exist.
 */
export type ExplainReason = string

/** Omit the attribute for a blank reason - never emit `data-explain=""`. */
export const explainAttr = (explain?: ExplainReason): string | undefined =>
    explain && explain.trim().length > 0 ? explain.trim() : undefined
