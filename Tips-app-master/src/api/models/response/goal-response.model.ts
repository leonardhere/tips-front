export interface GoalResponse {
    targetId: number;
    userId: number;
    name: string;
    summa: number;
    currentSumma: number;
    startDate: string;
    endDate: string;
    isFinished: boolean;
}