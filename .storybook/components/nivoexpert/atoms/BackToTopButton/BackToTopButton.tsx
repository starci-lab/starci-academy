"use client"

/**
 * ATOM — `BackToTopButton`: one round control with a single fixed glyph (an
 * up arrow), that fades between hidden and visible. It composes no other
 * component — the glyph is hard-coded, not a caller-supplied child — so it
 * stays one element rather than a generic icon-button composite.
 *
 * PLAIN CSS: reads `--nivo-*` runtime tokens directly (styled-jsx), the
 * nivoexpert restyle of the shared `atoms/buttons/BackToTop` atom onto
 * `nivo-expert-app`'s plain-CSS token contract — no HeroUI.
 *
 * `isVisible` is the one leaf — the atom owns every state its shown/hidden
 * value can be in. It renders in-flow: WHERE it floats on the page is the
 * host shell's call (`TenantLandingShell` wraps it in a fixed bottom-end
 * corner), not this atom's — position is the one class of decision only the
 * parent can make.
 */

/** Props for {@link BackToTopButton}. */
export interface BackToTopButtonProps {
    /** `true` → the control fades in and becomes pressable; `false` → faded out, unreachable by tab. */
    isVisible: boolean
    /** Fired when pressed — the caller scrolls the page back to the top. */
    onPress: () => void
    /** Accessible name, announced by screen readers (already resolved by the caller). */
    label: string
}

/**
 * The back-to-top control. See the file header for why `isVisible` is the
 * one leaf and why the floating placement is left to the caller.
 *
 * @param props - {@link BackToTopButtonProps}
 */
const BackToTopButton = ({ isVisible, onPress, label }: BackToTopButtonProps) => (
    <button
        type="button"
        data-tier="atom"
        data-component="BackToTopButton"
        aria-label={label}
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
        onClick={onPress}
        className={`btt${isVisible ? " btt-visible" : ""}`}
    >
        <span aria-hidden="true">&uarr;</span>

        <style jsx>{`
            .btt {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 44px;
                height: 44px;
                border-radius: var(--nivo-radius-pill);
                border: 1px solid var(--nivo-border);
                background: var(--nivo-surface-2);
                color: var(--nivo-text);
                font-size: 16px;
                line-height: 1;
                cursor: pointer;
                box-shadow: 0 12px 30px -18px rgba(0, 0, 0, 0.6);
                opacity: 0;
                transform: translateY(8px);
                pointer-events: none;
                transition: opacity 0.2s ease, transform 0.2s ease, border-color 0.15s ease;
            }
            .btt:hover {
                border-color: var(--nivo-accent);
            }
            .btt-visible {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }
        `}</style>
    </button>
)

export { BackToTopButton }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "atom", name: "BackToTopButton" } as const
