/**
 * STORYBOOK-LOCAL copy of `@/modules/types/base/class-name` — a sibling-local
 * type so this ported subtree never reaches back into `src`. Synced with `src`
 * later along with the rest of the MarkdownContent port.
 */

/** Interface for components that can have class names. */
export interface WithClassNames<T> {
    /** Class names object. */
    classNames?: T
    /** Class name string. */
    className?: string
}
