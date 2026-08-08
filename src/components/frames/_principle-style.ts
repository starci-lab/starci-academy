/**
 * Principle → owned CSS responsibility. Typed mirror of
 * `.storybook/test-runner/patterns.mjs` (`prop` + step / xy / margin).
 *
 * A token is semantic and may resolve MULTIPLE private CSS declarations
 * (gap + align, padding + measure, …). Callers declare one `principle`;
 * Flex/Stack resolve the class list. Keep in lockstep with `patterns.mjs`
 * (audit-principles).
 */
import type { PrincipleToken } from "./_principles"
import {
    ALIGN_CLASS,
    GAP_CLASS,
    JUSTIFY_CLASS,
    PADDING_CLASS,
    type AllowedGap,
    type AllowedPadding,
    type LayoutAlign,
    type LayoutJustify,
    type PaddingValue,
    type Responsive,
    gapClassNames,
    paddingClassNames,
} from "./_spacing"

/** Gap-owning principles — Flex/Stack may omit `gap` when one of these is set. */
export type GapPrinciple = Extract<
    PrincipleToken,
    | "name-handle"
    | "icon-text"
    | "separator-dot"
    | "title-subtitle"
    | "flex-action"
    | "flex-action-center"
    | "flex-action-end"
    | "flex-action-start"
    | "flex-action-between"
    | "identity"
    | "identity-end"
    | "value-row"
    | "chip-row"
    | "sibling-stack"
    | "label-field"
    | "content-row"
    | "card-caption"
    | "group-boundary"
    | "block-boundary"
    | "layout-split"
    | "marketing-beat"
>

/** Symmetric / asymmetric padding principles. */
export type PaddingPrinciple = Extract<
    PrincipleToken,
    "cell-pad" | "card-padding" | "page-pad" | "control-pad" | "row-pad" | "pill-pad"
>

type PrincipleStyleEntry =
    | { kind: "gap"; step: AllowedGap; align?: LayoutAlign; justify?: LayoutJustify }
    | { kind: "padding"; step: AllowedPadding; align?: LayoutAlign; justify?: LayoutJustify }
    | { kind: "padding-xy"; x: AllowedPadding; y: AllowedPadding; align?: LayoutAlign; justify?: LayoutJustify }
    | { kind: "margin"; classes: readonly string[]; align?: LayoutAlign; justify?: LayoutJustify }
    | { kind: "structural"; classes: readonly string[]; align?: LayoutAlign; justify?: LayoutJustify }

/**
 * Closed map: every {@link PrincipleToken} declares ownership. Optional
 * `align` / `justify` are private CSS the resolver emits with the token —
 * callers must not pass those props on the public Stack API.
 */
export const PRINCIPLE_STYLE: { readonly [K in PrincipleToken]: PrincipleStyleEntry } = {
    "name-handle": { kind: "gap", step: 1 },
    "icon-text": { kind: "gap", step: 2 },
    "separator-dot": { kind: "gap", step: 2 },
    "title-subtitle": { kind: "gap", step: 2 },
    "flex-action": { kind: "gap", step: 3 },
    "flex-action-center": { kind: "gap", step: 3, align: "center" },
    "flex-action-end": { kind: "gap", step: 3, justify: "end" },
    "flex-action-start": { kind: "gap", step: 3, justify: "start" },
    "flex-action-between": { kind: "gap", step: 3, justify: "between" },
    "identity": { kind: "gap", step: 3 },
    "identity-end": { kind: "gap", step: 3, align: "end" },
    "value-row": { kind: "gap", step: 3, align: "baseline" },
    "chip-row": { kind: "gap", step: 3 },
    "sibling-stack": { kind: "gap", step: 3 },
    "label-field": { kind: "gap", step: 4 },
    "content-row": { kind: "gap", step: 4 },
    "card-caption": { kind: "gap", step: 4 },
    "group-boundary": { kind: "gap", step: 5 },
    "block-boundary": { kind: "gap", step: 6 },
    "layout-split": { kind: "gap", step: 7 },
    "marketing-beat": { kind: "gap", step: 8 },
    "cell-pad": { kind: "padding", step: 4 },
    "card-padding": { kind: "padding", step: 5 },
    "page-pad": { kind: "padding", step: 6 },
    "control-pad": { kind: "padding-xy", x: 4, y: 3 },
    "row-pad": { kind: "padding-xy", x: 5, y: 4 },
    "pill-pad": { kind: "padding-xy", x: 5, y: 3 },
    "push-end": { kind: "margin", classes: ["ml-auto"] },
    "pin-bottom": { kind: "margin", classes: ["mt-auto"] },
    "center-measure": { kind: "margin", classes: ["mx-auto", "w-full"] },
    "reel": { kind: "structural", classes: ["overflow-x-auto"] },
    "sticky-top": { kind: "structural", classes: ["sticky", "top-0"] },
    "fixed-bar": { kind: "structural", classes: ["fixed"] },
    "stack-below": { kind: "structural", classes: [] },
    "flex-fill": { kind: "structural", classes: ["min-h-0", "@app-lg:flex-1"] },
    "flex-fill-base": { kind: "structural", classes: ["min-w-0", "flex-1"] },
}

/** True when the token owns the gap seam. */
export const isGapPrinciple = (token: PrincipleToken): token is GapPrinciple =>
    PRINCIPLE_STYLE[token].kind === "gap"

/** True when the token owns padding / padding-xy. */
export const isPaddingPrinciple = (token: PrincipleToken): token is PaddingPrinciple => {
    const kind = PRINCIPLE_STYLE[token].kind
    return kind === "padding" || kind === "padding-xy"
}

/**
 * Resolve the Tailwind class list a principle owns (spacing + private align/justify).
 */
export const principleStyleClassNames = (token: PrincipleToken): string[] => {
    const entry = PRINCIPLE_STYLE[token]
    const align = entry.align != null ? [ALIGN_CLASS[entry.align]] : []
    const justify = entry.justify != null ? [JUSTIFY_CLASS[entry.justify]] : []
    switch (entry.kind) {
    case "gap":
        return [GAP_CLASS[entry.step], ...align, ...justify]
    case "padding":
        return [PADDING_CLASS[entry.step], ...align, ...justify]
    case "padding-xy":
        return [
            ...paddingClassNames({ x: entry.x, y: entry.y }).filter(
                (c): c is string => typeof c === "string" && c.length > 0,
            ),
            ...align,
            ...justify,
        ]
    case "margin":
    case "structural":
        return [...entry.classes, ...align, ...justify]
    }
}

/** Resolved layout for one Flex/Stack render. */
export interface ResolvedPrincipleSpacing {
    gap?: Responsive<AllowedGap>
    padding?: Responsive<PaddingValue>
    align?: LayoutAlign
    justify?: LayoutJustify
    extraClassNames: string[]
    /** When true, caller CSS layout props must not be applied. */
    principleOwnsLayout: boolean
}

/**
 * Principle is the complete CSS owner when present:
 * - gap / padding / margin / structural from the map
 * - optional align / justify baked into the token
 * - caller `gap` / `padding` / `align` / `justify` are ignored
 *
 * Needing both a gap and a padding principle means two nested frames.
 */
export const resolvePrincipleSpacing = (
    principle: PrincipleToken | undefined,
    gap: Responsive<AllowedGap> | undefined,
    padding: Responsive<PaddingValue> | undefined,
    align?: LayoutAlign,
    justify?: LayoutJustify,
): ResolvedPrincipleSpacing => {
    if (!principle) {
        return { gap, padding, align, justify, extraClassNames: [], principleOwnsLayout: false }
    }
    const entry = PRINCIPLE_STYLE[principle]
    const fromToken = {
        align: entry.align,
        justify: entry.justify,
        principleOwnsLayout: true as const,
    }
    switch (entry.kind) {
    case "gap":
        return { gap: entry.step, padding: undefined, extraClassNames: [], ...fromToken }
    case "padding":
        return { gap: undefined, padding: entry.step, extraClassNames: [], ...fromToken }
    case "padding-xy":
        return { gap: undefined, padding: { x: entry.x, y: entry.y }, extraClassNames: [], ...fromToken }
    case "margin":
    case "structural":
        return { gap: undefined, padding: undefined, extraClassNames: [...entry.classes], ...fromToken }
    }
}

/** Class fragments Flex composes after resolving principle ownership. */
export const resolvedSpacingClassNames = (resolved: ResolvedPrincipleSpacing): Array<string | false> => [
    ...(resolved.gap != null ? gapClassNames(resolved.gap) : []),
    ...(resolved.padding != null ? paddingClassNames(resolved.padding) : []),
    resolved.align != null && ALIGN_CLASS[resolved.align],
    resolved.justify != null && JUSTIFY_CLASS[resolved.justify],
    ...resolved.extraClassNames,
]
