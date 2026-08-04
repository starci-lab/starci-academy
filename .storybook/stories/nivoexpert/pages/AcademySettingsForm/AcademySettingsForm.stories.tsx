import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AcademySettingsForm,
    type AcademySettingsFormLabels,
    type AcademySettingsFormValues,
} from "@sb-components/nivoexpert/pages/AcademySettingsForm/AcademySettingsForm"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AcademySettingsForm` — the PAGE an expert edits their academy's brand and
 * landing template from: two stacked cards (brand identity fields, a 3-card
 * template picker) under one form shell + save/discard row. A page's story is
 * one complete STATE per story — not a leaf-per-prop map. Grounded in the real
 * `Brand` shape (`lib/session.ts`) and the three real `landings/` presets.
 *
 * Settings are never genuinely EMPTY (a tenant's brand always exists from
 * `EXPERT_CONFIG` the moment it does) — this page's "empty" state is
 * therefore the first-fetch skeleton, not a zero-data branch; see `Empty`
 * below. The other three named states — `editing` (dirty) and `saving` are
 * this page's own interaction states, and `Failed` renders the save-error
 * banner the proposal calls out as new backend scope (contradiction #4:
 * there is no brand/theme update mutation yet).
 */
const meta: Meta<typeof AcademySettingsForm> = {
    title: "NivoExpert/Pages/AcademySettingsForm/AcademySettingsForm",
    component: AcademySettingsForm,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AcademySettingsForm>

const NOOP = () => {}

const LABELS: AcademySettingsFormLabels = {
    title: "Settings",
    subtitle: "Your academy's brand identity and landing template.",
    unsavedBadge: "Unsaved changes",
    brandSectionTitle: "Brand",
    brandSectionDescription: "Shown across your academy's sidebar, topbar, and public landing page.",
    displayNameLabel: "Display name",
    slugLabel: "Slug",
    slugHint: "Your academy's URL identity — set at signup, not editable here.",
    taglineLabel: "Tagline",
    taglinePlaceholder: "A one-line pitch for what learners get",
    logoLabel: "Logo URL",
    logoHint: "Shown in the sidebar and topbar.",
    accentHueLabel: "Accent hue",
    accentHueHint: "0–359 — every accent color on your public site derives from this one hue.",
    communityEnabledLabel: "Community group",
    communityGroupLabel: "Group link",
    communityGroupPlaceholder: "https://discord.gg/… or a Zalo/Telegram link",
    communityGroupHint: "Shown as a \"join\" link once the community group is on.",
    templateSectionTitle: "Landing template",
    templateSectionDescription: "Which preset your public landing page renders.",
    templateGroupAriaLabel: "Landing template",
    templateLabels: { classic: "Classic", bold: "Bold", minimal: "Minimal" },
    templateDescriptions: {
        classic: "Centered avatar, straightforward course list.",
        bold: "Large hero, high contrast.",
        minimal: "Pared back, content-first.",
    },
    discardLabel: "Discard changes",
    saveLabel: "Save changes",
    savingLabel: "Saving…",
    saveErrorTitle: "Save failed",
}

const LOADED_VALUES: AcademySettingsFormValues = {
    displayName: "An Nguyen Academy",
    slug: "an-nguyen",
    tagline: "Learn to code alongside a working engineer.",
    avatarUrl: "https://cdn.nivo.app/an-nguyen/logo.png",
    accentHue: 344,
    communityEnabled: true,
    communityGroupUrl: "https://zalo.me/g/annguyen-academy",
    template: "classic",
}

const EDITED_VALUES: AcademySettingsFormValues = {
    ...LOADED_VALUES,
    tagline: "Ship your first AI agent in four evenings.",
    template: "bold",
}

const SKELETON_VALUES: AcademySettingsFormValues = {
    displayName: "",
    slug: "",
    tagline: "",
    avatarUrl: "",
    accentHue: 0,
    communityEnabled: false,
    communityGroupUrl: "",
    template: "classic",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the Brand and Landing template sections" },
    Form: { tier: "composite", role: "the form shell — locks every field via a native `<fieldset disabled>` while saving" },
    SurfaceCardPressableGroup: { tier: "composite", role: "the 3-card template picker, used in its documented single-select mode" },
    Callout: { tier: "composite", role: "the failed-save banner, only in the Failed state" },
}

const REASON =
    "Settings are always filled from `EXPERT_CONFIG` the moment a tenant exists — there is no zero-data empty branch the way a course/member/post list has one. The `isSkeleton` first-fetch mirror fills that role instead. `SurfaceCardPressableGroup` (not `SurfaceCardSelectableGroup`) drives the template picker because it is the one card-grid member with `isSkeleton` support (§ file header) — a real single-select radio group has no loading mirror yet, flagged as a proposed gap rather than hand-rolled around here."

/** STATE — the page's own first fetch is in flight: every field and the template picker shimmer. This is this page's "empty" — settings have no genuine zero-data branch (see file header). */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademySettingsForm"
                tier="screen"
                leaf="Empty (first-fetch skeleton)"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Before `getBrand()`/`api.theme()` resolve: every field renders its field-box shimmer, the template picker renders placeholder tiles, and the save/discard row is withheld — nothing is editable yet.",
                        code: "<AcademySettingsForm isSkeleton values={…} … />",
                        render: (
                            <AcademySettingsForm
                                values={SKELETON_VALUES}
                                onDisplayNameChange={NOOP}
                                onTaglineChange={NOOP}
                                onAvatarUrlChange={NOOP}
                                onAccentHueChange={NOOP}
                                onCommunityEnabledChange={NOOP}
                                onCommunityGroupUrlChange={NOOP}
                                onTemplateChange={NOOP}
                                onDiscard={NOOP}
                                onSave={NOOP}
                                isSkeleton
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — loaded, idle: every field holds the last-saved values, Discard/Save are both disabled (nothing changed yet). */
export const View: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademySettingsForm"
                tier="screen"
                leaf="View (loaded, clean)"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "isDirty = false",
                        why: "The default landing state once data has arrived — every field mirrors the real `Brand`/`Theme`, Classic is the selected template (matches `an-nguyen`'s real config), and the closing row stays inert until the expert actually changes something.",
                        code: "<AcademySettingsForm values={loadedValues} … />",
                        render: (
                            <AcademySettingsForm
                                values={LOADED_VALUES}
                                onDisplayNameChange={NOOP}
                                onTaglineChange={NOOP}
                                onAvatarUrlChange={NOOP}
                                onAccentHueChange={NOOP}
                                onCommunityEnabledChange={NOOP}
                                onCommunityGroupUrlChange={NOOP}
                                onTemplateChange={NOOP}
                                onDiscard={NOOP}
                                onSave={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the expert has changed a field (tagline + template): the "Unsaved changes" chip appears and Discard/Save both enable. */
export const Editing: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademySettingsForm"
                tier="screen"
                leaf="Editing (dirty)"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "isDirty = true",
                        why: "The connected layer diffs the current field values against what last loaded and passes the result down as `isDirty` — this page never computes that itself. Bold is now selected instead of Classic, and the tagline changed.",
                        code: "<AcademySettingsForm values={editedValues} isDirty … />",
                        render: (
                            <AcademySettingsForm
                                values={EDITED_VALUES}
                                onDisplayNameChange={NOOP}
                                onTaglineChange={NOOP}
                                onAvatarUrlChange={NOOP}
                                onAccentHueChange={NOOP}
                                onCommunityEnabledChange={NOOP}
                                onCommunityGroupUrlChange={NOOP}
                                onTemplateChange={NOOP}
                                isDirty
                                onDiscard={NOOP}
                                onSave={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — Save is in flight: the whole form locks via a native `<fieldset disabled>` and the Save button spins with "Saving…". */
export const Saving: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademySettingsForm"
                tier="screen"
                leaf="Saving"
                annotate={ANNOTATE}
                reason={REASON}
                states={[
                    {
                        name: "isSaving = true",
                        why: "Right after the expert presses Save: every field, the template picker, and Discard all disable together through the form's own `<fieldset>` — the page never threads a lock flag to each field by hand — while the Save button itself shows the spinner + \"Saving…\" (`Button`'s own `isPending`).",
                        code: "<AcademySettingsForm values={editedValues} isDirty isSaving … />",
                        render: (
                            <AcademySettingsForm
                                values={EDITED_VALUES}
                                onDisplayNameChange={NOOP}
                                onTaglineChange={NOOP}
                                onAvatarUrlChange={NOOP}
                                onAccentHueChange={NOOP}
                                onCommunityEnabledChange={NOOP}
                                onCommunityGroupUrlChange={NOOP}
                                onTemplateChange={NOOP}
                                isDirty
                                onDiscard={NOOP}
                                onSave={NOOP}
                                isSaving
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the save attempt failed: a danger `Callout` explicitly captions this as new backend scope, matching proposal contradiction #4. Typed content is kept (no data loss on a failed save). */
export const Failed: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AcademySettingsForm"
                tier="screen"
                leaf="Failed"
                annotate={ANNOTATE}
                reason="Today `dashboard/_sections/settings.tsx` and `appearance.tsx` only DISPLAY the config-sourced brand/theme — the backend has no update mutation to call yet (`platform-settings.entity.ts` is a generic key/value store for the app's own runtime secrets, not tenant brand config). This state is not a hypothetical network error: it is what pressing Save does TODAY, and the banner says so plainly rather than pretending the mutation exists."
                states={[
                    {
                        name: "saveError set",
                        why: "The typed changes stay exactly as entered — nothing reverts on a failed save — while the banner names the real gap so the debt stays visible in the design system instead of silently assumed away.",
                        code: "<AcademySettingsForm values={editedValues} isDirty saveError=\"…\" … />",
                        render: (
                            <AcademySettingsForm
                                values={EDITED_VALUES}
                                onDisplayNameChange={NOOP}
                                onTaglineChange={NOOP}
                                onAvatarUrlChange={NOOP}
                                onAccentHueChange={NOOP}
                                onCommunityEnabledChange={NOOP}
                                onCommunityGroupUrlChange={NOOP}
                                onTemplateChange={NOOP}
                                isDirty
                                onDiscard={NOOP}
                                onSave={NOOP}
                                saveError="There's no backend endpoint to persist brand/theme changes yet — this form is UI-only until that mutation ships. Your changes above are kept, not lost."
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
