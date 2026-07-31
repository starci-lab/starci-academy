import { AvatarBase } from "./AvatarBase"

/**
 * `Avatar.*` — namespace for the avatar family. This file only re-exports:
 * `Avatar` (./AvatarBase) is the single avatar, with a fallback chain of
 * image → generated image (DiceBear) → initials → icon, plus a status dot
 * and leaf skeleton.
 *
 * `AvatarGroup` used to live here too — it renders another atom (`Avatar`) per
 * item, which makes it a composite, not a member of this namespace. It now lives
 * at `@sb-components/composites/lists/AvatarGroup`.
 */
export { AvatarBase as Avatar }

export type { AvatarBaseProps, AvatarFallback, AvatarColor, AvatarRing, AvatarSize, AvatarStatus, IconComponent, IconWeight } from "./AvatarBase"
