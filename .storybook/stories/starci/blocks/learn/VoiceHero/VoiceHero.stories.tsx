import type { Meta, StoryObj } from "@storybook/nextjs"
import { VoiceHero } from "@sb-components/starci/blocks/learn/VoiceHero/VoiceHero"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `VoiceHero`: the voice-first answer composer. A big push-to-talk mic
 * with its live transcript is the HERO; a quiet typed textarea is the fallback
 * for browsers that cannot do speech-to-text, or a lesson that only wants
 * typed answers.
 *
 * 📐 LEAF by STRUCTURE (§14d.2), TWO OF THEM, given by the shape rather than
 * derived: `MicHero` (circular button + transcript) and `TypedFallback`
 * (textarea + switch-back link) are different NODE TREES, not the same nodes
 * with different data. Which one renders is computed from `sttSupported` +
 * `answerMode`, plus an EPHEMERAL internal toggle only reachable when both
 * input methods are actually offered (`answerMode="both"` and STT supported)
 * — see the component's file header.
 *
 * ⭐ The "type instead" / "use voice" switch link is a STATE inside each leaf,
 * not a third leaf: unlike `ContentModeNav`'s language group (a whole second
 * tab cluster), it is one `Typography` node whose presence tracks a single
 * boolean (`canToggle`) already visible in the state's data.
 *
 * ⚠️ THE MANUAL SWITCH ITSELF IS NOT STORY-ABLE, same call as `InputPassword`'s
 * `reveal`: props alone always mount fresh with `manualTyped = false`, so a
 * `both`-mode render always lands on `MicHero` — the "already switched to
 * typing under `both` mode" shape only exists after a click no static render
 * can perform. `TypedFallback`'s states therefore use the two shapes that
 * ARE reachable from props alone (unsupported browser, and `answerMode="text"`),
 * both of which coincidentally also hide the switch-back link — which is
 * exactly why `MicHero`'s states are the ones that show the link ON.
 *
 * ⚠️ NO SKELETON LEAF. See the component file header — the prop contract has
 * no `isSkeleton`, so there is nothing to mirror.
 */
const meta: Meta<typeof VoiceHero> = {
    title: "StarCi/Blocks/Learn/VoiceHero/VoiceHero",
    component: VoiceHero,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof VoiceHero>

const LABELS = {
    pushToTalk: "Nhấn để nói",
    listening: "Đang nghe...",
    typeInstead: "Gõ thay vì nói",
    useVoice: "Chuyển sang nói",
    placeholder: "Nhấn micro để bắt đầu trả lời",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track holding the mic (or textarea), its transcript, and the optional switch link — owning the single seam between them", storyId: "frames-stack-stackv--default" },
    "Button": { tier: "atom", role: "the circular icon-only mic control; color carries idle-versus-listening rather than a second icon", storyId: "atoms-buttons-button-button--is-icon-only" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the live/committed transcript, or the switch-mode link — real, muted-provisional, or a link, per state", storyId: "atoms-text-typography-typography--plain" },
    "TextArea": { tier: "atom", role: "the typed answer field inside `InputTextarea`, bound straight to the same `value`/`onValueChange` pair MicHero's transcript reads from", storyId: "atoms-forms-input-inputtextarea--default" },
}

/** LEAF — `MicHero`: the voice-first shape, circular mic + live transcript. */
export const MicHero: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="VoiceHero"
                tier="block"
                leaf="MicHero"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "listening = false, chưa nói gì",
                        why: "Nothing has been said yet, so the transcript line falls back to the idle placeholder and reads muted — it is a hint, not an answer. Both input methods are offered here, so the quiet \"gõ thay vì nói\" link sits under the mic as the way out for anyone who would rather type.",
                        code: `<VoiceHero
    sttSupported
    listening={false}
    interimTranscript=""
    value=""
    onValueChange={setAnswer}
    onToggleListen={toggleMic}
    answerMode="both"
    labels={labels}
/>`,
                        render: (
                            <VoiceHero
                                anatPart="VoiceHero"
                                showAnatomy
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                value=""
                                onValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "listening = true, transcript đang nhận diện dở",
                        why: "The mic turns danger-red — the everyday \"recording\" signal — while speech is still being recognized. The interim fragment reads muted + italic to mark it provisional; it will straighten into plain text the moment it commits to `value`.",
                        code: `<VoiceHero
    sttSupported
    listening
    interimTranscript="Em nghĩ là dùng cache-aside pattern để..."
    value=""
    onValueChange={setAnswer}
    onToggleListen={toggleMic}
    answerMode="both"
    labels={labels}
/>`,
                        render: (
                            <VoiceHero
                                sttSupported
                                listening
                                interimTranscript="Em nghĩ là dùng cache-aside pattern để..."
                                value=""
                                onValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "answerMode = voice, đã có transcript trước đó",
                        why: "The caller asked for a voice-only answer, so the switch-away link is gone entirely — offering a silent escape hatch would undercut the point of asking. The last committed sentence stays on screen in plain (non-italic) text between recordings, exactly where the learner left it.",
                        code: `<VoiceHero
    sttSupported
    listening={false}
    interimTranscript=""
    value="Dùng cache-aside pattern, đọc miss thì mới query DB rồi ghi lại cache."
    onValueChange={setAnswer}
    onToggleListen={toggleMic}
    answerMode="voice"
    labels={labels}
/>`,
                        render: (
                            <VoiceHero
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                value="Dùng cache-aside pattern, đọc miss thì mới query DB rồi ghi lại cache."
                                onValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="voice"
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `TypedFallback`: the quiet typed shape, textarea + switch-back link. */
export const TypedFallback: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="VoiceHero"
                tier="block"
                leaf="TypedFallback"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-md"
                states={[
                    {
                        name: "sttSupported = false, chưa gõ gì",
                        why: "This browser cannot do speech-to-text at all, so `TypedFallback` is the ONLY shape offered — there is no \"chuyển sang nói\" link, because there is nothing to switch to. The field opens with the same placeholder wording MicHero would have shown, so the composer reads as one answer box regardless of which input method got picked.",
                        code: `<VoiceHero
    sttSupported={false}
    listening={false}
    interimTranscript=""
    value=""
    onValueChange={setAnswer}
    onToggleListen={toggleMic}
    answerMode="both"
    labels={labels}
/>`,
                        render: (
                            <VoiceHero
                                anatPart="VoiceHero"
                                showAnatomy
                                sttSupported={false}
                                listening={false}
                                interimTranscript=""
                                value=""
                                onValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="both"
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "answerMode = text, đã gõ chữ",
                        why: "The caller asked for a typed answer outright — this lesson never offers a mic at all — so, same as the unsupported-browser state, there is no \"chuyển sang nói\" link. The field already carries earlier typing, which is the ordinary case for returning to a question mid-draft.",
                        code: `<VoiceHero
    sttSupported
    listening={false}
    interimTranscript=""
    value="Dùng connection pooling để tránh mở kết nối mới mỗi request."
    onValueChange={setAnswer}
    onToggleListen={toggleMic}
    answerMode="text"
    labels={labels}
/>`,
                        render: (
                            <VoiceHero
                                sttSupported
                                listening={false}
                                interimTranscript=""
                                value="Dùng connection pooling để tránh mở kết nối mới mỗi request."
                                onValueChange={() => {}}
                                onToggleListen={() => {}}
                                answerMode="text"
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
