import { SetProfileData } from '../models/settings-action.model';
import actionsConstants from "../models/actions-constants"

export const setProfileData = (action:SetProfileData) => {
    return {
        type: actionsConstants.SET_PROFILE_DATA,
        ...action
    }
}

export const setAvatarState = (action:{photoUrl:string}) => {
    return {
        type: actionsConstants.SET_AVATAR,
        ...action
    }
}

export const deleteAvatarData = () => {
    return {
        type: actionsConstants.DELETE_AVATAR
    }
}

export const setBalance = (balance:number) => {
    return {
        type: actionsConstants.SET_BALANCE,
        balance: balance
    }
}