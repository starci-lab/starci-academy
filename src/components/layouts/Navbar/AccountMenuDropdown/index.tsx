"use client"

import React from "react"
import {
    Dropdown,
} from "@heroui/react"
import { AccountTrigger } from "./AccountTrigger"
import { UserSummary } from "./UserSummary"
import { GuestHeader } from "./GuestHeader"
import { AccountMenuAuthed } from "./AccountMenuAuthed"
import { AccountMenuGuest } from "./AccountMenuGuest"
import { useAccountMenuOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryUserSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserSwr"
import { useAppSelector } from "@/redux/hooks"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Divider } from "@/components/atoms/display/Divider"
import { StackV } from "@/components/frames/Stack"

/**
 * AccountMenuDropdown — navbar account menu. Two regions, both swapped on auth
 * state and both holding a placeholder while the shared `me` query first resolves:
 *   1. a STATIC header region — UserSummary for signed-in viewers, GuestHeader
 *      for guests.
 *   2. a Dropdown.Menu — AccountMenuAuthed (dashboard/profile/settings/sign-out)
 *      for signed-in viewers, AccountMenuGuest (sign in / sign up) for guests.
 * Language + theme live in the navbar itself, so they are not repeated here.
 *
 * Thin container: owns only the dropdown overlay state and the auth flags; each
 * region self-fetches/dispatches. `"use client"` for the hooks.
 *
 * `Dropdown` stays a raw HeroUI primitive: the atom layer wraps no dropdown yet,
 * and inventing one for a single call site is a bigger call than this pass makes.
 */
export const AccountMenuDropdown = () => {
    const { isOpen, setOpen } = useAccountMenuOverlayState()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const user = useAppSelector((state) => state.user.user)
    // real loading signal: the shared "me" query (deduped). On FAIL it resolves to
    // not-loading with no user → guest (the `initialized` flag is never set, so it
    // would shimmer forever). Placeholder only on first load with no user yet.
    const { isLoading } = useQueryUserSwr()
    const isSkeleton = isLoading && !user

    // authed view only when we actually have the user — a dead/expired session or
    // any auth error falls back to guest (not a broken authed view / error state)
    const isAuthed = authenticated && Boolean(user)

    return (
        <Dropdown isOpen={isOpen} onOpenChange={setOpen}>
            <AccountTrigger />
            <Dropdown.Popover placement="bottom right" className="w-[300px]">
                {/* (1) static header region — UserSummary / GuestHeader, shimmering as a UserCell */}
                <StackV
                    padding={4}
                    gap={1}
                    body={() => (isSkeleton
                        ? <Skeleton.UserCell />
                        : isAuthed ? <UserSummary /> : <GuestHeader />)}
                />
                <Divider />
                {/* (2) menu — authed actions / guest sign-in, shimmering as four rows */}
                {isSkeleton
                    ? <Skeleton.Menu items={4} />
                    : isAuthed ? <AccountMenuAuthed /> : <AccountMenuGuest />}
            </Dropdown.Popover>
        </Dropdown>
    )
}
