import { BackgroundEffect } from "@/modules/types/enums/background-effect"

/**
 * The same override the REAL picker passes (`profile/Appearance` — Settings →
 * Appearance). The block ships `fixed inset-0 -z-10` because in the app it IS the whole
 * shell's backdrop; a preview box has to re-anchor it to the box (`absolute`) and
 * lift it out from behind the page (`-z-0`). Without this the effect escapes to the
 * viewport and paints under the page, leaving an empty bordered box here.
 */
export const PREVIEW_CLASS = "absolute inset-0 -z-0"

/**
 * `when` = the axis a user actually picks on, READ FROM SOURCE, not invented here:
 * `globals.css` under `prefers-reduced-motion: reduce` drops the five particle
 * effects to `opacity: 0` (a frozen flake reads as debris, not atmosphere) while
 * the four field effects only lose their animation and stay on. Counts are each
 * effect's own `count` default; Rain's cadence is its `rainFall` duration range.
 */
export const effects: Array<{ effect: BackgroundEffect, label: string, when: string }> = [
    {
        effect: BackgroundEffect.Aurora,
        label: "Aurora",
        when: "three light bands drifting very slowly, no particles — stays on when the user enables reduced motion, good as a backdrop for long reading screens.",
    },
    {
        effect: BackgroundEffect.Ember,
        label: "Ember",
        when: "60 particles rising, the second densest — turns off completely under reduced motion, don't pick it if the background must stay visible in every case.",
    },
    {
        effect: BackgroundEffect.Wave,
        label: "Wave",
        when: "a wave band hugging the bottom edge, leaving the top half clear — good when the main content sits up top; under reduced motion it holds still but stays on.",
    },
    {
        effect: BackgroundEffect.Snow,
        label: "Snow",
        when: "50 particles falling slowly, spread evenly across the screen — turns off completely under reduced motion.",
    },
    {
        effect: BackgroundEffect.Rain,
        label: "Rain",
        when: "45 streaks, the fastest of the group, one pass in just 1.4–2.7 seconds — the most animated, easily competes with content for attention; turns off completely under reduced motion.",
    },
    {
        effect: BackgroundEffect.Bubbles,
        label: "Bubbles",
        when: "30 bubbles rising slowly, sparser than Ember despite the same direction — turns off completely under reduced motion.",
    },
    {
        effect: BackgroundEffect.Fireflies,
        label: "Fireflies",
        when: "24 dots drifting aimlessly, the sparsest of the group — pick it when you want motion that barely draws any attention; turns off completely under reduced motion.",
    },
    {
        effect: BackgroundEffect.Stars,
        label: "Stars",
        when: "70 points, the densest, but they only twinkle in place rather than move — the only particle effect that stays visible under reduced motion, pick it when you need a particle background that's still safe for motion-sensitive users.",
    },
    {
        effect: BackgroundEffect.Circuit,
        label: "Circuit",
        when: "a static grid fading out toward the top, no particles — geometric rather than natural; under reduced motion it stops pulsing but stays on.",
    },
]
