// Helper to display toast notifications based on GraphQL API responses
import { GraphQLResponse } from "@/modules/api"
import { toast } from "@heroui/react"

// Show a toast depending on whether the GraphQL response was successful or not
export const showGraphQLToast = <T>(response: GraphQLResponse<T>) => {
    const { success, message } = response

    const description =
        message || (success ? "Operation completed." : "Something went wrong.")

    if (success) {
        toast.success("Success", { description })
    } else {
        toast.danger("Error", { description })
    }
}

// Show a toast when the user is not authorized to access a resource
export const showUnauthorizedToast = () => {
    toast.danger("Unauthorized", {
        description: "You are not authorized to access this resource.",
    })
}

export interface RunGraphQLWithToastOptions {
    showSuccessToast?: boolean
    showErrorToast?: boolean
}
// Execute an API action and automatically show a toast based on the result
export const runGraphQLWithToast = async <T>(
    action: () => Promise<GraphQLResponse<T>>,
    options: RunGraphQLWithToastOptions = {
        showSuccessToast: true,
        showErrorToast: true,
    },
) => {
    try {
        const response = await action()
        if (options?.showSuccessToast) {
            showGraphQLToast(response)
            return true
        }
        return true
    } catch (error) {
        const _error = error as Error
        if (_error.message.toLowerCase().includes("unauthorized")) {
            if (options?.showErrorToast) {
                showUnauthorizedToast()
            }
            return false
        }
        if (options?.showErrorToast) {
            toast.danger("Error", {
                description: _error.message,
            })
        }
        return false
    }
}

export interface RunRestWithToastOptions {
    /** Message shown on success. Defaults to `"Operation completed."`. */
    successMessage?: string
    /** Whether to show a toast on success. */
    showSuccessToast?: boolean
    /** Whether to show a toast on error. */
    showErrorToast?: boolean
}

/**
 * Execute a REST API action and automatically show a toast based on the result.
 *
 * @param action - Async function that returns the response payload.
 * @param options - Toast display options.
 * @returns The response data on success, or `null` on failure.
 */
export const runRestWithToast = async <T>(
    action: () => Promise<T>,
    options: RunRestWithToastOptions = {
        showSuccessToast: true,
        showErrorToast: true,
    },
): Promise<T | null> => {
    try {
        const response = await action()
        if (options?.showSuccessToast) {
            toast.success("Success", {
                description: options?.successMessage ?? "Operation completed.",
            })
        }
        return response
    } catch (error) {
        const _error = error as Error
        if (_error.message.toLowerCase().includes("unauthorized")) {
            if (options?.showErrorToast) {
                showUnauthorizedToast()
            }
            return null
        }
        if (options?.showErrorToast) {
            toast.danger("Error", {
                description: _error.message,
            })
        }
        return null
    }
}
