import React from "react"
import { 
    StarCiButton, 
    StarCiAutocomplete,
    StarCiAutocompleteSection,
    StarCiAutocompleteItem
} from "@/components/atomic"
import { 
    MagnifyingGlassIcon, 
    SlidersHorizontalIcon 
} from "@phosphor-icons/react"


/**
 * SearchBar is a component that allows the user to search for content.
 */
export const SearchBar = () => {
    return (
        <div className="flex items-center">
            <StarCiAutocomplete 
                inputProps={{
                    classNames: {
                        inputWrapper: "rounded-r-none",
                    }
                }}
                startContent={<MagnifyingGlassIcon className="size-5" />} 
                placeholder="Search" 
            >
                <StarCiAutocompleteSection>
                    <StarCiAutocompleteItem>
                        <div>Item 1</div>
                    </StarCiAutocompleteItem>
                </StarCiAutocompleteSection>
            </StarCiAutocomplete>
            <StarCiButton
                isIconOnly
                color="default"
                className="rounded-l-none"
            >
                <SlidersHorizontalIcon className="size-5" />
            </StarCiButton>
        </div>
    )
}