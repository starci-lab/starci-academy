import type {
    ConsultantEntity,
    HeadhuntingCompanyEntity,
} from "@/modules/types"
import {
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit"

export interface HeadhunterSlice {
    headhunterId?: string
    companyId?: string
    entity?: ConsultantEntity
    company?: HeadhuntingCompanyEntity
    companies?: Array<HeadhuntingCompanyEntity>
    entities?: Array<ConsultantEntity>
    count?: number
}

const initialState: HeadhunterSlice = {
    headhunterId: undefined,
    companyId: undefined,
    entity: undefined,
    company: undefined,
    companies: undefined,
    entities: undefined,
    count: undefined,
}

export const headhunterSlice = createSlice({
    name: "headhunter",
    initialState,
    reducers: {
        setHeadhunterId: (
            state,
            action: PayloadAction<string | undefined>,
        ) => {
            state.headhunterId = action.payload
        },
        setHeadhunterCompanyId: (
            state,
            action: PayloadAction<string | undefined>,
        ) => {
            state.companyId = action.payload
        },
        setHeadhunter: (
            state,
            action: PayloadAction<ConsultantEntity | undefined>,
        ) => {
            state.entity = action.payload
        },
        setHeadhunterCompany: (
            state,
            action: PayloadAction<HeadhuntingCompanyEntity | undefined>,
        ) => {
            state.company = action.payload
        },
        setHeadhunterCompanies: (
            state,
            action: PayloadAction<Array<HeadhuntingCompanyEntity> | undefined>,
        ) => {
            state.companies = action.payload
        },
        setHeadhunters: (
            state,
            action: PayloadAction<Array<ConsultantEntity> | undefined>,
        ) => {
            state.entities = action.payload
        },
        setHeadhuntersCount: (
            state,
            action: PayloadAction<number | undefined>,
        ) => {
            state.count = action.payload
        },
    },
})

export const headhunterReducer = headhunterSlice.reducer
export const {
    setHeadhunterId,
    setHeadhunterCompanyId,
    setHeadhunter,
    setHeadhunterCompany,
    setHeadhunterCompanies,
    setHeadhunters,
    setHeadhuntersCount,
} = headhunterSlice.actions
