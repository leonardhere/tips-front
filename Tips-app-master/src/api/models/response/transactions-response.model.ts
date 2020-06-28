import { WalletResponse } from "./order-response.model";

export interface TransactionsResponse {
    wallet: WalletResponse;
    transactionType: number;
    createdDate: string;
    amount: number;
}