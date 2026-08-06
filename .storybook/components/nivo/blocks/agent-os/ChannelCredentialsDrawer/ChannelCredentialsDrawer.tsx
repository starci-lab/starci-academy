import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { Disclosure } from "@sb-components/composites/layout/Disclosure/Disclosure"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import {
    SecretField,
    type SecretFieldDeliveryTone,
    type SecretFieldLabels,
    type SecretFieldMode,
    type SecretFieldStatus,
} from "@sb-components/composites/form/SecretField/SecretField"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ChannelCredentialsDrawer` — the panel where a customer types the tokens their
 * channels need, grouped by channel rather than by key name, because a person
 * arrives holding "my Telegram bot stopped answering", not a variable name.
 *
 * Every field is written INDEPENDENTLY — the operation behind this surface takes
 * one key per call — so each row owns its own save, its own failure line, and its
 * own delivery state. While one write is in flight the other rows lock, since the
 * server rolls the customer's pod on every save and two overlapping saves mean
 * two overlapping restarts.
 *
 * `isReadPathMissing` is not decoration. When the server offers no way to list
 * what is already stored, the drawer must say so once, at the top, and every row
 * must sit at `unknown` rather than claiming nothing is configured. The moment a
 * real status arrives for any row, that note is FALSE and stops rendering — its
 * whole claim is "you are only seeing what you just sent".
 *
 * `blockingMessage` replaces the groups outright, for the failures where no field
 * on the surface can succeed: no workspace to write into, or an expired session.
 * A per-field error there would repeat the same sentence seventeen times.
 */

/** One credential row inside a group — a `SecretField` shape plus the key it writes. */
export interface ChannelCredentialFieldRow {
    /** The exact key this row writes. Comes from the server's allowlist, never from free text. */
    key: string
    /** Field label, in the reader's language. */
    label: string
    /** Supporting line under the label — where the value comes from. */
    hint?: string
    /** What the client knows about the stored value. */
    status: SecretFieldStatus
    /** Tail fragment of the stored value, or `null` when the server returned none. */
    valueHint?: string | null
    /** Already-formatted delivery line, or `null` when there is nothing to say. */
    deliveryLabel?: string | null
    /** Tone of the delivery line. */
    deliveryTone?: SecretFieldDeliveryTone
    /** Which half of the row is showing. */
    mode: SecretFieldMode
    /** The value being typed (controlled). */
    value: string
    /** Fires as the value changes. */
    onValueChange: (next: string) => void
    /** Switch this row into entry mode. */
    onEdit: () => void
    /** Leave entry mode without writing. */
    onCancel: () => void
    /** Write this one key. */
    onSubmit: () => void
    /** `true` → mask the control. Hostnames and ports stay plain, so typos stay visible. */
    isMasked?: boolean
    /** `true` → this row's own write is in flight. */
    isPending?: boolean
    /** `true` → inert because another row is writing. */
    isDisabled?: boolean
    /** Failure line under this row's control. */
    errorMessage?: string
    /** Warning-toned note that is not a failure. */
    noticeMessage?: string
}

/** One channel's worth of credential rows. */
export interface ChannelCredentialGroup {
    /** Stable group key, used to deep-link the drawer to one channel. */
    key: string
    /** Channel name as the reader knows it. */
    title: string
    /** Optional line under the title — say which providers this group covers. */
    description?: string
    /**
     * Already-composed count ("1/3 saved"). A group whose rows are all `unknown`
     * must NOT read `0/3`: zero is a claim, and the client is not in a position
     * to make it.
     */
    countLabel: string
    /** The rows, in display order. */
    fields: ReadonlyArray<ChannelCredentialFieldRow>
}

/** The already-resolved copy the drawer renders. */
export interface ChannelCredentialsDrawerLabels {
    /** Drawer title. */
    title: string
    /** Line under the title. */
    description?: string
    /** Heading of the permanent restart warning. */
    restartWarningTitle: string
    /** Body of the permanent restart warning — say the agent stops answering. */
    restartWarningDescription: string
    /** Heading of the "this server cannot list stored keys" note. */
    readPathMissingTitle: string
    /** Body of that note. */
    readPathMissingDescription: string
    /** Footer button that closes the drawer. */
    closeLabel: string
    /** Copy shared by every row's `SecretField`. */
    field: SecretFieldLabels
}

/** Props for {@link ChannelCredentialsDrawer}. */
export interface ChannelCredentialsDrawerProps {
    /** Whether the drawer is open. */
    isOpen: boolean
    /** Close it. Ignored while a write is in flight — the pod is mid-restart. */
    onClose: () => void
    /** The channel groups, in display order, already localized. */
    groups: ReadonlyArray<ChannelCredentialGroup>
    /** Group to open on mount; the rest render collapsed. */
    openGroupKey?: string | null
    /** Fires with the group the reader expanded, or `null` when they collapsed it. */
    onOpenGroupChange: (key: string | null) => void
    /** `true` → some row's write is in flight; closing is blocked. */
    isSaving?: boolean
    /** Whole-surface failure replacing the groups. `null` when the groups can render. */
    blockingMessage?: string | null
    /** `true` → the server offers no way to read stored keys back; the top note renders. */
    isReadPathMissing: boolean
    /**
     * `true` → a first read of the stored keys is in flight. Today no such read
     * exists, so the app passes `false`; the state is implemented and storied
     * anyway, so the day a listing query lands the drawer shimmers instead of
     * flashing seventeen `unknown` rows.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: ChannelCredentialsDrawerLabels
}

/** How many placeholder groups the loading mirror draws before a listing has landed. */
const SKELETON_GROUP_COUNT = 3

/**
 * The credential drawer. See the file header for why each field saves on its own
 * and why `unknown` is the resting state of every row today.
 *
 * @param props - {@link ChannelCredentialsDrawerProps}
 */
const ChannelCredentialsDrawer = ({
    isOpen,
    onClose,
    groups,
    openGroupKey = null,
    onOpenGroupChange,
    isSaving = false,
    blockingMessage = null,
    isReadPathMissing,
    isSkeleton = false,
    labels,
}: ChannelCredentialsDrawerProps) => {
    const renderField = (field: ChannelCredentialFieldRow, isFieldSkeleton: boolean) => {
        const shared = {
            label: field.label,
            hint: field.hint,
            status: field.status,
            valueHint: field.valueHint,
            deliveryLabel: field.deliveryLabel,
            deliveryTone: field.deliveryTone,
            mode: field.mode,
            onEdit: field.onEdit,
            onCancel: field.onCancel,
            onSubmit: field.onSubmit,
            isMasked: field.isMasked,
            isPending: field.isPending,
            // Every other row locks while one write runs: the server restarts the
            // pod on each save, so overlapping writes mean overlapping restarts.
            isDisabled: field.isDisabled ?? (isSaving && field.isPending !== true),
            errorMessage: field.errorMessage,
            noticeMessage: field.noticeMessage,
            labels: labels.field,
        }
        return isFieldSkeleton ? (
            <SecretField {...shared} isSkeleton />
        ) : (
            <SecretField {...shared} value={field.value} onValueChange={field.onValueChange} />
        )
    }

    const groupItems = groups.map((group) => ({ isSkeleton: isGroupSkeleton }: SkeletonProps) => (
        <Disclosure
            title={`${group.title} · ${group.countLabel}`}
            isOpen={isGroupSkeleton ? false : group.key === openGroupKey}
            onOpenChange={(next) => onOpenGroupChange(next ? group.key : null)}
            isSkeleton={isGroupSkeleton}
            body={({ isSkeleton: isBodySkeleton }: SkeletonProps) => (
                <StackV
                    gap={6}
                    principle="group-boundary"
                    isSkeleton={isBodySkeleton}
                    items={group.fields.map((field) => () => renderField(field, isBodySkeleton === true))}
                />
            )}
        />
    ))

    const skeletonGroupItems = Array.from(
        { length: SKELETON_GROUP_COUNT },
        () => ({ isSkeleton: isGroupSkeleton }: SkeletonProps) => (
            <Disclosure title={labels.title} isSkeleton={isGroupSkeleton} />
        ),
    )

    return (
        <DrawerShell
            isOpen={isOpen}
            // Closing is refused mid-write rather than merely discouraged: the pod is
            // rolling, and a reader who leaves now learns nothing about the outcome.
            onOpenChange={(open) => {
                if (!open && !isSaving) onClose()
            }}
            placement="right"
            title={labels.title}
            description={labels.description}
            isSkeleton={isSkeleton}
            body={({ isSkeleton: isBodySkeleton }: SkeletonProps) => (
                <StackV
                    gap={6}
                    principle="block-boundary"
                    isSkeleton={isBodySkeleton}
                    items={[
                        () => (
                            <Callout
                                status="warning"
                                title={labels.restartWarningTitle}
                                description={labels.restartWarningDescription}
                            />
                        ),
                        // The note claims "you only see what you just sent" — false the
                        // moment any row carries a real status, so it stops rendering then.
                        ...(isReadPathMissing
                            ? [
                                () => (
                                    <Callout
                                        status="info"
                                        title={labels.readPathMissingTitle}
                                        description={labels.readPathMissingDescription}
                                    />
                                ),
                            ]
                            : []),
                        ...(blockingMessage != null && !isBodySkeleton
                            ? [() => <Callout status="danger" title={blockingMessage} />]
                            : isBodySkeleton
                                ? skeletonGroupItems
                                : groupItems),
                    ]}
                />
            )}
            footer={({ isSkeleton: isFooterSkeleton }: SkeletonProps) => (
                <Button
                    variant="ghost"
                    label={labels.closeLabel}
                    isSkeleton={isFooterSkeleton}
                    isDisabled={isSaving}
                    onPress={isFooterSkeleton ? undefined : onClose}
                />
            )}
        />
    )
}

export { ChannelCredentialsDrawer }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "ChannelCredentialsDrawer" } as const
