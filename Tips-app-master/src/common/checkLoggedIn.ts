import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

// Check if user is not logged in and go to auth
const checkLoggedIn = () => {
    const state = useSelector((state:any) => state.AuthReducer);
    const history = useHistory();
    if(!state.isLoggedIn) {
        history.push('/authorization');
    }
}

export default checkLoggedIn;