import { TransactionsReducer } from './reducers/transactions.reducer';
import { GoalReducer } from './reducers/goal.reducer';
import { ReviewsReducer } from './reducers/reviews.reducer';
import { ProfileReducer } from './reducers/profile.reducer';
import { AuthReducer } from './reducers/auth.reducer';
import { createStore, combineReducers } from 'redux';

const getStore = () => createStore(
    combineReducers({AuthReducer, ProfileReducer, ReviewsReducer, GoalReducer})
    // combineReducers({AuthReducer, ProfileReducer, ReviewsReducer, GoalReducer, TransactionsReducer})
);

export default getStore;