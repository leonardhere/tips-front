import { TransactionsResponse } from "../../api/models/response/transactions-response.model";
import actionsConstants from "../models/actions-constants";


export const TransactionsReducer = (
        state:TransactionsResponse[]=[],
        action:any
    ) => {
    switch (action.type) {
        case actionsConstants.SET_TRANSACTIONS:
            return [...action.data] // don't copy previous state into array
        default:
            return state;
    }
}