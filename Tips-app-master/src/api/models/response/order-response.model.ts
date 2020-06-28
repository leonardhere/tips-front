export interface WalletResponse {
    balance: number;
}

export interface OrderResponse {
    wallet: WalletResponse;
    fromUserId: string;
    amountPay: number;
    bankOrderId: string;
    bankUrl: string;
    status: number;
    date: Date;
}