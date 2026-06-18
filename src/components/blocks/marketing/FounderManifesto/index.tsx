import React from "react"
import { cn, Typography } from "@heroui/react"
import { SectionCard } from "@/components/reuseable"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link FounderManifesto} block. */
export interface FounderManifestoProps extends WithClassNames<undefined> {
    /** Founder portrait node (image or fallback IconTile/avatar). */
    portrait: React.ReactNode
    /** Founder name. */
    name: React.ReactNode
    /** Founder role / tagline. */
    role: React.ReactNode
    /** Manifesto body — pass paragraphs as a rich node. */
    body: React.ReactNode
    /** Optional links row (GitHub / blog / etc.). */
    links?: React.ReactNode
}

/**
 * Founder beat: a compact, grounded manifesto with the founder's portrait, name,
 * role, the message, and real links (GitHub / blog) as proof. Tier-3 block built
 * on {@link SectionCard} — owns styling, content via props. Portrait stacks above
 * the copy on mobile, sits beside it on desktop.
 *
 * @param props - {@link FounderManifestoProps}
 */
export const FounderManifesto = ({
    portrait,
    name,
    role,
    body,
    links,
    className,
}: FounderManifestoProps) => {
    return (
        <SectionCard className={cn(className)} contentClassName="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex flex-col items-center gap-3 md:w-48 md:shrink-0">
                {portrait}
                <div className="flex flex-col items-center gap-0">
                    <Typography type="h5" weight="semibold" align="center">
                        {name}
                    </Typography>
                    <Typography type="body-xs" color="muted" align="center">
                        {role}
                    </Typography>
                </div>
                {links ? <div className="flex items-center gap-3">{links}</div> : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                {body}
            </div>
        </SectionCard>
    )
}
