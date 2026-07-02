/**
 * Ambient background effect a user has chosen for the app chrome (GraphQL / DB
 * enum). Independent of light/dark mode; never applies to the lesson reading
 * column.
 */
export enum BackgroundEffect {
    /** No ambient effect. */
    None = "none",
    /** Warm embers drifting upward. */
    Ember = "ember",
    /** Layered waves drifting at the bottom edge. */
    Wave = "wave",
    /** Snowflakes drifting downward. */
    Snow = "snow",
    /** Rain streaks falling. */
    Rain = "rain",
    /** Bubbles rising and wobbling. */
    Bubbles = "bubbles",
    /** Slow-drifting fireflies that flicker. */
    Fireflies = "fireflies",
    /** Twinkling starfield. */
    Stars = "stars",
    /** Soft moving aurora ribbons. */
    Aurora = "aurora",
    /** Pulsing circuit-board grid lines. */
    Circuit = "circuit",
}
