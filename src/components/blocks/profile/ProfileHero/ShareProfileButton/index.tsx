import React from "react"
import { ShareNetworkIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"

/** Props for {@link ShareProfileButton}. */
export interface ShareProfileButtonProps {
    /** Fired when the share action is pressed. */
    onShare?: () => void
    /** `true` → icon-only shimmer; no press. */
    isSkeleton?: boolean
}

/**
 * Icon-only share trigger — the caller decides what "share" does (copy link, open a sheet, …).
 * Atom Button root — CallerIdentity held until atoms accept it (CourseTrialChip pattern).
 *
 * @param props - {@link ShareProfileButtonProps}
 */
export const ShareProfileButton = ({ onShare, isSkeleton = false}: ShareProfileButtonProps) => {
    if (isSkeleton) {
        return <Button isSkeleton isIconOnly />
    }
    return (
        <Button
            isIconOnly
            variant="tertiary"
            prefixIcon={ShareNetworkIcon}
            ariaLabel="Share profile"
            onPress={onShare}

        />
    )
}
