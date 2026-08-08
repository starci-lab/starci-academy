import React from "react"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"

/**
 * `FoundationResourceEmpty` — the message shown when a foundation resource id
 * resolved to nothing. A single fixed message, no props to vary it by.
 */

/** Props for {@link FoundationResourceEmpty}. */
export type FoundationResourceEmptyProps = Record<string, never>

/**
 * The foundation resource's own empty message. See the file header for why
 * this exists as its own block instead of a bare `AsyncContentEmpty` in the
 * screen tree.
 *
 * @param props - {@link FoundationResourceEmptyProps}
 */
const FoundationResourceEmpty = () => (
    <AsyncContentEmpty
        identity={{ tier: "block", component: "FoundationResourceEmpty" }}
        title="This category doesn't have any resources yet."
    />
)

export { FoundationResourceEmpty }
