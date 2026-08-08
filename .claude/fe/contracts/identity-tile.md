# IdentityTile contract

Status: approved

## Tier decision

`IdentityTile` is an atom.

A typed icon component is value payload, not an independently placed child.
The icon, cover image, and skeleton are mutually exclusive render states of one
visual value. `IdentityTile` does not arrange multiple caller-owned children.

The canonical home is:

```text
atoms/display/IdentityTile
```

Do not create `composites/identity/IdentityTile`. A composite that only forwards
the same props to a leaf atom adds no ownership and conflicts with the composite
skeleton gates.

## Existing components

`atoms/display/IconTile` remains the circular glyph atom:

```text
sm = 40px, rounded-full
md = 64px, rounded-full
lg = 80px, rounded-full
```

`blocks/identity/IconTile` is a legacy misfiled implementation. Its behavior
becomes the new `IdentityTile` atom:

```text
sm = 48px, rounded-xl
md = 64px, rounded-2xl
lg = 80px, rounded-2xl
```

The two components have different names and contracts. No size remapping is
allowed between them.

## Public API

```ts
type IdentityTileSize = "sm" | "md" | "lg"
type IdentityTileTone = "accent" | "success" | "warning" | "danger" | "neutral"
type IdentityTileIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

type IdentityTileProps =
    | {
        isSkeleton: true
        icon?: IdentityTileIcon
        src?: string | null
        alt?: string
        tone?: IdentityTileTone
        size?: IdentityTileSize
    }
    | {
        isSkeleton?: false
        icon: IdentityTileIcon
        src?: string | null
        alt?: string
        tone?: IdentityTileTone
        size?: IdentityTileSize
    }
```

No `className`, `classNames`, width, height, radius, shape, skeleton slot, or
free-form token prop is public.

## Ownership

`IdentityTile` owns:

- box size and radius;
- icon size and placement;
- tone chrome;
- cover-image crop;
- broken-image fallback;
- skeleton geometry;
- its atom identity metadata.

The parent owns margin, shrink/grow behavior, grid/flex placement, responsive
visibility, and surrounding spacing.

## Skeleton law

The atom is the only place allowed to import the vendor skeleton for this
shape. `isSkeleton` renders the exact size/radius selected by `size`. Consumers
must not mirror the tile with raw `Skeleton className` markup.

## Migration law

Migration is incremental:

1. Add Storybook `IdentityTile`, then mirror src.
2. Keep circular `IconTile` unchanged.
3. Migrate unlocked legacy block consumers from JSX icon nodes to typed icon
   components and import `IdentityTile`.
4. Leave locked, Nivo/Nivoexpert, page-folder, or non-zero-warning consumers on
   the legacy block temporarily, with ledger holds.
5. Delete `blocks/identity/IconTile` only after its final consumer reaches zero.

Temporary coexistence is migration state, not a compatibility API. Do not add
forwarding files or re-export the legacy block from the atom path.

## Completion

The migration is complete when:

- all unlocked consumers use the correct `IconTile` or `IdentityTile` contract;
- no consumer draws IdentityTile skeleton CSS;
- the legacy block has zero imports and is deleted;
- Storybook/src atom twins match;
- all changed files pass the zero-warning ratchet.
