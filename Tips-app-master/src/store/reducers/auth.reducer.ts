import { AuthAction } from '../models/auth-action.model';
import actionsConstants from '../models/actions-constants';

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
        default:
            return state;
    }
}