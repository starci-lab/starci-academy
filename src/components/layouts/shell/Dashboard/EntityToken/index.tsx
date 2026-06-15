"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    useLocale,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    queryResolveRoute,
} from "@/modules/api"

/** Props for {@link EntityToken}. */
export interface EntityTokenProps {
    /** Opaque global id of the entity, or null when it has no resolvable route. */
    globalId: string | null
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
    label,
    block = false,
}: EntityTokenProps) => {
    const locale = useLocale()
    const router = useRouter()
    const [pending, setPending] = useState(false)

    /** Resolve the route via the index, then push to it. */
    const onPress = useCallback(
        async () => {
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
                disabled={!globalId || pending}
                onClick={onPress}
                className="truncate rounded-medium px-2 py-1 text-left text-sm text-muted hover:bg-default/40 hover:text-foreground disabled:opacity-60"
            >
                {label}
            </button>
        )
    }

    // unresolvable target → non-interactive bold text
    if (!globalId) {
        return (
            <span className="font-semibold text-foreground">{label}</span>
        )
    }

    return (
        <button
            type="button"
            disabled={pending}
            onClick={onPress}
            className="font-semibold text-accent hover:underline disabled:opacity-60"
        >
            {label}
        </button>
    )
}
