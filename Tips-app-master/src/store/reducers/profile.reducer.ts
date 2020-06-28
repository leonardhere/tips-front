import { SetProfileData } from '../models/settings-action.model';
import actionsConstants from "../models/actions-constants";

interface ProfileState extends SetProfileData {
    balance: number;
}

export const ProfileReducer = (
        state:ProfileState = {
            userID: NaN,
            restaurant: {
                restaurantId: NaN,
                name: '',
                phoneNumber: '',
                address: '',
                createDate: ''
            },
            person: {
                photoUrl: undefined, name: '', email: '', address: '', passport:'', sex: NaN
            },
            balance: NaN
        },
        action:any
    ):ProfileState => {
    switch (action.type) {
        case actionsConstants.SET_PROFILE_DATA:
            return {
                ...state,
                userID: action.userID,
                restaurant: action.restaurant ? {...action.restaurant} : {...state.restaurant},
                person: {
                    photoUrl: action.person.photoUrl || state.person.photoUrl,
                    name: action.person.name,
                    email: action.person.email != null ? action.person.email : state.person.email,
                    address: action.person.address != null ? action.person.address : state.person.address,
                    passport: action.person.passport != null ? action.person.passport : state.person.passport,
                    sex: action.person.sex
                }
            }
        case actionsConstants.DELETE_AVATAR:
            return {
                ...state,
                person : {
                    ...state.person,
                    photoUrl: ''
                }
            }
        case actionsConstants.SET_AVATAR:
            return {
                ...state,
                person: {
                    ...state.person,
                    photoUrl: action.photoUrl
                }
            }
        case actionsConstants.SET_BALANCE:
            return {
                ...state,
                balance: 0 || action.balance
            }
        default:
            return state;
    }
}