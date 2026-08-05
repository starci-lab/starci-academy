/**
 * PrincipleToken -- the closed set of layout/seam tokens a node may declare via
 * `principles="token"`. MUST stay in sync with `.storybook/test-runner/patterns.mjs`
 * (the registry that maps each token -> the CSS value it must compute to). A typed
 * union so `tsc` rejects a token that isn't in the registry -- a compile-time guard
 * on top of the runtime `check-pattern-coverage` gate.
 *
 * One public frame instance carries exactly one token. Multiple tokens on one node
 * means the seams belong to different owners: split the node or keep the one
 * correct seam owner. Do not join tokens.
 */
export type PrincipleToken =
    // gap -- seam intent
    | "name-handle" | "icon-text" | "separator-dot" | "title-subtitle"
    | "flex-action" | "identity" | "value-row" | "chip-row" | "sibling-stack"
    | "label-field" | "content-row" | "card-caption"
    | "group-boundary" | "block-boundary" | "layout-split" | "marketing-beat"
    // padding
    | "cell-pad" | "card-padding" | "page-pad" | "control-pad" | "row-pad" | "pill-pad"
    // margin / alignment
    | "push-end" | "pin-bottom" | "center-measure"
    // structural (frame-emitted)
    | "reel" | "sticky-top" | "fixed-bar" | "stack-below"

/**
 * Build the `data-principles` attribute value from one token. Undefined omits the
 * attribute entirely (never an empty string). The attribute stays queryable as
 * `[data-principles~="token"]`.
 */
export const principlesAttr = (principles?: PrincipleToken): string | undefined =>
    principles || undefined
