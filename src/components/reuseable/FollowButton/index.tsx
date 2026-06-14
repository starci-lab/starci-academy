"use client"

import {
    CircleCheck as CheckIcon,
    Persons as PersonsIcon,
} from "@gravity-ui/icons"
import React, {
    useCallback,
    useState,
} from "react"
import {
    Button,
    Spinner,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useMutateSetFollowSwr,
} from "@/hooks"

/** Props for {@link FollowButton}. */
export interface FollowButtonProps {
    /** Id of the user to follow / unfollow. */
    userId: string
    /** Current follow state (controlled by the parent). */
    following: boolean
    /** Called with the new follow state after a successful toggle. */
    onChange?: (following: boolean) => void
}

/**
 * Reusable follow / unfollow toggle for another user.
 *
 * Fires the idempotent `setFollow` mutation and reports the new state up via
 * `onChange` so the parent can adjust any follower count it shows. Shows a
 * spinner while in flight; the parent owns the authoritative `following` value.
 *
 * @param props - {@link FollowButtonProps}
 */
export const FollowButton = ({
    userId,
    following,
    onChange,
}: FollowButtonProps) => {
    const t = useTranslations()
    const { trigger } = useMutateSetFollowSwr()
    // in-flight flag for the toggle request
    const [pending, setPending] = useState(false)

    /** Toggle follow state, then notify the parent on success. */
    const onPress = useCallback(
        async () => {
            // optimistic target = the opposite of the current state
            const next = !following
            setPending(true)
            try {
                const result = await trigger({
                    userId,
                    follow: next,
                })
                // only commit when the server confirms
                if (result?.data?.setFollow?.success) {
                    onChange?.(next)
                }
            } finally {
                setPending(false)
            }
        },
        [
            following,
            userId,
            trigger,
            onChange,
        ],
    )

    return (
        <Button
            // "following" reads as a softer, already-engaged state
            variant={following ? "secondary" : "primary"}
            size="sm"
            isDisabled={pending}
            onPress={onPress}
        >
            {pending ? (
                <Spinner
                    color="current"
                    size="sm"
                />
            ) : following ? (
                <CheckIcon className="size-4" />
            ) : (
                <PersonsIcon className="size-4" />
            )}
            {following ? t("follow.following") : t("follow.follow")}
        </Button>
    )
}
