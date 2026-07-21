import React from "react"
import { OtpInput } from "@/components/blocks/form/OtpInput"

/** Controlled wrapper for the demo — holds `value` with useState so the boxes are typeable. */
export const Controlled = ({
    initialValue = "",
    length = 6,
    isInvalid,
    errorMessage,
    label,
}: {
    initialValue?: string
    length?: number
    isInvalid?: boolean
    errorMessage?: React.ReactNode
    label?: React.ReactNode
}) => {
    const [value, setValue] = React.useState(initialValue)
    return (
        <OtpInput
            length={length}
            value={value}
            onChange={setValue}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            label={label}
        />
    )
}
