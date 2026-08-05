"use client"

import React, {
    useCallback,
} from "react"
import {
    cn,
    Link,
} from "@heroui/react"
import {
    pathConfig,
} from "@/resources/path"
import {
    useRouter,
} from "@/i18n/navigation"
import { BrandLockup } from "@/components/blocks/identity/BrandLockup"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * Props for {@link Logo}.
 */
export type LogoProps = WithClassNames<undefined>

/**
 * Logo — the {@link BrandLockup} lockup wrapped in a link that routes home when
 * pressed.
 *
 * `"use client"` for the router press handler.
 * @param props - optional container class name
 */
export const Logo = ({ className }: LogoProps) => {
    const router = useRouter()

    /** Navigate to the (ungated) landing route — reachable even while signed in. */
    const onPress = useCallback(
        () => router.push(pathConfig().locale().home().build()),
        [
            router,
        ],
    )
    return (
        <Link
            onPress={onPress}
            className={cn("cursor-pointer no-underline", className)}
        >
            <BrandLockup />
        </Link>
    )
}
