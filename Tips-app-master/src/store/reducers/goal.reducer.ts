import actionsConstants from "../models/actions-constants"
import { setGoalAction } from "../models/goal-action.model"

export const GoalReducer = (state:setGoalAction={
        targetId: NaN,
        userId: NaN,
        name: '',
        currentSumma: 0,
        summa: 0,
        startDate: '',
        endDate: '',
        isFinished: false
    }, action:any) => {
        switch(action.type) {
            case actionsConstants.SET_GOAL:
                return {
                    ...state,
                    ...action
                }
            case actionsConstants.EDIT_GOAL:
                return {
                    ...state,
                    ...action
                }
            default:
                return state
        }
}