"use client"

import React, { useState } from "react"
import {
    AlertDialog,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownTrigger,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    DotsThreeVerticalIcon,
    PencilSimpleIcon,
    TrashIcon,
} from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link CvHistoryItemMenu}. */
export interface CvHistoryItemMenuProps extends WithClassNames<undefined> {
    /** Display label used in the confirm-delete copy and the trigger's accessible name. */
    cvLabel: string
    /** Navigate to the edit page, scoped to this CV. */
    onEdit: () => void
    /** Delete this CV — resolves once the mutation settles (success or failure). */
    onDelete: () => Promise<void>
    /** True while THIS item's delete is in flight (disables the trigger). */
    isDeleting: boolean
}

/**
 * Per-CV management menu (kebab trigger) rendered as a SIBLING of the CV's
 * select chip in `CvWorkspace`'s history dial — never nested inside it (a
 * `<Button>` can't contain another interactive element). Two actions:
 * "Sửa" (navigate to `/profile/cv/edit`, scoped to this CV) and "Xoá"
 * (deletes the CV — irreversible, so it's gated behind an `AlertDialog`
 * confirmation rather than firing on a single click).
 *
 * Self-contained overlay state (dropdown + confirm dialog); the delete
 * mutation itself is owned by the caller (`CvWorkspace`), passed in as
 * `onDelete` so a single `useCvGenerationForm()` instance is shared across
 * every item in the dial instead of one per menu.
 *
 * @param props - {@link CvHistoryItemMenuProps}
 */
export const CvHistoryItemMenu = ({
    cvLabel,
    onEdit,
    onDelete,
    isDeleting,
    className,
}: CvHistoryItemMenuProps) => {
    const t = useTranslations()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const manageAriaLabel = t("cv.workspace.manageAria", { label: cvLabel })

    return (
        <>
            <Dropdown>
                <DropdownTrigger isDisabled={isDeleting} className={className}>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        isDisabled={isDeleting}
                        aria-label={manageAriaLabel}
                    >
                        <DotsThreeVerticalIcon aria-hidden className="size-5" />
                    </Button>
                </DropdownTrigger>
                <DropdownPopover placement="bottom end">
                    <DropdownMenu aria-label={manageAriaLabel}>
                        <DropdownItem
                            key="edit"
                            textValue={t("cv.workspace.editAction")}
                            onPress={onEdit}
                        >
                            <div className="flex items-center gap-2">
                                <PencilSimpleIcon aria-hidden className="size-5" />
                                <span>{t("cv.workspace.editAction")}</span>
                            </div>
                        </DropdownItem>
                        <DropdownItem
                            key="delete"
                            textValue={t("cv.workspace.deleteAction")}
                            className="text-danger"
                            onPress={() => setIsConfirmOpen(true)}
                        >
                            <div className="flex items-center gap-2">
                                <TrashIcon aria-hidden className="size-5" />
                                <span>{t("cv.workspace.deleteAction")}</span>
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </DropdownPopover>
            </Dropdown>

            <AlertDialog isOpen={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialog.Backdrop>
                    <AlertDialog.Container size="sm">
                        <AlertDialog.Dialog>
                            <AlertDialog.Header>
                                <AlertDialog.Icon status="danger" />
                                <AlertDialog.Heading>
                                    {t("cv.workspace.deleteConfirmTitle")}
                                </AlertDialog.Heading>
                            </AlertDialog.Header>
                            <AlertDialog.Body>
                                <p>{t("cv.workspace.deleteConfirmBody", { label: cvLabel })}</p>
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button
                                    variant="secondary"
                                    isDisabled={isDeleting}
                                    onPress={() => setIsConfirmOpen(false)}
                                >
                                    {t("cv.workspace.deleteCancelAction")}
                                </Button>
                                <Button
                                    variant="danger"
                                    isPending={isDeleting}
                                    onPress={async () => {
                                        await onDelete()
                                        setIsConfirmOpen(false)
                                    }}
                                >
                                    {t("cv.workspace.deleteConfirmAction")}
                                </Button>
                            </AlertDialog.Footer>
                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
        </>
    )
}
