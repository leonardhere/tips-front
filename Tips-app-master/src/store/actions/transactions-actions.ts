import { SetTransactionsAction } from "../models/transactions-action.model"
import actionsConstants from "../models/actions-constants"

export const setTransactions = (action:SetTransactionsAction[]) => {
    return {
        type: actionsConstants.SET_TRANSACTIONS,
        data: [...action]
    }
}