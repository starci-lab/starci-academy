import { Avatar, type AvatarSize } from "@sb-components/atoms/display/Avatar/Avatar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * `IdentityContentRow` — avatar + byline + whatever content sits under it, as one row.
 * `byline` and `body` each take a component reference, not a built node — the row calls them
 * itself and forwards `isSkeleton` so both shimmer along with the avatar. Both seams use
 * `gap={2}` for a denser standalone treatment.
 */

/** Props for {@link IdentityContentRow}. */
export interface IdentityContentRowProps {
    /** Avatar image url. Omitted → `Avatar`'s own generated/initials fallback chain. */
    avatarSrc?: string
    /** Display name driving the avatar's fallback + accessible label. */
    avatarName: string
    /** Stable seed for the avatar's generated fallback (usually the author id). */
    avatarSeed: string
    /** Avatar preset. Defaults to `"sm"`. */
    avatarSize?: AvatarSize
    /** Forwarded to the root `Stack` — draws the reply-thread indent guide one level deeper. */
    nested?: boolean
    /**
     * The byline line — name/handle + any badges + timestamp. A COMPONENT
     * reference (COMPOSITE-8): the row calls it itself, forwarding `isSkeleton`,
     * so the whole row — not just `Avatar` — can shimmer while loading.
     */
    byline: ComponentTypeWithSkeleton
    /**
     * Whatever sits under the byline — body text, actions, nested replies… Same
     * COMPONENT-reference contract as {@link IdentityContentRowProps.byline}
     * above. Named `body` (not `children`) so the "pass a component, not JSX
     * children" contract is explicit at the call site.
     */
    body: ComponentTypeWithSkeleton
    /** `true` → the whole row (avatar + byline) renders as its skeleton mirror. */
    isSkeleton?: boolean
    /** Layout utilities on the root, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
}

/**
 * Avatar + byline + content column. See the file header for the full contract.
 *
 * @param props - {@link IdentityContentRowProps}
 */
/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "IdentityContentRow" } as const

const IdentityContentRow = ({
    avatarSrc,
    avatarName,
    avatarSeed,
    avatarSize = "sm",
    nested = false,
    byline: Byline,
    body: Body,
    isSkeleton = false,
    classNames,
}: IdentityContentRowProps) => (
    <StackH
        gap={4}
        principle="content-row"
        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
        align="start"
        nested={nested}
        classNames={classNames}
        isSkeleton={isSkeleton}

        items={[
            () => (
                <Avatar
                    src={avatarSrc}
                    name={avatarName}
                    seed={avatarSeed}
                    size={avatarSize}
                    isSkeleton={isSkeleton}

                />
            ),
            () => (
                <StackV
                    gap={2}
                    classNames={["min-w-0", "flex-1"]}
                    isSkeleton={isSkeleton}

                    items={[
                        () => <Byline isSkeleton={isSkeleton} />,
                        () => <Body isSkeleton={isSkeleton} />,
                    ]}
                />
            ),
        ]}
    />
)

export { IdentityContentRow }
