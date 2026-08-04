/**
 * Minimal class joiner for the neo-brutalist Mia Mia marketing components. These
 * share nothing with the product design system (no HeroUI, no `@/modules`), so they
 * carry their own tiny `cn` rather than importing the product's — that keeps the twins
 * synced into `apps/landing` self-contained, since that app has neither dependency.
 */
export type ClassValue = string | number | false | null | undefined

export const cn = (...parts: ClassValue[]): string => parts.filter(Boolean).join(" ")
