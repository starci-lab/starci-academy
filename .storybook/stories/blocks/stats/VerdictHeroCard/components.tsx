import { Button } from "@heroui/react"

/** The mature/young retention split reused by the Default story. */
export const REVIEW_HEALTH_SPLITS = [
    { label: "Thẻ đã học kỹ (chín)", value: "72%", band: "success" as const },
    { label: "Thẻ mới (non)", value: "31%", band: "danger" as const },
]

/** No-op primary action shared by Default and WithoutSplits — the block only renders the slot, the caller owns the click. */
export const PrimaryAction = ({ children }: { children: string }) => (
    <Button variant="primary" size="sm" onPress={() => {}}>{children}</Button>
)
