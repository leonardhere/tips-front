import React, { useState } from 'react';
import './Registration.scss';
import useFormState from '../../../../common/customHooks/useFormState';
import { register } from '../../../../api/auth';
import { AxiosResponse, AxiosError } from 'axios';
import { RegistrationResponse } from '../../../../api/models/response/registration-response.model';
import { CSSTransition } from 'react-transition-group';
import ErrorModal from '../../../ui/ErrorModal/ErrorModal';
import { useParams, useHistory } from 'react-router';

const Registration = () => {
    const {restID} = useParams();
    const history = useHistory();

    const [error, setError] = useState(false);

    const account = {
        name: useFormState(''),
        email: useFormState(''),
        password: useFormState(''),
        address: useFormState('')
    }
    const [sex, setSex] = useState(0);

    const registerAccount = ({name, email, password, address}:any, e:any) => {
        e.preventDefault();
        register({
            name: name.value,
            email: email.value,
            restaurantID: restID ? +restID : NaN,
            password: password.value,
            sex: sex,
            address: address.value
        })
        .then((response:AxiosResponse<RegistrationResponse>) => {
            history.push('/authorization');
        })
        .catch((err:AxiosError) => {
            setError(true)
            setTimeout(() => setError(false), 3500);
        })
    }

    const selectGender = (e:React.ChangeEvent) => {
        setSex(e.target.id === 'man' ? 0 : 1);
    }

    return (
        <form noValidate className="auth-form registration-form" onSubmit={(e) => registerAccount(account, e)}>
            <CSSTransition in={error} timeout={300} unmountOnExit classNames="show-hide-animation">
                <div className="error-modal-container"><ErrorModal /></div>
            </CSSTransition>
            <h1>Sign up</h1>
            <div className="main-input_with-label">
                <input type="text" name="name" {...account.name} id="name" className="main-input" required />
                <label htmlFor="name" className={account.name.value === '' ? 'null' : 'filled-input_label'}>Имя</label>
            </div>
            <div className="input-row">
                <label htmlFor="man" className="checkbox-input">
                    <span className="checkbox-label">Мужчина</span>
                    <input type="radio" onChange={selectGender} name="sex" id="man" defaultChecked />
                    <span className="checkbox-icon"></span>
                </label>
                <label htmlFor="woman" className="checkbox-input">
                    <span className="checkbox-label">Женщина</span>
                    <input type="radio" onChange={selectGender} name="sex" id="woman"/>
                    <span className="checkbox-icon"></span>
                </label>
            </div>
            <div className="main-input_with-label">
                <input type="text" name="email" {...account.email} id="email" className="main-input" required />
                <label htmlFor="email" className={account.email.value === '' ? 'null' : 'filled-input_label'}>E-mail</label>
            </div>
            <div className="main-input_with-label">
                <input type="text" name="password" {...account.password} id="password" className="main-input" required />
                <label htmlFor="password" className={account.password.value === '' ? 'null' : 'filled-input_label'}>Пароль</label>
            </div>
            <div className="main-input_with-label">
                <input type="text" name="address" {...account.address} id="address" className="main-input" required />
                <label htmlFor="address" className={account.address.value === '' ? 'null' : 'filled-input_label'}>Адрес</label>
            </div>
            <button type="submit" className="main-btn">Зарегистрироваться</button>
        </form>
    );
}

export default Registration;