/**
 * PrincipleToken — the closed set of layout/seam tokens a node may declare via
 * `principles={[…]}`. MUST stay in sync with `.storybook/test-runner/patterns.mjs`
 * (the registry that maps each token → the CSS value it must compute to). A typed
 * union so `tsc` rejects a token that isn't in the registry — a compile-time guard
 * on top of the runtime `check-pattern-coverage` gate.
 */
export type PrincipleToken =
    // gap — seam intent
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
 * Build the `data-principles` attribute value from a token list — space-separated
 * like `class`, queryable as `[data-principles~="token"]`. Empty/undefined → the
 * attribute is omitted entirely (never an empty string).
 */
export const principlesAttr = (principles?: ReadonlyArray<PrincipleToken>): string | undefined =>
    principles && principles.length > 0 ? principles.join(" ") : undefined

/**
 * Why THIS layer exists — one plain sentence, emitted as `data-explain` beside the
 * tokens it justifies.
 *
 * `principles` says WHAT a node claims to be. On its own that is a label, and a label
 * outlives every change that quietly invalidates it. `explain` says WHY there is a node
 * here at all — the part nobody can reconstruct from the markup afterwards, and the part
 * that decides whether the next layer belongs beside this one or inside it.
 *
 * It lands in the DOM, not only in source, so the reason is readable exactly where the
 * problem is being looked at: open the element, read why it is there.
 *
 * Write a REASON, not a restatement. "row of chips" only repeats the tokens; "the tags
 * wrap onto their own line before the title does" is the fact that made this node exist.
 */
export type ExplainReason = string

/** Omit the attribute for a blank reason — never emit `data-explain=""`. */
export const explainAttr = (explain?: ExplainReason): string | undefined =>
    explain && explain.trim().length > 0 ? explain.trim() : undefined
