export interface ReviewsResponse {
    commentId: number;
    waiterId: number;
    clientId: number;
    rating: number;
    summa: number;
    text: string;
    date: string;
    isConfirmed: boolean;
}