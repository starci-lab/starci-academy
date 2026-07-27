import { AvatarBase } from "./AvatarBase"
import { AvatarGroup } from "./AvatarGroup"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Avatar.*`: namespace for the avatar family. This file ONLY re-exports,
 * no logic of its own.
 *
 * Each member has its OWN file (split 2026-07-26, folding in `UserAvatar` — see
 * the header of `AvatarBase.tsx`) so the relationship between them is a REAL,
 * readable `import`:
 *   • `Avatar`  → ./AvatarBase   — the ONE avatar; fallback chain: image →
 *     generated image (DiceBear) → initials → icon, status-dot, leaf skeleton.
 *   • `AvatarGroup` → ./AvatarGroup  — a ROW of overlapping avatars; **imports
 *     AvatarBase** ⇒ the only component in the family with deps.
 *
 * ⚠️ `UserAvatar` (block `identity/UserAvatar`) is DELETED (2026-07-26): its
 * DiceBear generation + broken-image handling moved entirely into `Avatar`
 * (default `fallback="generated"`) — no more two atoms doing the same job.
 *
 * External call-sites keep the SAME import path: still `.../Avatar/Avatar`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export { AvatarBase as Avatar, AvatarGroup }

export type { AvatarBaseProps, AvatarFallback, AvatarColor, AvatarSize, AvatarStatus, IconComponent, IconWeight } from "./AvatarBase"
export type { AvatarGroupItem, AvatarGroupProps } from "./AvatarGroup"
