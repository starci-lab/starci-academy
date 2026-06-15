"use client"

import React, { useState } from "react"
import { Drawer, ScrollShadow } from "@heroui/react"
import { useAppSelector } from "@/redux"
import { E2eBody } from "../E2eBody"

/** Minimal flow shape needed for the trigger label (full shape lives in E2eBody). */
interface E2eFlowLite { status: string }

/**
 * E2eResultDrawer — a quiet text link at the bottom of a lesson ("Xem kết quả
 * E2E") that opens a right-side drawer titled "E2E result", rendering the
 * recorded per-language Playwright proofs (via {@link E2eBody}). Kept out of the
 * tab bar so the proof is one click away without crowding the main lesson tabs.
 */
export const E2eResultDrawer = (): React.JSX.Element | null => {
    const [isOpen, setOpen] = useState(false)
    const content = useAppSelector((state) => state.content.entity)
    const flows = (content?.e2eFlows as Array<E2eFlowLite> | null | undefined) ?? []
    if (flows.length === 0) return null
    const passed = flows.filter((f) => f.status === "passed").length

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
                Xem kết quả kiểm thử E2E ({passed}/{flows.length} luồng pass) →
            </button>

            <Drawer>
                <Drawer.Backdrop isOpen={isOpen} onOpenChange={setOpen}>
                    <Drawer.Content placement="right">
                        <Drawer.Dialog className="p-0 sm:max-w-2xl">
                            <div className="p-3">
                                <Drawer.CloseTrigger />
                                <Drawer.Header>
                                    <Drawer.Heading>E2E result</Drawer.Heading>
                                </Drawer.Header>
                            </div>
                            <div className="border-b" />
                            <Drawer.Body>
                                <ScrollShadow className="h-full p-3" hideScrollBar>
                                    <E2eBody />
                                </ScrollShadow>
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    )
}
