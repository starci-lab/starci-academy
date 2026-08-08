import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/** Props for {@link ProfileFollowers}. */
export interface ProfileFollowersProps {
    followersCount?: number
    isSkeleton?: boolean
}

/** Follower count + caption, same "big tabular number over a muted label" idiom `FlashcardDueHero` uses for its due-count (file header, judgement call 4). */
export const ProfileFollowers = ({ followersCount, isSkeleton = false}: ProfileFollowersProps) => (
    <StackV
        identity={{ tier: "block", component: "ProfileFollowers" }}
        gap={1}
        isSkeleton={isSkeleton}
        items={[
            () => (
                <Typography
                    size="h5"
                    weight="bold"
                    tabularNums
                    isSkeleton={isSkeleton}
                    text={isSkeleton ? undefined : String(followersCount ?? 0)}

                />
            ),
            () => (
                <Typography
                    size="xs"
                    color="muted"
                    isSkeleton={isSkeleton}
                    text="Followers"

                />
            ),
        ]}
    />
)
