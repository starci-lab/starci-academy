"use client"
import React, { PropsWithChildren, useMemo } from "react"
import { createContext } from "react"
import {
    useConnectDisclosureCore,
    useExportPrivateKeyDisclosureCore,
    useConfirmTOTPDisclosureCore,
    useDepositDisclosureCore,
    useUpdateExplorerDisclosureCore,
    useUpdateRpcsDisclosureCore,
    useSelectPoolsDisclosureCore,
    useSelectTokenDisclosureCore,
    useAuthenticationDisclosureCore,
    useManageMFASettingsDisclosureCore,
    useMFAVerificationDisclosureCore,
    usePositionDisclosureCore,
    useMenuDisclosureCore,
    useUpdatePoolsDisclosureCore,
    useSortByDisclosureCore,
    useWithdrawDisclosureCore,
    useRequireMFADisclosureCore,
    useAdvancedConfigurationDisclosureCore,
    useViolateIndicatorRulesDisclosureCore,
} from "./core"

export interface DiscloresureContextType {
    connect: ReturnType<typeof useConnectDisclosureCore>
    exportPrivateKey: ReturnType<typeof useExportPrivateKeyDisclosureCore>
    confirmTOTP: ReturnType<typeof useConfirmTOTPDisclosureCore>
    deposit: ReturnType<typeof useDepositDisclosureCore>
    updateExplorer: ReturnType<typeof useUpdateExplorerDisclosureCore>
    updateRpcs: ReturnType<typeof useUpdateRpcsDisclosureCore>
    selectPools: ReturnType<typeof useSelectPoolsDisclosureCore>
    selectToken: ReturnType<typeof useSelectTokenDisclosureCore>
    authentication: ReturnType<typeof useAuthenticationDisclosureCore>
    manageMFASettings: ReturnType<typeof useManageMFASettingsDisclosureCore>
    mfaVerification: ReturnType<typeof useMFAVerificationDisclosureCore>
    position: ReturnType<typeof usePositionDisclosureCore>
    menu: ReturnType<typeof useMenuDisclosureCore>
    updatePools: ReturnType<typeof useUpdatePoolsDisclosureCore>
    sortBy: ReturnType<typeof useSortByDisclosureCore>
    withdraw: ReturnType<typeof useWithdrawDisclosureCore>
    requireMFA: ReturnType<typeof useRequireMFADisclosureCore>
    advancedConfiguration: ReturnType<typeof useAdvancedConfigurationDisclosureCore>
    violateIndicatorRules: ReturnType<typeof useViolateIndicatorRulesDisclosureCore>
}

export const DiscloresureContext = createContext<DiscloresureContextType | null>(null)

export const DiscloresureProvider = ({ children }: PropsWithChildren) => {
    const connect = useConnectDisclosureCore()
    const exportPrivateKey = useExportPrivateKeyDisclosureCore()
    const confirmTOTP = useConfirmTOTPDisclosureCore()
    const deposit = useDepositDisclosureCore()
    const updateExplorer = useUpdateExplorerDisclosureCore()
    const updateRpcs = useUpdateRpcsDisclosureCore()
    const selectPools = useSelectPoolsDisclosureCore()
    const selectToken = useSelectTokenDisclosureCore()
    const authentication = useAuthenticationDisclosureCore()
    const manageMFASettings = useManageMFASettingsDisclosureCore()
    const mfaVerification = useMFAVerificationDisclosureCore()
    const position = usePositionDisclosureCore()
    const menu = useMenuDisclosureCore()
    const updatePools = useUpdatePoolsDisclosureCore()
    const sortBy = useSortByDisclosureCore()
    const withdraw = useWithdrawDisclosureCore()
    const requireMFA = useRequireMFADisclosureCore()
    const advancedConfiguration = useAdvancedConfigurationDisclosureCore()
    const violateIndicatorRules = useViolateIndicatorRulesDisclosureCore()
    const value = useMemo(() => ({
        connect, 
        exportPrivateKey, 
        confirmTOTP, 
        deposit, 
        updateExplorer, 
        updateRpcs,
        selectPools,
        selectToken,
        authentication,
        manageMFASettings,
        mfaVerification,
        position,
        menu,
        updatePools,
        sortBy,
        withdraw,
        requireMFA,
        advancedConfiguration,
        violateIndicatorRules
    }), [
        connect, 
        exportPrivateKey, 
        confirmTOTP, 
        deposit, 
        updateExplorer, 
        updateRpcs,
        selectPools,
        selectToken,
        authentication,
        manageMFASettings,
        mfaVerification,
        position,
        menu,
        updatePools,
        sortBy,
        withdraw,
        requireMFA,
        advancedConfiguration,
        violateIndicatorRules
    ])
    return (
        <DiscloresureContext.Provider value={value}>
            {children}
        </DiscloresureContext.Provider>
    )
}