import React from "react"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Typography } from "@/components/atoms/text/Typography"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

/** Props for {@link _LoginPage}. */
export interface LoginPageProps {
    /** Home route for the brand link. */
    brandHref: string
    /** Localized brand label. */
    brandLabel: string
    /**
     * Optional redirect-context hint under the brand (shown when the edge guard
     * sent the visitor here with `?redirect=`). Already localized.
     */
    redirectHint?: string
    /**
     * Auth body slot — same {@link AuthenticationPanel} the modal mounts inside
     * `ModalShell`. A COMPONENT reference the page mounts itself.
     */
    body: ComponentTypeWithSkeleton
}

/**
 * `/login` presentational shell — brand, optional redirect hint, and a
 * page-owned card surface around the shared auth body. No modal chrome.
 *
 * @param props - {@link LoginPageProps}
 */
export const _LoginPage = ({
    brandHref,
    brandLabel,
    redirectHint,
    body: Body,
}: LoginPageProps) => (
    <Box
        principle="center-measure"
        explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport."
        className={"mx-auto max-w-2xl p-6 py-16"}
        identity={{ tier: "page", component: "LoginPage" }}
    >
        <StackV
            principle="block-boundary"
            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
            items={[
                () => (
                    <StackH
                        principle="name-handle"
                        explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                        items={[
                            () => (
                                <Typography
                                    isLink
                                    href={brandHref}
                                    weight="semibold"
                                    size="lg"
                                    text={brandLabel}
                                />
                            ),
                        ]}
                    />
                ),
                () => (redirectHint != null ? (
                    <Typography size="xs" color="muted" align="center" text={redirectHint} />
                ) : null),
                () => (
                    <SurfaceCard body={Body} />
                ),
            ]}
        />
    </Box>
)
