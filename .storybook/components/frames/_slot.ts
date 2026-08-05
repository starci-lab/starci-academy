import type { ComponentType } from "react"

/**
 * A region a frame or composite MOUNTS itself -- a named slot (`body` / `start` / `header`
 * / `content`) it is responsible for the loading state of. The host receives the component
 * UNCALLED (a reference, never a built element), so it can render it with `isSkeleton` and
 * build both states from one source.
 *
 * Shared vocabulary at the frame tier: FRAME-9 names the slots, COMPOSITE-8 uses the same
 * contract one tier up. This file is a type, not a component.
 *
 * `P` carries any extra props the slot needs beyond the skeleton flag.
 *
 *   body?: ComponentTypeWithSkeleton              // <Body isSkeleton={isSkeleton} />
 *   row?:  ComponentTypeWithSkeleton<{ index: number }>
 *
 * NOT for text -- text a host renders is a `string`, so the host wraps it in the atom
 * itself and owns its tone (`<Typography text={label} color="default" isSkeleton />`). A slot typed
 * as a component hands rendering to the caller; a `string` keeps the tone with the host, which
 * is where the no-guess colour rule requires it.
 */
export type ComponentTypeWithSkeleton<P = Record<never, never>> = ComponentType<SkeletonProps<P>>

/**
 * The props a slot/item component receives -- the skeleton flag, plus any extra `P`. Use it to type
 * the destructured param of an INLINE item so it stays assignable to `ComponentTypeWithSkeleton`
 * (an untyped `({ isSkeleton }: SkeletonProps) =>` infers implicit-any and fails):
 *
 *   items={[({ isSkeleton }: SkeletonProps) => <A isSkeleton={isSkeleton} />]}
 */
export type SkeletonProps<P = Record<never, never>> = P & { isSkeleton?: boolean }
