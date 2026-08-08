import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { resolveIdentity, type CallerIdentity } from "@sb-components/frames/_identity"

/** Props for {@link ViewportShell}. */
export interface ViewportShellProps {
    /** Pinned-and-growing application track. */
    body: ComponentTypeWithSkeleton
    /** Optional terminal region below the application track. */
    footer?: ComponentTypeWithSkeleton
    /** Forwards skeleton state to both regions. */
    isSkeleton?: boolean
    /** Caller identity when a layout uses this frame as its root. */
    identity?: CallerIdentity
}

/** Viewport-height column with the established flush shell seam. */
const ViewportShell = ({ body: Body, footer: Footer, isSkeleton, identity }: ViewportShellProps) => (
    <div
        {...resolveIdentity(identity, { tier: "frame", name: "ViewportShell" })}
        className="flex min-h-dvh flex-col gap-1"
    >
        <Body isSkeleton={isSkeleton} />
        {Footer ? <Footer isSkeleton={isSkeleton} /> : null}
    </div>
)

export { ViewportShell }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "ViewportShell" } as const
