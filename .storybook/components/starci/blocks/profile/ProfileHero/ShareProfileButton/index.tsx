import React from "react"
import { ShareNetworkIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"

/** Props for {@link ShareProfileButton}. */
export interface ShareProfileButtonProps {
    onShare?: () => void
    isSkeleton?: boolean
}

/** Icon-only share trigger — the caller decides what "share" does (copy link, open a sheet, …). */
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
