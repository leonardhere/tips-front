import React from 'react';
import './ErrorModal.scss';
import errorIcon from '../../../assets/images/icons/error-icon.svg';

const ErrorModal = () => {
    
    return(
        <div className="error-modal">
            <img src={errorIcon} alt=""/>
            <p>Please check your data</p>
        </div>
    );
}

export default ErrorModal;