import { GoalResponse } from "../../api/models/response/goal-response.model";

export interface setGoalAction {
    targetId: number;
    userId: number;
    name: string;
    summa: number;
    currentSumma: number;
    startDate: string;
    endDate: string;
    isFinished: boolean;
}