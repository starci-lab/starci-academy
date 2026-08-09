import type { PrincipleToken } from "./_principles"

/**
 * The topology a principle is allowed to claim. This is deliberately separate
 * from `_principle-style.ts`: CSS answers "what is emitted", while topology
 * answers "what may be rendered here". Keeping both facts explicit prevents a
 * generic Stack from silently accepting a child shape that the token cannot
 * explain.
 */
export type PrincipleTopology =
    | "free-items"
    | "measure"
    | "padding-shell"
    | "structural-child"
    | "fill-child"

/** Runtime/test contract for one semantic principle. */
export interface PrincipleContract {
    /** The frame/composite that is allowed to own this semantic contract. */
    owner: "Stack" | "Container" | "Box" | "FillAvailable"
    /** The child shape that component tests and future lint rules must enforce. */
    topology: PrincipleTopology
    /** Named slots are required when a topology is not an arbitrary item list. */
    slots?: readonly string[]
}

/**
 * Closed semantic registry. Every PrincipleToken must appear exactly once.
 *
 * Gap tokens are `free-items` because they describe the seam between already
 * typed children; they do not give Stack permission to guess domain roles.
 * Measure/padding tokens are shells because their owner is the frame itself.
 * Fill tokens are structural-child contracts because flex participation belongs
 * to the wrapper, never to an arbitrary child className.
 */
export const PRINCIPLE_CONTRACTS: { readonly [K in PrincipleToken]: PrincipleContract } = {
    "name-handle": { owner: "Stack", topology: "free-items" },
    "icon-text": { owner: "Stack", topology: "free-items" },
    "separator-dot": { owner: "Stack", topology: "free-items" },
    "title-subtitle": { owner: "Stack", topology: "free-items" },
    "flex-action": { owner: "Stack", topology: "free-items" },
    "flex-action-center": { owner: "Stack", topology: "free-items" },
    "flex-action-end": { owner: "Stack", topology: "free-items" },
    "flex-action-start": { owner: "Stack", topology: "free-items" },
    "flex-action-between": { owner: "Stack", topology: "free-items" },
    "identity": { owner: "Stack", topology: "free-items" },
    "identity-end": { owner: "Stack", topology: "free-items" },
    "value-row": { owner: "Stack", topology: "free-items" },
    "chip-row": { owner: "Stack", topology: "free-items" },
    "sibling-stack": { owner: "Stack", topology: "free-items" },
    "label-field": { owner: "Stack", topology: "free-items" },
    "content-row": { owner: "Stack", topology: "free-items" },
    "card-caption": { owner: "Stack", topology: "free-items" },
    "group-boundary": { owner: "Stack", topology: "free-items" },
    "block-boundary": { owner: "Stack", topology: "free-items" },
    "layout-split": { owner: "Stack", topology: "free-items" },
    "marketing-beat": { owner: "Stack", topology: "free-items" },
    "cell-pad": { owner: "Box", topology: "padding-shell" },
    "card-padding": { owner: "Box", topology: "padding-shell" },
    "page-pad": { owner: "Box", topology: "padding-shell" },
    "control-pad": { owner: "Box", topology: "padding-shell" },
    "row-pad": { owner: "Box", topology: "padding-shell" },
    "pill-pad": { owner: "Box", topology: "padding-shell" },
    "push-end": { owner: "Box", topology: "structural-child" },
    "pin-bottom": { owner: "Box", topology: "structural-child" },
    "center-measure": { owner: "Box", topology: "measure" },
    "page-measure": { owner: "Container", topology: "measure" },
    "reel": { owner: "Box", topology: "structural-child" },
    "sticky-top": { owner: "Box", topology: "structural-child" },
    "fixed-bar": { owner: "Box", topology: "structural-child" },
    "stack-below": { owner: "Box", topology: "structural-child" },
    "flex-fill": { owner: "FillAvailable", topology: "fill-child" },
    "flex-fill-base": { owner: "FillAvailable", topology: "fill-child" },
}

/** Look up the closed semantic contract for a registered principle. */
export const principleContract = (principle: PrincipleToken): PrincipleContract =>
    PRINCIPLE_CONTRACTS[principle]
