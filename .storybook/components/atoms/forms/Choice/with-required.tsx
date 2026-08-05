import type { ReactNode } from "react"

/** Inline label + `*` mark when required (matches FieldFrame). */
export const withRequired = (label: ReactNode, isRequired?: boolean) =>
    isRequired ? (
        <>
            {label} <span className="text-danger">*</span>
        </>
    ) : (
        label
    )
