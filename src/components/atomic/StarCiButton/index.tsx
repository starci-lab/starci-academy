import { Button } from "@heroui/react"
import type { ButtonRootProps } from "@heroui/react"
import React, { forwardRef } from "react"
export const StarCiButton = forwardRef<HTMLButtonElement, ButtonRootProps>(
    (props, ref) => {
        return <Button {...props} ref={ref} />
    }
)
StarCiButton.displayName = "StarCiButton"
