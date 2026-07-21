import { CaretRightIcon } from "@phosphor-icons/react"

import { ListRow } from "@/components/blocks/lists/ListRow"

/** Shared rows body. */
export const body = (
    <>
        <ListRow title="Spaced-repetition review" subtitle="8 cards due" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} divider />
        <ListRow title="Coding challenge" subtitle="2 unsubmitted" trailing={<CaretRightIcon className="size-4 text-muted" aria-hidden focusable="false" />} onPress={() => {}} />
    </>
)
