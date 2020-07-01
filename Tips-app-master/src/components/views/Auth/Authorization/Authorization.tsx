import React, { useState } from 'react';
import './Authorization.scss';
import useFormState from '../../../../common/customHooks/useFormState';
import { auth } from '../../../../api/auth';
import { AuthResponse } from '../../../../api/models/response/auth-response.model';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthState, setLogOutState } from '../../../../store/actions/auth-actions';
import ErrorModal from '../../../ui/ErrorModal/ErrorModal';
import { CSSTransition } from 'react-transition-group';
import { useHistory } from 'react-router';

const Authorization = () => {

    const login = useFormState('');
    const password = useFormState('');

    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const history = useHistory();

    const logIn = (login:string,password:string, e:any) => {
        e.preventDefault();
        auth(login, password)
        .then((response:AxiosResponse<AuthResponse>) => {
            dispatch(setLogOutState());
            localStorage.removeItem('qrcode');
            localStorage.setItem('token', `Bearer ${response.data.token.token}`);
            localStorage.setItem('expireDate', response.data.token.expireDate);
            dispatch(setAuthState({isLoggedIn: true, token: `Bearer ${response.data.token.token}`}));
            setError(false);
            history.push('/home');
        })
        .catch(err => {
            setError(true)
            setTimeout(() => setError(false), 3500);
        })
    }

    return (
        <React.Fragment>
            <CSSTransition in={error} timeout={300} unmountOnExit classNames="show-hide-animation">
                <div className="error-modal-container"><ErrorModal /></div>
            </CSSTransition>
            <form noValidate className="auth-form" onSubmit={(e) => logIn(login.value, password.value, e)}>
                <h1>Sign in</h1>
                <div className="main-input_with-label">
                    <input type="text" name="email" {...login} id="email" className="main-input" required />
                    <label htmlFor="email" className={login.value === '' ? 'null' : 'filled-input_label'}>E-mail</label>
                </div>
                <div className="main-input_with-label">
                    <input type="password" name="password" {...password} id="password" className="main-input" required />
                    <label htmlFor="password" className={password.value === '' ? 'null' : 'filled-input_label'}>Пароль</label>
                </div>
                <button type="submit" className="main-btn">Войти</button>
            </form>
        </React.Fragment>
    );
}

export default Authorization;