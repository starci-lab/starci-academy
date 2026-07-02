import {
    useEffect,
    useState,
} from "react"
import {
    useAppSelector,
} from "@/redux/hooks"
import {
    LocalStorage,
} from "@/modules/storage/local/storage"
import {
    LocalStorageId,
} from "@/modules/storage/local/enums/id"
import {
    BackgroundEffect,
} from "@/modules/types/enums/background-effect"

/**
 * Resolves the ambient background effect to render: the server value
 * (`UserEntity.backgroundEffect`, via the signed-in user in Redux) once the
 * `me` query resolves, falling back to a same-device localStorage cache in
 * the brief window before that — so a returning user's chosen effect does not
 * pop in a beat late on every reload. Mirrors fresh server values back into
 * the cache. Guests never write a server value, so they see the default
 * (`undefined` → {@link import("@/components/blocks/layout/AmbientBackground").AmbientBackground}'s
 * own `None` default) after the one-time cache read finds nothing.
 */
export const useBackgroundEffect = (): BackgroundEffect | undefined => {
    const serverEffect = useAppSelector((state) => state.user.user?.backgroundEffect)
    const [cached, setCached] = useState<BackgroundEffect | undefined>(undefined)

    // one-time read of the same-device cache (client-only; SSR has no localStorage)
    useEffect(() => {
        const stored = LocalStorage.getItemAsString(LocalStorageId.BackgroundEffect)
        if (stored) {
            setCached(stored as BackgroundEffect)
        }
    }, [])

    // keep the cache mirroring whatever the server last confirmed
    useEffect(() => {
        if (serverEffect === undefined) {
            return
        }
        LocalStorage.setItem(LocalStorageId.BackgroundEffect, serverEffect)
    }, [
        serverEffect,
    ])

    return serverEffect ?? cached
}
