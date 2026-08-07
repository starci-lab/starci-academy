import React from "react"
import type { ReactNode } from "react"
import { Label } from "@/components/atoms/forms/Label"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for the {@link LabeledList} block. */
export interface LabeledListProps {
    /** Section label (text) shown above the list. */
    label: ReactNode
    /** Optional leading icon before the label (e.g. a phosphor `*Icon`). */
    icon?: ReactNode
    /** The list items — rendered as a vertical peer stack (caller renders rows). */
    children: ReactNode
    /**
     * Optional footer action pinned below the list (e.g. a primary CTA button).
     * Rendered as a peer section with the label and rows.
     */
    action?: ReactNode
}

/**
 * A labeled vertical list — NO card frame: an icon + `Label` header, the list
 * rows, and an optional footer action, spaced as sibling sections. For rail /
 * panel blocks that are a "label + short list (+ CTA)" where a full card would
 * be too heavy (e.g. the lesson rail's review / practice panels). The block owns
 * spacing + label; the caller passes label / icon / rows / action only.
 *
 * @param props - {@link LabeledListProps}
 */
export const LabeledList = ({
    label,
    icon,
    children,
    action,
}: LabeledListProps) => {
    const rowItems = React.Children.toArray(children).map(
        (child) => () => <>{child}</>,
    )
    return (
        <StackV
            as="section"
            identity={{ tier: "block", component: "LabeledList" }}
            principle="sibling-stack"
            explain="Label, list rows, and optional action are peer sections in one labeled list — not group-boundary, because they stay as one list unit rather than separate section groups."
            items={[
                () => (
                    <StackH
                        principle="icon-text"
                        explain="Icon beside its section label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                        items={[
                            ...(icon != null ? [() => <>{icon}</>] : []),
                            () => <Label>{label}</Label>,
                        ]}
                    />
                ),
                ...rowItems,
                ...(action != null ? [() => <>{action}</>] : []),
            ]}
        />
    )
}
