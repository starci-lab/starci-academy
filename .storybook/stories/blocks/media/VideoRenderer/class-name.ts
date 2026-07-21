/**
 * STORYBOOK-LOCAL copy of `@/modules/types/base/class-name` — inlined so the
 * VideoRenderer port stays free of `@/` imports. Synced to `src` later.
 */

/** Interface for components that can have class names. */
export interface WithClassNames<T> {
    /** Class names object. */
    classNames?: T
    /** Class name string. */
    className?: string
}
