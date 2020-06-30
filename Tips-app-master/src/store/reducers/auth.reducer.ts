import { AuthAction } from '../models/auth-action.model';
import actionsConstants from '../models/actions-constants';
import { stat } from 'fs';

interface AuthState extends AuthAction {}

export const AuthReducer = (
        state:AuthState={isLoggedIn: false, token: ''},
        action:any
    ) => {
    switch (action.type) {
        case actionsConstants.LOG_IN:
            return {
                ...state,
                isLoggedIn: action.isLoggedIn,
                token: action.token
            }
        case "USER_LOGGED_OUT":
            return {
                ...state,
                isLoggedIn: false,
                token: undefined
            }
        default:
            return state;
    }
}