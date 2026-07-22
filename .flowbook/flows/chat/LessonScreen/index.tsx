import React from "react"

import { Button, Typography } from "@heroui/react"
import { SparkleIcon, TextAaIcon } from "@phosphor-icons/react"

import { SELECTED_PASSAGE } from "../fixtures"

/**
 * The lesson host page (light redraw of the learn reading surface): where the Content-AI
 * chat is launched from — the "Hỏi AI" button, and a highlightable passage.
 */
export const LessonScreen = () => (
    <div className="relative flex w-full flex-col gap-4 rounded-2xl border border-default bg-surface p-6">
        <div className="flex flex-col gap-1">
            <Typography type="body-xs" color="muted">
                Module 11 · Webhooks & Delivery
            </Typography>
            <Typography type="h4">Idempotency & retry an toàn</Typography>
        </div>

        <Typography type="body" color="muted">
            Khi client gặp timeout, nó thường gửi lại request — nếu endpoint không phòng bị, một lần charge có thể
            thành hai. Phần này xây dựng một endpoint thanh toán chịu được retry.
        </Typography>

        {/* a highlightable passage — "bôi đen" to ask the AI about it */}
        <span className="w-fit rounded-lg bg-accent-soft px-2 py-1">
            <Typography type="body">“{SELECTED_PASSAGE}”</Typography>
        </span>

        <Typography type="body" color="muted">
            Cơ chế cốt lõi là idempotency key: một khoá duy nhất cho mỗi ý định charge, để server nhận ra request
            lặp và trả lại kết quả cũ.
        </Typography>

        <div className="flex items-center gap-2 pt-2">
            <Button variant="secondary" size="sm">
                <TextAaIcon className="size-4" aria-hidden focusable="false" />
                Bôi đen đoạn bất kỳ để hỏi
            </Button>
        </div>

        {/* floating launch — the app opens the chat drawer from a docked button */}
        <Button variant="primary" className="absolute bottom-6 right-6 shadow-lg">
            <SparkleIcon className="size-5" aria-hidden focusable="false" />
            Hỏi AI
        </Button>
    </div>
)
