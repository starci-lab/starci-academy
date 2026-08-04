"use client"

import React from "react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { _BackLink } from "./component"

/** Props the connected {@link BackLink} takes from its caller. */
export interface BackLinkConnectedProps extends WithClassNames<undefined> {
    /** Full label override; omit to compose from `target` / the generic "Back". */
    label?: string
    /** Destination name appended to the generic label — "Back to {target}" (e.g. "Back to preview"). */
    target?: string
    /** Fired when the link is pressed — the caller owns the routing. */
    onPress: () => void
}

/**
 * The single back affordance of a leaf / sub-view page — the CONNECTED half:
 * composes the link text via `t()` when `label` isn't a full override. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link BackLinkConnectedProps}
 */
export const BackLink = ({ label, target, onPress, className }: BackLinkConnectedProps) => {
    const t = useTranslations()
    const text = label ?? (target ? t("common.goBackTo", { target }) : t("common.goBack"))

    return <_BackLink text={text} onPress={onPress} className={className} />
}
