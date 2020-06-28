import React, { useEffect, useState } from 'react';
import './Withdrawal.scss';
import useFormState from '../../../common/customHooks/useFormState';
import { useSelector, useDispatch } from 'react-redux';
import { WalletAPI } from '../../../api/wallet';
import { AxiosResponse, AxiosError } from 'axios';
import { WalletResponse } from '../../../api/models/response/order-response.model';
import { setBalance } from '../../../store/actions/settings-actions';

const Withdrawal = () => {

    const withdrawalField = useFormState('');
    const [balanceError, setBalanceError] = useState(false)

    const balanceState = useSelector((state:any) => state.ProfileReducer);
    const dispatch = useDispatch();

    const getBalance = () => {
        WalletAPI.getBalance()
            .then((response:AxiosResponse<WalletResponse>) => {
                dispatch(setBalance(response.data.balance))
                withdrawalField.onChange({target: { value: response.data.balance }})
            })
            .catch((err:AxiosError) => console.log(err))
    }

    const withdraw = (e:any) => {
        e.preventDefault();
        if(withdrawalField.value > balanceState.balance) {
            setBalanceError(true);
            setTimeout(() => setBalanceError(false), 3000);
            return;
        }
        WalletAPI.withdraw(+withdrawalField.value)
            .then((response:AxiosResponse<WalletResponse>) => {
                dispatch(setBalance(response.data.balance))
                withdrawalField.onChange({target: { value: response.data.balance }})
            })
            .catch((err:AxiosError) => console.log(err))
    }

    useEffect(() => {
        if(isNaN(balanceState.balance) || balanceState.balance === undefined) {
            getBalance();
        }
    });

    return(
        <form className="withdrawal" onSubmit={withdraw}>
            <h2>TRANSFER HUB</h2>
            <div className="main-input_with-label">
                <input type="text" {...withdrawalField} id="withdrawal-value" className="main-input" required />
                <label htmlFor="withdrawal-value" className={withdrawalField.value === '' ? 'null' : 'filled-input_label'}>Введите сумму</label>
            </div>
            <div className="input-row">
                <label htmlFor="mastercard" className="checkbox-input">
                    <span className="checkbox-label">Mastercard</span>
                    <input type="radio" name="card" id="mastercard"/>
                    <span className="checkbox-icon"></span>
                </label>
                <label htmlFor="other-card" className="checkbox-input">
                    <span className="checkbox-label">Другая карта</span>
                    <input type="radio" name="card" id="other-card"/>
                    <span className="checkbox-icon"></span>
                </label>
            </div>
            <button type="submit" className={ balanceError ? "main-btn balance-error" : "main-btn" }>Получить</button>
        </form>
    );
}

export default Withdrawal;