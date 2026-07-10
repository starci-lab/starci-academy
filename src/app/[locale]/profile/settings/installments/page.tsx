import React from "react"
import { InstallmentPlans } from "@/components/features/profile/InstallmentPlans"

/**
 * Route `/[locale]/profile/settings/installments` — renders the viewer's
 * installment (trả góp) plans. Thin route file: only mounts the component.
 */
const Page = () => {
    return <InstallmentPlans />
}

export default Page
