import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"
import { resolveIdentity, type CallerIdentity } from "@/components/frames/_identity"
import { Container } from "@/components/frames/Container"

/** Props for {@link FooterFrame}. */
export interface FooterFrameProps {
    /** Buildable footer body rendered inside the canonical site measure. */
    body: ComponentTypeWithSkeleton
    /** Forwards skeleton state to the body. */
    isSkeleton?: boolean
    /** Caller identity when a block/layout uses this frame as its root. */
    identity?: CallerIdentity
}

/**
 * Semantic site-footer frame: owns the footer landmark, surface chrome, and
 * canonical xl measure. Callers own content only.
 *
 * @param props - {@link FooterFrameProps}
 */
const FooterFrame = ({ body: Body, isSkeleton, identity }: FooterFrameProps) => (
    <footer
        {...resolveIdentity(identity, { tier: "frame", name: "FooterFrame" })}
        className="border-t border-default bg-surface"
    >
        <Container size="xl" padding={6} body={Body} isSkeleton={isSkeleton} />
    </footer>
)

export { FooterFrame }

/** Source-level tier marker. */
export const meta = { tier: "frame", name: "FooterFrame" } as const
