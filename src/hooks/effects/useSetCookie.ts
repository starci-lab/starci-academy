import { useEffect } from "react"
import { useLocale } from "next-intl"

/**
 * Set the cookie for the locale.
 */
export const useSetCookie = () => {
    const locale = useLocale()
    useEffect(() => {
        document.cookie = `locale=${locale}; path=/`
    }, [locale])


}