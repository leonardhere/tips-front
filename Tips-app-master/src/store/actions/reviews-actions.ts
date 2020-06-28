import { setReviewsAction } from './../models/reviews-action.model';
import actionsConstants from '../models/actions-constants';

export const setReviews = (action:setReviewsAction[]) => {
    return ({
        type: actionsConstants.SET_REVIEWS,
        data: action
    })
}