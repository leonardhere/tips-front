import React from 'react';
import './Wallet.scss';
import checkIcon from '../../../assets/images/icons/check.svg';

const Wallet = () => {

    return(
        <div className="wallet">
            <h2>ID:666</h2>
            <div className="wallet_border"></div>
            <div className="wallet_card">
                <label htmlFor="" className="checkbox-input">
                    <span className="wallet_card_checkbox"><img src={checkIcon} alt=""/></span>
                    <span className="wallet_card_number">2134 4565 5657 3456</span>
                    <input type="checkbox" name="" id=""/>
                </label>
            </div>
        </div>
    );
}

export default Wallet;