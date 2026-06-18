"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    cn,
    Link,
} from "@heroui/react"
import {
    useLocale,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    queryResolveRoute,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link EntityToken}. */
export interface EntityTokenProps extends WithClassNames<undefined> {
    /**
     * Opaque global id of the entity — resolved to a route on click. Omit when
     * passing a direct {@link EntityTokenProps.href} instead.
     */
    globalId?: string | null
    /**
     * Direct (already-built, locale-prefixed) route to push on click — use when the
     * caller already knows the path (e.g. a course `displayId`), skipping the
     * resolve round-trip. Takes precedence over {@link EntityTokenProps.globalId}.
     */
    href?: string
    /** Token text (username / lesson title …). */
    label: string
    /**
     * Render as a full-width left-rail row (truncated, hover bg) instead of an
     * inline accent link. Defaults to inline.
     */
    block?: boolean
}

/**
 * A clickable entity reference inside the feed (GitHub-style `<user>`/`<challenge>`
 * token). On click it asks the route index (`resolveRoute(globalId)`) where the
 * entity lives, then navigates — the dashboard has no course context, so the
 * server resolves the path. Renders as plain bold text when not routable.
 * @param props - the entity global id + label
 */
export const EntityToken = ({
    globalId,
    href,
    label,
    block = false,
    className,
}: EntityTokenProps) => {
    const locale = useLocale()
    const router = useRouter()
    const [pending, setPending] = useState(false)
    // routable via a direct path OR a resolvable global id
    const routable = Boolean(href) || Boolean(globalId)

    /** Navigate: a direct href goes straight there; else resolve the global id. */
    const onPress = useCallback(
        async () => {
            // direct path — no resolve round-trip
            if (href) {
                router.push(href)
                return
            }
            // guard: nothing to resolve, or a resolve already in flight
            if (!globalId || pending) {
                return
            }
            setPending(true)
            try {
                // ask the index server for this entity's canonical (locale-agnostic) path
                const response = await queryResolveRoute({
                    request: {
                        globalId,
                    },
                })
                const path = response.data?.resolveRoute?.data?.path
                // prepend the active locale and navigate (no-op if unroutable)
                if (path) {
                    router.push(`/${locale}${path}`)
                }
            } finally {
                setPending(false)
            }
        },
        [
            globalId,
            href,
            locale,
            pending,
            router,
        ],
    )

    // block (left-rail row): full-width, truncated, hover background
    if (block) {
        return (
            <button
                type="button"
                disabled={!routable || pending}
                onClick={onPress}
                className={cn("truncate rounded-medium px-2 py-1 text-left text-sm text-muted hover:bg-default/40 hover:text-foreground disabled:opacity-60", className)}
            >
                {label}
            </button>
        )
    }

    // unresolvable target → non-interactive bold text
    if (!routable) {
        return (
            <span className="font-semibold text-foreground">{label}</span>
        )
    }

    return (
        <Link
            onPress={onPress}
            isDisabled={pending}
            className={cn("font-semibold text-foreground hover:underline disabled:opacity-6 text-sm", className)}
        >
            {label}
        </Link>
    )
}
