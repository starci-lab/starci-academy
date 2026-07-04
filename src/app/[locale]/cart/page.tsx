import React from "react"
import { CartView } from "@/components/features/cart/CartView"

/**
 * Route `/[locale]/cart` — the shopping cart: review chosen courses + multi-course
 * checkout. Thin route file: mounts the feature; all logic/UI lives in the component.
 */
const Page = () => {
    return <CartView />
}

export default Page
