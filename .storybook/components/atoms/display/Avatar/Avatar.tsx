import { AvatarBase } from "./AvatarBase"
import { AvatarGroup } from "./AvatarGroup"

/**
 * `Avatar.*` — namespace for the avatar family. This file only re-exports:
 * `Avatar` (./AvatarBase) is the single avatar, with a fallback chain of
 * image → generated image (DiceBear) → initials → icon, plus a status dot
 * and leaf skeleton. `AvatarGroup` (./AvatarGroup) is a row of overlapping
 * avatars and is the only member of this family with dependencies of its own.
 */
export { AvatarBase as Avatar, AvatarGroup }

export type { AvatarBaseProps, AvatarFallback, AvatarColor, AvatarRing, AvatarSize, AvatarStatus, IconComponent, IconWeight } from "./AvatarBase"
export type { AvatarGroupItem, AvatarGroupProps } from "./AvatarGroup"
