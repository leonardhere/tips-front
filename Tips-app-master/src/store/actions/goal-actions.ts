import { setGoalAction } from './../models/goal-action.model';
import actionsConstants from "../models/actions-constants";

export const setGoal = (action:setGoalAction) => ({
    type: actionsConstants.SET_GOAL,
    ...action
})

export const editGoalState = (action:{name:string, summa:number, endDate:string}) => ({
    type: actionsConstants.EDIT_GOAL,
    ...action
})