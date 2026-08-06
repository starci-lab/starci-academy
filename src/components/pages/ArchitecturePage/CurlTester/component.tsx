import React from "react"
import { CheckIcon, CopyIcon, PlayIcon } from "@phosphor-icons/react"
import { Callout } from "@/components/composites/feedback/Callout"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** All display text for {@link _CurlTester}, already localized by the connected `CurlTester`. */
export interface CurlTesterLabels {
    /** Caption above the curl command box. */
    commandLabel: string
    /** Copy-button label before a copy. */
    copy: string
    /** Copy-button label right after a successful copy. */
    copied: string
    /** "Run" button label. */
    run: string
}

/** Props for {@link _CurlTester} — presentational; all data resolved, no fetch/store/i18n. */
export interface CurlTesterProps {
    /** The curl command to display and copy — already built by the connected half from the public GraphQL endpoint. */
    curlCommand: string
    /** True right after a successful copy — swaps the copy button's icon/label briefly. */
    copied: boolean
    onCopy: () => void
    /** True while the whitelisted query is in flight — the co-located result box shows a shimmer instead of collapsing or being replaced by a second tree. */
    running: boolean
    onRun: () => void
    /** Pretty-printed JSON of the last successful run; `null` before any run, or after a failed one. */
    result: string | null
    /** Message of the last failed run; `null` once a run succeeds or before any run has fired. */
    errorText: string | null
    labels: CurlTesterLabels
}

/**
 * `_CurlTester` — the presentational half of {@link import("./index").CurlTester}: an
 * MVP-scoped "Try it yourself" panel that whitelists ONLY the public `systemHealthStatus`
 * query (no free-form query input, no mutation ever reachable here). Shows the curl command
 * hitting the real `/graphql` endpoint (copy-able) plus a "Run" button.
 *
 * The result region is a single CO-LOCATED box (`loading-and-skeleton.md`): while
 * {@link CurlTesterProps.running} it renders `Skeleton.Paragraph` in place of the JSON, in
 * the SAME rounded/padded box the settled response renders in — one tree, not a hand-kept
 * parallel skeleton, so the box never collapses or jumps on resolve. Takes already-resolved
 * text and state; owns no fetch, no i18n (that lives in the connected `./index.tsx` — see
 * `tiers/split.md`).
 *
 * @param props - {@link CurlTesterProps}
 */
export const _CurlTester = ({
    curlCommand,
    copied,
    onCopy,
    running,
    onRun,
    result,
    errorText,
    labels,
}: CurlTesterProps) => (
    <StackV
        gap={3}
        identity={{ tier: "block", component: "CurlTester" }}
        principle="sibling-stack"
        items={[
            () => (
                <StackV gap={2} principle="title-subtitle" items={[
                    () => (
                        <StackH gap={2} justify="between" align="center" principle="icon-text" items={[
                            () => <Typography size="xs" color="muted" text={labels.commandLabel} />,
                            () => (
                                <Button
                                    variant="tertiary"
                                    size="sm"
                                    prefixIcon={copied ? CheckIcon : CopyIcon}
                                    label={copied ? labels.copied : labels.copy}
                                    onPress={onCopy}
                                />
                            ),
                        ]} />
                    ),
                    () => (
                        <Box principle="cell-pad" className="overflow-x-auto rounded-xl bg-default p-3">
                            <Typography size="code" text={curlCommand} preserveWhitespace />
                        </Box>
                    ),
                ]} />
            ),
            () => (
                <Button
                    variant="primary"
                    size="sm"
                    prefixIcon={PlayIcon}
                    label={labels.run}
                    onPress={onRun}
                    isPending={running}
                    classNames={["self-start"]}
                />
            ),
            ...(errorText ? [() => <Callout status="danger" title={errorText} />] : []),
            // Co-located result box (no isEmpty/error branch was ever wired here — the legacy
            // AsyncContent usage only ever toggled loading vs. content, loading-and-skeleton.md
            // §1). Same box for both states; `Box`/`Typography` carry no `isSkeleton` shape for a
            // multi-line JSON blob, so the swap is hand-mirrored right where it sits rather than
            // threaded through a leaf prop.
            ...(running || result ? [() => (
                <Box principle="cell-pad" className="overflow-x-auto rounded-xl bg-default p-3">
                    {running ? <Skeleton.Paragraph lines={4} /> : <Typography size="code" text={result ?? ""} preserveWhitespace />}
                </Box>
            )] : []),
        ]}
    />
)
