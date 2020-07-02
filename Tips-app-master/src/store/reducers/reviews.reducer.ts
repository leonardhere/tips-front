import actionsConstants from '../models/actions-constants';
import { ReviewsResponse } from '../../api/models/response/reviews-response.model';

export const ReviewsReducer = (
        state:ReviewsResponse[]=[],
        action:any
    ) => {
    switch (action.type) {
        case actionsConstants.SET_REVIEWS:
            return [...action.data] // don't copy previous state into array
        default:
            return state;
    }
}