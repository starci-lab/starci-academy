import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { StackH, StackV } from "@/components/frames/Stack"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Loading placeholder for the mock-interview green room's "You're about to be
 * interviewed" card — the only piece of {@link import("../index").MockInterviewPage}
 * visible before `courseId`/`courseDisplayId`/the enrollment check resolve.
 * Mirrors the real card 1:1: persona avatar + name/role, the title + "N questions ·
 * level X · ~Y minutes" meta line, and the primary CTA — so resolving never
 * collapses or jumps the surface.
 */
export const MockInterviewSetupSkeleton = ({ className }: WithClassNames<undefined> = {}) => {
    return (
        <div className={className}>
            <SurfaceCard
                padding={6}
                body={() => (
                    <StackV
                        gap={5}
                        principle="group-boundary"
                        explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                        items={[
                            () => (
                                <StackH
                                    gap={3}
                                    principle="identity"
                                    explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                    items={[
                                        () => <Skeleton.Avatar size="lg" />,
                                        () => (
                                            <StackV
                                                gap={2}
                                                principle="title-subtitle"
                                                explain="Title over supporting line — not label-field, because neither line is a form control label."
                                                classNames={["min-w-0"]}
                                                items={[
                                                    () => <Skeleton.Typography type="body" width="1/3" />,
                                                    () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                                ]}
                                            />
                                        ),
                                    ]}
                                />
                            ),
                            () => (
                                <StackV
                                    gap={2}
                                    principle="title-subtitle"
                                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                                    items={[
                                        () => <Skeleton.Typography type="h4" width="1/2" />,
                                        () => <Skeleton.Typography type="body-sm" width="2/3" />,
                                    ]}
                                />
                            ),
                            () => <Skeleton.Button width="w-48" />,
                        ]}
                    />
                )}
            />
        </div>
    )
}
