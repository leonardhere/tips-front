import React, { useEffect, useState } from 'react';
import './Withdrawal.scss';
import useFormState from '../../../common/customHooks/useFormState';
import { useSelector, useDispatch } from 'react-redux';
import { WalletAPI } from '../../../api/wallet';
import { AxiosResponse, AxiosError } from 'axios';
import { WalletResponse } from '../../../api/models/response/order-response.model';
import { setBalance } from '../../../store/actions/settings-actions';
import { stat } from 'fs';

const Withdrawal = () => {

    const showButton = useFormState(true);
    const showText= useFormState(false);
    const cardType= useFormState(0);


    const setCard = (value:any)=>{
        cardType.onChange({target:{value}});
    };
    

    const withdraw = (e:any) => {
        e.preventDefault();
        
        showText.onChange({target:{value:true}});
        showButton.onChange({target:{value:false}});

        WalletAPI.withdraw(cardType.value)
            .then((response:AxiosResponse<WalletResponse>) => {
                
                console.log("ok")

            })
            .catch((err:AxiosError) => console.log(err))
    }
    

    useEffect(() => {
      
    });

    return(
        <form className="withdrawal" onSubmit={withdraw}>
            <h2>TRANSFER HUB</h2>
             <div className="main-input_with-label" >
                <label className="withdraw-attenstion">  </label>
                <label className="withdraw-ok">{showText.value ? "Ваши чаевые в скором времени поступят на привязанную карту": "Внимание! В случае если тип  привязанной карты будет указан неверно, возможны проблемы с выводом средств"}</label>
            </div> 
            <div className="input-row">
                <label htmlFor="mastercard" className="checkbox-input">
                    <span className="checkbox-label">Mastercard</span>
                    <input type="radio" name="card" id="mastercard" value="1" onChange={(e:any)=>setCard(1)}/> 
                    <span className="checkbox-icon"></span>
                </label>
                <label htmlFor="other-card" className="checkbox-input">
                    <span className="checkbox-label">Другая карта</span>
                    <input type="radio" name="card" id="other-card" value="2" onChange={(e:any)=>setCard(2)}/>
                    <span className="checkbox-icon"></span>
                </label>
            </div>
            <button type="submit" className="main-btn" disabled={cardType.value===0||!showButton.value}>Получить</button>
        </form>
    );
}

export default Withdrawal;