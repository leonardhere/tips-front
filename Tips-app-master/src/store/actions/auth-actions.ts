import { AuthAction } from '../models/auth-action.model';
import actionsConstants from '../models/actions-constants';

export const setAuthState = (action:AuthAction) => {
    return {
        type: actionsConstants.LOG_IN,
        isLoggedIn: action.isLoggedIn,
        token: action.token
    }
}