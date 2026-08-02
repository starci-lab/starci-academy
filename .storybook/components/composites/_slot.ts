import type { ComponentType } from "react"

/**
 * A region a composite MOUNTS itself — a `header` / `body` / `footer` / `content` slot it is
 * responsible for the loading state of. The composite receives the component UNCALLED (a reference,
 * never a built element), so it can render it with `isSkeleton` and build both states from one
 * source. This is the COMPOSITE-8 slot type.
 *
 * `P` carries any extra props the slot needs beyond the skeleton flag.
 *
 *   body?: ComponentTypeWithSkeleton              // <Body isSkeleton={isSkeleton} />
 *   row?:  ComponentTypeWithSkeleton<{ index: number }>
 *
 * NOT for text — text a composite renders is a `string`, so the composite wraps it in the atom
 * itself and owns its tone (`<Typography text={label} color="default" isSkeleton />`). A slot typed
 * as a component hands rendering to the caller; a `string` keeps the tone with the composite, which
 * is where the no-guess colour rule requires it.
 */
export type ComponentTypeWithSkeleton<P = Record<never, never>> = ComponentType<SkeletonProps<P>>

/**
 * The props a slot/item component receives — the skeleton flag, plus any extra `P`. Use it to type
 * the destructured param of an INLINE item so it stays assignable to `ComponentTypeWithSkeleton`
 * (an untyped `({ isSkeleton }: SkeletonProps) =>` infers implicit-any and fails):
 *
 *   items={[({ isSkeleton }: SkeletonProps) => <A isSkeleton={isSkeleton} />]}
 */
export type SkeletonProps<P = Record<never, never>> = P & { isSkeleton?: boolean }
