"use client"

import React from "react"
import { Link, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for the {@link BackLink} block. */
export interface BackLinkProps extends WithClassNames<undefined> {
    /** Full label override; omit to compose from `target` / the generic "Trở lại". */
    label?: string
    /** Destination name appended to the generic label — "Trở lại {target}" (e.g. "Trở lại preview"). */
    target?: string
    /** Fired when the link is pressed — the caller owns the routing. */
    onPress: () => void
}

/**
 * The single back affordance of a leaf / sub-view page ("← Trở lại",
 * "← Quay lại thử thách"…), rendered top-left — typically into `PageHeader`'s
 * `breadcrumb` slot. A quiet text link (muted), NOT a pill/button. Hover =
 * the arrow slides left + the label underlines (go-there affordance); the
 * block owns the look so every back link reads the same.
 *
 * @param props - {@link BackLinkProps}
 * @see Story: .storybook/stories/blocks/navigation/BackLink/BackLink.stories
 */
export const BackLink = ({ label, target, onPress, className }: BackLinkProps) => {
    const t = useTranslations()
    const text = label ?? (target ? t("common.goBackTo", { target }) : t("common.goBack"))

    return (
        <Link
            onPress={onPress}
            className={cn(
                "group flex w-fit cursor-pointer items-center gap-2 text-sm text-muted no-underline transition-colors hover:text-foreground",
                className,
            )}
        >
            <ArrowLeftIcon
                aria-hidden
                focusable="false"
                className="size-4 transition-transform group-hover:-translate-x-1"
            />
            <span className="group-hover:underline">{text}</span>
        </Link>
    )
}
