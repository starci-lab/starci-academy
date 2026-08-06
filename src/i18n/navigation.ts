import {
    createNavigation
} from "next-intl/navigation"
import {
    routing
} from "./routing"
 
/**
 * Locale-aware Next.js navigation helpers (`Link`, `redirect`, `usePathname`,
 * `useRouter`, `getPathname`) bound to this app's next-intl routing config.
 */
export const {
    Link, 
    redirect, 
    usePathname, 
    useRouter, 
    getPathname
} = createNavigation(routing)