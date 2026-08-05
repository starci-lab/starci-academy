"use client"

import React from "react"
import type { ReactNode } from "react"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"
import { Image } from "@/components/atoms/media/Image"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { StackV } from "@/components/frames/Stack"

/** Placeholder cover when {@link MediaCardProps.cover} is omitted — 16:9. */
const FALLBACK_COVER_SRC = "https://placehold.co/640x360"

/** Props for {@link MediaCard}. */
export interface MediaCardProps {
    /**
     * Optional media node rendered flush at the very top of the card, edge-to-
     * edge under the card radius (e.g. an `<img>`). When omitted, a 16:9
     * placeholder image fills the same full-bleed slot.
     */
    cover?: ReactNode
    /**
     * Primary heading of the card (course / lesson / challenge / blog title).
     * Rendered via {@link Typography} weight="medium" (body size).
     */
    title: ReactNode
    /**
     * Optional metadata row shown directly under the title — typically a row of
     * chips or muted text (category, difficulty, duration, author).
     */
    meta?: ReactNode
    /**
     * Optional short description / excerpt. Rendered muted, clamped to two
     * lines so grid rows stay uniform.
     */
    description?: ReactNode
    /**
     * Optional footer pinned at the bottom of the body — typically a CTA button,
     * price, or progress indicator.
     */
    footer?: ReactNode
    /**
     * Optional press handler. When provided the whole card becomes pressable and
     * keyboard-accessible. Prefer {@link href} for pure navigation.
     */
    onPress?: () => void
    /**
     * Optional destination URL. When provided the card renders as an anchor so
     * the whole card is a single accessible link.
     */
    href?: string
    /**
     * Where this card sits inside its parent. Appearance is not passable — it is
     * already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Consolidated, presentational content card — one shape for course / lesson /
 * challenge / blog grids. Composes {@link SurfaceCard} for the card face itself
 * (the `nested` variant gives the flat, border-not-shadow look this card has
 * always had — globals still supply the 3xl radius) so this file owns no card
 * chrome of its own: a flush 16:9 cover slot on top, and a padded stack of
 * title / meta / description / footer underneath. When {@link cover} is
 * omitted a 16:9 placeholder image fills that slot.
 *
 * Pass `href` for navigation or `onPress` for a custom handler — either makes
 * the whole card pressable and keyboard-accessible via `SurfaceCard`'s own
 * press handling (ripple + press-scale for `onPress`, a real anchor for
 * `href`).
 *
 * @param props - {@link MediaCardProps}
 * @see Story: .storybook/stories/blocks/cards/MediaCard/MediaCard.stories
 */
export const MediaCard = ({
    cover,
    title,
    meta,
    description,
    footer,
    onPress,
    href,
    classNames,
}: MediaCardProps) => {
    const coverNode = cover ?? <Image src={FALLBACK_COVER_SRC} alt="" ratio="video" radius="none" />

    const body = () => (
        <StackV
            gap={1}
            items={[
                () => (
                    <Box className="aspect-video w-full shrink-0 overflow-hidden [&_img]:block [&_img]:size-full [&_img]:object-cover">
                        {coverNode}
                    </Box>
                ),
                () => (
                    <StackV
                        gap={4}
                        padding={5}
                        items={[
                            () => <Typography size="base" weight="medium" text={title} />,
                            ...(meta ? [() => <Cluster gap={3} items={[() => <>{meta}</>]} />] : []),
                            ...(description ? [() => <Typography size="sm" color="muted" lineClamp={2} text={description} />] : []),
                            ...(footer ? [() => <>{footer}</>] : []),
                        ]}
                    />
                ),
            ]}
        />
    )

    return (
        <SurfaceCard
            variant="nested"
            padding={1}
            onPress={onPress}
            href={href}
            body={body}
            classNames={classNames}
        />
    )
}
