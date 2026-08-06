import type { ReactNode } from "react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import {
    InvoiceList,
    type InvoiceListLabels,
    type InvoiceRow,
} from "@sb-components/nivo/blocks/billing/InvoiceList/InvoiceList"

/**
 * `Dashboard` — the PAGE a signed-in user lands on: an identity summary above a
 * capped list of recent invoices (the `InvoiceList` block). A page's story is one
 * complete STATE per story — `loading`, `content`, `empty-invoices` — not a
 * leaf-per-prop map. Grounded in the real `UserEntity` + `InvoiceEntity`.
 */

/** The identity summary shown at the top of the dashboard — a subset of `UserEntity`. */
export interface DashboardUser {
    /** Display name (`UserEntity.username`). */
    username: string
    /** Email address (`UserEntity.email`). */
    email: string
    /** Absolute avatar image URL, or null → the initials fallback. */
    avatarUrl?: string | null
}

/** Props for {@link Dashboard}. */
export interface DashboardProps {
    /** The signed-in user's identity summary. */
    user: DashboardUser
    /** The user's most recent invoices — capped to five by the connected layer. */
    invoices: Array<InvoiceRow>
    /** Pay one still-unpaid invoice — forwarded to the embedded {@link InvoiceList}. */
    onPayInvoice: (invoiceId: string) => void
    /** Already-localized copy for the page's own sections. */
    labels: DashboardLabels
    /** Already-localized copy for the embedded {@link InvoiceList}. */
    invoiceLabels: InvoiceListLabels
    /** `true` → the page is still loading; the skeleton mirror is shown. */
    isLoading?: boolean
}

/** The already-resolved copy the page renders. */
export interface DashboardLabels {
    /** Greeting eyebrow above the name (e.g. "Welcome back"). */
    greeting: string
}

/** How many placeholder invoice rows the skeleton draws — mirrors the five-row cap. */
const SKELETON_ROW_COUNT = 3

/**
 * The dashboard page. See the file header for why it composes the `InvoiceList`
 * block and why its story is one state per render.
 *
 * @param props - {@link DashboardProps}
 */
const Dashboard = ({ user, invoices, onPayInvoice, labels, invoiceLabels, isLoading = false }: DashboardProps) => {
    const shell = (children: ReactNode) => (
        <div
            data-tier="page"
            data-component="Dashboard"
            className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8"
        >
            {children}
        </div>
    )

    // ── LOADING state: the skeleton mirror, so nothing jumps when the data resolves.
    if (isLoading) {
        return shell(
            <StackV
                gap={6}
                principle="block-boundary"
                items={[
                    () => (
                        <StackH
                            gap={3}
                            items={[
                                () => <Avatar isSkeleton size="lg" />,
                                () => (
                                    <StackV
                                        gap={1}
                                        items={[
                                            () => <Typography size="base" isSkeleton />,
                                            () => <Typography size="sm" isSkeleton />,
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    ),
                    () => (
                        <SurfaceCard
                            isSkeleton
                            padding={3}
                            label={invoiceLabels.title}
                            body={() => (
                                <StackV
                                    gap={2}
                                    principle="title-subtitle"
                                    isSkeleton
                                    items={Array.from({ length: SKELETON_ROW_COUNT }, () => ({ isSkeleton }: SkeletonProps) => (
                                        <SurfaceCard
                                            variant="nested"
                                            padding={3}
                                            isSkeleton={isSkeleton}
                                            body={() => (
                                                <StackH
                                                    gap={3}
                                                    justify="between"
                                                    items={[
                                                        () => <Typography size="sm" isSkeleton />,
                                                        () => <Typography size="sm" isSkeleton />,
                                                    ]}
                                                />
                                            )}
                                        />
                                    ))}
                                />
                            )}
                        />
                    ),
                ]}
            />,
        )
    }

    // ── CONTENT: the identity summary above the recent-invoices block.
    return shell(
        <StackV
            gap={6}
            items={[
                () => (
                    <StackH
                        gap={3}
                        items={[
                            () => (
                                <Avatar
                                    size="lg"
                                    name={user.username}
                                    src={user.avatarUrl ?? undefined}
                                    fallback="initials"
                                />
                            ),
                            () => (
                                <StackV
                                    gap={1}
                                    items={[
                                        () => <Typography size="xs" color="muted" text={labels.greeting} />,
                                        () => <Typography size="base" weight="semibold" text={user.username} />,
                                        () => <Typography size="sm" color="muted" text={user.email} />,
                                    ]}
                                />
                            ),
                        ]}
                    />
                ),
                () => <InvoiceList invoices={invoices} onPay={onPayInvoice} labels={invoiceLabels} />,
            ]}
        />,
    )
}

export { Dashboard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "Dashboard" } as const
