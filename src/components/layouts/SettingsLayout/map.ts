import type {
    SettingsNavGroup as RealSettingsNavGroup,
} from "@/components/features/profile/Settings/nav"
import type {
    SettingsDestinationKey,
    SettingsNavGroup,
} from "@/components/starci/blocks/navigation/SettingsSidebarNav"

/**
 * The ported `SettingsSidebarNav` block's closed destination vocabulary — every
 * `SettingsDestinationKey` member, kept here as a runtime `Set` so the real (string-keyed)
 * nav data can be narrowed against it.
 */
const BLOCK_DESTINATION_KEYS = new Set<SettingsDestinationKey>([
    "editProfile",
    "appearance",
    "security",
    "sessions",
    "courseHistory",
    "aiSettings",
    "aiSubscription",
    "aiUsage",
    "bookmarks",
    "membership",
    "installments",
])

const isBlockDestinationKey = (key: string): key is SettingsDestinationKey =>
    BLOCK_DESTINATION_KEYS.has(key as SettingsDestinationKey)

/**
 * The real, `icon`-carrying settings nav groups (`getSettingsGroups`) → the ported
 * block's closed-vocabulary shape (`key`/`href` only — label + icon are block-owned
 * tables keyed on {@link SettingsDestinationKey}, never handed in by the caller).
 *
 * TODO(i18n/nav): the real nav has a `privacy` destination the ported block's
 * `SettingsDestinationKey` union does not (yet) include — it is dropped here rather
 * than widening the block's vocabulary, which is out of scope for this pilot. A group
 * left with zero surviving items (none today) is dropped too, so no empty divider shows.
 *
 * @param groups - the real `getSettingsGroups(locale)` output.
 * @returns the same groups, narrowed to destinations the block recognizes.
 */
export const toBlockSettingsGroups = (groups: Array<RealSettingsNavGroup>): Array<SettingsNavGroup> =>
    groups
        .map((group) => ({
            key: group.key,
            items: group.items
                .filter((item) => isBlockDestinationKey(item.key))
                .map((item) => ({
                    key: item.key as SettingsDestinationKey,
                    href: item.href,
                })),
        }))
        .filter((group) => group.items.length > 0)
