import { Button, ButtonProps } from "@heroui/react"
import React, { forwardRef } from "react"
export const StarCiButton = forwardRef<HTMLButtonElement, ButtonProps>(
    (props, ref) => {
        return <Button {...props} ref={ref} />
    }
)
StarCiButton.displayName = "StarCiButton"
