import React from "react"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"

/**
 * `FoundationResourceEmpty` — the message shown when a foundation resource id
 * resolved to nothing. A single fixed message, no props to vary it by.
 */

/** Props for {@link FoundationResourceEmpty}. */
export interface FoundationResourceEmptyProps {
}

/**
 * The foundation resource's own empty message. See the file header for why
 * this exists as its own block instead of a bare `AsyncContentEmpty` in the
 * screen tree.
 *
 * @param props - {@link FoundationResourceEmptyProps}
 */
const FoundationResourceEmpty = ({ }: FoundationResourceEmptyProps) => (
    <AsyncContentEmpty

        title="This category doesn't have any resources yet."
    />
)

export { FoundationResourceEmpty }
